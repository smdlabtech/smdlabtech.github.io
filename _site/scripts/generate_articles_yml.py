import os
import yaml
import re
from datetime import datetime

POSTS_DIR = "_posts"
OUTPUT_FILE = "_data/articles.yml"

def extract_front_matter(content):
    match = re.match(r"---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if match:
        front_matter = yaml.safe_load(match.group(1))
        body = match.group(2)
        return front_matter, body
    return None, content

def get_excerpt(body):
    lines = [l.strip() for l in body.splitlines() if l.strip()]
    return lines[0][:160] if lines else ""

def get_permalink(front_matter, rel_path):
    if "permalink" in front_matter:
        return front_matter["permalink"]
    url = rel_path.replace("_posts/", "").replace(".md", ".html")
    return "/" + url

def parse_date(date_str):
    if isinstance(date_str, datetime):
        return date_str.date()
    for fmt in ("%Y-%m-%d", "%Y-%m-%d %H:%M:%S"):
        try:
            return datetime.strptime(str(date_str), fmt).date()
        except Exception:
            continue
    return date_str

def main():
    articles = []
    for root, _, files in os.walk(POSTS_DIR):
        for file in files:
            if file.endswith(".md"):
                rel_path = os.path.join(root, file)
                with open(rel_path, "r", encoding="utf-8") as f:
                    content = f.read()
                front_matter, body = extract_front_matter(content)
                if not front_matter or not front_matter.get("title"):
                    continue
                article = {
                    "title": str(front_matter.get("title")),
                    "date": str(parse_date(front_matter.get("date"))),
                    "tags": front_matter.get("tags") or [],
                    "categories": front_matter.get("categories") or [],
                    "excerpt": front_matter.get("excerpt") or get_excerpt(body),
                    "permalink": get_permalink(front_matter, rel_path)
                }
                if isinstance(article["tags"], str):
                    article["tags"] = [article["tags"]]
                if isinstance(article["categories"], str):
                    article["categories"] = [article["categories"]]
                articles.append(article)
    articles.sort(key=lambda x: x["date"], reverse=True)
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        yaml.dump(articles, f, allow_unicode=True, sort_keys=False)
    print(f"{len(articles)} articles exportés dans {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
