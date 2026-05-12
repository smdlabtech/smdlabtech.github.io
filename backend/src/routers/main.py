"""
Routes principales
"""
from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Page d'accueil"""
    return render_template('index.html')


@main_bp.route('/about')
def about():
    """Page à propos"""
    return render_template('about.html')


@main_bp.route('/monitoring')
def monitoring():
    """Page statut monitoring (i18n FR/EN)."""
    return render_template('monitoring.html')
