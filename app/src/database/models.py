"""
Modèles SQLAlchemy Améliorés
Architecture moderne avec relations, vues, et fonctionnalités avancées
"""
from datetime import datetime, timezone

from slugify import slugify
from src.database.extensions import db


def utcnow():
    """Helper pour obtenir la date/heure UTC actuelle"""
    return datetime.now(timezone.utc)


# ============================================
# Table d'association Article <-> Tag (Many-to-Many)
# ============================================

article_tags = db.Table(
    "article_tags",
    db.Column("article_id", db.Integer, db.ForeignKey("articles.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
    db.Column("created_at", db.DateTime, default=utcnow),
)


# ============================================
# Modèle Tag
# ============================================


class Tag(db.Model):
    """Modèle pour les tags/catégories"""

    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    color = db.Column(db.String(7), default="#E31E24")  # Couleur hex
    icon = db.Column(db.String(50))  # FontAwesome icon class
    parent_id = db.Column(db.Integer, db.ForeignKey("tags.id"), nullable=True)

    # Compteurs
    article_count = db.Column(db.Integer, default=0)

    # Timestamps
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    # Relations
    children = db.relationship("Tag", backref=db.backref("parent", remote_side=[id]))
    articles = db.relationship("Article", secondary=article_tags, back_populates="tags")

    def __init__(self, name: str, **kwargs):
        super().__init__(**kwargs)
        self.name = name
        self.slug = slugify(name)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "color": self.color,
            "icon": self.icon,
            "article_count": self.article_count,
            "parent_id": self.parent_id,
        }

    @staticmethod
    def get_or_create(name: str) -> "Tag":
        """Récupère un tag existant ou en crée un nouveau"""
        slug = slugify(name)
        tag = Tag.query.filter_by(slug=slug).first()
        if not tag:
            tag = Tag(name=name)
            db.session.add(tag)
        return tag

    def update_article_count(self):
        """Met à jour le compteur d'articles"""
        self.article_count = len([a for a in self.articles if a.published])


# ============================================
# Modèle Article
# ============================================


class Article(db.Model):
    """Modèle pour les articles de blog"""

    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    excerpt = db.Column(db.Text)
    slug = db.Column(db.String(200), unique=True, nullable=False)

    # SEO
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(300))

    # Media
    cover_image = db.Column(db.String(500))
    thumbnail_image = db.Column(db.String(500))

    # Status
    published = db.Column(db.Boolean, default=False)
    featured = db.Column(db.Boolean, default=False)

    # Engagement
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    shares_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)

    # Lecture
    reading_time = db.Column(db.Integer)  # En minutes
    word_count = db.Column(db.Integer)

    # Auteur
    author_id = db.Column(db.Integer, db.ForeignKey("authors.id"))

    # Timestamps
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)
    published_at = db.Column(db.DateTime)

    # Relations
    tags = db.relationship("Tag", secondary=article_tags, back_populates="articles")
    author = db.relationship("Author", back_populates="articles")
    views = db.relationship("ArticleView", back_populates="article", cascade="all, delete-orphan")
    reactions = db.relationship(
        "ArticleReaction", back_populates="article", cascade="all, delete-orphan"
    )

    def __init__(self, title: str, content: str, **kwargs):
        super().__init__(**kwargs)
        self.title = title
        self.content = content
        self.slug = kwargs.get("slug") or slugify(title)
        self.calculate_reading_stats()

    def calculate_reading_stats(self):
        """Calcule le temps de lecture et le nombre de mots"""
        if self.content:
            words = self.content.split()
            self.word_count = len(words)
            self.reading_time = max(1, self.word_count // 200)  # 200 mots/minute

    def increment_views(self, user_ip: str = None, user_agent: str = None):
        """Incrémente le compteur de vues"""
        self.views_count += 1

        # Enregistre la vue détaillée si IP fournie
        if user_ip:
            view = ArticleView(article_id=self.id, ip_address=user_ip, user_agent=user_agent)
            db.session.add(view)

    def add_tag(self, tag_name: str):
        """Ajoute un tag à l'article"""
        tag = Tag.get_or_create(tag_name)
        if tag not in self.tags:
            self.tags.append(tag)
            tag.update_article_count()

    def remove_tag(self, tag_name: str):
        """Supprime un tag de l'article"""
        slug = slugify(tag_name)
        tag = Tag.query.filter_by(slug=slug).first()
        if tag and tag in self.tags:
            self.tags.remove(tag)
            tag.update_article_count()

    def to_dict(self, include_content: bool = True):
        data = {
            "id": self.id,
            "title": self.title,
            "excerpt": self.excerpt,
            "slug": self.slug,
            "meta_title": self.meta_title,
            "meta_description": self.meta_description,
            "cover_image": self.cover_image,
            "thumbnail_image": self.thumbnail_image,
            "published": self.published,
            "featured": self.featured,
            "views_count": self.views_count,
            "likes_count": self.likes_count,
            "shares_count": self.shares_count,
            "comments_count": self.comments_count,
            "reading_time": self.reading_time,
            "word_count": self.word_count,
            "tags": [tag.to_dict() for tag in self.tags],
            "author": self.author.to_dict() if self.author else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "published_at": self.published_at.isoformat() if self.published_at else None,
        }

        if include_content:
            data["content"] = self.content

        return data


# ============================================
# Modèle ArticleView (Statistiques de vues)
# ============================================


class ArticleView(db.Model):
    """Modèle pour tracker les vues d'articles"""

    __tablename__ = "article_views"

    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)
    ip_address = db.Column(db.String(45))  # IPv6 compatible
    user_agent = db.Column(db.String(500))
    referrer = db.Column(db.String(500))
    country = db.Column(db.String(100))
    city = db.Column(db.String(100))
    device_type = db.Column(db.String(50))  # mobile, desktop, tablet

    # Temps passé sur la page (en secondes)
    time_on_page = db.Column(db.Integer)
    scroll_depth = db.Column(db.Integer)  # Pourcentage scrollé

    created_at = db.Column(db.DateTime, default=utcnow)

    # Relations
    article = db.relationship("Article", back_populates="views")


