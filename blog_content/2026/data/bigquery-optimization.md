---
title: Optimiser BigQuery : Performance et coûts
date: 2024-11-20
author: Daya SYLLA
category: Data Engineering
tags: [BigQuery, GCP, SQL, Optimization, Performance]
---

# Optimiser BigQuery : Performance et coûts

BigQuery est puissant, mais mal optimisé, il peut coûter cher. Voici comment améliorer les performances et réduire les coûts.

## Comprendre le pricing BigQuery

### Modèle de facturation

- **On-demand** : Payez par requête (premiers 1 TB gratuits/mois)
- **Flat-rate** : Prix fixe mensuel (slots réservés)

### Coûts principaux

1. **Storage** : $0.02/GB/mois
2. **Query processing** : $5/TB (après 1 TB gratuit)
3. **Streaming inserts** : $0.01/200 MB

## Optimisations de requêtes

### 1. Sélectionner uniquement les colonnes nécessaires

❌ **Mauvais :**
```sql
SELECT * FROM `project.dataset.table`
```

✅ **Bon :**
```sql
SELECT id, name, email FROM `project.dataset.table`
```

### 2. Utiliser les partitions

```sql
-- Table partitionnée par date
CREATE TABLE `project.dataset.events`
(
  event_id INT64,
  event_date DATE,
  event_data STRING
)
PARTITION BY event_date;

-- Requête optimisée avec partition
SELECT * FROM `project.dataset.events`
WHERE event_date = '2024-12-15'
```

### 3. Clustering pour les filtres fréquents

```sql
CREATE TABLE `project.dataset.users`
(
  user_id INT64,
  country STRING,
  created_at TIMESTAMP
)
CLUSTER BY country;
```

### 4. Éviter les SELECT DISTINCT

❌ **Mauvais :**
```sql
SELECT DISTINCT user_id FROM events
```

✅ **Bon :**
```sql
SELECT user_id FROM events
GROUP BY user_id
```

## Optimisations de stockage

### 1. Compression

- Utilisez les formats compressés (Parquet, Avro)
- Évitez JSON non compressé

### 2. Nettoyage régulier

```sql
-- Supprimer les anciennes partitions
DELETE FROM `project.dataset.events`
WHERE event_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
```

### 3. Expiration automatique

```sql
ALTER TABLE `project.dataset.temp_data`
SET OPTIONS(expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY));
```

## Best Practices

### 1. Utiliser les vues matérialisées

```sql
CREATE MATERIALIZED VIEW `project.dataset.daily_stats`
AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as events
FROM `project.dataset.events`
GROUP BY date;
```

### 2. Cache des résultats

BigQuery cache automatiquement les résultats identiques pendant 24h. Réutilisez les requêtes quand possible.

### 3. Limiter les données scannées

```sql
-- Utiliser LIMIT tôt dans la requête
SELECT * FROM (
  SELECT * FROM large_table
  LIMIT 1000
) WHERE condition
```

## Monitoring des coûts

### 1. BigQuery Console

- Voir les requêtes coûteuses
- Analyser les patterns d'utilisation
- Identifier les optimisations possibles

### 2. Alerts de coût

```sql
-- Créer une alerte si coût > seuil
CREATE ALERT IF (
  SELECT SUM(total_bytes_processed) 
  FROM `region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
  WHERE creation_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
) > 1000000000000  -- 1 TB
```

## Conclusion

Optimiser BigQuery nécessite de comprendre le pricing et d'appliquer les bonnes pratiques. Suivez ces conseils pour améliorer les performances et réduire les coûts.
