"""
Endpoints API pour les expériences
"""
from flask import Blueprint, jsonify
from src.services.experience_service import ExperienceService
from src.api.schemas import ExperienceSchema

experiences_bp = Blueprint('experiences', __name__)
experience_service = ExperienceService()
experience_schema = ExperienceSchema()
experiences_schema = ExperienceSchema(many=True)


@experiences_bp.route('/', methods=['GET'])
def get_experiences():
    """Récupère la liste des expériences"""
    experiences = experience_service.get_all_experiences()
    
    return jsonify(experiences_schema.dump(experiences)), 200


@experiences_bp.route('/<int:experience_id>', methods=['GET'])
def get_experience(experience_id):
    """Récupère une expérience par son ID"""
    experience = experience_service.get_experience_by_id(experience_id)
    
    if not experience:
        return jsonify({'error': 'Experience not found'}), 404
    
    return jsonify(experience_schema.dump(experience)), 200

