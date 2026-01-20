"""
Service pour la gestion des projets
"""
from typing import List, Optional
from src.database.extensions import db
from src.database.models import Project


class ProjectService:
    """Service pour la gestion des projets"""
    
    def get_all_projects(self) -> List[Project]:
        """Récupère tous les projets"""
        return Project.query.order_by(Project.created_at.desc()).all()
    
    def get_featured_projects(self) -> List[Project]:
        """Récupère les projets mis en avant"""
        return Project.query.filter_by(featured=True).order_by(
            Project.created_at.desc()
        ).all()
    
    def get_project_by_id(self, project_id: int) -> Optional[Project]:
        """Récupère un projet par son ID"""
        return db.session.get(Project, project_id)
    
    def create_project(self, **kwargs) -> Project:
        """Crée un nouveau projet"""
        project = Project(**kwargs)
        db.session.add(project)
        db.session.commit()
        return project
    
    def update_project(self, project_id: int, **kwargs) -> Optional[Project]:
        """Met à jour un projet"""
        project = self.get_project_by_id(project_id)
        if not project:
            return None
        
        for key, value in kwargs.items():
            if hasattr(project, key):
                setattr(project, key, value)
        
        db.session.commit()
        return project
    
    def delete_project(self, project_id: int) -> bool:
        """Supprime un projet"""
        project = self.get_project_by_id(project_id)
        if not project:
            return False
        
        db.session.delete(project)
        db.session.commit()
        return True

