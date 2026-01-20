"""
Configuration pour le développement
"""
from pathlib import Path
from src.config.base import BaseConfig


class DevelopmentConfig(BaseConfig):
    """Configuration de développement"""
    
    DEBUG = True
    TESTING = False
    
    # Base de données SQLite locale
    base_dir = Path(__file__).parent.parent.parent.parent
    instance_path = base_dir / 'instance'
    instance_path.mkdir(exist_ok=True)
    
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{instance_path}/portfolio_pro.db'
    
    # Logging plus verbeux
    LOG_LEVEL = 'DEBUG'
    
    # CORS plus permissif en développement
    CORS_ORIGINS = ['http://localhost:3000', 'http://localhost:8080']
    
    @staticmethod
    def init_app(app):
        """Initialisation spécifique au développement"""
        BaseConfig.init_app(app)

