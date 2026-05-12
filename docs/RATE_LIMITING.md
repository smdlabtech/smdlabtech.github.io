# Rate Limiting — API

Implémentation du rate limiting pour l’API Flask : limites globales, par IP et par endpoint (search, upload). Inspirée d’une approche multi-niveaux avec backend Redis ou mémoire, options de logging et seuil d’alerte.

---

## Vue d’ensemble

Ce document décrit le rate limiting de l’API : protection contre les abus, usage équitable et maintien des performances.

### Fonctionnalités

#### Limites multi-niveaux
- **Global** : toute l’API (ex. 1000/heure)
- **Par IP** : par adresse client (ex. 100/minute)
- **Par endpoint** : limites dédiées pour search et upload/export
- **Ajustement par environnement** : multiplicateur dev vs prod

#### Backend
- **Redis** : rate limiting distribué en production
- **Mémoire** : repli en dev ou si Redis indisponible
- **Bascule automatique** : fallback transparent vers mémoire

#### Options avancées
- **Burst** : capacité de pic par type de limite
- **Fenêtre glissante** : via Flask-Limiter
- **En-têtes personnalisés** : `X-RateLimit-*`, `Retry-After`
- **Monitoring** : métriques Prometheus, health, logging configurable
- **Seuil d’alerte** : log warning quand `remaining/limit < RATE_LIMIT_ALERT_THRESHOLD`
- **Logging** : dépassements (429), approche du seuil, ou toutes les vérifications

---

## Limites par défaut

| Type       | Requêtes/min (équivalent) | Burst | Fenêtre | Usage                |
|-----------|----------------------------|-------|---------|----------------------|
| **Global** | 1000/heure                 | 100   | 3600 s  | Protection globale   |
| **IP (défaut)** | 100/minute            | 20    | 60 s    | Usage général        |
| **Search** | 60/minute                 | 15    | 60 s    | Recherche            |
| **Upload / Export** | 10/minute          | 5     | 60 s    | Export PDF/DOCX      |

### Ajustement par environnement

| Environnement | Multiplicateur (défaut) | Exemple (Search)   |
|---------------|-------------------------|--------------------|
| Development / Testing | 5.0x (`RATE_LIMIT_DEV_MULTIPLIER`) | 300 req/min |
| Production    | 1.0x (`RATE_LIMIT_PROD_MULTIPLIER`) | 60 req/min  |

---

## Configuration

### Variables d’environnement

```bash
# Redis (URL complète ; avec mot de passe : redis://:REDIS_PASSWORD@host:6379/0)
REDIS_URL=redis://localhost:6379
# Optionnel : dédié au rate limiting
RATELIMIT_STORAGE_URL=redis://localhost:6379/1
# Avec authentification : redis://:votre_mot_de_passe@localhost:6379/0

# Activer / désactiver
RATELIMIT_ENABLED=true

# Global
RATE_LIMIT_GLOBAL_REQUESTS=1000
RATE_LIMIT_GLOBAL_WINDOW=3600
RATE_LIMIT_GLOBAL_BURST=100

# Par IP
RATE_LIMIT_IP_REQUESTS=100
RATE_LIMIT_IP_WINDOW=60
RATE_LIMIT_IP_BURST=20

# Search (/api/search)
RATE_LIMIT_SEARCH_REQUESTS=60
RATE_LIMIT_SEARCH_WINDOW=60
RATE_LIMIT_SEARCH_BURST=15

# Chat
RATE_LIMIT_CHAT_REQUESTS=30
RATE_LIMIT_CHAT_WINDOW=60
RATE_LIMIT_CHAT_BURST=10

# Upload / Export (/api/export)
RATE_LIMIT_UPLOAD_REQUESTS=10
RATE_LIMIT_UPLOAD_WINDOW=60
RATE_LIMIT_UPLOAD_BURST=5

# Endpoint -> tier mapping (FastAPI)
RATE_LIMIT_CHAT_PATHS=/api/chat,/api/v1/chat
RATE_LIMIT_SEARCH_PATHS=/api/search,/api/eval,/api/v1/articles,/api/v1/projects,/api/v1/experiences
RATE_LIMIT_UPLOAD_PATHS=/api/ingest,/api/ingest-batch,/api/upload

# Methods considered for each tier
RATE_LIMIT_CHAT_METHODS=POST
RATE_LIMIT_SEARCH_METHODS=GET,POST
RATE_LIMIT_UPLOAD_METHODS=POST,PUT,PATCH

# Multiplicateurs par environnement
RATE_LIMIT_DEV_MULTIPLIER=5.0
RATE_LIMIT_PROD_MULTIPLIER=1.0

# Logging et monitoring
RATE_LIMIT_LOG_EXCEEDED=true
RATE_LIMIT_LOG_WARNINGS=false
RATE_LIMIT_LOG_ALL=false
RATE_LIMIT_ALERT_THRESHOLD=0.8
RATE_LIMIT_ENABLE_METRICS=true
```

