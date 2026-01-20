"""
Tests unitaires pour les utilitaires
"""
import pytest
from datetime import datetime
from src.utils.helpers import format_date, slugify, truncate


class TestHelpers:
    """Tests pour les fonctions utilitaires"""
    
    def test_format_date(self):
        """Test formatage de date"""
        date = datetime(2024, 1, 15)
        formatted = format_date(date, '%d/%m/%Y')
        assert formatted == '15/01/2024'
    
    def test_format_date_none(self):
        """Test formatage de date None"""
        assert format_date(None) == ''
    
    def test_slugify(self):
        """Test conversion en slug"""
        assert slugify("Hello World") == "hello-world"
        assert slugify("Test & Special! Characters") == "test--special-characters"
        assert slugify("  Multiple   Spaces  ") == "multiple-spaces"
    
    def test_truncate(self):
        """Test troncature de texte"""
        text = "A" * 150
        truncated = truncate(text, 100)
        assert len(truncated) == 100
        assert truncated.endswith('...')
    
    def test_truncate_short(self):
        """Test troncature d'un texte court"""
        text = "Short text"
        truncated = truncate(text, 100)
        assert truncated == text

