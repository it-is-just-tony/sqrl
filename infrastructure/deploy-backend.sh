#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${APP_DIR:-/var/www/sqrl}
SERVICE=backend
echo "[deploy] Starting backend deploy in $APP_DIR/backend"
cd "$APP_DIR/backend"
npm ci
node src/db/migrate.js
echo "[deploy] Restarting PM2 process sqrl-api"
pm2 restart sqrl-api || pm2 start src/index.js --name sqrl-api
pm2 save
echo "[deploy] Done"
