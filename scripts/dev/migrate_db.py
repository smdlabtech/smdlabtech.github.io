#!/usr/bin/env python3
"""
Script pour exécuter les migrations de base de données
"""
import sys
from pathlib import Path

# Ajouter app/ au PYTHONPATH
app_dir = Path(__file__).parent.parent / "app"
sys.path.insert(0, str(app_dir))

from src import create_app
from src.database.extensions import db, migrate


def run_migrations():
    """Exécute les migrations"""
    app = create_app('development')

    with app.app_context():
        # Les migrations sont déjà initialisées dans create_app
        print("✅ Migrations initialisées")
        print("💡 Utilisez 'flask db upgrade' pour appliquer les migrations")


if __name__ == '__main__':
    run_migrations()
