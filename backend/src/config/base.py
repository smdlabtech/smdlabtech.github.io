"""
Configuration de base
"""
import os
from pathlib import Path


class BaseConfig:
    """Configuration de base partagée par tous les environnements"""

    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = False
    TESTING = False

    # Base de données
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }

    # Redis
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CACHE_TYPE = 'redis'
    CACHE_REDIS_URL = REDIS_URL
    CACHE_DEFAULT_TIMEOUT = 300

    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 heure

    # Rate Limiting (voir docs/RATE_LIMITING.md et rate_limit_config.py)
    # Par défaut mémoire ; en prod définir RATELIMIT_STORAGE_URL ou REDIS_URL pour Redis
    RATELIMIT_ENABLED = os.getenv("RATELIMIT_ENABLED", "true").lower() in ("1", "true", "yes")
    RATELIMIT_STORAGE_URL = os.getenv("RATELIMIT_STORAGE_URL", "memory://")

    # Uploads
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB
    UPLOAD_FOLDER = 'public/uploads'
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp'}

    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

    # Monitoring
    PROMETHEUS_ENABLED = True
    HEALTH_CHECK_ENABLED = True

    @staticmethod
    def init_app(app):
        """Initialisation spécifique de l'application"""
        pass
