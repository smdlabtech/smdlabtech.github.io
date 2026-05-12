"""
FastAPI rate limiter (global + per-IP + per-endpoint).

Backends:
- Redis (recommended for prod) via `redis` package
- In-memory fallback (dev/testing)

Features:
- sliding-ish windows using fixed windows + reset time
- burst capacity
- headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After
"""

from __future__ import annotations

import hashlib
import time
from dataclasses import dataclass
from typing import Any, Optional

try:
    import redis  # type: ignore
except Exception:  # pragma: no cover
    redis = None  # type: ignore

from fastapi import Request
from starlette.responses import Response, JSONResponse

from backend.config import Settings
from backend.rate_limit_config import Limit, get_limits


@dataclass
class Decision:
    allowed: bool
    limit: int
    remaining: int
    reset_time: int
    window_seconds: int
    retry_after: int


def _now() -> int:
    return int(time.time())


def _window_key(window_seconds: int, ts: int) -> int:
    return ts // window_seconds


def _hash_ip(ip: str) -> str:
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()[:16]


class Storage:
    def incr(self, key: str, ttl_seconds: int) -> int:
        raise NotImplementedError


class MemoryStorage(Storage):
    def __init__(self) -> None:
        self._data: dict[str, tuple[int, int]] = {}  # key -> (count, expires_at)

    def incr(self, key: str, ttl_seconds: int) -> int:
        ts = _now()
        count, exp = self._data.get(key, (0, ts + ttl_seconds))
        if exp <= ts:
            count, exp = 0, ts + ttl_seconds
        count += 1
        self._data[key] = (count, exp)
        return count


class RedisStorage(Storage):
    def __init__(self, url: str) -> None:
        if redis is None:
            raise RuntimeError("redis package not available")
        self._client = redis.Redis.from_url(url, decode_responses=True)

    def incr(self, key: str, ttl_seconds: int) -> int:
        # INCR + set expiry on first hit
        pipe = self._client.pipeline()
        pipe.incr(key)
        pipe.ttl(key)
        value, ttl = pipe.execute()
        if ttl == -1:
            self._client.expire(key, ttl_seconds)
        return int(value)


class RateLimiter:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.limits = get_limits(settings)
        self.storage, self.backend = self._init_storage(settings)

    def _init_storage(self, settings: Settings) -> tuple[Storage, str]:
        url = (settings.RATE_LIMIT_STORAGE_URL or "").strip()
        if settings.is_production and url.startswith("redis"):
            try:
                return RedisStorage(url), "redis"
            except Exception:
                return MemoryStorage(), "memory"
        return MemoryStorage(), "memory"

    def exempt(self, request: Request) -> bool:
        path = request.url.path
        return (
            path.startswith("/health")
            or path == "/metrics"
            or path.startswith("/metrics/")
            or path == "/api/rate-limit"
        )

    def get_client_ip(self, request: Request) -> str:
        # If behind a proxy, prefer X-Forwarded-For first IP.
        xff = request.headers.get("x-forwarded-for", "")
        if xff:
            return xff.split(",")[0].strip()
        client = request.client
        return (client.host if client else "unknown") or "unknown"

    def _evaluate(self, key_prefix: str, limit: Limit, identity: str) -> Decision:
        ts = _now()
        w = _window_key(limit.window_seconds, ts)
        reset_time = (w + 1) * limit.window_seconds
        ttl = max(reset_time - ts, 1)
        key = f"rl:{key_prefix}:{identity}:{w}"
        count = self.storage.incr(key, ttl_seconds=ttl)

        allowed = count <= (limit.requests + limit.burst)
        remaining = max((limit.requests + limit.burst) - count, 0)
        retry_after = max(reset_time - ts, 1) if not allowed else 0
        return Decision(
            allowed=allowed,
            limit=(limit.requests + limit.burst),
            remaining=remaining,
            reset_time=reset_time,
            window_seconds=limit.window_seconds,
            retry_after=retry_after,
        )

    def check(self, request: Request) -> dict[str, Decision]:
        decisions, _ = self.check_with_context(request)
        return decisions

    def _path_matches_any(self, path: str, prefixes: list[str]) -> bool:
        for prefix in prefixes:
            if path == prefix or path.startswith(prefix.rstrip("/") + "/"):
                return True
        return False

    def _endpoint_tier(self, request: Request) -> str | None:
        path = request.url.path
        method = request.method.upper()
        if method in self.settings.RATE_LIMIT_UPLOAD_METHODS_SET and self._path_matches_any(path, self.settings.RATE_LIMIT_UPLOAD_PATHS_LIST):
            return "upload"
        if method in self.settings.RATE_LIMIT_CHAT_METHODS_SET and self._path_matches_any(path, self.settings.RATE_LIMIT_CHAT_PATHS_LIST):
            return "chat"
        if method in self.settings.RATE_LIMIT_SEARCH_METHODS_SET and self._path_matches_any(path, self.settings.RATE_LIMIT_SEARCH_PATHS_LIST):
            return "search"
        return None

    def check_with_context(self, request: Request) -> tuple[dict[str, Decision], str | None]:
        ip = self.get_client_ip(request)
        ip_id = _hash_ip(ip)
        endpoint_key = request.url.path
        endpoint_tier = self._endpoint_tier(request)
        # Tier decisions
        out: dict[str, Decision] = {}
        out["global"] = self._evaluate("global", self.limits["global"], "all")
        out["ip"] = self._evaluate("ip", self.limits["ip"], ip_id)
        if endpoint_tier:
            out[endpoint_tier] = self._evaluate(endpoint_tier, self.limits[endpoint_tier], f"{ip_id}:{endpoint_key}")
        return out, endpoint_tier

    def apply_headers(self, response: Response, decision: Decision) -> None:
        response.headers["X-RateLimit-Limit"] = str(decision.limit)
        response.headers["X-RateLimit-Remaining"] = str(decision.remaining)
        response.headers["X-RateLimit-Reset"] = str(decision.reset_time)
        if not decision.allowed:
            response.headers["Retry-After"] = str(decision.retry_after)


def rate_limit_middleware(settings: Settings):
    limiter = RateLimiter(settings)

    async def middleware(request: Request, call_next):
        if not settings.RATE_LIMIT_ENABLED or limiter.exempt(request):
            return await call_next(request)

        decisions, endpoint_tier = limiter.check_with_context(request)
        # Enforce in order: global -> ip -> endpoint
        enforce_order = ["global", "ip"]
        if endpoint_tier:
            enforce_order.append(endpoint_tier)
        for name in enforce_order:
            d = decisions[name]
            if not d.allowed:
                payload = {
                    "error": "Too many requests",
                    "message": "Rate limit exceeded. Please retry later.",
                    "retry_after": d.retry_after,
                    "limit_type": name,
                }
                resp = JSONResponse(payload, status_code=429)
                limiter.apply_headers(resp, d)
                return resp

        response = await call_next(request)
        # Headers du tier le plus spécifique actif; sinon tier IP.
        header_tier = endpoint_tier if endpoint_tier else "ip"
        limiter.apply_headers(response, decisions[header_tier])
        return response

    # Expose for /api/rate-limit
    middleware.limiter = limiter  # type: ignore[attr-defined]
    return middleware
