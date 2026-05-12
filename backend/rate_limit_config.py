"""
Rate limit configuration (FastAPI).

Inspired by the provided documentation:
- global + per-IP + endpoint-specific limits
- env multiplier for dev vs prod
- Redis backend in prod, memory fallback in dev
"""

from __future__ import annotations

from dataclasses import dataclass

from backend.config import Settings


@dataclass(frozen=True)
class Limit:
    requests: int
    window_seconds: int
    burst: int


def _scale(limit: Limit, multiplier: float) -> Limit:
    req = max(int(limit.requests * multiplier), 1)
    burst = max(int(limit.burst * multiplier), 0)
    return Limit(requests=req, window_seconds=limit.window_seconds, burst=burst)


def get_limits(settings: Settings) -> dict[str, Limit]:
    mult = settings.rate_limit_multiplier
    base = {
        "global": Limit(settings.RATE_LIMIT_GLOBAL_REQUESTS, settings.RATE_LIMIT_GLOBAL_WINDOW, settings.RATE_LIMIT_GLOBAL_BURST),
        "ip": Limit(settings.RATE_LIMIT_IP_REQUESTS, settings.RATE_LIMIT_IP_WINDOW, settings.RATE_LIMIT_IP_BURST),
        "chat": Limit(settings.RATE_LIMIT_CHAT_REQUESTS, settings.RATE_LIMIT_CHAT_WINDOW, settings.RATE_LIMIT_CHAT_BURST),
        "search": Limit(settings.RATE_LIMIT_SEARCH_REQUESTS, settings.RATE_LIMIT_SEARCH_WINDOW, settings.RATE_LIMIT_SEARCH_BURST),
        "upload": Limit(settings.RATE_LIMIT_UPLOAD_REQUESTS, settings.RATE_LIMIT_UPLOAD_WINDOW, settings.RATE_LIMIT_UPLOAD_BURST),
    }
    return {k: (_scale(v, mult) if not settings.is_production else v) for k, v in base.items()}
