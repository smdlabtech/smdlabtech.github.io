"""
Configuration Gunicorn pour la production
"""
import multiprocessing
import os

# Nombre de workers
workers = int(os.getenv('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1))

# Bind
bind = f"0.0.0.0:{os.getenv('PORT', 8080)}"

# Worker class
worker_class = 'sync'

# Timeout
timeout = int(os.getenv('GUNICORN_TIMEOUT', 120))

# Logging
accesslog = '-'
errorlog = '-'
loglevel = os.getenv('LOG_LEVEL', 'info').lower()

# Process naming
proc_name = 'flask-portfolio'

# Worker connections
worker_connections = 1000

# Max requests (reload workers after N requests to prevent memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Preload app
preload_app = True

# Graceful timeout
graceful_timeout = 30

