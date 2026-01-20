# Inventaire des Variables d'Environnement

## 📋 Vue d'ensemble

Ce document recense toutes les variables d'environnement utilisées dans le projet Flask Portfolio, avec leur statut dans `.env.example` et `.env`.

**Date de génération** : 2024  
**Total variables dans `.env.example`** : 35  
**Total variables dans `.env`** : 19

---

## 🔍 Variables par Catégorie

### 🔐 Sécurité et Authentification

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `SECRET_KEY` | ✅ | ❌ | Clé secrète Flask pour les sessions | ✅ Production |
| `JWT_SECRET_KEY` | ✅ | ❌ | Clé secrète pour JWT | ✅ Production |
| `ADMIN_PASSWORD` | ✅ | ❌ | Mot de passe admin | ✅ Production |

### 🗄️ Base de Données

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `DATABASE_URL` | ✅ | ❌ | URL de connexion à la base de données | ✅ Production |
| `CLOUDSQL_INSTANCE` | ✅ | ❌ | Instance Cloud SQL (GCP) | ⚠️ Optionnel |

### 🔴 Redis et Cache

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `REDIS_URL` | ✅ | ❌ | URL de connexion Redis | ⚠️ Optionnel (fallback: memory) |

### 🤖 Intelligence Artificielle

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `OPENAI_API_KEY` | ✅ | ❌ | Clé API OpenAI | ⚠️ Optionnel |
| `GEMINI_API_KEY` | ✅ | ✅ | Clé API Google Gemini | ⚠️ Optionnel |
| `AI_PROVIDER` | ✅ | ❌ | Fournisseur AI (openai/gemini) | ⚠️ Optionnel |

### 🌐 Application Flask

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `FLASK_ENV` | ✅ | ❌ | Environnement Flask (development/production) | ✅ |
| `FLASK_APP` | ✅ | ❌ | Point d'entrée de l'application | ✅ |
| `PORT` | ✅ | ✅ | Port d'écoute de l'application | ✅ |
| `LOG_LEVEL` | ✅ | ❌ | Niveau de logging (DEBUG/INFO/WARNING/ERROR) | ⚠️ Optionnel |
| `GUNICORN_WORKERS` | ✅ | ❌ | Nombre de workers Gunicorn | ⚠️ Optionnel |

### ☁️ Google Cloud Platform (GCP)

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `GCP_PROJECT_ID` | ✅ | ✅ | ID du projet GCP | ✅ Production |
| `GCP_REGION` | ❌ | ✅ | Région GCP (ex: europe-west1) | ✅ Production |
| `CLOUD_RUN_SERVICE_NAME` | ❌ | ✅ | Nom du service Cloud Run | ⚠️ Optionnel |
| `DOCKER_REGISTRY` | ❌ | ✅ | Registry Docker | ⚠️ Optionnel |
| `BASE_URL` | ❌ | ✅ | URL de base de l'application | ⚠️ Optionnel |
| `PRODUCTION_URL` | ✅ | ❌ | URL de production | ⚠️ Optionnel |

### 📧 Email et Notifications

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `SMTP_HOST` | ✅ | ❌ | Serveur SMTP | ⚠️ Optionnel |
| `SMTP_PORT` | ✅ | ❌ | Port SMTP (défaut: 587) | ⚠️ Optionnel |
| `SMTP_USER` | ✅ | ❌ | Utilisateur SMTP | ⚠️ Optionnel |
| `SMTP_PASSWORD` | ✅ | ❌ | Mot de passe SMTP | ⚠️ Optionnel |
| `ALERT_EMAIL_FROM` | ✅ | ❌ | Email expéditeur des alertes | ⚠️ Optionnel |
| `ALERT_EMAIL_TO` | ✅ | ❌ | Email destinataire des alertes | ⚠️ Optionnel |
| `ALERT_EMAIL_CRITICAL` | ✅ | ❌ | Email pour alertes critiques | ⚠️ Optionnel |
| `ALERT_EMAIL_ERRORS` | ✅ | ❌ | Email pour erreurs | ⚠️ Optionnel |
| `ALERT_EMAIL_WARNING` | ✅ | ❌ | Email pour avertissements | ⚠️ Optionnel |
| `ONCALL_EMAIL` | ✅ | ❌ | Email on-call | ⚠️ Optionnel |
| `BACKEND_TEAM_EMAIL` | ✅ | ❌ | Email de l'équipe backend | ⚠️ Optionnel |

### 🔔 Intégrations (Slack, PagerDuty, Webhooks)

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `SLACK_WEBHOOK_URL` | ✅ | ❌ | Webhook URL Slack | ⚠️ Optionnel |
| `PAGERDUTY_SERVICE_KEY` | ✅ | ❌ | Clé de service PagerDuty | ⚠️ Optionnel |
| `WEBHOOK_URL` | ✅ | ❌ | URL webhook générique | ⚠️ Optionnel |
| `WEBHOOK_BEARER_TOKEN` | ✅ | ❌ | Token Bearer pour webhook | ⚠️ Optionnel |

