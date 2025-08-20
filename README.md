# sqrl (motionless)

Solana Wallet Profitability Tracker.

## Structure
- backend: Express API / PostgreSQL
- frontend: Next.js interface

## Quickstart (Dev)
1. Start PostgreSQL locally and create db `sqrl`.
2. Backend:
```
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```
3. Frontend:
```
cd frontend
npm install
# set NEXT_PUBLIC_API_BASE in .env.local if different
npm run dev
```

Open http://localhost:3000

## Env Vars (backend .env)
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/sqrl
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug

## Next Steps
- Implement wallet discovery (data collectors for Solscan, Helius etc.)
- Implement profitability heuristics
- Add authentication / API key if needed
- Add charts & token pages
- Harden deployment (Nginx, PM2 scripts)
 - Add background job scheduler (cron or worker) for periodic refresh

## Deployment Workflow (VPS)
1. Clone repo to /var/www/sqrl (or set APP_DIR)
2. Backend: run infrastructure/deploy-backend.sh
3. Frontend: run infrastructure/deploy-frontend.sh
4. Ensure nginx reverse proxy configured (see infrastructure/nginx.conf.example)
5. Copy backend/.env.example to backend/.env and set values (API_KEY, DATABASE_URL, etc.)

One-liner after changes:
`bash infrastructure/deploy-backend.sh && bash infrastructure/deploy-frontend.sh`

### API Key Protection
Set API_KEY in backend .env and send header `X-API-Key: <value>` for protected endpoints (POST /refresh).

### Migrating From fullstack-harden.sh Sample App
If you previously ran `fullstack-harden.sh`, you have a sample app at `/var/www/app` with API on 3001 and frontend on 3000.

Steps to switch fully to sqrl:
1. Deploy sqrl to `/var/www/sqrl` using scripts above.
2. Update nginx config `/api/` upstream to `http://127.0.0.1:4000/` (not 3001).
3. Reload nginx: `sudo nginx -s reload`.
4. Stop old PM2 processes if desired: `pm2 delete api frontend` (ensure they are the old ones).
5. Optionally remove `/var/www/app` after confirming sqrl is serving traffic.

Legacy → sqrl variable mapping:
API_PORT=3001 -> PORT=4000
DB creds (appdb/appuser/pass) -> compose DATABASE_URL.
