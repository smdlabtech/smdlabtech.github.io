"""
Frontend Flask — interface utilisateur (templates) qui consomme l'API FastAPI.
Point d'entrée : flask --app frontend.app run --port 3000
Ou : python -m flask --app frontend.app run --port 3000
"""
import os
from collections import defaultdict
from datetime import datetime
from pathlib import Path

from flask import Flask, abort, jsonify, render_template, request
import requests

# Répertoire du frontend
FRONTEND_DIR = Path(__file__).parent
TEMPLATES = FRONTEND_DIR / "templates"
STATIC = FRONTEND_DIR / "static"

# URL du backend FastAPI (env)
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080")
API_TIMEOUT = float(os.getenv("API_TIMEOUT", "5"))


def create_app():
    app = Flask(
        __name__,
        template_folder=str(TEMPLATES),
        static_folder=str(STATIC),
    )
    app.config["BACKEND_URL"] = BACKEND_URL

    def _api_get(path: str, params: dict | None = None):
        """Appel API backend avec gestion d'erreurs uniforme."""
        url = f"{app.config['BACKEND_URL']}{path}"
        try:
            response = requests.get(url, params=params, timeout=API_TIMEOUT)
            if not response.ok:
                app.logger.warning("Backend API status %s for %s", response.status_code, path)
                return None, f"API status {response.status_code}"
            return response.json(), None
        except requests.Timeout:
            app.logger.warning("Backend API timeout for %s", path)
            return None, "Timeout backend"
        except requests.RequestException as exc:
            app.logger.warning("Backend API unreachable for %s: %s", path, exc)
            return None, "Backend indisponible"

    @app.route("/")
    def index():
        health_payload, health_error = _api_get("/health")
        rate_payload, rate_error = _api_get("/api/rate-limit")

        health_status = (health_payload or {}).get("status", "unknown")
        rate_backend = (rate_payload or {}).get("backend", "unknown")

        if health_error:
            health_status = "offline"
        if rate_error:
            rate_backend = "unknown"

        proof = {
            "health_status": str(health_status).lower(),
            "rate_backend": str(rate_backend).lower(),
            "health_url": f"{app.config['BACKEND_URL']}/health",
            "docs_url": f"{app.config['BACKEND_URL']}/docs",
            "rate_limit_url": f"{app.config['BACKEND_URL']}/api/rate-limit",
        }
        return render_template("index.html", proof=proof)

    @app.route("/about")
    def about():
        return render_template("about.html")

    @app.route("/parcours")
    def parcours():
        return render_template("parcours.html")

    @app.route("/blog/")
    def blog_list():
        """Blog connecté : pagination + filtres tag/catégorie + recherche + langue (FR/EN)."""
        backend_available = False
        articles = []
        backend_error = None
        page = request.args.get("page", 1, type=int)
        per_page = min(max(request.args.get("per_page", 10, type=int), 1), 20)
        tag_filter = (request.args.get("tag") or "").strip().lower()
        category_filter = (request.args.get("category") or "").strip().lower()
        q = (request.args.get("q") or "").strip().lower()
        lang = (request.args.get("lang") or "fr").strip().lower()
        if lang not in ("fr", "en"):
            lang = "fr"

        skip = (max(page, 1) - 1) * per_page
        params = {"skip": skip, "limit": per_page, "lang": lang}
        if q:
            params["q"] = q
        if tag_filter:
            params["tag"] = tag_filter
        if category_filter:
            params["category"] = category_filter
        payload, backend_error = _api_get("/api/v1/articles/", params=params)
        if payload:
            articles = payload.get("items", [])
            total = int(payload.get("total", len(articles)))
            backend_available = True
        else:
            total = 0

        total_pages = max((total + per_page - 1) // per_page, 1)
        next_page = page + 1 if page < total_pages else None
        prev_page = page - 1 if page > 1 else None

        by_year: dict[str, list] = defaultdict(list)
        for a in articles:
            d = str(a.get("date") or "")
            year_key = d[:4] if len(d) >= 4 else "—"
            by_year[year_key].append(a)
        blog_sections = sorted(by_year.items(), key=lambda x: x[0], reverse=True)

        popular_tags = {}
        popular_categories = {}
        for a in articles:
            for t in a.get("tags") or []:
                popular_tags[t] = popular_tags.get(t, 0) + 1
            for c in a.get("categories") or []:
                popular_categories[c] = popular_categories.get(c, 0) + 1

        return render_template(
            "blog_list.html",
            articles=articles,
            blog_sections=blog_sections,
            backend_available=backend_available,
            backend_error=backend_error,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
            total=total,
            next_page=next_page,
            prev_page=prev_page,
            q=q,
            tag_filter=tag_filter,
            category_filter=category_filter,
            lang=lang,
            popular_tags=sorted(popular_tags.items(), key=lambda x: x[1], reverse=True)[:12],
            popular_categories=sorted(popular_categories.items(), key=lambda x: x[1], reverse=True)[:8],
        )

    @app.route("/blog/<int:article_id>")
    def blog_detail(article_id: int):
        article, error = _api_get(f"/api/v1/articles/{article_id}")
        if error or not article:
            abort(404)
        return render_template("blog_detail.html", article=article)

    @app.route("/projects/")
    def projects_list():
        payload, backend_error = _api_get("/api/v1/projects/", params={"skip": 0, "limit": 50})
        projects = (payload or {}).get("items", [])
        return render_template(
            "projects.html",
            projects=projects,
            backend_available=payload is not None,
            backend_error=backend_error,
        )

    @app.route("/experiences/")
    def experiences_list():
        payload, backend_error = _api_get("/api/v1/experiences/", params={"skip": 0, "limit": 50})
        experiences = (payload or {}).get("items", [])
        return render_template(
            "experiences.html",
            experiences=experiences,
            backend_available=payload is not None,
            backend_error=backend_error,
        )

    @app.route("/monitoring")
    def monitoring():
        return render_template("monitoring.html")

    @app.route("/api/proof")
    def proof():
        health_payload, health_error = _api_get("/health")
        rate_payload, rate_error = _api_get("/api/rate-limit")

        health_status = (health_payload or {}).get("status", "unknown")
        rate_backend = (rate_payload or {}).get("backend", "unknown")

        if health_error:
            health_status = "offline"
        if rate_error:
            rate_backend = "unknown"

        return jsonify(
            {
                "health_status": str(health_status).lower(),
                "rate_backend": str(rate_backend).lower(),
                "health_url": f"{app.config['BACKEND_URL']}/health",
                "docs_url": f"{app.config['BACKEND_URL']}/docs",
                "rate_limit_url": f"{app.config['BACKEND_URL']}/api/rate-limit",
            }
        )

    @app.context_processor
    def inject_globals():
        return {
            "backend_url": app.config["BACKEND_URL"],
            "current_year": datetime.now().year,
        }

    @app.after_request
    def add_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["X-Frame-Options"] = "DENY"
        return response

    return app


app = create_app()
