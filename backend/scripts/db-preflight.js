#!/usr/bin/env node
import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[preflight] DATABASE_URL missing in .env');
  process.exit(2);
}

(async () => {
  const started = Date.now();
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const r = await client.query('SELECT current_user, current_database();');
    console.log(`[preflight] OK user=${r.rows[0].current_user} db=${r.rows[0].current_database} latency=${Date.now()-started}ms`);
  } catch (e) {
    console.error('[preflight] FAILED', e.code, e.message);
    if (e.code === '28P01') {
      console.error('\n[hint] Auth failure. Run:');
      console.error("  sudo -u postgres psql -c \"ALTER ROLE appuser WITH PASSWORD 'NewPass!123';\"");
      console.error('  (or adjust DATABASE_URL user/pass)');
      console.error('\n[debug] Effective DATABASE_URL:', url.replace(/:(.*?)@/, ':****@'));
    }
    process.exit(3);
  } finally {
    try { await client.end(); } catch (_) {}
  }
})();
