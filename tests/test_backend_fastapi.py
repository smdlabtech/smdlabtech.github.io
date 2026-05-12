"""
Tests du backend FastAPI (backend.main:app).
À lancer avec PYTHONPATH=racine_du_repo (pour que « backend » soit importable).
"""
import sys
from pathlib import Path

import pytest

# S'assurer que la racine du repo est dans le path pour importer backend
REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

# TestClient FastAPI (fourni par starlette, dépendance de fastapi)
from fastapi.testclient import TestClient  # noqa: E402


@pytest.fixture(scope="module")
def backend_client():
    """Client de test pour le backend FastAPI."""
    from backend.main import app

    return TestClient(app)


class TestBackendHealth:
    """Tests des endpoints health."""

    def test_health_returns_200(self, backend_client):
        r = backend_client.get("/health")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "healthy"

    def test_health_ready(self, backend_client):
        r = backend_client.get("/health/ready")
        assert r.status_code == 200
        assert r.json().get("status") == "ready"

    def test_root_returns_service_info(self, backend_client):
        r = backend_client.get("/")
        assert r.status_code == 200
        assert "text/html" in r.headers.get("content-type", "")
        assert "Backend Platform" in r.text


class TestBackendApiV1:
    """Tests des endpoints /api/v1."""

    def test_articles_list_returns_200_and_structure(self, backend_client):
        r = backend_client.get("/api/v1/articles/")
        assert r.status_code == 200
        data = r.json()
        assert "items" in data
        assert "total" in data
        assert "skip" in data
        assert "limit" in data
        assert isinstance(data["items"], list)

    def test_projects_list_returns_200_and_structure(self, backend_client):
        r = backend_client.get("/api/v1/projects/")
        assert r.status_code == 200
        data = r.json()
        assert "items" in data
        assert "total" in data
        assert isinstance(data["items"], list)

    def test_experiences_list_returns_200_and_structure(self, backend_client):
        r = backend_client.get("/api/v1/experiences/")
        assert r.status_code == 200
        data = r.json()
        assert "items" in data
        assert "total" in data
        assert isinstance(data["items"], list)

    def test_article_not_found_returns_404(self, backend_client):
        r = backend_client.get("/api/v1/articles/99999")
        assert r.status_code == 404

    def test_rate_limit_status_endpoint(self, backend_client):
        r = backend_client.get("/api/rate-limit")
        assert r.status_code == 200
        data = r.json()
        assert "rate_limits" in data
        assert "backend" in data
        assert "client_ip" in data
        assert "endpoint_limit_type" in data
        assert data["endpoint_limit_type"] is None

    def test_debug_data_source_endpoint(self, backend_client):
        r = backend_client.get("/api/debug/data-source")
        assert r.status_code == 200
        data = r.json()
        assert "selected_dir" in data
        assert "strict_mode" in data
        assert "candidates" in data
        assert isinstance(data["selected_dir"], str)
        assert Path(data["selected_dir"]).exists()

    def test_rate_limit_headers_present_on_api(self, backend_client):
        r = backend_client.get("/api/v1/articles/?limit=1")
        assert r.status_code == 200
        # headers should be present when rate limiting is enabled
        assert "X-RateLimit-Limit" in r.headers
        assert "X-RateLimit-Remaining" in r.headers
        assert "X-RateLimit-Reset" in r.headers

    def test_articles_filters_shape(self, backend_client):
        r = backend_client.get("/api/v1/articles/?q=nonexistent-query-xyz")
        assert r.status_code == 200
        data = r.json()
        assert "filters" in data
        assert data["filters"]["q"] == "nonexistent-query-xyz"
        assert "lang" in data["filters"]
        assert "items" in data and "total" in data
        assert isinstance(data["items"], list)

    def test_articles_tag_filter_case_insensitive(self, backend_client):
        base = backend_client.get("/api/v1/articles/?limit=1")
        assert base.status_code == 200
        items = base.json().get("items", [])
        if not items or not items[0].get("tags"):
            pytest.skip("Aucun tag disponible dans les données de test")
        tag = str(items[0]["tags"][0])
        r = backend_client.get(f"/api/v1/articles/?tag={tag.upper()}&limit=20")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data.get("items", []), list)
        for article in data["items"]:
            tags = [str(t).lower() for t in article.get("tags", [])]
            assert tag.lower() in tags
