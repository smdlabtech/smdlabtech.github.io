---
title: Flask in production — complete guide 2024
date: 2024-11-10
author: Daya SYLLA
category: Python
tags: [Flask, Python, Production, Gunicorn, Deployment]
---

# Flask in production — complete guide 2024

Running Flask in production takes a few important choices. Here is a practical checklist to make your Flask app production-ready.

## WSGI server: Gunicorn

### Install

```bash
pip install gunicorn
```

### Basic configuration

```python
# gunicorn_config.py
bind = "0.0.0.0:8080"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 30
keepalive = 2
max_requests = 1000
max_requests_jitter = 50
preload_app = True
```

### Run with Gunicorn

```bash
gunicorn --config gunicorn_config.py app:app
```

## Application configuration

### 1. Environment variables

```python
# config.py
import os
from pathlib import Path

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CACHE_TYPE = os.environ.get('CACHE_TYPE', 'simple')
    CACHE_REDIS_URL = os.environ.get('REDIS_URL')
```

### 2. Structured logging

```python
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(app):
    if not app.debug:
        file_handler = RotatingFileHandler(
            'logs/app.log',
            maxBytes=10240000,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
```

## Security

### 1. Security headers

```python
from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response
```

### 2. Rate limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/endpoint')
@limiter.limit("10 per minute")
def api_endpoint():
    return {"status": "ok"}
```

## Performance

### 1. Caching

```python
from flask_caching import Cache

cache = Cache(app, config={
    'CACHE_TYPE': 'redis',
    'CACHE_REDIS_URL': os.environ.get('REDIS_URL')
})

@app.route('/expensive')
@cache.cached(timeout=300)
def expensive_operation():
    return result
```

### 2. Compression

```python
from flask_compress import Compress

Compress(app)
```

### 3. Database connection pooling

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)
```

## Monitoring

### 1. Health checks

```python
@app.route('/health')
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }
```

### 2. Prometheus metrics

```python
from prometheus_client import Counter, Histogram, generate_latest

request_count = Counter('http_requests_total', 'Total HTTP requests')
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    request_count.inc()
    request_duration.observe(time.time() - request.start_time)
    return response

@app.route('/metrics')
def metrics():
    return generate_latest()
```

## Deployment

### Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["gunicorn", "--config", "gunicorn_config.py", "app:app"]
```

### Cloud Run / Kubernetes

- Use health checks
- Configure autoscaling
- Add monitoring

## Conclusion

These practices help you ship Flask apps that are safer and faster in production. Up-front configuration pays off in stability and performance.
