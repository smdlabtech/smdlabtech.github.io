"""
Configuration pytest pour les tests
"""
import sys
import os
from pathlib import Path
import pytest

# Ajouter app/ au PYTHONPATH pour les imports
app_dir = Path(__file__).parent.parent / "app"
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

# Définir PYTHONPATH pour les imports
os.environ['PYTHONPATH'] = str(app_dir)

from src import create_app
from src.config.testing import TestingConfig
from src.database.extensions import db


@pytest.fixture
def app():
    """Créer une application Flask pour les tests"""
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    """Client de test Flask"""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Runner CLI pour les tests"""
    return app.test_cli_runner()

