#!/usr/bin/env python3
"""
Script pour initialiser la base de données
"""
import sys
import os
from pathlib import Path

# Ajouter app/ au PYTHONPATH
app_dir = Path(__file__).parent.parent / "app"
sys.path.insert(0, str(app_dir))

# S'assurer qu'on est en mode développement
os.environ.setdefault('FLASK_ENV', 'development')

from src import create_app
from src.database.extensions import db
from src.database.models import Article, Project, Experience


def init_db():
    """Initialise la base de données"""
    # Forcer l'environnement de développement
    app = create_app('development')

    with app.app_context():
        # Créer toutes les tables
        db.create_all()
        print("✅ Base de données initialisée avec succès")

        # Optionnel: Ajouter des données de test
        # seed_data()


def seed_data():
    """Ajoute des données de test"""
    app = create_app('development')

    with app.app_context():
        # Exemple d'article
        article = Article(
            title="Premier article",
            content="Contenu de l'article...",
            excerpt="Extrait de l'article",
            slug="premier-article",
            published=True,
            tags="python,flask"
        )
        db.session.add(article)

        # Exemple de projet
        project = Project(
            title="Mon premier projet",
            description="Description du projet",
            featured=True,
            technologies="Python,Flask,React"
        )
        db.session.add(project)

        db.session.commit()
        print("✅ Données de test ajoutées")


if __name__ == '__main__':
    init_db()
