# Bundle Monitoring HTML2PPTX

Ce bundle ajoute à ton projet HTML2PPTX :

- Prometheus (+ règles d'alerting) pour les métriques (`/metrics` sur le backend)
- Alertmanager pour router les alertes (Slack / email)
- Loki + Promtail pour centraliser les logs
- Grafana pour les dashboards
- Squelettes Ansible (secrets) & Pulumi (Cloud Run)

## Dossier à copier

Copie simplement le dossier `monitoring/`, `ansible/`, `pulumi/` et le fichier `docker-compose.observability.yml` à la racine de ton repo existant.

## Lancer la stack d'observabilité en local

```bash
docker compose -f docker-compose.observability.yml up -d
```

Assure-toi que ton service backend s'appelle bien `backend` dans Docker
et qu'il expose les métriques sur `http://backend:8080/metrics`.

## Points d'entrée

- Prometheus : http://localhost:9090
- Alertmanager : http://localhost:9093
- Loki (HTTP API) : http://localhost:3100
- Grafana : http://localhost:3030 (admin / admin)

**Note :** Grafana utilise le port 3030 pour éviter les conflits avec Next.js (port 3000).
