"""
Point d'entrée pour lancer l'application Flask
"""
import os
import sys
from pathlib import Path

# Ajouter app/ au PYTHONPATH
app_dir = Path(__file__).parent
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

from src import create_app

# Détection de l'environnement
config_name = os.getenv('FLASK_ENV', 'development')

# Création de l'application
app = create_app(config_name)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )

