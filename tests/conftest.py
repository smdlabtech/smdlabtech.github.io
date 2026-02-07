"""
Configuration pytest pour les tests
"""
import os
import sys
from pathlib import Path

import pytest

# Ajouter app/ au PYTHONPATH pour les imports
app_dir = Path(__file__).parent.parent / "app"
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

# Définir PYTHONPATH pour les imports
os.environ["PYTHONPATH"] = str(app_dir)

from src import create_app  # noqa: E402
from src.database.extensions import db as _db  # noqa: E402


@pytest.fixture
def app():
    """Créer une application Flask pour les tests"""
    app = create_app("testing")
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture
def db(app):
    """Expose db pour les tests qui en ont besoin."""
    with app.app_context():
        yield _db


@pytest.fixture
def client(app):
    """Client de test Flask"""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Runner CLI pour les tests"""
    return app.test_cli_runner()
