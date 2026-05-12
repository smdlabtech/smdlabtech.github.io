"""
Configuration pytest pour les tests (Flask dans backend/app/).
Les tests backend FastAPI (test_backend_fastapi.py) n'utilisent pas ces fixtures.
"""
import os
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
APP_DIR = REPO_ROOT / "backend" / "app"

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))
os.environ.setdefault("PYTHONPATH", str(REPO_ROOT))

try:
    from src import create_app  # noqa: E402
    from src.database.extensions import db as _db  # noqa: E402

    _flask_available = True
except ImportError:
    create_app = None
    _db = None
    _flask_available = False


@pytest.fixture
def app():
    """Créer une application Flask pour les tests (skip si app/src absent)."""
    if not _flask_available:
        pytest.skip("Flask app (backend/app/src) non disponible")
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
    """Client de test Flask."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Runner CLI pour les tests."""
    return app.test_cli_runner()
