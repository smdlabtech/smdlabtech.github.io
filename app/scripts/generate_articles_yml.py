#!/usr/bin/env python3
"""
Script pour générer le fichier articles.yml depuis les posts Jekyll
Amélioré avec gestion d'erreurs et meilleures pratiques
"""
import os
import sys
import yaml
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple


# Configuration
POSTS_DIR = Path("_posts")
OUTPUT_FILE = Path("_data/articles.yml")


def extract_front_matter(content: str) -> Tuple[Optional[Dict], str]:
    """
    Extrait le front matter YAML d'un fichier Markdown
    
    Args:
        content: Contenu du fichier Markdown
    
    Returns:
        Tuple (front_matter dict, body string)
    """
    match = re.match(r"---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if match:
        try:
            front_matter = yaml.safe_load(match.group(1))
            body = match.group(2)
            return front_matter, body
        except yaml.YAMLError as e:
            print(f"⚠️  Erreur YAML: {e}", file=sys.stderr)
            return None, content
    return None, content


def get_excerpt(body: str, max_length: int = 160) -> str:
    """
    Extrait un extrait du corps de l'article
    
    Args:
        body: Corps de l'article
        max_length: Longueur maximale de l'extrait
    
    Returns:
        Extrait tronqué
    """
    lines = [line.strip() for line in body.splitlines() if line.strip()]
    if not lines:
        return ""
    
    excerpt = lines[0]
    if len(excerpt) > max_length:
        excerpt = excerpt[:max_length - 3] + "..."
    return excerpt


def get_permalink(front_matter: Dict, rel_path: str) -> str:
    """
    Génère le permalink de l'article
    
    Args:
        front_matter: Front matter de l'article
        rel_path: Chemin relatif du fichier
    
    Returns:
        Permalink
    """
    if "permalink" in front_matter:
        return front_matter["permalink"]
    
    # Générer depuis le chemin
    url = rel_path.replace("_posts/", "").replace(".md", ".html")
    return f"/{url}"


def parse_date(date_str) -> str:
    """
    Parse une date en string ISO
    
    Args:
        date_str: Date à parser
    
    Returns:
        Date au format string ISO
    """
    if isinstance(date_str, datetime):
        return date_str.date().isoformat()
    
    for fmt in ("%Y-%m-%d", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M:%S %z"):
        try:
            return datetime.strptime(str(date_str), fmt).date().isoformat()
        except (ValueError, TypeError):
            continue
    
    return str(date_str)


def process_article(file_path: Path) -> Optional[Dict]:
    """
    Traite un fichier article et retourne ses métadonnées
    
    Args:
        file_path: Chemin vers le fichier article
    
    Returns:
        Dictionnaire avec les métadonnées de l'article ou None
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception as e:
        print(f"⚠️  Erreur lecture {file_path}: {e}", file=sys.stderr)
        return None
    
    front_matter, body = extract_front_matter(content)
    
    if not front_matter or not front_matter.get("title"):
        return None
    
    # Normaliser les tags et categories
    tags = front_matter.get("tags") or []
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(",")]
    
    categories = front_matter.get("categories") or []
    if isinstance(categories, str):
        categories = [cat.strip() for cat in categories.split(",")]
    
    article = {
        "title": str(front_matter.get("title", "")),
        "date": parse_date(front_matter.get("date")),
        "tags": tags,
        "categories": categories,
        "excerpt": front_matter.get("excerpt") or get_excerpt(body),
        "permalink": get_permalink(front_matter, str(file_path)),
    }
    
    # Ajouter des champs optionnels
    if "author" in front_matter:
        article["author"] = front_matter["author"]
    if "cover-img" in front_matter:
        article["cover_img"] = front_matter["cover-img"]
    if "thumbnail-img" in front_matter:
        article["thumbnail_img"] = front_matter["thumbnail-img"]
    
    return article


def main() -> None:
    """Fonction principale"""
    # Vérifier que le dossier _posts existe
    if not POSTS_DIR.exists():
        print(f"❌ Erreur: Le dossier {POSTS_DIR} n'existe pas", file=sys.stderr)
        sys.exit(1)
    
    articles: List[Dict] = []
    
    # Parcourir tous les fichiers .md dans _posts
    for file_path in POSTS_DIR.rglob("*.md"):
        article = process_article(file_path)
        if article:
            articles.append(article)
    
    # Trier par date (plus récent en premier)
    articles.sort(key=lambda x: x.get("date", ""), reverse=True)
    
    # Créer le dossier _data s'il n'existe pas
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Écrire le fichier YAML
    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            yaml.dump(
                articles,
                f,
                allow_unicode=True,
                sort_keys=False,
                default_flow_style=False,
                indent=2
            )
        print(f"✅ {len(articles)} articles exportés dans {OUTPUT_FILE}")
    except Exception as e:
        print(f"❌ Erreur écriture {OUTPUT_FILE}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
