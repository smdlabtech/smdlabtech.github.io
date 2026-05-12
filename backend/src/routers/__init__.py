"""
Compatibilite legacy pour anciens imports `backend.src.routers`.
Les routeurs FastAPI canoniques sont dans `backend.routers`.
"""

from backend.routers import api_v1, health

__all__ = ["api_v1", "health"]
