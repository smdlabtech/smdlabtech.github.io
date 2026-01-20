"""
Fonctions utilitaires
"""
from datetime import datetime
from typing import Optional


def format_date(date: Optional[datetime], format_str: str = '%d/%m/%Y') -> str:
    """Formate une date"""
    if not date:
        return ''
    return date.strftime(format_str)


def slugify(text: str) -> str:
    """Convertit un texte en slug"""
    import re
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def truncate(text: str, length: int = 100, suffix: str = '...') -> str:
    """Tronque un texte"""
    if len(text) <= length:
        return text
    return text[:length - len(suffix)] + suffix

