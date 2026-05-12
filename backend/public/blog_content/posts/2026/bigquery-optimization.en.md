---
title: BigQuery optimization — performance and cost
date: 2024-11-20
author: Daya SYLLA
category: Data Engineering
tags: [BigQuery, GCP, SQL, Optimization, Performance]
---

# BigQuery optimization — performance and cost

BigQuery is powerful, but poor usage can get expensive. Here is how to improve performance and control cost.

## Understanding BigQuery pricing

### Billing models

- **On-demand**: pay per query (first 1 TB/month free)
- **Flat-rate**: fixed monthly price (reserved slots)

### Main cost drivers

1. **Storage**: ~$0.02/GB/month
2. **Query processing**: ~$5/TB (after free tier)
3. **Streaming inserts**: ~$0.01/200 MB

## Query optimizations

### 1. Select only the columns you need

❌ **Bad:**
```sql
SELECT * FROM `project.dataset.table`
```

✅ **Good:**
```sql
SELECT id, name, email FROM `project.dataset.table`
```

### 2. Use partitions

```sql
-- Table partitioned by date
CREATE TABLE `project.dataset.events`
(
  event_id INT64,
  event_date DATE,
  event_data STRING
)
PARTITION BY event_date;

-- Query with partition filter
SELECT * FROM `project.dataset.events`
WHERE event_date = '2024-12-15'
```

### 3. Clustering for frequent filters

```sql
CREATE TABLE `project.dataset.users`
(
  user_id INT64,
  country STRING,
  created_at TIMESTAMP
)
CLUSTER BY country;
```

### 4. Avoid SELECT DISTINCT when possible

❌ **Bad:**
```sql
SELECT DISTINCT user_id FROM events
```

✅ **Better:**
```sql
SELECT user_id FROM events
GROUP BY user_id
```

## Storage optimizations

### 1. Compression

- Prefer compressed formats (Parquet, Avro)
- Avoid uncompressed JSON when possible

### 2. Regular cleanup

```sql
-- Remove old partitions
DELETE FROM `project.dataset.events`
WHERE event_date < DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
```

### 3. Automatic expiration

```sql
ALTER TABLE `project.dataset.temp_data`
SET OPTIONS(expiration_timestamp=TIMESTAMP_ADD(CURRENT_TIMESTAMP(), INTERVAL 7 DAY));
```

## Best practices

### 1. Materialized views

```sql
CREATE MATERIALIZED VIEW `project.dataset.daily_stats`
AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as events
FROM `project.dataset.events`
GROUP BY date;
```

### 2. Result cache

BigQuery caches identical query results for about 24 hours. Reuse queries when you can.

### 3. Limit bytes scanned

```sql
-- Apply LIMIT early in subqueries when exploring
SELECT * FROM (
  SELECT * FROM large_table
  LIMIT 1000
) WHERE condition
```

## Cost monitoring

### 1. BigQuery console

- Review expensive queries
- Understand usage patterns
- Spot optimization opportunities

### 2. Cost alerts

```sql
-- Example: alert when daily bytes processed exceed a threshold
CREATE ALERT IF (
  SELECT SUM(total_bytes_processed) 
  FROM `region-us.INFORMATION_SCHEMA.JOBS_BY_PROJECT`
  WHERE creation_time > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
) > 1000000000000  -- 1 TB
```

## Conclusion

Optimizing BigQuery means understanding pricing and applying solid SQL and storage practices. These tips improve both performance and spend.
