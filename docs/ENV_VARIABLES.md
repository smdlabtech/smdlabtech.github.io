# Inventaire des variables d'environnement

Référence des variables utilisées par l'application Flask.  
Pour un fichier d'exemple à copier, voir à la racine : **`env.example`** et **`env.production.example`**.

---

## Variables principales

| Variable | Description | Obligatoire |
|----------|-------------|--------------|
| `SECRET_KEY` | Clé secrète Flask (sessions) | ✅ Prod |
| `JWT_SECRET_KEY` | Clé JWT | ✅ Prod |
| `DATABASE_URL` | URL BDD (SQLite / PostgreSQL) | ✅ Prod |
| `FLASK_ENV` | `development` / `production` | ✅ |
| `FLASK_APP` | Point d'entrée (`run.py`) | ✅ |
| `PORT` | Port d'écoute (défaut 8080) | ✅ |
| `REDIS_URL` | Cache Redis | Optionnel |
| `CORS_ORIGINS` | Origines CORS autorisées | Optionnel |
| `LOG_LEVEL` | DEBUG / INFO / WARNING / ERROR | Optionnel |

## Production (minimal)

```bash
SECRET_KEY=<générer: python -c "import secrets; print(secrets.token_hex(32))">
JWT_SECRET_KEY=<idem>
DATABASE_URL=postgresql://user:password@host:5432/portfolio_pro  # pragma: allowlist secret
FLASK_ENV=production
PORT=8080
```

Voir **`env.production.example`** à la racine pour un modèle complet.

---

*Document déplacé depuis `inv_env_var_check.md` lors du nettoyage du repo.*
