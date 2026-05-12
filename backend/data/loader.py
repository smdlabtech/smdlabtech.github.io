"""
Charge les données YAML pour servir l'API FastAPI sans dépendance DB.
Priorité aux données canoniques dans backend/data.
"""
from pathlib import Path
from typing import Any
import os

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

# Chemins possibles pour les YAML (ordre de priorité : ceux avec articles.yml ou projects.yml)
_BACKEND_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _BACKEND_DIR.parent
_DATA_DIRS = [
    _BACKEND_DIR / "data",
    _BACKEND_DIR / "src" / "data",
    _BACKEND_DIR / "app" / "data",  # legacy, conservé en fallback
    _REPO_ROOT / "app" / "data",
    _REPO_ROOT / "__backend_old" / "data",
    _REPO_ROOT / "backend_old" / "data",
]

# Cache mémoire simple: path -> (mtime_ns, parsed_rows)
_YAML_CACHE: dict[str, tuple[int, list[dict[str, Any]]]] = {}

# Articles fusionnés (YAML + Markdown), invalidé par mtime articles.yml + arborescence posts
_MERGED_ARTICLES: dict[str, Any] = {"fp": None, "rows": []}


def _env_true(name: str, default: str = "false") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}


def _data_dir() -> Path:
    """Premier dossier data/ existant (priorité aux dossiers contenant articles.yml ou projects.yml)."""
    forced = os.getenv("BACKEND_DATA_DIR")
    if forced:
        p = Path(forced).expanduser()
        if p.exists():
            return p
    if _env_true("BACKEND_DATA_DIR_STRICT"):
        # Mode strict: utiliser uniquement la source canonique backend/data.
        return _BACKEND_DIR / "data"
    for d in _DATA_DIRS:
        if d.exists() and ((d / "articles.yml").exists() or (d / "projects.yml").exists()):
            return d
    for d in _DATA_DIRS:
        if d.exists():
            return d
    return _DATA_DIRS[0]


def _load_yaml(path: Path) -> list[dict[str, Any]]:
    if not path.exists() or not yaml:
        return []
    try:
        with open(path, encoding="utf-8") as f:
            data = yaml.safe_load(f)
        if data is None:
            return []
        return data if isinstance(data, list) else [data]
    except Exception:
        return []


def _load_yaml_cached(path: Path) -> list[dict[str, Any]]:
    """
    Retourne le YAML depuis un cache en mémoire invalidé par mtime.
    Réduit les lectures disque répétées sur les endpoints liste + détail.
    """
    if not path.exists() or not yaml:
        return []
    try:
        mtime_ns = path.stat().st_mtime_ns
    except OSError:
        return []

    cache_key = str(path.resolve())
    cached = _YAML_CACHE.get(cache_key)
    if cached and cached[0] == mtime_ns:
        # copie défensive pour éviter des mutations externes
        return list(cached[1])

    rows = _load_yaml(path)
    _YAML_CACHE[cache_key] = (mtime_ns, rows)
    return list(rows)


def clear_yaml_cache() -> None:
    """Efface les caches YAML et articles fusionnés (utile en tests)."""
    _YAML_CACHE.clear()
    _MERGED_ARTICLES["fp"] = None
    _MERGED_ARTICLES["rows"] = []


def _public_article_dict(row: dict[str, Any]) -> dict[str, Any]:
    """Retire les clés internes (préfixe _)."""
    return {k: v for k, v in row.items() if not str(k).startswith("_")}


def _merged_articles_fingerprint() -> tuple[int, int]:
    yml = _data_dir() / "articles.yml"
    ym = 0
    if yml.exists():
        try:
            ym = yml.stat().st_mtime_ns
        except OSError:
            pass
    from backend.data.blog_posts import posts_tree_fingerprint

    return (ym, posts_tree_fingerprint())


