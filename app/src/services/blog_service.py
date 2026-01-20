"""
Service pour la gestion des articles de blog
"""
from typing import List, Optional
from flask import current_app
from src.database.extensions import db
from src.database.models import Article


class BlogService:
    """Service pour la gestion des articles"""
    
    def get_all_articles(self, page: int = 1, per_page: int = 10) -> List[Article]:
        """Récupère tous les articles avec pagination"""
        return Article.query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        ).items
    
    def get_published_articles(self, page: int = 1, per_page: int = 10) -> List[Article]:
        """Récupère uniquement les articles publiés"""
        return Article.query.filter_by(published=True).order_by(
            Article.created_at.desc()
        ).paginate(
            page=page,
            per_page=per_page,
            error_out=False
        ).items
    
    def get_article_by_id(self, article_id: int) -> Optional[Article]:
        """Récupère un article par son ID"""
        return db.session.get(Article, article_id)
    
    def get_article_by_slug(self, slug: str) -> Optional[Article]:
        """Récupère un article par son slug"""
        return Article.query.filter_by(slug=slug, published=True).first()
    
    def create_article(self, **kwargs) -> Article:
        """Crée un nouvel article"""
        article = Article(**kwargs)
        db.session.add(article)
        db.session.commit()
        return article
    
    def update_article(self, article_id: int, **kwargs) -> Optional[Article]:
        """Met à jour un article"""
        article = self.get_article_by_id(article_id)
        if not article:
            return None
        
        for key, value in kwargs.items():
            if hasattr(article, key):
                setattr(article, key, value)
        
        db.session.commit()
        return article
    
    def delete_article(self, article_id: int) -> bool:
        """Supprime un article"""
        article = self.get_article_by_id(article_id)
        if not article:
            return False
        
        db.session.delete(article)
        db.session.commit()
        return True

