"""
Tests d'intégration pour l'API
"""
import pytest
import json
from src.database.models import Article


class TestArticlesAPI:
    """Tests pour l'API Articles"""
    
    def test_get_articles_empty(self, client):
        """Test récupération des articles (vide)"""
        response = client.get('/api/v1/articles/')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'articles' in data
        assert len(data['articles']) == 0
    
    def test_get_article_not_found(self, client):
        """Test récupération d'un article inexistant"""
        response = client.get('/api/v1/articles/999')
        assert response.status_code == 404
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_create_and_get_article(self, client, app, db):
        """Test création et récupération d'un article via API"""
        # Créer un article directement en DB
        with app.app_context():
            article = Article(
                title="Test Article",
                content="Content",
                slug="test-article",
                published=True
            )
            db.session.add(article)
            db.session.commit()
            article_id = article.id
        
        # Récupérer via API
        response = client.get(f'/api/v1/articles/{article_id}')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['title'] == "Test Article"
        assert data['slug'] == "test-article"


class TestHealthChecks:
    """Tests pour les health checks"""
    
    def test_health_endpoint(self, client):
        """Test endpoint /health"""
        response = client.get('/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'healthy'
    
    def test_health_ready(self, client):
        """Test endpoint /health/ready"""
        response = client.get('/health/ready')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'status' in data
    
    def test_health_live(self, client):
        """Test endpoint /health/live"""
        response = client.get('/health/live')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'alive'

