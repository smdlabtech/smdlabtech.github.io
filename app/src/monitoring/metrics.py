"""
Métriques Prometheus
"""
from flask import Flask, Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST


def register_metrics(app: Flask) -> None:
    """Enregistre l'endpoint de métriques Prometheus"""
    
    @app.route('/metrics', methods=['GET'])
    def metrics():
        """Endpoint pour les métriques Prometheus"""
        return Response(
            generate_latest(),
            mimetype=CONTENT_TYPE_LATEST
        )

