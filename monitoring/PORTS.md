# 📋 Ports Utilisés - Stack d'Observabilité

## Ports des Services

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Grafana** | **3030** | http://localhost:3030 | Dashboards et visualisations (admin/admin) |
| **Prometheus** | 9090 | http://localhost:9090 | Collecte et stockage des métriques |
| **Alertmanager** | 9093 | http://localhost:9093 | Gestion et routage des alertes |
| **Loki** | 3100 | http://localhost:3100 | Agrégation des logs (API HTTP) |

## ⚠️ Conflits de Ports Évités

### Grafana : Port 3030 (au lieu de 3000)

**Raison du changement :**
- Le port 3000 est utilisé par **Next.js** (frontend)
- Grafana utilise maintenant le port **3030** pour éviter les conflits
- Facile à retenir : 3030 = 3000 + 30

### Ports Réservés par l'Application

| Service | Port | Usage |
|---------|------|-------|
| **Next.js Frontend** | 3000 | Application web principale |
| **FastAPI Backend** | 8080 | API REST backend |
| **Grafana** | 3030 | Monitoring et dashboards |

## 🚀 Démarrage de la Stack

```bash
# Démarrer la stack d'observabilité
docker compose -f docker-compose.observability.yml up -d

# Vérifier que tous les services sont démarrés
docker compose -f docker-compose.observability.yml ps
```

## 🔍 Vérification des Ports

### Vérifier si un port est disponible

```bash
# macOS/Linux
lsof -i :3030
lsof -i :9090
lsof -i :9093
lsof -i :3100

# Windows
netstat -ano | findstr :3030
netstat -ano | findstr :9090
netstat -ano | findstr :9093
netstat -ano | findstr :3100
```

### Tester l'accessibilité

```bash
# Grafana
curl http://localhost:3030/api/health

# Prometheus
curl http://localhost:9090/-/healthy

# Alertmanager
curl http://localhost:9093/-/healthy

# Loki
curl http://localhost:3100/ready
```

## 📝 Configuration

### Changer le port de Grafana

Si vous souhaitez utiliser un autre port pour Grafana, modifiez `docker-compose.observability.yml` :

```yaml
grafana:
  ports:
    - "VOTRE_PORT:3000"  # Format: "HOST_PORT:CONTAINER_PORT"
```

**Note :** Le port interne du conteneur reste 3000, seul le port exposé sur l'hôte change.

## 🔄 Migration depuis le Port 3000

Si vous aviez déjà configuré Grafana sur le port 3000 :

1. **Arrêter les conteneurs :**
   ```bash
   docker compose -f docker-compose.observability.yml down
   ```

2. **Mettre à jour la configuration :**
   - Le fichier `docker-compose.observability.yml` a déjà été mis à jour
   - Les liens dans `backend/index.html` ont été mis à jour

3. **Redémarrer :**
   ```bash
   docker compose -f docker-compose.observability.yml up -d
   ```

4. **Mettre à jour vos bookmarks :**
   - Ancien : http://localhost:3000
   - Nouveau : http://localhost:3030

## 📚 Références

- [Grafana Documentation](https://grafana.com/docs/grafana/latest/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Loki Documentation](https://grafana.com/docs/loki/latest/)

