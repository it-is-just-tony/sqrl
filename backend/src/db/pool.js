import pg from 'pg';
import '../loadEnv.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgres://postgres:postgres@localhost:5432/appdb`
});

export function query(text, params) {
  return pool.query(text, params);
}
