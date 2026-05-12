#!/usr/bin/env bash
set -euo pipefail

echo "Ports en écoute avant :"
sudo lsof -nP -iTCP -sTCP:LISTEN | sed -n '1,20p'
echo ""

# Ports de dev habituels (backend, frontend, jekyll)
PORTS=(8080 3000 4000)

for port in "${PORTS[@]}"; do
  pids=$(lsof -t -nP -iTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [ -z "$pids" ]; then
    echo "✅ $port : rien à arrêter"
    continue
  fi
  echo "🛑 $port : arrêt des PID(s) $pids"
  sudo kill $pids 2>/dev/null || true
done

echo ""
echo "Ports en écoute après :"
sudo lsof -nP -iTCP -sTCP:LISTEN | sed -n '1,20p'
