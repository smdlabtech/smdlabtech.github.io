"""
Configuration du logging
"""
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask


def setup_logging(app: Flask) -> None:
    """Configure le logging pour l'application"""
    if not app.debug:
        # Logging vers fichier en production
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
    
    # Logging vers console
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ))
    console_handler.setLevel(logging.DEBUG if app.debug else logging.INFO)
    app.logger.addHandler(console_handler)
    app.logger.setLevel(logging.DEBUG if app.debug else logging.INFO)

