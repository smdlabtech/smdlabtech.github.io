"""
Schémas Pydantic pour l'API REST (réponses normalisées).
"""
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


class ArticleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    title: str
    excerpt: Optional[str] = None
    permalink: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)
    date: Optional[Any] = None
    author: Optional[str] = None
    slug: Optional[str] = None
    lang: Optional[str] = None
    source: Optional[str] = None
    content_html: Optional[str] = None

class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)  # normalisé en str dans le loader
    github: Optional[str] = None
    github_url: Optional[str] = None
    website: Optional[str] = None
    website_url: Optional[str] = None
    permalink: Optional[str] = None

class ExperienceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[int] = None
    title: str = ""
    company: str = ""
    company_url: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    skills: list[str] = Field(default_factory=list)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    current: bool = False
    employment_type: Optional[str] = None

class ArticlesListOut(BaseModel):
    items: list[ArticleOut]
    total: int
    skip: int
    limit: int
    filters: dict[str, Optional[str]]


class ProjectsListOut(BaseModel):
    items: list[ProjectOut]
    total: int
    skip: int
    limit: int


class ExperiencesListOut(BaseModel):
    items: list[ExperienceOut]
    total: int
    skip: int
    limit: int
