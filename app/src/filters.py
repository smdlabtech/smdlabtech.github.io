"""
Filtres Jinja2 personnalisés
"""
from flask import Flask
from src.utils.helpers import format_date, truncate


def register_filters(app: Flask) -> None:
    """Enregistre les filtres Jinja2 personnalisés"""
    
    @app.template_filter('date')
    def date_filter(date, format_str='%d/%m/%Y'):
        """Filtre pour formater les dates"""
        return format_date(date, format_str)
    
    @app.template_filter('truncate')
    def truncate_filter(text, length=100):
        """Filtre pour tronquer les textes"""
        return truncate(text, length)

