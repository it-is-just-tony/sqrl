import { query, getConnectionInfo } from './pool.js';
import pg from 'pg';
import '../loadEnv.js';

async function migrate() {
  if (process.env.DB_DEBUG === '1') {
    console.log('[migrate][debug] connection info:', getConnectionInfo());
  }
  // Direct auth test with new client (bypassing pool reuse)
  if (process.env.DB_DEBUG === '1') {
    const { Client } = pg;
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    try {
      await c.connect();
      console.log('[migrate][debug] standalone client auth OK');
    } catch (e) {
      console.error('[migrate][debug] standalone client auth FAIL', e.code, e.message);
    } finally { try { await c.end(); } catch(_){} }
  }
  try {
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
  } catch (err) {
    if (err.code === '28P01') {
      console.error('\n[error] Database authentication failed (code 28P01).');
      console.error('Resolve by either:');
      console.error('  * Setting correct DATABASE_URL in backend/.env');
      console.error('  * Or creating the referenced user & password in PostgreSQL');
      console.error('\nExamples:');
      console.error('  sudo -u postgres psql -c "ALTER USER appuser WITH PASSWORD \'newpass\';"');
      console.error('  export DATABASE_URL=postgres://appuser:newpass@localhost:5432/appdb');
    }
    throw err;
  }
}

migrate().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
