"""
Configuration du rate limiting (limites par type et par environnement).
Inspiré d'une approche multi-niveaux : global, par IP, par endpoint (search, upload).
"""
import os
from typing import Callable

_FLASK_ENV = os.getenv("FLASK_ENV", "development")
_IS_DEV = _FLASK_ENV.lower() in ("development", "testing")

# Multiplicateur en dev pour assouplir les limites (ex. 5x)
RATE_LIMIT_DEV_MULTIPLIER = float(os.getenv("RATE_LIMIT_DEV_MULTIPLIER", "5.0"))
RATE_LIMIT_PROD_MULTIPLIER = float(os.getenv("RATE_LIMIT_PROD_MULTIPLIER", "1.0"))


def _multiply(requests: int) -> int:
    """Applique le multiplicateur selon l'environnement."""
    mult = RATE_LIMIT_DEV_MULTIPLIER if _IS_DEV else RATE_LIMIT_PROD_MULTIPLIER
    return max(1, int(requests * mult))


# Global (toute l'API)
RATE_LIMIT_GLOBAL_REQUESTS = _multiply(int(os.getenv("RATE_LIMIT_GLOBAL_REQUESTS", "1000")))
RATE_LIMIT_GLOBAL_WINDOW = int(os.getenv("RATE_LIMIT_GLOBAL_WINDOW", "3600"))
RATE_LIMIT_GLOBAL_BURST = _multiply(int(os.getenv("RATE_LIMIT_GLOBAL_BURST", "100")))

# Par IP (défaut)
RATE_LIMIT_IP_REQUESTS = _multiply(int(os.getenv("RATE_LIMIT_IP_REQUESTS", "100")))
RATE_LIMIT_IP_WINDOW = int(os.getenv("RATE_LIMIT_IP_WINDOW", "60"))
RATE_LIMIT_IP_BURST = _multiply(int(os.getenv("RATE_LIMIT_IP_BURST", "20")))

# Search (/api/search)
RATE_LIMIT_SEARCH_REQUESTS = _multiply(int(os.getenv("RATE_LIMIT_SEARCH_REQUESTS", "60")))
RATE_LIMIT_SEARCH_WINDOW = int(os.getenv("RATE_LIMIT_SEARCH_WINDOW", "60"))
RATE_LIMIT_SEARCH_BURST = _multiply(int(os.getenv("RATE_LIMIT_SEARCH_BURST", "15")))

# Upload / Export (/api/export)
RATE_LIMIT_UPLOAD_REQUESTS = _multiply(int(os.getenv("RATE_LIMIT_UPLOAD_REQUESTS", "10")))
RATE_LIMIT_UPLOAD_WINDOW = int(os.getenv("RATE_LIMIT_UPLOAD_WINDOW", "60"))
RATE_LIMIT_UPLOAD_BURST = _multiply(int(os.getenv("RATE_LIMIT_UPLOAD_BURST", "5")))

# Logging / monitoring
RATE_LIMIT_LOG_EXCEEDED = os.getenv("RATE_LIMIT_LOG_EXCEEDED", "true").lower() in ("1", "true", "yes")
RATE_LIMIT_LOG_WARNINGS = os.getenv("RATE_LIMIT_LOG_WARNINGS", "false").lower() in ("1", "true", "yes")
RATE_LIMIT_LOG_ALL = os.getenv("RATE_LIMIT_LOG_ALL", "false").lower() in ("1", "true", "yes")
RATE_LIMIT_ENABLE_METRICS = os.getenv("RATE_LIMIT_ENABLE_METRICS", "true").lower() in ("1", "true", "yes")

# Seuil (0.0–1.0) : alerter quand remaining/limit < seuil (ex. 0.8 = alerte si < 80 % restant)
RATE_LIMIT_ALERT_THRESHOLD = float(os.getenv("RATE_LIMIT_ALERT_THRESHOLD", "0.8"))
if RATE_LIMIT_ALERT_THRESHOLD < 0 or RATE_LIMIT_ALERT_THRESHOLD > 1:
    RATE_LIMIT_ALERT_THRESHOLD = 0.8


def _limit_string(requests: int, window_seconds: int) -> str:
    """Construit une chaîne de limite au format Flask-Limiter (ex. '60/minute')."""
    if window_seconds >= 3600:
        return f"{requests}/hour"
    if window_seconds >= 60:
        return f"{requests}/minute"
    return f"{requests}/second"


# Chaînes pour Flask-Limiter
DEFAULT_LIMIT = _limit_string(RATE_LIMIT_IP_REQUESTS, RATE_LIMIT_IP_WINDOW)
GLOBAL_LIMIT = _limit_string(RATE_LIMIT_GLOBAL_REQUESTS, RATE_LIMIT_GLOBAL_WINDOW)
SEARCH_LIMIT = _limit_string(RATE_LIMIT_SEARCH_REQUESTS, RATE_LIMIT_SEARCH_WINDOW)
UPLOAD_LIMIT = _limit_string(RATE_LIMIT_UPLOAD_REQUESTS, RATE_LIMIT_UPLOAD_WINDOW)


def get_rate_limit_config() -> dict:
    """Retourne la config actuelle (pour l'endpoint /api/rate-limit)."""
    return {
        "global": {
            "requests": RATE_LIMIT_GLOBAL_REQUESTS,
            "window_seconds": RATE_LIMIT_GLOBAL_WINDOW,
            "burst": RATE_LIMIT_GLOBAL_BURST,
        },
        "ip": {
            "requests": RATE_LIMIT_IP_REQUESTS,
            "window_seconds": RATE_LIMIT_IP_WINDOW,
            "burst": RATE_LIMIT_IP_BURST,
        },
        "search": {
            "requests": RATE_LIMIT_SEARCH_REQUESTS,
            "window_seconds": RATE_LIMIT_SEARCH_WINDOW,
            "burst": RATE_LIMIT_SEARCH_BURST,
        },
        "upload": {
            "requests": RATE_LIMIT_UPLOAD_REQUESTS,
            "window_seconds": RATE_LIMIT_UPLOAD_WINDOW,
            "burst": RATE_LIMIT_UPLOAD_BURST,
        },
        "environment": _FLASK_ENV,
        "multiplier": RATE_LIMIT_DEV_MULTIPLIER if _IS_DEV else RATE_LIMIT_PROD_MULTIPLIER,
        "alert_threshold": RATE_LIMIT_ALERT_THRESHOLD,
        "log_warnings": RATE_LIMIT_LOG_WARNINGS,
        "log_all": RATE_LIMIT_LOG_ALL,
    }
