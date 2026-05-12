"""
Configuration du backend FastAPI (variables d'environnement).
"""
import os
from functools import lru_cache


@lru_cache
def get_settings():
    return Settings()


class Settings:
    """Settings chargées depuis l'environnement."""

    # App
    APP_NAME: str = os.getenv("APP_NAME", "Portfolio API")
    DEBUG: bool = os.getenv("DEBUG", "false").lower() in ("1", "true", "yes")
    ENV: str = os.getenv("ENV", os.getenv("FLASK_ENV", "development")).lower()

    # Database (même DATABASE_URL que le frontend pour partager la base)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        os.getenv("SQLALCHEMY_DATABASE_URI", "sqlite:///instance/portfolio_pro.db"),
    )

    # CORS
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    CORS_ORIGINS_LIST: list = None  # rempli à la demande

    # Rate limiting (FastAPI)
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() in ("1", "true", "yes")
    RATE_LIMIT_STORAGE_URL: str = os.getenv("RATE_LIMIT_STORAGE_URL", os.getenv("REDIS_URL", "memory://"))

    RATE_LIMIT_GLOBAL_REQUESTS: int = int(os.getenv("RATE_LIMIT_GLOBAL_REQUESTS", "1000"))
    RATE_LIMIT_GLOBAL_WINDOW: int = int(os.getenv("RATE_LIMIT_GLOBAL_WINDOW", "3600"))
    RATE_LIMIT_GLOBAL_BURST: int = int(os.getenv("RATE_LIMIT_GLOBAL_BURST", "100"))

    RATE_LIMIT_IP_REQUESTS: int = int(os.getenv("RATE_LIMIT_IP_REQUESTS", "100"))
    RATE_LIMIT_IP_WINDOW: int = int(os.getenv("RATE_LIMIT_IP_WINDOW", "60"))
    RATE_LIMIT_IP_BURST: int = int(os.getenv("RATE_LIMIT_IP_BURST", "20"))

    RATE_LIMIT_SEARCH_REQUESTS: int = int(os.getenv("RATE_LIMIT_SEARCH_REQUESTS", "60"))
    RATE_LIMIT_SEARCH_WINDOW: int = int(os.getenv("RATE_LIMIT_SEARCH_WINDOW", "60"))
    RATE_LIMIT_SEARCH_BURST: int = int(os.getenv("RATE_LIMIT_SEARCH_BURST", "15"))

    RATE_LIMIT_CHAT_REQUESTS: int = int(os.getenv("RATE_LIMIT_CHAT_REQUESTS", "30"))
    RATE_LIMIT_CHAT_WINDOW: int = int(os.getenv("RATE_LIMIT_CHAT_WINDOW", "60"))
    RATE_LIMIT_CHAT_BURST: int = int(os.getenv("RATE_LIMIT_CHAT_BURST", "10"))

    RATE_LIMIT_UPLOAD_REQUESTS: int = int(os.getenv("RATE_LIMIT_UPLOAD_REQUESTS", "10"))
    RATE_LIMIT_UPLOAD_WINDOW: int = int(os.getenv("RATE_LIMIT_UPLOAD_WINDOW", "60"))
    RATE_LIMIT_UPLOAD_BURST: int = int(os.getenv("RATE_LIMIT_UPLOAD_BURST", "5"))

    RATE_LIMIT_CHAT_PATHS: str = os.getenv("RATE_LIMIT_CHAT_PATHS", "/api/chat,/api/v1/chat")
    RATE_LIMIT_SEARCH_PATHS: str = os.getenv(
        "RATE_LIMIT_SEARCH_PATHS",
        "/api/search,/api/eval,/api/v1/articles,/api/v1/projects,/api/v1/experiences",
    )
    RATE_LIMIT_UPLOAD_PATHS: str = os.getenv("RATE_LIMIT_UPLOAD_PATHS", "/api/ingest,/api/ingest-batch,/api/upload")

    RATE_LIMIT_CHAT_METHODS: str = os.getenv("RATE_LIMIT_CHAT_METHODS", "POST")
    RATE_LIMIT_SEARCH_METHODS: str = os.getenv("RATE_LIMIT_SEARCH_METHODS", "GET,POST")
    RATE_LIMIT_UPLOAD_METHODS: str = os.getenv("RATE_LIMIT_UPLOAD_METHODS", "POST,PUT,PATCH")

    RATE_LIMIT_CHAT_PATHS_LIST: list = None
    RATE_LIMIT_SEARCH_PATHS_LIST: list = None
    RATE_LIMIT_UPLOAD_PATHS_LIST: list = None
    RATE_LIMIT_CHAT_METHODS_SET: set = None
    RATE_LIMIT_SEARCH_METHODS_SET: set = None
    RATE_LIMIT_UPLOAD_METHODS_SET: set = None

    RATE_LIMIT_DEV_MULTIPLIER: float = float(os.getenv("RATE_LIMIT_DEV_MULTIPLIER", "5.0"))
    RATE_LIMIT_PROD_MULTIPLIER: float = float(os.getenv("RATE_LIMIT_PROD_MULTIPLIER", "1.0"))

    RATE_LIMIT_LOG_EXCEEDED: bool = os.getenv("RATE_LIMIT_LOG_EXCEEDED", "true").lower() in ("1", "true", "yes")

    def __init__(self):
        self.CORS_ORIGINS_LIST = (
            [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()] or ["http://localhost:3000"]
        )
        if self.is_production and "*" in self.CORS_ORIGINS_LIST:
            raise ValueError(
                "CORS_ORIGINS ne peut pas contenir '*' en production. "
                "Définissez explicitement les origines autorisées."
            )
        self.RATE_LIMIT_CHAT_PATHS_LIST = self._split_csv_paths(self.RATE_LIMIT_CHAT_PATHS)
        self.RATE_LIMIT_SEARCH_PATHS_LIST = self._split_csv_paths(self.RATE_LIMIT_SEARCH_PATHS)
        self.RATE_LIMIT_UPLOAD_PATHS_LIST = self._split_csv_paths(self.RATE_LIMIT_UPLOAD_PATHS)

        self.RATE_LIMIT_CHAT_METHODS_SET = self._split_csv_methods(self.RATE_LIMIT_CHAT_METHODS)
        self.RATE_LIMIT_SEARCH_METHODS_SET = self._split_csv_methods(self.RATE_LIMIT_SEARCH_METHODS)
        self.RATE_LIMIT_UPLOAD_METHODS_SET = self._split_csv_methods(self.RATE_LIMIT_UPLOAD_METHODS)

    @staticmethod
    def _split_csv_paths(raw: str) -> list[str]:
        out: list[str] = []
        for item in (raw or "").split(","):
            p = item.strip()
            if not p:
                continue
            if not p.startswith("/"):
                p = "/" + p
            out.append(p)
        return out

    @staticmethod
    def _split_csv_methods(raw: str) -> set[str]:
        return {m.strip().upper() for m in (raw or "").split(",") if m.strip()}

    @property
    def is_production(self) -> bool:
        return self.ENV in ("production", "prod")

    @property
    def cors_allow_credentials(self) -> bool:
        # Évite la combinaison risquée '*' + credentials=True.
        return "*" not in self.CORS_ORIGINS_LIST

    @property
    def rate_limit_multiplier(self) -> float:
        return self.RATE_LIMIT_PROD_MULTIPLIER if self.is_production else self.RATE_LIMIT_DEV_MULTIPLIER
