# Deployment Notes (sqrl / motionless)

## Server Hardening Checklist
- [ ] Create non-root deploy user
- [ ] SSH key auth only, disable password login
- [ ] UFW allow 22/tcp, 80/tcp, 443/tcp; deny incoming default
- [ ] Fail2ban enabled for sshd
- [ ] Install Node.js LTS & PostgreSQL
- [ ] Create postgres role & database `sqrl`
- [ ] Nginx reverse proxy using `infrastructure/nginx.conf.example`
- [ ] Obtain TLS cert via certbot (Let's Encrypt)

## App Deployment
Preferred (using provided scripts):
```
git clone <repo> /var/www/sqrl
cd /var/www/sqrl/backend && cp .env.example .env # adjust values
bash infrastructure/deploy-backend.sh
bash infrastructure/deploy-frontend.sh
```

Manual (fallback):
```
cd /var/www/sqrl/backend && npm ci && node src/db/migrate.js && pm2 start src/index.js --name sqrl-api
cd /var/www/sqrl/frontend && npm ci && npm run build && pm2 start node_modules/next/dist/bin/next --name sqrl-frontend -- start -p 3000
pm2 save
```

If migrating from the bootstrap `fullstack-harden.sh` environment (ports 3001 API / 3000 frontend) to sqrl layout (API 4000 / frontend 3000), update nginx upstream `/api/` block to target `127.0.0.1:4000` and remove legacy `/var/www/app` sample app if not needed.

## Logs & Monitoring
- pm2 logs sqrl-api
- pm2 logs sqrl-frontend
- journalctl -u nginx
- PostgreSQL logs: /var/log/postgresql/

## Refresh Job
Use `infrastructure/refresh-job.sh` via cron:
```
*/15 * * * * API_KEY=yourkey bash /var/www/sqrl/infrastructure/refresh-job.sh >> /var/log/sqrl-refresh.log 2>&1
```
Adjust frequency (e.g. every 5 minutes) as needed.

Environment variable mapping (legacy -> sqrl):
- API_PORT=3001 (legacy) -> PORT=4000 (sqrl backend .env)
- DB_NAME=appdb -> part of DATABASE_URL
- DB_USER/DB_PASS -> embed into DATABASE_URL or keep local role; example: DATABASE_URL=postgres://appuser:pass@localhost:5432/appdb
