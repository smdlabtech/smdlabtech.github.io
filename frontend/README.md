# Frontend (Flask UI)

Application Flask qui sert les **pages web** (templates) et appelle le **backend FastAPI** pour les données.

## Port

**Port 3000** en local.

## Lancer

Le backend doit tourner sur le port **8080** avant de lancer le frontend.

```bash
# Terminal 1 — Backend
make run-backend
# ou : uvicorn backend.main:app --reload --port 8080

# Terminal 2 — Frontend
make run-frontend
# ou : BACKEND_URL=http://localhost:8080 flask --app frontend.app run --port 3000
```

→ **http://localhost:3000**

## Structure

- `app.py` — point d’entrée Flask, routes (/, /about, /blog, /monitoring)
- `templates/` — Jinja2 (index, about, blog_list, monitoring)
- `static/` — CSS, JS

Voir le [README principal](../README.md) pour le tableau des composants et ports.
