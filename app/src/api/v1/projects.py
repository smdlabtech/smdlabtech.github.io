"""
Endpoints API pour les projets
"""
from flask import Blueprint, jsonify, request
from src.services.project_service import ProjectService
from src.api.schemas import ProjectSchema

projects_bp = Blueprint('projects', __name__)
project_service = ProjectService()
project_schema = ProjectSchema()
projects_schema = ProjectSchema(many=True)


@projects_bp.route('/', methods=['GET'])
def get_projects():
    """Récupère la liste des projets"""
    featured = request.args.get('featured', type=bool)
    
    if featured:
        projects = project_service.get_featured_projects()
    else:
        projects = project_service.get_all_projects()
    
    return jsonify(projects_schema.dump(projects)), 200


@projects_bp.route('/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Récupère un projet par son ID"""
    project = project_service.get_project_by_id(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    return jsonify(project_schema.dump(project)), 200

