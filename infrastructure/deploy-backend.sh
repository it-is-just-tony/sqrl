#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${APP_DIR:-/var/www/sqrl}
SERVICE=backend
echo "[deploy] Starting backend deploy in $APP_DIR/backend"
cd "$APP_DIR/backend"
if [ -f package-lock.json ]; then
	echo "[deploy] package-lock.json found -> npm ci"
	npm ci
else
	echo "[deploy] No package-lock.json found -> npm install (first run)"
	npm install --no-audit --no-fund
	echo "[deploy] Generating lockfile for future deterministic installs"
	npm install --package-lock-only --no-audit --no-fund || true
fi
node src/db/migrate.js
echo "[deploy] Restarting PM2 process sqrl-api"
pm2 restart sqrl-api || pm2 start src/index.js --name sqrl-api
pm2 save
echo "[deploy] Done"
