#!/usr/bin/env bash
set -euo pipefail
APP_DIR=${APP_DIR:-/var/www/sqrl}
echo "[deploy] Building frontend"
cd "$APP_DIR/frontend"
npm ci
npm run build
pm2 restart sqrl-frontend || pm2 start node_modules/next/dist/bin/next --name sqrl-frontend -- start -p 3000
pm2 save
echo "[deploy] Frontend deploy complete"
