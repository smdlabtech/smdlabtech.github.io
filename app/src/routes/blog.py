"""
Routes pour le blog
"""
from flask import Blueprint, render_template, request
from src.services.blog_service import BlogService

blog_bp = Blueprint('blog', __name__)
blog_service = BlogService()


@blog_bp.route('/')
def blog_list():
    """Liste des articles"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    articles = blog_service.get_published_articles(page=page, per_page=per_page)
    
    return render_template('blog/list.html', articles=articles)


@blog_bp.route('/<slug>')
def blog_post(slug):
    """Détail d'un article"""
    article = blog_service.get_article_by_slug(slug)
    
    if not article:
        return render_template('errors/404.html'), 404
    
    return render_template('blog/post.html', article=article)

