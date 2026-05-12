"""
Routeur API v1 — articles, projets, expériences.
Données chargées depuis backend/data/*.yml (YAML) avec fallback legacy.
"""
from fastapi import APIRouter, HTTPException, Query

from backend.data.loader import (
    load_articles,
    load_experiences,
    load_projects,
    get_article_by_id,
    get_project_by_id,
    get_experience_by_id,
)
from backend.schemas import ArticleOut, ExperienceOut, ProjectOut
from backend.schemas import ArticlesListOut, ExperiencesListOut, ProjectsListOut

router = APIRouter()


@router.get("/articles/", response_model=ArticlesListOut)
def list_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    q: str | None = Query(None, description="Recherche texte sur titre/extrait/tags/catégories"),
    tag: str | None = Query(None, description="Filtre exact sur tag (case-insensitive)"),
    category: str | None = Query(None, description="Filtre exact sur catégorie (case-insensitive)"),
    lang: str | None = Query(None, description="Langue du contenu (ex: fr, en)"),
):
    """Liste des articles (YAML + Markdown sous public/posts et public/blog_content/posts)."""
    items, total = load_articles(
        skip=skip, limit=limit, q=q, tag=tag, category=category, lang=lang
    )
    return {
        "items": [ArticleOut(**x).model_dump() for x in items],
        "total": total,
        "skip": skip,
        "limit": limit,
        "filters": {"q": q, "tag": tag, "category": category, "lang": lang},
    }


@router.get("/articles/{article_id}", response_model=ArticleOut)
def get_article(article_id: int):
    """Détail d'un article par ID (index 1-based depuis le YAML)."""
    it = get_article_by_id(article_id)
    if it:
        return ArticleOut(**it).model_dump()
    raise HTTPException(status_code=404, detail="Article not found")


@router.get("/projects/", response_model=ProjectsListOut)
def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """Liste des projets (source canonique: backend/data/projects.yml)."""
    items, total = load_projects(skip=skip, limit=limit)
    return {
        "items": [ProjectOut(**x).model_dump() for x in items],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/projects/{project_id}", response_model=ProjectOut)
def get_project(project_id: int):
    """Détail d'un projet par ID."""
    it = get_project_by_id(project_id)
    if it:
        return ProjectOut(**it).model_dump()
    raise HTTPException(status_code=404, detail="Project not found")


@router.get("/experiences/", response_model=ExperiencesListOut)
def list_experiences(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    """Liste des expériences (source canonique: backend/data/experiences.yml si présent)."""
    items, total = load_experiences(skip=skip, limit=limit)
    return {
        "items": [ExperienceOut(**x).model_dump() for x in items],
        "total": total,
        "skip": skip,
        "limit": limit,
    }


@router.get("/experiences/{experience_id}", response_model=ExperienceOut)
def get_experience(experience_id: int):
    """Détail d'une expérience par ID."""
    it = get_experience_by_id(experience_id)
    if it:
        return ExperienceOut(**it).model_dump()
    raise HTTPException(status_code=404, detail="Experience not found")
