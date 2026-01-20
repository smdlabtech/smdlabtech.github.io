"""
Service pour la gestion des fichiers
"""
import os
from pathlib import Path
from typing import Optional
from flask import current_app
from werkzeug.utils import secure_filename


class FileService:
    """Service pour la gestion des fichiers uploadés"""
    
    @staticmethod
    def allowed_file(filename: str) -> bool:
        """Vérifie si l'extension du fichier est autorisée"""
        if '.' not in filename:
            return False
        ext = filename.rsplit('.', 1)[1].lower()
        allowed = current_app.config.get('ALLOWED_EXTENSIONS', set())
        return ext in allowed
    
    @staticmethod
    def get_upload_folder() -> Path:
        """Retourne le chemin du dossier d'upload"""
        # En Docker
        if os.path.exists('/app/src/public/uploads'):
            return Path('/app/src/public/uploads')
        
        # En local - root_path pointe vers app/src/
        base_dir = Path(current_app.root_path)
        upload_folder = base_dir / 'public' / 'uploads'
        upload_folder.mkdir(parents=True, exist_ok=True)
        return upload_folder
    
    @staticmethod
    def save_file(file, subfolder: str = '') -> Optional[str]:
        """
        Sauvegarde un fichier uploadé
        
        Args:
            file: Fichier uploadé (FileStorage)
            subfolder: Sous-dossier dans uploads/
        
        Returns:
            Chemin relatif du fichier sauvegardé ou None
        """
        if not file or not FileService.allowed_file(file.filename):
            return None
        
        filename = secure_filename(file.filename)
        upload_folder = FileService.get_upload_folder()
        
        if subfolder:
            upload_folder = upload_folder / subfolder
            upload_folder.mkdir(parents=True, exist_ok=True)
        
        filepath = upload_folder / filename
        file.save(str(filepath))
        
        # Retourner le chemin relatif
        return f"uploads/{subfolder}/{filename}" if subfolder else f"uploads/{filename}"
    
    @staticmethod
    def delete_file(filepath: str) -> bool:
        """Supprime un fichier"""
        try:
            upload_folder = FileService.get_upload_folder()
            full_path = upload_folder / filepath.lstrip('uploads/')
            if full_path.exists():
                full_path.unlink()
                return True
            return False
        except Exception:
            return False

