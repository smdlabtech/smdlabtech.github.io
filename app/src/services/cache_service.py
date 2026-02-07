"""
Service de Cache Redis
Implémentation du caching pour améliorer les performances
"""
import functools
import hashlib
import json
from typing import Any, Callable, Optional

import redis
from flask import current_app
from redis.exceptions import RedisError
from src.monitoring.metrics import timed_cache_operation, track_cache_hit, track_cache_miss


class CacheService:
    """
    Service de cache utilisant Redis
    Fournit des méthodes pour la mise en cache et la récupération de données
    """

    # Préfixes de clés pour organisation
    PREFIX_ARTICLE = "article:"
    PREFIX_ARTICLES_LIST = "articles:list:"
    PREFIX_PROJECT = "project:"
    PREFIX_SEARCH = "search:"
    PREFIX_USER_SESSION = "session:"
    PREFIX_API_RESPONSE = "api:"

    # Durées de cache par défaut (en secondes)
    TTL_SHORT = 60  # 1 minute
    TTL_MEDIUM = 300  # 5 minutes
    TTL_LONG = 3600  # 1 heure
    TTL_DAY = 86400  # 24 heures

    def __init__(self, redis_url: Optional[str] = None):
        """
        Initialise le service de cache

        Args:
            redis_url: URL de connexion Redis (ex: redis://localhost:6379/0)
        """
        self._redis_url = redis_url
        self._client: Optional[redis.Redis] = None
        self._enabled = True

    @property
    def client(self) -> Optional[redis.Redis]:
        """Lazy loading du client Redis"""
        if self._client is None:
            try:
                url = self._redis_url or current_app.config.get(
                    "REDIS_URL", "redis://localhost:6379/0"
                )
                self._client = redis.from_url(
                    url,
                    decode_responses=True,
                    socket_timeout=5,
                    socket_connect_timeout=5,
                    retry_on_timeout=True,
                )
                # Test de connexion
                self._client.ping()
            except RedisError as e:
                current_app.logger.warning(f"Redis connection failed: {e}. Cache disabled.")
                self._enabled = False
                self._client = None
        return self._client

    @property
    def is_available(self) -> bool:
        """Vérifie si Redis est disponible"""
        if not self._enabled:
            return False
        try:
            if self.client:
                self.client.ping()
                return True
        except RedisError:
            pass
        return False

    @timed_cache_operation("get", "redis")
    def get(self, key: str) -> Optional[Any]:
        """
        Récupère une valeur du cache

        Args:
            key: Clé de cache

        Returns:
            Valeur désérialisée ou None si non trouvée
        """
        if not self.is_available:
            return None

        try:
            value = self.client.get(key)
            if value is not None:
                track_cache_hit("redis", key.split(":")[0] if ":" in key else "default")
                return self._deserialize(value)
            track_cache_miss("redis", key.split(":")[0] if ":" in key else "default")
            return None
        except RedisError as e:
            current_app.logger.error(f"Cache get error for {key}: {e}")
            return None

    @timed_cache_operation("set", "redis")
    def set(self, key: str, value: Any, ttl: Optional[int] = None, nx: bool = False) -> bool:
        """
        Stocke une valeur dans le cache

        Args:
            key: Clé de cache
            value: Valeur à stocker (sera sérialisée en JSON)
            ttl: Time-to-live en secondes (défaut: TTL_MEDIUM)
            nx: Si True, ne stocke que si la clé n'existe pas

        Returns:
            True si stocké avec succès
        """
        if not self.is_available:
            return False

        try:
            ttl = ttl or self.TTL_MEDIUM
            serialized = self._serialize(value)

            if nx:
                return bool(self.client.set(key, serialized, ex=ttl, nx=True))
            else:
                return bool(self.client.set(key, serialized, ex=ttl))
        except RedisError as e:
            current_app.logger.error(f"Cache set error for {key}: {e}")
            return False

    @timed_cache_operation("delete", "redis")
    def delete(self, key: str) -> bool:
        """
        Supprime une clé du cache

        Args:
            key: Clé à supprimer

        Returns:
            True si supprimée
        """
        if not self.is_available:
            return False

        try:
            return bool(self.client.delete(key))
        except RedisError as e:
            current_app.logger.error(f"Cache delete error for {key}: {e}")
            return False

    def delete_pattern(self, pattern: str) -> int:
        """
        Supprime toutes les clés correspondant à un pattern

        Args:
            pattern: Pattern de clé (ex: 'article:*')

        Returns:
            Nombre de clés supprimées
        """
        if not self.is_available:
            return 0

        try:
            keys = list(self.client.scan_iter(match=pattern))
            if keys:
                return self.client.delete(*keys)
            return 0
        except RedisError as e:
            current_app.logger.error(f"Cache delete pattern error for {pattern}: {e}")
            return 0

    def get_or_set(self, key: str, factory: Callable[[], Any], ttl: Optional[int] = None) -> Any:
        """
        Récupère une valeur du cache ou la calcule et la stocke

        Args:
            key: Clé de cache
            factory: Fonction qui génère la valeur si absente du cache
            ttl: Time-to-live en secondes

        Returns:
            Valeur (du cache ou nouvellement calculée)
        """
        value = self.get(key)
        if value is not None:
            return value

        # Calcul de la valeur
        value = factory()
        if value is not None:
            self.set(key, value, ttl)

        return value

    def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """
        Incrémente un compteur atomiquement

        Args:
            key: Clé du compteur
            amount: Valeur d'incrémentation

        Returns:
            Nouvelle valeur du compteur
        """
        if not self.is_available:
            return None

        try:
            return self.client.incr(key, amount)
        except RedisError as e:
            current_app.logger.error(f"Cache increment error for {key}: {e}")
            return None

    def _serialize(self, value: Any) -> str:
        """Sérialise une valeur en JSON"""
        return json.dumps(value, default=str)

    def _deserialize(self, value: str) -> Any:
        """Désérialise une valeur JSON"""
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value

    @staticmethod
    def generate_key(*args, **kwargs) -> str:
        """
        Génère une clé de cache unique basée sur les arguments

        Returns:
            Clé de cache hashée
        """
        key_parts = [str(arg) for arg in args]
        key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
        key_string = ":".join(key_parts)
        return hashlib.md5(key_string.encode()).hexdigest()