### 📊 Monitoring et Observabilité

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `STATSD_HOST` | ✅ | ❌ | Hôte StatsD pour métriques | ⚠️ Optionnel |
| `GRAFANA_ADMIN_USER` | ✅ | ❌ | Utilisateur admin Grafana | ⚠️ Optionnel |
| `GRAFANA_ADMIN_PASSWORD` | ✅ | ❌ | Mot de passe admin Grafana | ⚠️ Optionnel |
| `GRAFANA_LOG_LEVEL` | ✅ | ❌ | Niveau de log Grafana | ⚠️ Optionnel |
| `PROMETHEUS_PORT` | ❌ | ✅ | Port Prometheus | ⚠️ Optionnel |
| `GRAFANA_PORT` | ❌ | ✅ | Port Grafana | ⚠️ Optionnel |
| `LOKI_PORT` | ❌ | ✅ | Port Loki | ⚠️ Optionnel |
| `ALERTMANAGER_PORT` | ❌ | ✅ | Port Alertmanager | ⚠️ Optionnel |

### 🌍 Frontend et CORS

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `CORS_ORIGINS` | ❌ | ✅ | Origines CORS autorisées | ⚠️ Optionnel |
| `FRONTEND_PORT` | ❌ | ✅ | Port du frontend | ⚠️ Optionnel |
| `BACKEND_PORT` | ❌ | ✅ | Port du backend | ⚠️ Optionnel |
| `NEXT_PUBLIC_BACKEND_URL` | ❌ | ✅ | URL publique du backend (Next.js) | ⚠️ Optionnel |

### 🔗 GitHub et API Externes

| Variable | `.env.example` | `.env` | Description | Obligatoire |
|----------|----------------|--------|-------------|-------------|
| `GITHUB_API_URL` | ❌ | ✅ | URL de l'API GitHub | ⚠️ Optionnel |
| `GITHUB_TIMEOUT_SECONDS` | ❌ | ✅ | Timeout API GitHub (secondes) | ⚠️ Optionnel |
| `GITHUB_TOKEN` | ❌ | ✅ | Token GitHub | ⚠️ Optionnel |

---

## 📊 Statistiques

### Variables par Statut

- **Variables dans `.env.example` uniquement** : 16
- **Variables dans `.env` uniquement** : 10
- **Variables communes** : 9
- **Variables manquantes dans `.env`** : 26
- **Variables manquantes dans `.env.example`** : 19

### Variables par Priorité

- **✅ Obligatoires en Production** : 8
  - `SECRET_KEY`, `JWT_SECRET_KEY`, `ADMIN_PASSWORD`
  - `DATABASE_URL`
  - `FLASK_ENV`, `FLASK_APP`, `PORT`
  - `GCP_PROJECT_ID`

- **⚠️ Optionnelles mais Recommandées** : 12
  - `REDIS_URL`, `GEMINI_API_KEY`, `OPENAI_API_KEY`
  - `LOG_LEVEL`, `GUNICORN_WORKERS`
  - Variables de monitoring et alerting

- **ℹ️ Optionnelles** : 15
  - Variables d'intégration (Slack, PagerDuty)
  - Variables de configuration avancée

---

## 🔧 Recommandations

### 1. Variables Critiques Manquantes dans `.env`

Pour un déploiement en production, assurez-vous de configurer au minimum :

```bash
# Sécurité
SECRET_KEY=<générer-une-clé-sécurisée>
JWT_SECRET_KEY=<générer-une-clé-sécurisée>
ADMIN_PASSWORD=<mot-de-passe-fort>

# Base de données
DATABASE_URL=postgresql://user:password@host:port/dbname

# Application
FLASK_ENV=production
FLASK_APP=run:app
PORT=8080

# GCP
GCP_PROJECT_ID=<votre-projet-id>
GCP_REGION=europe-west1
```

### 2. Variables Recommandées pour Production

```bash
# Cache et Performance
REDIS_URL=redis://host:port/0

# Monitoring
LOG_LEVEL=INFO
GUNICORN_WORKERS=4

# Alerting (au moins un canal)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
# OU
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALERT_EMAIL_TO=alerts@example.com
```

### 3. Variables Optionnelles selon les Besoins

- **AI Features** : `OPENAI_API_KEY`, `GEMINI_API_KEY`, `AI_PROVIDER`
- **Monitoring Avancé** : Variables Grafana, Prometheus, Loki
- **Intégrations** : `PAGERDUTY_SERVICE_KEY`, `WEBHOOK_URL`

---

## 🔄 Synchronisation

### Checklist de Synchronisation

- [ ] Toutes les variables obligatoires sont présentes dans `.env`
- [ ] Les valeurs par défaut dans `.env.example` sont documentées
- [ ] Les secrets ne sont pas commités (vérifier `.gitignore`)
- [ ] Les variables de production sont dans Secret Manager (GCP)
- [ ] Les variables sont documentées dans le code (`app/config/`)

---

## 📝 Notes

1. **Sécurité** : Ne jamais commiter `.env` avec des valeurs réelles
2. **Production** : Utiliser GCP Secret Manager pour les secrets
3. **Développement** : Copier `.env.example` vers `.env` et remplir les valeurs locales
4. **CI/CD** : Utiliser GitHub Secrets pour les variables sensibles

---

## 🔗 Références

- Configuration Flask : `app/config/`
- Documentation GCP : `deploiement_gcp_cloud_run.md`
- Monitoring : `monitoring/README.md`

---

**Dernière mise à jour** : 2024  
**Maintenu par** : Équipe DevOps

