"""
Découverte et parsing des articles Markdown sous backend/public (posts/ et blog_content/posts/).
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

try:
    import markdown
except ImportError:
    markdown = None  # type: ignore

_BACKEND_DIR = Path(__file__).resolve().parent.parent
_PUBLIC_DIR = _BACKEND_DIR / "public"

# Dossiers canoniques : alias demandé « posts » + arborescence historique blog_content/posts
POSTS_ROOTS = (
    _PUBLIC_DIR / "posts",
    _PUBLIC_DIR / "blog_content" / "posts",
)


def _str_list(values: Any) -> list[str]:
    if not values:
        return []
    if isinstance(values, list):
        return [str(v).strip() for v in values if str(v).strip()]
    value = str(values).strip()
    return [value] if value else []


def _excerpt_from_body(body: str, max_len: int = 280) -> str:
    text = body.replace("\r\n", "\n").strip()
    for line in text.split("\n"):
        s = line.strip()
        if not s or s.startswith("#") or s.startswith("```"):
            continue
        plain = s.replace("**", "").replace("*", "").replace("`", "")
        if len(plain) > max_len:
            return plain[: max_len - 1].rstrip() + "…"
        return plain
    return ""


def _split_front_matter(raw: str) -> tuple[dict[str, Any], str]:
    stripped = raw.lstrip("\ufeff")
    if not stripped.startswith("---"):
        return {}, raw
    end = stripped.find("\n---", 3)
    if end == -1:
        return {}, raw
    fm_text = stripped[3:end]
    body = stripped[end + 4 :].lstrip("\n")
    if not yaml:
        return {}, raw
    try:
        fm = yaml.safe_load(fm_text) or {}
    except Exception:
        fm = {}
    if not isinstance(fm, dict):
        fm = {}
    return fm, body


def _lang_from_filename(path: Path) -> str:
    stem = path.stem
    return "en" if stem.endswith(".en") else "fr"


def _slug_from_path(path: Path) -> str:
    stem = path.stem
    if stem.endswith(".en"):
        return stem[: -3]  # without .en
    return stem


def iter_markdown_post_files() -> list[Path]:
    seen: set[Path] = set()
    out: list[Path] = []
    for root in POSTS_ROOTS:
        if not root.is_dir():
            continue
        for p in sorted(root.rglob("*.md")):
            rp = p.resolve()
            if rp in seen:
                continue
            seen.add(rp)
            out.append(p)
    return out


def posts_tree_fingerprint() -> int:
    """Fingerprint pour invalider le cache quand un fichier change."""
    total = 0
    for p in iter_markdown_post_files():
        try:
            total += p.stat().st_mtime_ns
        except OSError:
            pass
    return total


def parse_markdown_article(path: Path) -> dict[str, Any] | None:
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError:
        return None
    fm, body = _split_front_matter(raw)
    slug = _slug_from_path(path)
    title = fm.get("title") or slug.replace("-", " ").title()
    categories = _str_list(fm.get("categories"))
    if not categories and fm.get("category") is not None:
        categories = _str_list([fm.get("category")])
    tags = _str_list(fm.get("tags"))
    excerpt = fm.get("excerpt") or fm.get("description") or _excerpt_from_body(body)
    excerpt = str(excerpt).strip() if excerpt else None
    date_val = fm.get("date")
    date_str = str(date_val) if date_val is not None else None
    author = fm.get("author")
    author_str = str(author).strip() if author else None
    perm = fm.get("permalink") or fm.get("url")
    permalink = str(perm).strip() if perm else None

    return {
        "title": str(title).strip() or slug,
        "excerpt": excerpt,
        "permalink": permalink,
        "tags": tags,
        "categories": categories,
        "date": date_str,
        "author": author_str,
        "slug": slug,
        "lang": _lang_from_filename(path),
        "source": "markdown",
        "_md_path": str(path.resolve()),
    }


def markdown_body_to_html(body: str) -> str:
    if not markdown:
        escaped = body.replace("&", "&amp;").replace("<", "&lt;")
        return f"<pre>{escaped}</pre>"
    return markdown.markdown(
        body,
        extensions=["fenced_code", "tables", "nl2br"],
        output_format="html",
    )


def read_markdown_body(path: Path) -> str | None:
    try:
        raw = path.read_text(encoding="utf-8")
    except OSError:
        return None
    _fm, body = _split_front_matter(raw)
    return body


def html_for_article_row(row: dict[str, Any]) -> str:
    path_str = row.get("_md_path")
    if not path_str:
        return ""
    body = read_markdown_body(Path(path_str))
    if body is None:
        return ""
    return markdown_body_to_html(body)
