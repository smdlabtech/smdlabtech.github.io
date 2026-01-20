"""
Gestionnaires d'erreurs
"""
from flask import Flask, render_template, jsonify, request


def register_error_handlers(app: Flask) -> None:
    """Enregistre les gestionnaires d'erreurs"""
    
    @app.errorhandler(404)
    def not_found(error):
        """Gestionnaire pour les erreurs 404"""
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Resource not found'}), 404
        return render_template('errors/404.html'), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Gestionnaire pour les erreurs 500"""
        app.logger.error(f'Server Error: {error}')
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Internal server error'}), 500
        return render_template('errors/500.html'), 500
    
    @app.errorhandler(403)
    def forbidden(error):
        """Gestionnaire pour les erreurs 403"""
        if request.path.startswith('/api/'):
            return jsonify({'error': 'Forbidden'}), 403
        return render_template('errors/403.html'), 403

