"""
Middleware de sécurité
Meilleures pratiques de sécurité pour les applications web
"""
import os
import time
from flask import Flask, request, g, jsonify
from functools import wraps


def setup_security_middleware(app: Flask) -> None:
    """Configure les middlewares de sécurité selon les meilleures pratiques"""
    
    @app.before_request
    def before_request():
        """Exécuté avant chaque requête"""
        g.start_time = time.time()
        
        # Logging des requêtes suspectes
        if app.config.get('LOG_LEVEL') == 'DEBUG':
            user_agent = request.headers.get('User-Agent', '')
            if any(suspect in user_agent.lower() for suspect in ['bot', 'crawler', 'spider']):
                app.logger.debug(f"Suspicious User-Agent: {user_agent}")
    
    @app.after_request
    def after_request(response):
        """Exécuté après chaque requête - Ajoute les headers de sécurité"""
        
        # Security Headers (OWASP Top 10)
        # 1. X-Content-Type-Options: Empêche le MIME-sniffing
        response.headers['X-Content-Type-Options'] = 'nosniff'
        
        # 2. X-Frame-Options: Protection contre clickjacking
        response.headers['X-Frame-Options'] = 'DENY'
        
        # 3. X-XSS-Protection: Protection XSS (legacy mais toujours utile)
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        # 4. Content-Security-Policy (CSP)
        # En production, configurer selon vos besoins
        if app.config.get('FLASK_ENV') == 'production':
            csp = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self' data:; "
                "connect-src 'self'; "
                "frame-ancestors 'none';"
            )
            response.headers['Content-Security-Policy'] = csp
        
        # 5. Strict-Transport-Security (HSTS) - HTTPS uniquement
        if app.config.get('FLASK_ENV') == 'production':
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        
        # 6. Referrer-Policy: Contrôle des informations de referrer
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # 7. Permissions-Policy (anciennement Feature-Policy)
        response.headers['Permissions-Policy'] = (
            'geolocation=(), '
            'microphone=(), '
            'camera=(), '
            'payment=(), '
            'usb=()'
        )
        
        # 8. X-Permitted-Cross-Domain-Policies
        response.headers['X-Permitted-Cross-Domain-Policies'] = 'none'
        
        # 9. Calculer le temps de réponse
        if hasattr(g, 'start_time'):
            duration = time.time() - g.start_time
            response.headers['X-Response-Time'] = f'{duration:.3f}s'
        
        # 10. Server header (optionnel - masquer la version)
        # response.headers['Server'] = 'WebServer'  # Masquer le serveur utilisé
        
        return response
    
    @app.before_request
    def validate_request_size():
        """Valide la taille de la requête"""
        max_content_length = app.config.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024)
        if request.content_length and request.content_length > max_content_length:
            return jsonify({
                'error': 'Request entity too large',
                'max_size': max_content_length
            }), 413


def rate_limit_by_ip(max_requests: int = 100, window: int = 60):
    """
    Décorateur pour limiter le taux de requêtes par IP
    
    Args:
        max_requests: Nombre maximum de requêtes
        window: Fenêtre de temps en secondes
    """
    from collections import defaultdict
    from time import time
    
    # Stockage simple en mémoire (utiliser Redis en production)
    request_counts = defaultdict(list)
    
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            ip = request.remote_addr
            now = time()
            
            # Nettoyer les anciennes requêtes
            request_counts[ip] = [
                req_time for req_time in request_counts[ip]
                if now - req_time < window
            ]
            
            # Vérifier la limite
            if len(request_counts[ip]) >= max_requests:
                return jsonify({
                    'error': 'Too many requests',
                    'retry_after': window
                }), 429
            
            # Ajouter la requête actuelle
            request_counts[ip].append(now)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

