import os
import yaml
import re
from datetime import datetime

POSTS_DIR = "_posts"
OUTPUT_FILE = "_data/articles.yml"

def extract_front_matter(md_content):
    """
    Extrait le front matter YAML et le contenu markdown.
    """
    if md_content.startswith('---'):
        parts = md_content.split('---', 2)
        if len(parts) >= 3:
            front_matter = yaml.safe_load(parts[1])
            content = parts[2].strip()
            return front_matter, content
    return {}, md_content

def get_excerpt(content, length=30):
    """
    Génère un extrait à partir du contenu markdown.
    """
    # Retire les balises Jekyll et HTML
    text = re.sub(r"\{%\s*.*?%\}", "", content)
    text = re.sub(r"<.*?>", "", text)
    words = text.strip().split()
    return " ".join(words[:length]) + ("..." if len(words) > length else "")

def get_permalink(front_matter, rel_path):
    """
    Génère un permalink si absent.
    """
    if "permalink" in front_matter:
        return front_matter["permalink"]
    rel_path = rel_path.replace("\\", "/")
    url = rel_path.replace("_posts/", "").replace(".md", ".html")
    return "/" + url

def parse_date(date_value):
    """
    Convertit la date en chaîne ISO (YYYY-MM-DD).
    """
    if isinstance(date_value, datetime):
        return date_value.strftime("%Y-%m-%d")
    if isinstance(date_value, str):
        try:
            # Essaye de parser la date
            return str(datetime.fromisoformat(date_value).date())
        except Exception:
            return date_value
    return str(date_value)

def main():
    articles = []
    for root, _, files in os.walk(POSTS_DIR):
        for file in files:
            if file.endswith(".md"):
                rel_path = os.path.join(root, file)
                try:
                    with open(rel_path, "r", encoding="utf-8") as f:
                        content = f.read()
                    front_matter, body = extract_front_matter(content)
                    if not front_matter or not front_matter.get("title"):
                        continue  # Ignore les fichiers sans titre
                    article = {
                        "title": str(front_matter.get("title")),
                        "date": parse_date(front_matter.get("date")),
                        "tags": front_matter.get("tags") or [],
                        "categories": front_matter.get("categories") or [],
                        "excerpt": front_matter.get("excerpt") or get_excerpt(body),
                        "permalink": get_permalink(front_matter, rel_path)
                    }
                    # Force tags/categories en liste
                    if isinstance(article["tags"], str):
                        article["tags"] = [article["tags"]]
                    if isinstance(article["categories"], str):
                        article["categories"] = [article["categories"]]
                    articles.append(article)
                except Exception as e:
                    print(f"Erreur dans {rel_path}: {e}")
    # Trie par date décroissante
    articles.sort(key=lambda x: x["date"], reverse=True)
    # Écrit le fichier YAML
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        yaml.dump(articles, f, allow_unicode=True, sort_keys=False)
    print(f"{len(articles)} articles exportés dans {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
