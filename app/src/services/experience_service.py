"""
Service pour la gestion des expériences
"""
from typing import List, Optional
from src.database.extensions import db
from src.database.models import Experience


class ExperienceService:
    """Service pour la gestion des expériences professionnelles"""
    
    def get_all_experiences(self) -> List[Experience]:
        """Récupère toutes les expériences"""
        return Experience.query.order_by(Experience.start_date.desc()).all()
    
    def get_experience_by_id(self, experience_id: int) -> Optional[Experience]:
        """Récupère une expérience par son ID"""
        return db.session.get(Experience, experience_id)
    
    def create_experience(self, **kwargs) -> Experience:
        """Crée une nouvelle expérience"""
        experience = Experience(**kwargs)
        db.session.add(experience)
        db.session.commit()
        return experience
    
    def update_experience(self, experience_id: int, **kwargs) -> Optional[Experience]:
        """Met à jour une expérience"""
        experience = self.get_experience_by_id(experience_id)
        if not experience:
            return None
        
        for key, value in kwargs.items():
            if hasattr(experience, key):
                setattr(experience, key, value)
        
        db.session.commit()
        return experience
    
    def delete_experience(self, experience_id: int) -> bool:
        """Supprime une expérience"""
        experience = self.get_experience_by_id(experience_id)
        if not experience:
            return False
        
        db.session.delete(experience)
        db.session.commit()
        return True

