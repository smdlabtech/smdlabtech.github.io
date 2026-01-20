"""
Service pour la gestion des traductions
"""
import os
import json
from pathlib import Path
from typing import Dict, Optional
from flask import current_app


class TranslationService:
    """Service pour la gestion des traductions"""
    
    @staticmethod
    def get_data_folder() -> Path:
        """Retourne le chemin du dossier data"""
        # En Docker
        if os.path.exists('/app/src/data'):
            return Path('/app/src/data')
        
        # En local - root_path pointe vers app/src/
        base_dir = Path(current_app.root_path)
        data_folder = base_dir / 'data'
        return data_folder
    
    @staticmethod
    def load_translations(lang: str = 'fr') -> Dict:
        """Charge les traductions pour une langue"""
        data_folder = TranslationService.get_data_folder()
        filepath = data_folder / f'{lang}.json'
        
        if not filepath.exists():
            return {}
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    
    @staticmethod
    def get_translation(key: str, lang: str = 'fr', default: str = None) -> str:
        """Récupère une traduction par clé"""
        translations = TranslationService.load_translations(lang)
        return translations.get(key, default or key)
    
    @staticmethod
    def load_json_data(filename: str) -> Optional[Dict]:
        """Charge un fichier JSON depuis data/"""
        data_folder = TranslationService.get_data_folder()
        filepath = data_folder / filename
        
        if not filepath.exists():
            return None
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return None

