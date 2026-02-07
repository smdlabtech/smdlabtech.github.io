"""
Métriques Prometheus Avancées
Module de monitoring complet pour la plateforme Data & IA
"""
import functools
import time
from typing import Callable

from flask import Flask, Response, g, request
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
    Info,
    Summary,
    generate_latest,
)

# ============================================
# Métriques d'Application
# ============================================

# Informations sur l'application
APP_INFO = Info("flask_app_info", "Application information")

# Compteur de requêtes HTTP
HTTP_REQUESTS_TOTAL = Counter(
    "flask_http_requests_total", "Total HTTP requests", ["method", "endpoint", "status_code"]
)

# Histogramme de latence des requêtes
HTTP_REQUEST_DURATION = Histogram(
    "flask_http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint"],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
)

# Taille des requêtes/réponses
HTTP_REQUEST_SIZE = Summary(
    "flask_http_request_size_bytes", "HTTP request size in bytes", ["method", "endpoint"]
)

HTTP_RESPONSE_SIZE = Summary(
    "flask_http_response_size_bytes", "HTTP response size in bytes", ["method", "endpoint"]
)

# Requêtes en cours
HTTP_REQUESTS_IN_PROGRESS = Gauge(
    "flask_http_requests_in_progress", "HTTP requests currently in progress", ["method", "endpoint"]
)


# ============================================
# Métriques Métier (Blog)
# ============================================

# Vues d'articles
ARTICLE_VIEWS_TOTAL = Counter(
    "blog_article_views_total", "Total article views", ["slug", "category"]
)

# Recherches effectuées
SEARCH_QUERIES_TOTAL = Counter(
    "blog_search_queries_total", "Total search queries", ["query_type", "has_results"]
)

# Temps de lecture moyen
READING_TIME_SECONDS = Histogram(
    "blog_reading_time_seconds",
    "Time spent reading articles",
    ["slug"],
    buckets=[30, 60, 120, 180, 300, 600, 900, 1800],
)

# Inscriptions newsletter
NEWSLETTER_SUBSCRIPTIONS_TOTAL = Counter(
    "blog_newsletter_subscriptions_total", "Total newsletter subscriptions", ["source"]
)

# Formulaires de contact
CONTACT_FORM_SUBMISSIONS_TOTAL = Counter(
    "blog_contact_form_submissions_total", "Total contact form submissions", ["status"]
)


# ============================================
# Métriques de Cache
# ============================================

CACHE_HITS_TOTAL = Counter("cache_hits_total", "Total cache hits", ["cache_type", "key_prefix"])

CACHE_MISSES_TOTAL = Counter(
    "cache_misses_total", "Total cache misses", ["cache_type", "key_prefix"]
)

CACHE_OPERATIONS_DURATION = Histogram(
    "cache_operation_duration_seconds",
    "Cache operation duration",
    ["operation", "cache_type"],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1],
)


# ============================================
# Métriques de Base de Données
# ============================================

DB_QUERIES_TOTAL = Counter(
    "db_queries_total", "Total database queries", ["operation", "table", "status"]
)

DB_QUERY_DURATION = Histogram(
    "db_query_duration_seconds",
    "Database query duration",
    ["operation", "table"],
    buckets=[0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0],
)

DB_CONNECTIONS_ACTIVE = Gauge("db_connections_active", "Active database connections")

DB_POOL_SIZE = Gauge("db_pool_size", "Database connection pool size")


# ============================================
# Métriques Système
# ============================================

ACTIVE_USERS = Gauge("app_active_users", "Currently active users (based on sessions)")

ERROR_RATE = Counter("app_errors_total", "Total application errors", ["error_type", "endpoint"])


# ============================================
# Décorateurs Utilitaires
# ============================================


def track_article_view(slug: str, category: str = "unknown") -> None:
    """Track an article view"""
    ARTICLE_VIEWS_TOTAL.labels(slug=slug, category=category).inc()


def track_search_query(query_type: str = "general", has_results: bool = True) -> None:
    """Track a search query"""
    SEARCH_QUERIES_TOTAL.labels(query_type=query_type, has_results=str(has_results).lower()).inc()


def track_newsletter_subscription(source: str = "website") -> None:
    """Track a newsletter subscription"""
    NEWSLETTER_SUBSCRIPTIONS_TOTAL.labels(source=source).inc()


def track_contact_form(status: str = "success") -> None:
    """Track a contact form submission"""
    CONTACT_FORM_SUBMISSIONS_TOTAL.labels(status=status).inc()


def track_cache_hit(cache_type: str = "redis", key_prefix: str = "default") -> None:
    """Track a cache hit"""
    CACHE_HITS_TOTAL.labels(cache_type=cache_type, key_prefix=key_prefix).inc()


