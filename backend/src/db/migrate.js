import { query } from './pool.js';

async function migrate() {
  await query(`CREATE TABLE IF NOT EXISTS wallets (
    id SERIAL PRIMARY KEY,
    address TEXT UNIQUE NOT NULL,
    volume NUMERIC,
    trade_count INTEGER,
    profit_estimate NUMERIC
  )`);

  await query(`CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL,
    name TEXT,
    price_history JSONB DEFAULT '[]'::jsonb
  )`);

  await query(`CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    price NUMERIC,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);

  console.log('Migration complete');
}

migrate().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
