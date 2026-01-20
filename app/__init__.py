"""
Point d'entrée vers src/ pour compatibilité
"""
import sys
from pathlib import Path

# Ajouter app/ au PYTHONPATH
app_dir = Path(__file__).parent
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

# Importer depuis src
from src import create_app

__all__ = ['create_app']

