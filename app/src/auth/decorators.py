"""
Décorateurs d'authentification
"""
from functools import wraps
from flask import request, jsonify, current_app
import jwt


def admin_required(f):
    """Décorateur pour protéger les routes admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            if request.is_json:
                return jsonify({'error': 'Token manquant'}), 401
            from flask import redirect, url_for
            return redirect(url_for('auth.login'))
        
        try:
            # Extraire le token (format: "Bearer <token>")
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Décoder le token
            payload = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            
            # Vérifier les permissions admin
            if not payload.get('admin', False):
                return jsonify({'error': 'Accès refusé'}), 403
            
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token invalide'}), 401
    
    return decorated_function

