"""
Tests unitaires pour les services
"""
import pytest
from datetime import datetime
from src.database.models import Article, Project, Experience
from src.services.blog_service import BlogService
from src.services.project_service import ProjectService
from src.services.experience_service import ExperienceService


class TestBlogService:
    """Tests pour BlogService"""
    
    def test_get_all_articles_empty(self, app, db):
        """Test récupération de tous les articles (vide)"""
        service = BlogService()
        articles = service.get_all_articles()
        assert articles == []
    
    def test_create_article(self, app, db):
        """Test création d'un article"""
        service = BlogService()
        article = service.create_article(
            title="Test Article",
            content="Content",
            slug="test-article",
            published=True
        )
        assert article.id is not None
        assert article.title == "Test Article"
        assert article.slug == "test-article"
    
    def test_get_article_by_id(self, app, db):
        """Test récupération d'un article par ID"""
        service = BlogService()
        article = service.create_article(
            title="Test Article",
            content="Content",
            slug="test-article",
            published=True
        )
        retrieved = service.get_article_by_id(article.id)
        assert retrieved is not None
        assert retrieved.title == "Test Article"
    
    def test_get_article_by_slug(self, app, db):
        """Test récupération d'un article par slug"""
        service = BlogService()
        article = service.create_article(
            title="Test Article",
            content="Content",
            slug="test-article",
            published=True
        )
        retrieved = service.get_article_by_slug("test-article")
        assert retrieved is not None
        assert retrieved.slug == "test-article"
    
    def test_update_article(self, app, db):
        """Test mise à jour d'un article"""
        service = BlogService()
        article = service.create_article(
            title="Test Article",
            content="Content",
            slug="test-article",
            published=False
        )
        updated = service.update_article(article.id, published=True)
        assert updated is not None
        assert updated.published is True
    
    def test_delete_article(self, app, db):
        """Test suppression d'un article"""
        service = BlogService()
        article = service.create_article(
            title="Test Article",
            content="Content",
            slug="test-article",
            published=True
        )
        result = service.delete_article(article.id)
        assert result is True
        assert service.get_article_by_id(article.id) is None


class TestProjectService:
    """Tests pour ProjectService"""
    
    def test_create_project(self, app, db):
        """Test création d'un projet"""
        service = ProjectService()
        project = service.create_project(
            title="Test Project",
            description="Description",
            featured=True
        )
        assert project.id is not None
        assert project.title == "Test Project"
    
    def test_get_featured_projects(self, app, db):
        """Test récupération des projets mis en avant"""
        service = ProjectService()
        service.create_project(title="Featured", featured=True)
        service.create_project(title="Not Featured", featured=False)
        
        featured = service.get_featured_projects()
        assert len(featured) == 1
        assert featured[0].featured is True


class TestExperienceService:
    """Tests pour ExperienceService"""
    
    def test_create_experience(self, app, db):
        """Test création d'une expérience"""
        service = ExperienceService()
        experience = service.create_experience(
            title="Developer",
            company="Test Company",
            start_date=datetime(2020, 1, 1).date(),
            current=True
        )
        assert experience.id is not None
        assert experience.title == "Developer"
        assert experience.current is True

