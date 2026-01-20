"""
Configuration pour les tests
"""
from src.config.base import BaseConfig


class TestingConfig(BaseConfig):
    """Configuration pour les tests"""
    
    DEBUG = True
    TESTING = True
    
    # Base de données en mémoire pour les tests
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    
    # Désactiver certaines fonctionnalités pour les tests
    WTF_CSRF_ENABLED = False
    RATELIMIT_ENABLED = False
    
    # Logging minimal
    LOG_LEVEL = 'WARNING'
    
    @staticmethod
    def init_app(app):
        """Initialisation spécifique aux tests"""
        BaseConfig.init_app(app)

