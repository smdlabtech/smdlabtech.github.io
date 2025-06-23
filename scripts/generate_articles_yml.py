import os
import yaml
import re

POSTS_DIR = "_posts"
OUTPUT_FILE = "_data/articles.yml"

def extract_front_matter(md_content):
    match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)", md_content, re.DOTALL)
    if match:
        front_matter = yaml.safe_load(match.group(1))
        content = match.group(2)
        return front_matter, content
    return {}, md_content

def get_excerpt(content, length=160):
    # Prend les premiers mots du contenu si excerpt absent
    text = re.sub(r"\{%\s*.*?%\}", "", content)  # retire les balises Jekyll
    text = re.sub(r"<.*?>", "", text)  # retire le HTML
    return " ".join(text.strip().split()[:length]) + "..."

def get_permalink(front_matter, rel_path):
    if "permalink" in front_matter:
        return front_matter["permalink"]
    # Génère un permalink à partir du chemin
    rel_path = rel_path.replace("\\", "/")
    url = rel_path.replace("_posts/", "").replace(".md", ".html")
    return "/" + url

def main():
    articles = []
    for root, _, files in os.walk(POSTS_DIR):
        for file in files:
            if file.endswith(".md"):
                rel_path = os.path.join(root, file)
                with open(rel_path, "r", encoding="utf-8") as f:
                    content = f.read()
                front_matter, body = extract_front_matter(content)
                if not front_matter.get("title"):
                    continue  # Ignore les fichiers sans titre
                article = {
                    "title": front_matter.get("title"),
                    "date": str(front_matter.get("date")),
                    "tags": front_matter.get("tags", []),
                    "categories": front_matter.get("categories", []),
                    "excerpt": front_matter.get("excerpt") or get_excerpt(body),
                    "permalink": get_permalink(front_matter, rel_path)
                }
                articles.append(article)
    # Trie par date décroissante
    articles.sort(key=lambda x: x["date"], reverse=True)
    # Écrit le fichier YAML
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        yaml.dump(articles, f, allow_unicode=True, sort_keys=False)
    print(f"{len(articles)} articles exportés dans {OUTPUT_FILE}")



###########################
# MAIN :
##########################
if __name__ == "__main__":
    main()
