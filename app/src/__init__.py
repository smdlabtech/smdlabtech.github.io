"""
Application Factory Flask
Point d'entrée principal de l'application
"""
import os
from pathlib import Path

from flask import Flask
from flask_cors import CORS
from src.config import get_config
from src.database.extensions import db, migrate
from src.errors import register_error_handlers
from src.middleware.logging import setup_logging
from src.monitoring.health import register_health_checks


def create_app(config_name: str = None) -> Flask:
    """
    Application Factory Pattern

    Args:
        config_name: Nom de la configuration (development, production, testing)
                    Si None, utilise FLASK_ENV ou 'development' par défaut

    Returns:
        Instance de l'application Flask configurée
    """
    # Déterminer le chemin du module src
    src_dir = Path(__file__).parent

    app = Flask(
        __name__,
        template_folder=str(src_dir / "templates"),
        static_folder=str(src_dir / "static"),
        instance_relative_config=True,
    )

    # Détection automatique de l'environnement
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    # Chargement de la configuration
    config_class = get_config(config_name)
    app.config.from_object(config_class)

    # Configuration de l'instance path
    instance_path = _get_instance_path()
    app.instance_path = instance_path
    os.makedirs(instance_path, exist_ok=True)

    # Initialisation des extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # CORS : en production utiliser CORS_ORIGINS (liste), sinon '*' pour dev/test
    origins = app.config.get("CORS_ORIGINS")
    if isinstance(origins, list):
        origins = [o.strip() for o in origins if o and o.strip()]
    if not origins:
        origins = (
            "*"
            if app.config.get("FLASK_ENV") != "production"
            else [
                "https://smdlabtech.github.io",
            ]
        )
    CORS(app, resources={r"/api/*": {"origins": origins}})

    # Configuration du logging
    setup_logging(app)

    # Enregistrement des blueprints
    _register_blueprints(app)

    # Enregistrement des gestionnaires d'erreurs
    register_error_handlers(app)

    # Enregistrement des health checks
    register_health_checks(app)

    # Enregistrement des métriques Prometheus
    from src.monitoring.metrics import register_metrics

    register_metrics(app)

    # Middleware de sécurité
    from src.middleware.security import setup_security_middleware

    setup_security_middleware(app)

    # Filtres Jinja2 personnalisés
    from src.filters import register_filters

    register_filters(app)

    return app


def _get_instance_path() -> Path:
    """
    Détermine le chemin de l'instance folder selon l'environnement

    Returns:
        Chemin vers le dossier instance
    """
    # En Docker, utiliser /app/instance
    if os.path.exists("/app/instance"):
        return Path("/app/instance")

    # En local, utiliser instance/ à la racine du projet
    base_dir = Path(__file__).parent.parent.parent
    instance_path = base_dir / "instance"
    return instance_path


def _register_blueprints(app: Flask) -> None:
    """Enregistre tous les blueprints de l'application"""
    from src.api.v1.articles import articles_bp
    from src.api.v1.experiences import experiences_bp
    from src.api.v1.projects import projects_bp
    from src.routes.admin import admin_bp
    from src.routes.blog import blog_bp
    from src.routes.main import main_bp

    # Routes web
    app.register_blueprint(main_bp)
    app.register_blueprint(blog_bp, url_prefix="/blog")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    # API REST
    app.register_blueprint(articles_bp, url_prefix="/api/v1/articles")
    app.register_blueprint(projects_bp, url_prefix="/api/v1/projects")
    app.register_blueprint(experiences_bp, url_prefix="/api/v1/experiences")
