"""
Backend FastAPI — API REST pour le portfolio.
Point d'entrée : uvicorn backend.main:app --reload --port 8080
"""
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from backend.config import get_settings
from backend.data.loader import get_data_source_info
from backend.rate_limiter import rate_limit_middleware
from backend.routers import api_v1, health

settings = get_settings()
BACKEND_DIR = Path(__file__).resolve().parent
BACKEND_INDEX = BACKEND_DIR / "index.html"
BACKEND_MONITORING = BACKEND_DIR / "monitoring.html"

app = FastAPI(
    title=settings.APP_NAME,
    description="API REST du portfolio (articles, projets, expériences)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting middleware (global + IP + endpoint)
_rl_mw = rate_limit_middleware(settings)
app.middleware("http")(_rl_mw)

app.include_router(health.router, tags=["health"])
app.include_router(api_v1.router, prefix="/api/v1", tags=["api"])


@app.get("/api/rate-limit", tags=["rate-limit"])
def rate_limit_status(request: Request):
    limiter = getattr(_rl_mw, "limiter", None)
    if limiter is None:
        return {"rate_limits": {}, "backend": "unknown", "client_ip": "unknown"}
    ip = limiter.get_client_ip(request)
    decisions, endpoint_tier = limiter.check_with_context(request)
    return {
        "rate_limits": {
            k: {
                "allowed": v.allowed,
                "limit": v.limit,
                "remaining": v.remaining,
                "reset_time": v.reset_time,
                "window_seconds": v.window_seconds,
            }
            for k, v in decisions.items()
        },
        "backend": limiter.backend,
        "client_ip": ip,
        "endpoint_limit_type": endpoint_tier,
    }


@app.get("/")
def root():
    if BACKEND_INDEX.exists():
        return FileResponse(BACKEND_INDEX)
    return JSONResponse({"service": settings.APP_NAME, "docs": "/docs", "health": "/health"})


@app.get("/monitoring")
def monitoring_page():
    if BACKEND_MONITORING.exists():
        return FileResponse(BACKEND_MONITORING)
    raise HTTPException(status_code=404, detail="Monitoring page not found")


@app.get("/api/debug/data-source", tags=["debug"])
def debug_data_source():
    # Endpoint de debug limité aux environnements non production.
    if settings.is_production:
        raise HTTPException(status_code=404, detail="Not found")
    return get_data_source_info()