# Instance globale
cache_service = CacheService()


# ============================================
# Décorateurs de Caching
# ============================================


def cached(
    prefix: str = "", ttl: int = CacheService.TTL_MEDIUM, key_builder: Optional[Callable] = None
):
    """
    Décorateur pour mettre en cache le résultat d'une fonction

    Args:
        prefix: Préfixe de la clé de cache
        ttl: Time-to-live en secondes
        key_builder: Fonction personnalisée pour construire la clé

    Usage:
        @cached(prefix='articles', ttl=300)
        def get_articles(page=1):
            return Article.query.paginate(page=page)
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Construction de la clé
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                cache_key = f"{prefix}:{CacheService.generate_key(*args, **kwargs)}"

            # Tentative de récupération du cache
            cached_value = cache_service.get(cache_key)
            if cached_value is not None:
                return cached_value

            # Exécution de la fonction
            result = func(*args, **kwargs)

            # Mise en cache du résultat
            if result is not None:
                cache_service.set(cache_key, result, ttl)

            return result

        # Méthode pour invalider le cache
        def invalidate(*args, **kwargs):
            if key_builder:
                cache_key = key_builder(*args, **kwargs)
            else:
                cache_key = f"{prefix}:{CacheService.generate_key(*args, **kwargs)}"
            return cache_service.delete(cache_key)

        wrapper.invalidate = invalidate
        wrapper.cache_prefix = prefix

        return wrapper

    return decorator


def cache_page(ttl: int = CacheService.TTL_MEDIUM):
    """
    Décorateur pour mettre en cache une page entière basée sur l'URL

    Usage:
        @app.route('/articles')
        @cache_page(ttl=300)
        def articles_list():
            return render_template('articles.html')
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            from flask import request

            cache_key = f"page:{request.path}:{request.query_string.decode()}"

            cached_response = cache_service.get(cache_key)
            if cached_response is not None:
                return cached_response

            result = func(*args, **kwargs)

            # Ne cache que les réponses réussies
            if hasattr(result, "status_code"):
                if 200 <= result.status_code < 300:
                    cache_service.set(cache_key, result.get_data(as_text=True), ttl)
            else:
                cache_service.set(cache_key, result, ttl)

            return result

        return wrapper

    return decorator


def invalidate_cache(pattern: str):
    """
    Décorateur pour invalider le cache après l'exécution d'une fonction

    Usage:
        @invalidate_cache('articles:*')
        def create_article(data):
            # Création de l'article
            pass
    """

    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            cache_service.delete_pattern(pattern)
            return result

        return wrapper

    return decorator


# ============================================
# Export
# ============================================

__all__ = ["CacheService", "cache_service", "cached", "cache_page", "invalidate_cache"]