# ============================================
# Modèle ArticleReaction
# ============================================


class ArticleReaction(db.Model):
    """Modèle pour les réactions aux articles"""

    __tablename__ = "article_reactions"

    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)
    reaction_type = db.Column(db.String(20), nullable=False)  # like, love, insightful, etc.
    ip_address = db.Column(db.String(45))

    created_at = db.Column(db.DateTime, default=utcnow)

    # Relations
    article = db.relationship("Article", back_populates="reactions")


# ============================================
# Modèle Author
# ============================================


class Author(db.Model):
    """Modèle pour les auteurs"""

    __tablename__ = "authors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(200), unique=True)
    bio = db.Column(db.Text)
    avatar = db.Column(db.String(500))

    # Social links
    website = db.Column(db.String(500))
    twitter = db.Column(db.String(100))
    linkedin = db.Column(db.String(100))
    github = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    # Relations
    articles = db.relationship("Article", back_populates="author")

    def __init__(self, name: str, **kwargs):
        super().__init__(**kwargs)
        self.name = name
        self.slug = slugify(name)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "bio": self.bio,
            "avatar": self.avatar,
            "website": self.website,
            "twitter": self.twitter,
            "linkedin": self.linkedin,
            "github": self.github,
            "article_count": len(self.articles),
        }


# ============================================
# Modèle Project
# ============================================


class Project(db.Model):
    """Modèle pour les projets"""

    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    description = db.Column(db.Text)
    long_description = db.Column(db.Text)

    # Media
    image_url = db.Column(db.String(500))
    gallery = db.Column(db.JSON)  # Liste d'URLs d'images
    video_url = db.Column(db.String(500))

    # Links
    project_url = db.Column(db.String(500))
    github_url = db.Column(db.String(500))
    demo_url = db.Column(db.String(500))

    # Technologies (stocké en JSON)
    technologies = db.Column(db.JSON)

    # Status
    featured = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(50), default="completed")  # in_progress, completed, archived

    # Dates
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    # Timestamps
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def __init__(self, title: str, **kwargs):
        super().__init__(**kwargs)
        self.title = title
        self.slug = kwargs.get("slug") or slugify(title)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "description": self.description,
            "long_description": self.long_description,
            "image_url": self.image_url,
            "gallery": self.gallery,
            "video_url": self.video_url,
            "project_url": self.project_url,
            "github_url": self.github_url,
            "demo_url": self.demo_url,
            "technologies": self.technologies or [],
            "featured": self.featured,
            "status": self.status,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


# ============================================
# Modèle Experience
# ============================================


class Experience(db.Model):
    """Modèle pour les expériences professionnelles"""

    __tablename__ = "experiences"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    company_url = db.Column(db.String(500))
    company_logo = db.Column(db.String(500))
    location = db.Column(db.String(200))
    description = db.Column(db.Text)

    # Compétences utilisées
    skills = db.Column(db.JSON)

    # Dates
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    current = db.Column(db.Boolean, default=False)

    # Type
    employment_type = db.Column(db.String(50))  # full-time, part-time, freelance, etc.

    # Timestamps
    created_at = db.Column(db.DateTime, default=utcnow)
    updated_at = db.Column(db.DateTime, default=utcnow, onupdate=utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "company_url": self.company_url,
            "company_logo": self.company_logo,
            "location": self.location,
            "description": self.description,
            "skills": self.skills or [],
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
            "current": self.current,
            "employment_type": self.employment_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


# ============================================
# Modèle NewsletterSubscriber
# ============================================


class NewsletterSubscriber(db.Model):
    """Modèle pour les abonnés à la newsletter"""

    __tablename__ = "newsletter_subscribers"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    name = db.Column(db.String(100))

    # Status
    status = db.Column(db.String(20), default="pending")  # pending, confirmed, unsubscribed

    # Tracking
    source = db.Column(db.String(100))  # landing, blog, footer, etc.
    ip_address = db.Column(db.String(45))

    # Tokens
    confirmation_token = db.Column(db.String(100))
    unsubscribe_token = db.Column(db.String(100))

    # Timestamps
    created_at = db.Column(db.DateTime, default=utcnow)
    confirmed_at = db.Column(db.DateTime)
    unsubscribed_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "status": self.status,
            "source": self.source,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# ============================================
# Modèle ContactMessage
# ============================================


class ContactMessage(db.Model):
    """Modèle pour les messages de contact"""

    __tablename__ = "contact_messages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)

    # Status
    status = db.Column(db.String(20), default="new")  # new, read, replied, archived

    # Tracking
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))

    # Timestamps
    created_at = db.Column(db.DateTime, default=utcnow)
    read_at = db.Column(db.DateTime)
    replied_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
