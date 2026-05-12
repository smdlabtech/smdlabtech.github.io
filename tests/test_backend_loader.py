import time
from pathlib import Path

import yaml

from backend.data import loader


def _write_articles(path: Path, titles: list[str]) -> None:
    rows = [{"title": t, "permalink": f"/{t.lower()}"} for t in titles]
    with open(path, "w", encoding="utf-8") as f:
        yaml.safe_dump(rows, f, sort_keys=False, allow_unicode=True)


def test_loader_cache_invalidation_on_file_change(monkeypatch, tmp_path):
    data_dir = tmp_path / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    articles = data_dir / "articles.yml"

    _write_articles(articles, ["A"])
    monkeypatch.setenv("BACKEND_DATA_DIR", str(data_dir))
    monkeypatch.setenv("BACKEND_DATA_DIR_STRICT", "false")
    loader.clear_yaml_cache()

    _, total_before = loader.load_articles(skip=0, limit=100)
    assert total_before == 1

    # Assure un mtime différent sur tous les FS.
    time.sleep(0.01)
    _write_articles(articles, ["A", "B"])

    _, total_after = loader.load_articles(skip=0, limit=100)
    assert total_after == 2


def test_loader_strict_mode_uses_backend_data(monkeypatch):
    monkeypatch.delenv("BACKEND_DATA_DIR", raising=False)
    monkeypatch.setenv("BACKEND_DATA_DIR_STRICT", "true")
    loader.clear_yaml_cache()

    resolved = loader._data_dir().resolve()
    expected = (Path(loader.__file__).resolve().parent.parent / "data").resolve()
    assert resolved == expected
