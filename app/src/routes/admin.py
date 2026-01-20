"""
Routes d'administration
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from src.auth.decorators import admin_required
from src.services.blog_service import BlogService

admin_bp = Blueprint('admin', __name__)
blog_service = BlogService()


@admin_bp.route('/')
@admin_required
def dashboard():
    """Tableau de bord admin"""
    return render_template('admin/dashboard.html')


@admin_bp.route('/articles')
@admin_required
def articles():
    """Gestion des articles"""
    articles = blog_service.get_all_articles()
    return render_template('admin/articles.html', articles=articles)

