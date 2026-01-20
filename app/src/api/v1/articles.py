"""
Endpoints API pour les articles
"""
from flask import Blueprint, jsonify, request
from src.services.blog_service import BlogService
from src.api.schemas import ArticleSchema

articles_bp = Blueprint('articles', __name__)
blog_service = BlogService()
article_schema = ArticleSchema()
articles_schema = ArticleSchema(many=True)


@articles_bp.route('/', methods=['GET'])
def get_articles():
    """Récupère la liste des articles publiés"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    articles = blog_service.get_published_articles(page=page, per_page=per_page)
    
    return jsonify({
        'articles': articles_schema.dump(articles),
        'page': page,
        'per_page': per_page
    }), 200


@articles_bp.route('/<int:article_id>', methods=['GET'])
def get_article(article_id):
    """Récupère un article par son ID"""
    article = blog_service.get_article_by_id(article_id)
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    return jsonify(article_schema.dump(article)), 200


@articles_bp.route('/slug/<slug>', methods=['GET'])
def get_article_by_slug(slug):
    """Récupère un article par son slug"""
    article = blog_service.get_article_by_slug(slug)
    
    if not article:
        return jsonify({'error': 'Article not found'}), 404
    
    return jsonify(article_schema.dump(article)), 200

