"""
Health checks pour Kubernetes/Cloud Run
"""
from flask import Flask, jsonify
from src.database.extensions import db


def register_health_checks(app: Flask) -> None:
    """Enregistre les endpoints de health check"""
    
    @app.route('/health', methods=['GET'])
    def health():
        """Health check général"""
        return jsonify({
            'status': 'healthy',
            'service': 'flask-portfolio'
        }), 200
    
    @app.route('/health/ready', methods=['GET'])
    def readiness():
        """Readiness check - vérifie si l'app est prête à recevoir du trafic"""
        try:
            # Vérifier la connexion à la base de données
            db.session.execute('SELECT 1')
            return jsonify({
                'status': 'ready',
                'database': 'connected'
            }), 200
        except Exception as e:
            return jsonify({
                'status': 'not ready',
                'error': str(e)
            }), 503
    
    @app.route('/health/live', methods=['GET'])
    def liveness():
        """Liveness check - vérifie si l'app est toujours en vie"""
        return jsonify({
            'status': 'alive'
        }), 200

