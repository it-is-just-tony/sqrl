import pg from 'pg';
import '../loadEnv.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgres://appuser:CHANGE_ME@localhost:5432/appdb';
export const pool = new Pool({ connectionString });

// Optional immediate test (non-fatal) to surface auth errors early in logs
pool.query('SELECT 1').then(()=>{
  // eslint-disable-next-line no-console
  console.log('[db] connection ok');
}).catch(e=>{
  console.error('[db] initial connection failed:', e.code, e.message);
});

export function query(text, params) {
  return pool.query(text, params);
}