- **RATE_LIMIT_ALERT_THRESHOLD** : valeur entre 0 et 1. Si `remaining/limit < seuil`, un warning est loggé (quand `RATE_LIMIT_LOG_WARNINGS=true`).
- **RATE_LIMIT_LOG_WARNINGS** : logger quand on s’approche de la limite (sous le seuil).
- **RATE_LIMIT_LOG_ALL** : logger chaque vérification (niveau debug).

---

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Flask App     │───▶│  Flask-Limiter   │───▶│  Backend        │
│                 │    │                  │    │                 │
│ • Endpoints     │    │ • Redis / Memory │    │ • Redis         │
│ • Exemptions    │    │ • Limites config │    │ • Memory        │
│ • Headers       │    │ • After_request  │    │ • Métriques     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Fichiers principaux
- **rate_limit_config.py** : lecture env, limites, multiplicateur, seuil d’alerte, options de log.
- **rate_limiting.py** : init Flask-Limiter, exemptions, `GET /api/rate-limit`, handler 429, after_request (warning/verbose).
- **rate_limit_metrics.py** : métriques Prometheus.

---

## Endpoints API

### Protégés (limites appliquées)

| Endpoint | Type de limite | Usage |
|----------|----------------|-------|
| `GET /api/search` | Search + IP + Global | Recherche |
| `GET /api/export/<path>` | Upload + IP + Global | Export |
| `GET /api/v1/articles/*` | IP + Global | Lecture |
| `GET /api/v1/projects/*`, `.../experiences/*` | IP + Global | Lecture |

### Non protégés

| Endpoint | Raison |
|----------|--------|
| `GET /health`, `/health/ready`, `/health/live` | Health checks |
| `GET /metrics` | Prometheus |
| `GET /api/rate-limit` | Statut des limites |

`GET /health` inclut une clé **rate_limit** (`enabled` / `disabled` / `unknown`).

---

## Statut des limites

```bash
GET /api/rate-limit
```

Retourne la **configuration** des limites (global, IP, search, upload). Pour les valeurs **en temps réel** (requêtes restantes, prochaine réinitialisation), utiliser les **en-têtes** `X-RateLimit-Remaining` et `X-RateLimit-Reset` sur chaque réponse des endpoints protégés.

**Exemple de réponse :**

```json
{
  "rate_limits": {
    "global": {
      "limit": 1000,
      "window_seconds": 3600,
      "burst": 100
    },
    "ip": {
      "limit": 100,
      "window_seconds": 60,
      "burst": 20
    },
    "search": {
      "limit": 60,
      "window_seconds": 60,
      "burst": 15
    },
    "upload": {
      "limit": 10,
      "window_seconds": 60,
      "burst": 5
    }
  },
  "backend": "redis",
  "client_ip": "192.168.1.100",
  "environment": "production",
  "alert_threshold": 0.8,
  "log_warnings": false,
  "log_all": false
}
```

---

## En-têtes HTTP

Sur **chaque réponse** des endpoints protégés, les valeurs en temps réel sont exposées via les en-têtes (équivalent de `remaining` / `reset_time` dans un endpoint de statut) :