def track_cache_miss(cache_type: str = "redis", key_prefix: str = "default") -> None:
    """Track a cache miss"""
    CACHE_MISSES_TOTAL.labels(cache_type=cache_type, key_prefix=key_prefix).inc()


def timed_cache_operation(operation: str, cache_type: str = "redis"):
    """Decorator to time cache operations"""

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            try:
                return func(*args, **kwargs)
            finally:
                duration = time.perf_counter() - start_time
                CACHE_OPERATIONS_DURATION.labels(
                    operation=operation, cache_type=cache_type
                ).observe(duration)

        return wrapper

    return decorator


def track_db_query(operation: str, table: str, status: str = "success") -> None:
    """Track a database query"""
    DB_QUERIES_TOTAL.labels(operation=operation, table=table, status=status).inc()


def timed_db_query(operation: str, table: str):
    """Decorator to time database queries"""

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            try:
                result = func(*args, **kwargs)
                track_db_query(operation, table, "success")
                return result
            except Exception:
                track_db_query(operation, table, "error")
                raise
            finally:
                duration = time.perf_counter() - start_time
                DB_QUERY_DURATION.labels(operation=operation, table=table).observe(duration)

        return wrapper

    return decorator


# ============================================
# Middleware de Métriques
# ============================================


def setup_metrics_middleware(app: Flask) -> None:
    """Configure le middleware de métriques automatiques"""

    @app.before_request
    def before_request():
        """Enregistre le début de la requête"""
        g.start_time = time.perf_counter()

        # Incrémenter les requêtes en cours
        endpoint = request.endpoint or "unknown"
        HTTP_REQUESTS_IN_PROGRESS.labels(method=request.method, endpoint=endpoint).inc()

        # Enregistrer la taille de la requête
        content_length = request.content_length or 0
        HTTP_REQUEST_SIZE.labels(method=request.method, endpoint=endpoint).observe(content_length)

    @app.after_request
    def after_request(response):
        """Enregistre les métriques après la requête"""
        endpoint = request.endpoint or "unknown"
        method = request.method

        # Calculer la durée
        if hasattr(g, "start_time"):
            duration = time.perf_counter() - g.start_time
            HTTP_REQUEST_DURATION.labels(method=method, endpoint=endpoint).observe(duration)

        # Compteur de requêtes
        HTTP_REQUESTS_TOTAL.labels(
            method=method, endpoint=endpoint, status_code=response.status_code
        ).inc()

        # Décrémenter les requêtes en cours
        HTTP_REQUESTS_IN_PROGRESS.labels(method=method, endpoint=endpoint).dec()

        # Taille de la réponse
        content_length = response.content_length or 0
        HTTP_RESPONSE_SIZE.labels(method=method, endpoint=endpoint).observe(content_length)

        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        """Enregistre les erreurs"""
        endpoint = request.endpoint or "unknown"
        error_type = type(e).__name__
        ERROR_RATE.labels(error_type=error_type, endpoint=endpoint).inc()
        raise e


# ============================================
# Enregistrement des Métriques
# ============================================


def register_metrics(app: Flask) -> None:
    """
    Enregistre l'endpoint de métriques Prometheus et configure le middleware
    """
    # Informations sur l'application
    APP_INFO.info(
        {
            "version": "2.0.0",
            "environment": app.config.get("ENV", "development"),
            "framework": "Flask",
            "python_version": "3.11+",
        }
    )

    # Configuration du middleware
    setup_metrics_middleware(app)

    @app.route("/metrics", methods=["GET"])
    def metrics():
        """
        Endpoint Prometheus pour les métriques

        Returns:
            Response: Métriques au format Prometheus
        """
        return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

    @app.route("/metrics/health", methods=["GET"])
    def metrics_health():
        """
        Health check pour le système de métriques

        Returns:
            dict: Status du système de métriques
        """
        return {
            "status": "healthy",
            "metrics_endpoint": "/metrics",
            "active_collectors": [
                "http_requests",
                "http_duration",
                "article_views",
                "cache_operations",
                "db_queries",
                "errors",
            ],
        }


# ============================================
# Export des fonctions publiques
# ============================================

__all__ = [
    "register_metrics",
    "track_article_view",
    "track_search_query",
    "track_newsletter_subscription",
    "track_contact_form",
    "track_cache_hit",
    "track_cache_miss",
    "timed_cache_operation",
    "track_db_query",
    "timed_db_query",
    "HTTP_REQUESTS_TOTAL",
    "HTTP_REQUEST_DURATION",
    "ARTICLE_VIEWS_TOTAL",
    "CACHE_HITS_TOTAL",
    "CACHE_MISSES_TOTAL",
    "DB_QUERIES_TOTAL",
    "ACTIVE_USERS",
    "ERROR_RATE",
]
