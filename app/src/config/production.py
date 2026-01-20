"""
Configuration pour la production
"""
import os
from src.config.base import BaseConfig


class ProductionConfig(BaseConfig):
    """Configuration de production"""
    
    DEBUG = False
    TESTING = False
    
    # Base de données (PostgreSQL recommandé en production)
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://user:password@localhost/portfolio_pro'
    )
    
    # Sécurité - Les valeurs seront vérifiées dans init_app
    SECRET_KEY = os.getenv('SECRET_KEY', '')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '')
    
    # Redis
    REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379/0')
    CACHE_REDIS_URL = REDIS_URL
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
    
    @staticmethod
    def init_app(app):
        """Initialisation spécifique à la production"""
        BaseConfig.init_app(app)
        
        # Vérifier que SECRET_KEY est défini en production
        if not app.config.get('SECRET_KEY') or app.config.get('SECRET_KEY') == '':
            raise ValueError(
                "SECRET_KEY doit être défini en production. "
                "Définissez la variable d'environnement SECRET_KEY."
            )
        
        # Utiliser SECRET_KEY pour JWT si JWT_SECRET_KEY n'est pas défini
        if not app.config.get('JWT_SECRET_KEY') or app.config.get('JWT_SECRET_KEY') == '':
            app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']
        
        # Logging vers un service externe (Cloud Logging, etc.)
        import logging
        from logging.handlers import RotatingFileHandler
        
        if not app.debug:
            # Créer le dossier logs s'il n'existe pas
            os.makedirs('logs', exist_ok=True)
            
            file_handler = RotatingFileHandler(
                'logs/portfolio.log',
                maxBytes=10240000,
                backupCount=10
            )
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            app.logger.setLevel(logging.INFO)
            app.logger.info('Portfolio startup')

