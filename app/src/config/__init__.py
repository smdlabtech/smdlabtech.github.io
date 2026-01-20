"""
Configuration par environnement
"""
import os
from typing import Type

from src.config.base import BaseConfig
from src.config.development import DevelopmentConfig
from src.config.production import ProductionConfig
from src.config.testing import TestingConfig


# Mapping des configurations
config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
}


def get_config(config_name: str = None) -> Type[BaseConfig]:
    """
    Retourne la classe de configuration selon l'environnement
    
    Args:
        config_name: Nom de la configuration (development, production, testing)
    
    Returns:
        Classe de configuration
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    config_class = config_map.get(config_name.lower(), DevelopmentConfig)
    return config_class

