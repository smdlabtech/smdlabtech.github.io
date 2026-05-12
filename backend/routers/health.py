"""
Endpoints de health check pour le backend FastAPI.
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "healthy", "service": "portfolio-api"}


@router.get("/health/ready")
def ready():
    return {"status": "ready"}


@router.get("/health/live")
def live():
    return {"status": "alive"}
"""
Endpoints de health check pour le backend FastAPI.
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "healthy", "service": "portfolio-api"}


@router.get("/health/ready")
def ready():
    return {"status": "ready"}


@router.get("/health/live")
def live():
    return {"status": "alive"}