def _build_merged_article_rows() -> list[dict[str, Any]]:
    """Construit la liste triée des articles avec id stable (YAML puis Markdown)."""
    from backend.data.blog_posts import iter_markdown_post_files, parse_markdown_article

    path = _data_dir() / "articles.yml"
    raw = _load_yaml_cached(path)
    seen_perm: set[str] = set()
    yaml_rows: list[dict[str, Any]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        perm = str(item.get("permalink") or item.get("title") or "")
        if perm in seen_perm:
            continue
        seen_perm.add(perm)
        yaml_rows.append({
            "title": item.get("title", ""),
            "excerpt": item.get("excerpt"),
            "permalink": item.get("permalink"),
            "tags": _str_list(item.get("tags")),
            "categories": _str_list(item.get("categories")),
            "date": item.get("date"),
            "author": item.get("author"),
            "slug": item.get("slug"),
            "lang": str(item.get("lang") or "fr").lower(),
            "source": "yaml",
        })

    md_rows: list[dict[str, Any]] = []
    for fp in iter_markdown_post_files():
        row = parse_markdown_article(fp)
        if not row:
            continue
        p = row.get("permalink")
        if p and str(p) in seen_perm:
            continue
        md_rows.append(row)

    combined = yaml_rows + md_rows
    combined.sort(
        key=lambda r: (str(r.get("date") or ""), str(r.get("title") or "")),
        reverse=True,
    )
    for i, r in enumerate(combined):
        r["id"] = i + 1
    return combined


def _all_article_rows() -> list[dict[str, Any]]:
    fp = _merged_articles_fingerprint()
    if _MERGED_ARTICLES["fp"] == fp:
        return _MERGED_ARTICLES["rows"]
    rows = _build_merged_article_rows()
    _MERGED_ARTICLES["fp"] = fp
    _MERGED_ARTICLES["rows"] = rows
    return rows


def get_data_source_info() -> dict[str, Any]:
    """Expose la source de données active et les candidats (debug/ops)."""
    return {
        "selected_dir": str(_data_dir().resolve()),
        "strict_mode": _env_true("BACKEND_DATA_DIR_STRICT"),
        "forced_dir": os.getenv("BACKEND_DATA_DIR"),
        "candidates": [str(p.resolve()) for p in _DATA_DIRS],
    }


def _str_list(values: Any) -> list[str]:
    if not values:
        return []
    if isinstance(values, list):
        return [str(v).strip() for v in values if str(v).strip()]
    value = str(values).strip()
    return [value] if value else []


def load_articles(
    skip: int = 0,
    limit: int = 20,
    q: str | None = None,
    tag: str | None = None,
    category: str | None = None,
    lang: str | None = None,
) -> tuple[list[dict], int]:
    """
    Articles : articles.yml (si présent) + fichiers Markdown sous
    backend/public/posts/ et backend/public/blog_content/posts/.
    Retourne (liste d'items sans clés internes, total après filtres).
    """
    rows = [dict(r) for r in _all_article_rows()]

    lang_norm = (lang or "").strip().lower()
    if lang_norm:
        rows = [r for r in rows if str(r.get("lang") or "fr").lower() == lang_norm]

    q_norm = (q or "").strip().lower()
    tag_norm = (tag or "").strip().lower()
    category_norm = (category or "").strip().lower()

    if q_norm or tag_norm or category_norm:
        filtered: list[dict[str, Any]] = []
        for art in rows:
            tags = [str(t).lower() for t in (art.get("tags") or [])]
            categories = [str(c).lower() for c in (art.get("categories") or [])]
            title = str(art.get("title") or "").lower()
            excerpt = str(art.get("excerpt") or "").lower()
            slug = str(art.get("slug") or "").lower()
            author = str(art.get("author") or "").lower()
            searchable = " ".join([title, excerpt, slug, author] + tags + categories)

            if tag_norm and tag_norm not in tags:
                continue
            if category_norm and category_norm not in categories:
                continue
            if q_norm and q_norm not in searchable:
                continue
            filtered.append(art)
        rows = filtered

    total = len(rows)
    page = [_public_article_dict(r) for r in rows[skip : skip + limit]]
    return page, total


def load_projects(skip: int = 0, limit: int = 20) -> tuple[list[dict], int]:
    """
    Charge les projets depuis projects.yml (backend/app/data, backend_old/data ou app/data).
    Normalise name/title, description, tags, github/website.
    """
    path = _data_dir() / "projects.yml"
    raw = _load_yaml_cached(path)
    items = []
    for i, item in enumerate(raw):
        if not isinstance(item, dict):
            continue
        items.append({
            "id": i + 1,
            "name": item.get("name") or item.get("title"),
            "title": item.get("title") or item.get("name"),
            "description": item.get("description"),
            "tags": _str_list(item.get("tags")),
            "categories": _str_list(item.get("categories")),
            "github": item.get("github"),
            "github_url": item.get("github_url"),
            "website": item.get("website") or item.get("website_url"),
            "website_url": item.get("website_url") or item.get("website"),
            "permalink": item.get("permalink"),
        })
    total = len(items)
    return items[skip : skip + limit], total


def load_experiences(skip: int = 0, limit: int = 20) -> tuple[list[dict], int]:
    """
    Charge les expériences depuis experiences.yml si présent.
    """
    path = _data_dir() / "experiences.yml"
    raw = _load_yaml_cached(path)
    items = []
    for i, item in enumerate(raw):
        if not isinstance(item, dict):
            continue
        items.append({
            "id": i + 1,
            "title": item.get("title", ""),
            "company": item.get("company", ""),
            "company_url": item.get("company_url"),
            "location": item.get("location"),
            "description": item.get("description"),
            "skills": item.get("skills") or [],
            "start_date": str(item["start_date"]) if item.get("start_date") else None,
            "end_date": str(item["end_date"]) if item.get("end_date") else None,
            "current": item.get("current", False),
            "employment_type": item.get("employment_type"),
        })
    total = len(items)
    return items[skip : skip + limit], total


def get_article_by_id(article_id: int) -> dict[str, Any] | None:
    row = next((r for r in _all_article_rows() if r.get("id") == article_id), None)
    if not row:
        return None
    from backend.data.blog_posts import html_for_article_row

    out = _public_article_dict(row)
    if row.get("_md_path"):
        out["content_html"] = html_for_article_row(row)
    return out


def get_project_by_id(project_id: int) -> dict[str, Any] | None:
    items, _ = load_projects(skip=0, limit=10_000)
    return next((it for it in items if it.get("id") == project_id), None)


def get_experience_by_id(experience_id: int) -> dict[str, Any] | None:
    items, _ = load_experiences(skip=0, limit=10_000)
    return next((it for it in items if it.get("id") == experience_id), None)
