#!/usr/bin/env bash
set -euo pipefail
APP_DIR=${APP_DIR:-/var/www/sqrl}
echo "[deploy] Building frontend"
cd "$APP_DIR/frontend"
if [ -f package-lock.json ]; then
	echo "[deploy] package-lock.json found -> npm ci"
	npm ci
else
	echo "[deploy] No package-lock.json -> npm install (first run)"
	npm install --no-audit --no-fund
	npm install --package-lock-only --no-audit --no-fund || true
fi
npm run build
pm2 restart sqrl-frontend || pm2 start node_modules/next/dist/bin/next --name sqrl-frontend -- start -p 3000
pm2 save
echo "[deploy] Frontend deploy complete"
