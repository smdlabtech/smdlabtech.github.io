# GitHub Actions Workflows

Ce dossier contient les workflows GitHub Actions pour l'automatisation CI/CD du projet Flask Portfolio.

## 📋 Workflows Disponibles

### 1. CI Pipeline (`ci.yml`)

**Déclenchement** :
- Push sur `main` ou `develop`
- Pull requests vers `main` ou `develop`
- Déclenchement manuel

**Jobs** :
- **Lint** : Vérification du code (flake8, black, isort, mypy)
- **Security** : Scan de sécurité (Bandit, Safety, pip-audit)
- **Test** : Tests unitaires avec coverage (pytest)
- **Docker Build** : Build et test de l'image Docker
- **Integration Test** : Tests d'intégration

**Fonctionnalités** :
- Support multi-versions Python (3.10, 3.11)
- Upload des rapports de coverage vers Codecov
- Scan de sécurité avec Trivy
- Artifacts pour les rapports de sécurité

### 2. Deploy to Cloud Run (`deploy.yml`)

**Déclenchement** :
- Push sur `main` (avec filtrage par paths)
- Déclenchement manuel avec choix d'environnement

**Jobs** :
- **Validate** : Validation du Dockerfile et des fichiers requis
- **Build and Deploy** : Build, push et déploiement sur Cloud Run

**Fonctionnalités** :
- Build optimisé avec cache Docker
- Scan de sécurité de l'image
- Gestion des secrets depuis Secret Manager
- Health checks avec exponential backoff
- Smoke tests complets
- Rollback automatique en cas d'échec
- Nettoyage automatique des anciennes images

**Environnements** :
- `production` : Déploiement en production
- `staging` : Déploiement en staging (si configuré)

### 3. Monitoring Health Checks (`monitoring.yml`)

**Déclenchement** :
- Toutes les 5 minutes (cron)
- Déclenchement manuel

**Fonctionnalités** :
- Health checks (health, ready, live)
- Vérification des métriques
- Tests de performance
- Notifications Slack en cas d'échec

## 🔧 Configuration Requise

### Secrets GitHub

Les secrets suivants doivent être configurés dans les paramètres du repository :

- `GCP_SA_KEY` : Service Account Key JSON pour l'authentification GCP
- `WIF_PROVIDER` : Workload Identity Provider (optionnel, pour Workload Identity)
- `WIF_SERVICE_ACCOUNT` : Service Account pour Workload Identity (optionnel)
- `SLACK_WEBHOOK_URL` : Webhook URL pour les notifications Slack (optionnel)

### Variables GitHub

Les variables suivantes doivent être configurées dans les paramètres du repository :

- `GCP_PROJECT_ID` : ID du projet GCP (défaut: `bq-small-corp`)
- `GCP_REGION` : Région GCP (défaut: `europe-west1`)

### Secrets GCP Secret Manager

Les secrets suivants doivent être créés dans GCP Secret Manager :

**Obligatoires** :
- `SECRET_KEY` : Clé secrète Flask
- `JWT_SECRET_KEY` : Clé secrète JWT
- `DATABASE_URL` : URL de connexion à la base de données

**Optionnels** :
- `GEMINI_API_KEY` : Clé API Google Gemini
- `OPENAI_API_KEY` : Clé API OpenAI
- `REDIS_URL` : URL de connexion Redis
- `SMTP_PASSWORD` : Mot de passe SMTP

## 🚀 Utilisation

### Déclencher un déploiement manuel

1. Aller dans l'onglet "Actions" du repository
2. Sélectionner le workflow "Deploy to Cloud Run"
3. Cliquer sur "Run workflow"
4. Choisir l'environnement (production/staging)
5. Cliquer sur "Run workflow"

### Vérifier les health checks

1. Aller dans l'onglet "Actions"
2. Sélectionner le workflow "Monitoring Health Checks"
3. Voir les résultats des derniers checks

## 📊 Monitoring

### Métriques Disponibles

L'application expose des métriques Prometheus sur `/metrics` :
- `flask_http_requests_total` : Nombre total de requêtes HTTP
- `flask_http_errors_total` : Nombre d'erreurs HTTP
- `flask_request_duration_seconds` : Durée des requêtes

### Health Endpoints

- `/health` : Health check général
- `/health/ready` : Readiness check
- `/health/live` : Liveness check

## 🔍 Dépannage

### Le déploiement échoue

1. Vérifier les logs du workflow dans GitHub Actions
2. Vérifier les logs Cloud Run : `gcloud run logs read flask-portfolio --region=europe-west1`
3. Vérifier que tous les secrets sont configurés
4. Vérifier que le service account a les permissions nécessaires

### Les health checks échouent

1. Vérifier que le service est déployé et accessible
2. Vérifier les logs du service
3. Vérifier la configuration réseau (CORS, firewall, etc.)

### Les tests échouent

1. Vérifier les logs détaillés dans le job "test"
2. Vérifier que les services (PostgreSQL, Redis) sont disponibles
3. Vérifier les variables d'environnement de test

## 📝 Notes

- Les workflows utilisent des timeouts pour éviter les exécutions infinies
- Les builds Docker utilisent le cache pour accélérer les builds
- Les anciennes images Docker sont automatiquement nettoyées (garder les 10 dernières)
- Les notifications Slack sont optionnelles

## 🔗 Références

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Documentation Cloud Run](https://cloud.google.com/run/docs)
- [Documentation GCP Secret Manager](https://cloud.google.com/secret-manager/docs)