| En-tête | Description |
|---------|-------------|
| X-RateLimit-Limit | Nombre max de requêtes autorisées |
| X-RateLimit-Remaining | Requêtes restantes dans la fenêtre (équivalent « remaining ») |
| X-RateLimit-Reset | Timestamp Unix de réinitialisation (équivalent « reset_time ») |
| Retry-After | Secondes avant retry (réponses 429) |

**Exemple :**

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1640995200
Content-Type: application/json
```

---

## Réponse 429

En cas de dépassement :

```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please retry later.",
  "retry_after": 60
}
```

Statut HTTP : **429 Too Many Requests**.

---

## Tests

```bash
PYTHONPATH=app python3 -m pytest tests/test_rate_limiting.py -v
```

La suite vérifie notamment :
- Endpoints exemptés (health, metrics, /api/rate-limit)
- Format de `GET /api/rate-limit` (rate_limits, backend, client_ip, burst, alert_threshold, log_*)
- En-têtes X-RateLimit sur les routes limitées
- Déclenchement 429 sur search/export (si blueprints enregistrés)

Certains tests sont ignorés (skip) si les routes ou le rate limit ne sont pas actifs.

---

## Monitoring

### Métriques Prometheus

Si `RATE_LIMIT_ENABLE_METRICS=true` :
- **rate_limit_exceeded_total{endpoint}** : dépassements par endpoint
- **rate_limit_requests_total** : (si exposé) requêtes soumises au rate limit

### Health
- **GET /api/rate-limit** : détail des limites et options
- **GET /health** : état global + clé `rate_limit`

### Logging
- **RATE_LIMIT_LOG_EXCEEDED** : log des 429
- **RATE_LIMIT_LOG_WARNINGS** : log quand remaining/limit < ALERT_THRESHOLD
- **RATE_LIMIT_LOG_ALL** : log de chaque vérification (verbose)

---

## Dépannage

| Problème | Symptôme | Action |
|----------|----------|--------|
| Redis indisponible | Fallback mémoire, warning dans les logs | Vérifier `REDIS_URL` / `RATELIMIT_STORAGE_URL` |
| Pas de 429 | Limites non atteintes ou désactivées | Vérifier `RATELIMIT_ENABLED`, tester avec limites basses |
| Trop de logs | Trop de warnings | Réduire `RATE_LIMIT_LOG_WARNINGS` / `RATE_LIMIT_LOG_ALL` ou ajuster `RATE_LIMIT_ALERT_THRESHOLD` |

**Commandes utiles :**

```bash
# Statut des limites
curl http://localhost:8080/api/rate-limit

# Tester le rate limit (ex. search)
for i in {1..65}; do
  curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8080/api/search?q=test"
  sleep 0.1
done
```

---

## Checklist déploiement

- [ ] Redis configuré en production (cluster si besoin)
- [ ] Variables d’environnement définies (limites, burst, multiplicateurs)
- [ ] Monitoring activé (métriques, logs)
- [ ] Load balancer préserve l’IP client (X-Forwarded-For si besoin)
- [ ] Limites testées en staging
- [ ] Optionnel : `RATE_LIMIT_LOG_WARNINGS=true` et `RATE_LIMIT_ALERT_THRESHOLD=0.8` pour alerter avant saturation

---

## Bonnes pratiques

1. **Démarrer conservateur** : limites basses au début, augmenter selon l’usage.
2. **Surveiller** : suivre les 429 et les warnings pour ajuster.
3. **Messages clairs** : erreur 429 avec `retry_after` et message lisible.
4. **Tester en staging** : valider les limites avant la prod.
5. **Documenter** : garder cette doc et les limites à jour.

---

## Évolutions possibles

- [ ] Rate limiting par utilisateur (authentification)
- [ ] Ajustement dynamique des limites selon la charge
- [ ] Dashboard d’analyse des dépassements
- [ ] Webhooks ou alertes sur dépassements
- [ ] Rate limiting géographique

---

**Dernière mise à jour** : 2026-02  
**Contact** : voir README du projet.
