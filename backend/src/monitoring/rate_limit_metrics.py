"""Métriques Prometheus pour le rate limiting."""
from prometheus_client import Counter

rate_limit_exceeded_total = Counter(
    "rate_limit_exceeded_total",
    "Total rate limit violations",
    ["endpoint"],
)

rate_limit_requests_total = Counter(
    "rate_limit_requests_total",
    "Total requests subject to rate limiting (by limit type)",
    ["limit_type"],
)
