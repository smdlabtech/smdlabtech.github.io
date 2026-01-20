"""
Schémas Marshmallow pour la sérialisation
"""
from marshmallow import Schema, fields, validate


class ArticleSchema(Schema):
    """Schéma pour les articles"""
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    content = fields.Str(required=True)
    excerpt = fields.Str(allow_none=True)
    slug = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    published = fields.Bool(missing=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    tags = fields.List(fields.Str(), allow_none=True)


class ProjectSchema(Schema):
    """Schéma pour les projets"""
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(allow_none=True)
    image_url = fields.Str(allow_none=True, validate=validate.URL())
    project_url = fields.Str(allow_none=True, validate=validate.URL())
    github_url = fields.Str(allow_none=True, validate=validate.URL())
    technologies = fields.List(fields.Str(), allow_none=True)
    featured = fields.Bool(missing=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class ExperienceSchema(Schema):
    """Schéma pour les expériences"""
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    company = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    location = fields.Str(allow_none=True)
    description = fields.Str(allow_none=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(allow_none=True)
    current = fields.Bool(missing=False)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

