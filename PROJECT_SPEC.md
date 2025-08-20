# 📘 Full Project Specification: Solana Wallet Profitability Tracker

## 🧩 Project Overview
Build a fullstack web application that identifies and displays Solana wallets trading SPL tokens with consistent profitability. The system will use free APIs to gather wallet and token data, analyze trading behavior, and present insights via a secure web frontend.

---

## 🏗️ Architecture Overview

Your server is a **hardened Ubuntu VPS** with:

- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (local only)
- **Web Server**: Nginx (reverse proxy)
- **Process Manager**: PM2
- **Security**: UFW, Fail2ban, SSH hardening

---

## 📦 Application Modules

### 1. Wallet Discovery Module
- **Purpose**: Identify candidate wallets trading SPL tokens.
- **Data Sources**: Need to find free APIs for wallet and token data
- **APIs**: known sources, need to identify free ones
  - [SolanaFM](https://docs.solana.fm/)
  - [Solscan](https://public-api.solscan.io/)
  - [Helius](https://docs.helius.xyz/)
  - [Birdeye](https://birdeye.so/)
- **Logic**:
  - Query recent SPL token trades.
  - Extract wallet addresses.
  - Filter by volume, frequency, and token diversity.

### 2. Profitability Analysis Module
- **Purpose**: Estimate wallet profitability.
- **Logic**:
  - Track token buy/sell prices.
  - Estimate realized gains or ROI over different timeframes.
  - Use heuristics for profit estimation (e.g., price delta, trade timing).

### 3. Backend API
- **Tech**: Express.js
- **Endpoints**:
  - `GET /wallets`: List candidate wallets
  - `GET /wallet/:id`: Wallet details and trade history
  - `GET /tokens`: List tracked SPL tokens
  - `POST /refresh`: Trigger data refresh from APIs
- **Security**:
  - Rate limiting
  - API key protection (optional)

### 4. Frontend UI
- **Tech**: Next.js + Tailwind CSS
- **Pages**:
  - `/`: Dashboard with top wallets
  - `/wallet/:id`: Wallet detail view
  - `/tokens`: Token performance overview
- **Features**:
  - Search/filter wallets
  - Profitability charts
  - Token trade history

### 5. Database Schema (PostgreSQL)
- `wallets`: `id`, `address`, `volume`, `trade_count`, `profit_estimate`
- `trades`: `id`, `wallet_id`, `token`, `amount`, `price`, `timestamp`
- `tokens`: `id`, `symbol`, `name`, `price_history`

---

## 🔐 Security Considerations
- Keep `.env` secrets private
- Use HTTPS via Nginx
- Protect API endpoints
- Monitor logs with PM2 and system logs
- Never expose PostgreSQL externally

---

## 🚀 Deployment Workflow
1. Make code changes in `/var/www/app/`
2. Restart backend: `pm2 restart api`
3. Rebuild frontend: `npm run build && pm2 restart frontend`
4. Verify: `pm2 status && pm2 logs --lines 20`

---

## 📅 Development Milestones

| Phase | Task | Deliverable |
|-------|------|-------------|
| 1 | Wallet discovery logic | Script/API to fetch wallet candidates |
| 2 | Profitability heuristics | Backend logic to estimate profits |
| 3 | API endpoints | Express routes for frontend |
| 4 | Frontend dashboard | React pages with wallet/token views |
| 5 | Deployment | Live server with Nginx proxy |
