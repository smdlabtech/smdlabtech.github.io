#!/usr/bin/env python3
"""
Génère l'inventaire des fichiers Markdown du dépôt.

Sorties:
- docs/MARKDOWN_INVENTORY.md (inventaire complet)
- README.md (section "Documentation" synchronisée)
"""

from __future__ import annotations

import argparse
from pathlib import Path


EXCLUDED_DIRS = {
    ".git",
    ".venv",
    "venv",
    "node_modules",
    "__pycache__",
    ".pytest_cache",
}

EXCLUDED_PATH_PARTS = {
    "site-packages",
    "vendor",
}

README_COMPACT_EXCLUDED_PARTS = {
    "posts",
    "blog_content",
}


def _is_excluded(path: Path) -> bool:
    parts = set(path.parts)
    return bool(parts & EXCLUDED_DIRS) or bool(parts & EXCLUDED_PATH_PARTS)


def _describe(rel: Path) -> str:
    if rel.name == "README.md":
        return "Documentation principale du projet" if rel.parent == Path(".") else f"README du dossier `{rel.parent.as_posix()}`"
    if rel.name == "CODE_OF_CONDUCT.md":
        return "Code de conduite"
    if rel.parts and rel.parts[0] == "docs":
        return f"Document de référence: {rel.stem.replace('_', ' ').replace('-', ' ').lower()}"
    if rel.parts and rel.parts[0] == "monitoring":
        return f"Documentation monitoring: {rel.stem.replace('_', ' ').replace('-', ' ').lower()}"
    if rel.parts and rel.parts[0] == "scripts":
        return f"Documentation scripts: {rel.stem.replace('_', ' ').replace('-', ' ').lower()}"
    if "posts" in rel.parts:
        return "Article de blog (post daté)"
    if "blog_content" in rel.parts:
        return "Contenu article long format"
    if "tags" in rel.parts:
        return "Page tag/catégorie"
    return rel.stem.replace("_", " ").replace("-", " ")


def _row(i: int, rel: Path) -> str:
    path = rel.as_posix()
    return f"| {i} | `{rel.name}` | {_describe(rel)} | [`{path}`]({path}) |"


def generate_inventory(repo_root: Path) -> list[Path]:
    files: list[Path] = []
    for p in repo_root.rglob("*.md"):
        rel = p.relative_to(repo_root)
        if _is_excluded(rel):
            continue
        files.append(rel)
    return sorted(files)


def compact_inventory(files: list[Path]) -> list[Path]:
    """Sous-ensemble lisible pour le README, sans noyer avec les contenus articles."""
    selected: list[Path] = []
    for rel in files:
        parts = set(rel.parts)
        if parts & README_COMPACT_EXCLUDED_PARTS:
            continue
        # Garder prioritairement les zones de documentation et les README structurants.
        if rel.parts[0] in {"docs", "monitoring", "scripts", "backend", "frontend"}:
            selected.append(rel)
            continue
        if rel.name in {"README.md", "CODE_OF_CONDUCT.md"}:
            selected.append(rel)
    # Déduplication en conservant l'ordre
    out: list[Path] = []
    seen: set[str] = set()
    for rel in selected:
        key = rel.as_posix()
        if key in seen:
            continue
        seen.add(key)
        out.append(rel)
    return out


def write_inventory_doc(repo_root: Path, files: list[Path]) -> None:
    out = [
        "# Inventaire Markdown du repo",
        "",
        "Inventaire exhaustif des fichiers `.md` **du dépôt** (hors environnements locaux et dépendances installées).",
        "",
        "| N° | Nom fichier | Description | Emplacement |",
        "|---:|---|---|---|",
    ]
    out.extend(_row(i, rel) for i, rel in enumerate(files, 1))
    out.append("")
    (repo_root / "docs" / "MARKDOWN_INVENTORY.md").write_text("\n".join(out), encoding="utf-8")


def write_readme_section(repo_root: Path, files: list[Path], mode: str) -> None:
    readme_path = repo_root / "README.md"
    text = readme_path.read_text(encoding="utf-8")

    start = text.find("## 📚 Documentation")
    end = text.find("## 📝 Licence")
    if start == -1 or end == -1 or end <= start:
        raise RuntimeError("Sections README introuvables: '## 📚 Documentation' ou '## 📝 Licence'.")

    if mode == "compact":
        readme_files = compact_inventory(files)
        subtitle = "Inventaire **compact** pour lecture rapide. L'inventaire exhaustif est dans `docs/MARKDOWN_INVENTORY.md`."
    else:
        readme_files = files
        subtitle = "Inventaire exhaustif de tous les fichiers Markdown du dépôt."

    section = [
        "## 📚 Documentation",
        "",
        "Section centralisée pour inventorier **tous les fichiers Markdown (`.md`) du dépôt** (hors `.venv`, dépendances installées et caches locaux).",
        "",
        subtitle,
        "",
        "Inventaire complet maintenu dans `docs/MARKDOWN_INVENTORY.md`.",
        "",
        "| N° | Nom fichier | Description | Emplacement |",
        "|---:|---|---|---|",
    ]
    section.extend(_row(i, rel) for i, rel in enumerate(readme_files, 1))
    section.extend(["", "---", ""])

    new_text = text[:start] + "\n".join(section) + text[end:]
    readme_path.write_text(new_text, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Génère l'inventaire Markdown du repo.")
    parser.add_argument(
        "--readme-mode",
        choices=("compact", "full"),
        default="compact",
        help="Mode du tableau dans README.md (default: compact).",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    files = generate_inventory(repo_root)
    write_inventory_doc(repo_root, files)
    write_readme_section(repo_root, files, mode=args.readme_mode)
    print(f"Inventaire généré: {len(files)} fichiers Markdown (README mode={args.readme_mode})")


if __name__ == "__main__":
    main()
