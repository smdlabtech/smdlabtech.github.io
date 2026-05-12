"""
Route export : téléchargement memento en PDF, DOCX, PPTX, HTML.
Les services export_service et memento_service sont optionnels (import paresseux).
"""
from __future__ import annotations

from pathlib import Path

from flask import Blueprint, Response, current_app, make_response, abort

from src.rate_limiting import get_limiter
from src.rate_limit_config import UPLOAD_LIMIT

export_bp = Blueprint("export", __name__, url_prefix="/api/export")
_limiter = get_limiter()

_ALLOWED_EXTENSIONS = frozenset({".pdf", ".docx", ".pptx", ".html"})


def _get_content_root() -> Path | None:
    raw = current_app.config.get("SOURCE_CONTENT_DIR")
    if raw:
        p = Path(raw)
        if p.is_dir():
            return p

    # Fallback local: backend/app/public/blog_content
    fallback = Path(current_app.root_path) / "public" / "blog_content"
    return fallback if fallback.is_dir() else None


def _get_profile() -> dict:
    """Charge le profil memento (optionnel)."""
    try:
        from src.services.memento_service import load_profile
    except ImportError:
        return {
            "name": "", "title": "", "bio": "", "avatar": "assets/avatar.png",
            "signature": {"brand": "Memento Lab", "tagline": "", "location": "", "tags": []},
            "socials": [],
        }
    content_root = _get_content_root()
    if not content_root:
        return {"name": "", "title": "", "bio": "", "avatar": "assets/avatar.png", "signature": {"brand": "Memento Lab", "tagline": "", "location": "", "tags": []}, "socials": []}
    app_root = Path(current_app.root_path)
    icons_dir = app_root / "src" / "brand-kit" / "icons"
    if not icons_dir.exists():
        icons_dir = app_root / "src" / "brand-kit" / "icons"
    return load_profile(content_root, icons_dir)


@export_bp.route("/<path:path>", methods=["GET"])
@_limiter.limit(UPLOAD_LIMIT) if _limiter else lambda f: f
def export_memento(path: str) -> Response:
    """
    Télécharge le memento au format demandé.
    Ex. GET /api/export/2026/ai-engineering/rag/qdrant/chatbot-avec-qdrant.pdf
    """
    try:
        from src.services.export_service import (
            load_memento_by_url_path,
            export_to_docx,
            export_to_pptx,
            export_to_html,
            export_to_pdf,
        )
    except ImportError:
        abort(404)

    path_stripped = path.strip("/").replace("\\", "/")
    if not path_stripped or ".." in path_stripped:
        abort(404)
    suf = Path(path_stripped).suffix.lower()
    if suf not in _ALLOWED_EXTENSIONS:
        abort(404)
    memento_path = path_stripped[: -len(suf)].rstrip("/") if suf else path_stripped.rstrip("/")
    content_root = _get_content_root()
    if not content_root:
        abort(404)
    memento = load_memento_by_url_path(content_root, memento_path)
    if not memento:
        abort(404)
    filename_base = Path(memento_path).name or "memento"
    if suf == ".pdf":
        profile = _get_profile()
        data = export_to_pdf(memento, profile)
        if not data:
            response = make_response(
                "<!DOCTYPE html><html><body><p>Export PDF non disponible (installez weasyprint). Utilisez « Imprimer » puis « Enregistrer en PDF ».</p></body></html>",
                501,
            )
            response.headers["Content-Type"] = "text/html; charset=utf-8"
            return response
        response = make_response(data)
        response.headers["Content-Type"] = "application/pdf"
        response.headers["Content-Disposition"] = f'attachment; filename="{filename_base}.pdf"'
        return response
    if suf == ".docx":
        data = export_to_docx(memento)
        if not data:
            abort(501)
        response = make_response(data)
        response.headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        response.headers["Content-Disposition"] = f'attachment; filename="{filename_base}.docx"'
        return response
    if suf == ".pptx":
        data = export_to_pptx(memento)
        if not data:
            abort(501)
        response = make_response(data)
        response.headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        response.headers["Content-Disposition"] = f'attachment; filename="{filename_base}.pptx"'
        return response
    if suf == ".html":
        profile = _get_profile()
        html_str = export_to_html(memento, profile, static_base=".")
        if not html_str:
            abort(500)
        response = make_response(html_str)
        response.headers["Content-Type"] = "text/html; charset=utf-8"
        response.headers["Content-Disposition"] = f'attachment; filename="{filename_base}.html"'
        return response
    abort(404)
