"""
Route API : recherche (index memento ou Elasticsearch).
Principe "never trust user" : validation et sanitization de toutes les entrées.
Réponses JSON ou fragment HTML (HTMX) selon l'en-tête HX-Request.
"""
from __future__ import annotations

import time
from pathlib import Path
from typing import Any

from flask import Blueprint, current_app, jsonify, render_template, request

from src.rate_limiting import get_limiter
from src.rate_limit_config import SEARCH_LIMIT

api_bp = Blueprint("api", __name__, url_prefix="/api")
_limiter = get_limiter()

_MAX_QUERY_LEN = 200
_EMPTY_MESSAGE = "Aucun résultat"


def _get_public_dir() -> Path | None:
    path = current_app.config.get("PUBLIC_DIR")
    if not path:
        return None
    return Path(path)


def _sanitize_search_query(raw: str) -> str | None:
    """Valide et normalise la requête (never trust user). Retourne None si invalide."""
    if not raw or not isinstance(raw, str):
        return None
    s = raw.strip()[: _MAX_QUERY_LEN].strip()
    if not s:
        return None
    if "\x00" in s:
        return None
    if any(ord(c) < 32 and c not in " \t\n\r" for c in s):
        return None
    return s


def _safe_url(url: str) -> str:
    """Retourne une URL sûre pour l'affichage (évite javascript:, etc.)."""
    if not url or not isinstance(url, str):
        return "/"
    u = url.strip()
    if not u.startswith("/") or u.startswith("//") or ":" in u:
        return "/"
    return u


def _run_search(query: str) -> list[dict[str, Any]]:
    """
    Exécute la recherche et retourne une liste de hits.
    Utilise search_service / memento_index_cache si disponibles, sinon retourne [].
    """
    try:
        from src.services.search_service import (
            search_elasticsearch,
            search_fallback,
        )
        from src.services.memento_index_cache import get_memento_index
    except ImportError:
        return []

    content_root = Path(current_app.config.get("PUBLIC_DIR", ""))
    if not content_root or not content_root.is_dir():
        return []
    es_url = current_app.config.get("PDE_ELASTICSEARCH_URL", "")
    es_index = current_app.config.get("PDE_ELASTICSEARCH_INDEX", "memento-content")

    def url_builder(_route: str, **_kwargs: Any) -> str:
        return "/"

    if es_url:
        hits = search_elasticsearch(es_url, es_index, query, url_builder)
        if not hits:
            entries = get_memento_index(content_root)
            hits = search_fallback(entries, query, url_builder)
    else:
        entries = get_memento_index(content_root)
        hits = search_fallback(entries, query, url_builder)

    return [
        {
            "type": h.type,
            "title": (h.title or "")[:500],
            "url": _safe_url(h.url),
            "snippet": (h.snippet or "")[:300] if h.snippet else None,
        }
        for h in hits
    ]


@api_bp.route("/search", methods=["GET"])
@_limiter.limit(SEARCH_LIMIT) if _limiter else lambda f: f
def search() -> tuple[Any, int] | Any:
    """
    Recherche dans les mementos.
    GET /api/search?q=... → JSON (ok, query, hits).
    Avec en-tête HX-Request (HTMX) → fragment HTML pour hx-swap.
    """
    public_dir = _get_public_dir()
    if not public_dir or not public_dir.is_dir():
        current_app.logger.warning("api/search: PUBLIC_DIR unavailable")
        payload = {"ok": False, "query": "", "hits": [], "error": "CONTENT_ROOT not available"}
        if request.headers.get("HX-Request"):
            return render_template(
                "api/search_fragment.html",
                hits=[],
                empty_message="Contenu indisponible.",
            ), 503
        return jsonify(**payload), 503

    q = _sanitize_search_query(request.args.get("q") or "")
    if not q:
        if request.headers.get("HX-Request"):
            return render_template(
                "api/search_fragment.html",
                hits=[],
                empty_message=_EMPTY_MESSAGE,
            ), 200
        return jsonify(ok=True, query="", hits=[]), 200

    t0 = time.monotonic()
    try:
        out = _run_search(q)
    except Exception as e:
        current_app.logger.warning("api/search error: %s", e)
        out = []
    elapsed_ms = (time.monotonic() - t0) * 1000
    current_app.logger.info("api/search q=%r hits=%d elapsed_ms=%.0f", q[:50], len(out), elapsed_ms)

    if request.headers.get("HX-Request"):
        return render_template(
            "api/search_fragment.html",
            hits=out,
            empty_message=_EMPTY_MESSAGE,
        ), 200

    return jsonify(ok=True, query=q, hits=out), 200
