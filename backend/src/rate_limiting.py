"""
Rate limiting pour l'API Flask : global, par IP, par endpoint (search, upload).
Backend Redis en production, mémoire en dev. Headers X-RateLimit-*, endpoint GET /api/rate-limit.
"""
from flask import Flask, request, jsonify, g
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from src.rate_limit_config import (
    GLOBAL_LIMIT,
    DEFAULT_LIMIT,
    SEARCH_LIMIT,
    UPLOAD_LIMIT,
    get_rate_limit_config,
    RATE_LIMIT_LOG_EXCEEDED,
    RATE_LIMIT_LOG_WARNINGS,
    RATE_LIMIT_LOG_ALL,
    RATE_LIMIT_ALERT_THRESHOLD,
    RATE_LIMIT_ENABLE_METRICS,
)

# Instance partagée (initialisée dans init_rate_limiting)
limiter: Limiter | None = None


def _storage_uri(app: Flask) -> str:
    """Redis en production si configuré ; mémoire en dev/testing (évite 500 si Redis absent)."""
    # En développement/testing : toujours mémoire pour ne pas exiger Redis
    env = (app.config.get("FLASK_ENV") or app.config.get("ENV") or "").lower()
    if env in ("development", "testing") or app.debug:
        return "memory://"
    url = app.config.get("RATELIMIT_STORAGE_URL") or app.config.get("REDIS_URL")
    if url and isinstance(url, str) and url.strip().startswith("redis"):
        return url.strip()
    return "memory://"


def _exempt_when() -> bool:
    """Exempter health, metrics et l'endpoint rate-limit."""
    path = request.path or ""
    return (
        path.startswith("/health")
        or path == "/metrics"
        or path.startswith("/metrics/")
        or path == "/api/rate-limit"
    )


def _register_rate_limit_status_route(app: Flask) -> None:
    """Enregistre GET /api/rate-limit (toujours disponible, même si limiter désactivé)."""
    @app.route("/api/rate-limit", methods=["GET"])
    def rate_limit_status():
        config = get_rate_limit_config()
        client_ip = get_remote_address()
        backend = "redis" if "redis" in _storage_uri(app) else "memory"
        return jsonify({
            "rate_limits": {
                "global": {
                    "limit": config["global"]["requests"],
                    "window_seconds": config["global"]["window_seconds"],
                    "burst": config["global"]["burst"],
                },
                "ip": {
                    "limit": config["ip"]["requests"],
                    "window_seconds": config["ip"]["window_seconds"],
                    "burst": config["ip"]["burst"],
                },
                "search": {
                    "limit": config["search"]["requests"],
                    "window_seconds": config["search"]["window_seconds"],
                    "burst": config["search"]["burst"],
                },
                "upload": {
                    "limit": config["upload"]["requests"],
                    "window_seconds": config["upload"]["window_seconds"],
                    "burst": config["upload"]["burst"],
                },
            },
            "backend": backend,
            "client_ip": client_ip,
            "environment": config["environment"],
            "alert_threshold": config.get("alert_threshold"),
            "log_warnings": config.get("log_warnings"),
            "log_all": config.get("log_all"),
        })


def init_rate_limiting(app: Flask) -> Limiter:
    """Configure Flask-Limiter et enregistre GET /api/rate-limit."""
    global limiter

    if not app.config.get("RATELIMIT_ENABLED", True):
        # Désactivé : limiter no-op (aucune limite appliquée)
        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=[],
            storage_uri="memory://",
            default_limits_exempt_when=lambda: True,
        )
        limiter.init_app(app)
        _register_rate_limit_status_route(app)
        return limiter

    storage = _storage_uri(app)
    try:
        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=[DEFAULT_LIMIT],
            application_limits=[GLOBAL_LIMIT],
            storage_uri=storage,
            default_limits_exempt_when=_exempt_when,
            application_limits_exempt_when=_exempt_when,
            headers_enabled=True,
        )
        limiter.init_app(app)
    except Exception as e:
        app.logger.warning("Rate limiter Redis fallback to memory: %s", e)
        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=[DEFAULT_LIMIT],
            application_limits=[GLOBAL_LIMIT],
            storage_uri="memory://",
            default_limits_exempt_when=_exempt_when,
            application_limits_exempt_when=_exempt_when,
            headers_enabled=True,
        )
        limiter.init_app(app)

    _register_rate_limit_status_route(app)

    # Optionnel : log quand remaining/limit < ALERT_THRESHOLD (approche de la limite)
    if RATE_LIMIT_LOG_WARNINGS or RATE_LIMIT_LOG_ALL:

        @app.after_request
        def _log_rate_limit_usage(response):
            limit_h = response.headers.get("X-RateLimit-Limit")
            remaining_h = response.headers.get("X-RateLimit-Remaining")
            if limit_h is None or remaining_h is None:
                return response
            try:
                limit_val = int(limit_h)
                remaining_val = int(remaining_h)
            except (ValueError, TypeError):
                return response
            if limit_val <= 0:
                return response
            ratio = remaining_val / limit_val
            if RATE_LIMIT_LOG_ALL:
                app.logger.debug(
                    "Rate limit check: path=%s remaining=%s limit=%s",
                    request.path, remaining_val, limit_val,
                )
            elif RATE_LIMIT_LOG_WARNINGS and ratio < RATE_LIMIT_ALERT_THRESHOLD:
                app.logger.warning(
                    "Rate limit approaching: path=%s remaining=%s limit=%s ratio=%.2f",
                    request.path, remaining_val, limit_val, ratio,
                )
            return response

    # Handler 429 pour logging et métriques
    @app.errorhandler(429)
    def ratelimit_handler(e):
        if RATE_LIMIT_LOG_EXCEEDED:
            app.logger.warning("Rate limit exceeded: path=%s ip=%s", request.path, get_remote_address())
        if RATE_LIMIT_ENABLE_METRICS:
            try:
                from src.monitoring.rate_limit_metrics import rate_limit_exceeded_total
                rate_limit_exceeded_total.labels(
                    endpoint=request.endpoint or request.path or "unknown"
                ).inc()
            except Exception:
                pass
        return jsonify(
            error="Too many requests",
            message="Rate limit exceeded. Please retry later.",
            retry_after=getattr(e, "description", None) or 60,
        ), 429

    return limiter


def get_limiter() -> Limiter | None:
    """Retourne l'instance du limiter (pour décorer les routes)."""
    return limiter
