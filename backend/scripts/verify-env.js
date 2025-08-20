#!/usr/bin/env node
// Quick diagnostic to confirm runtime env variables used by backend
import 'dotenv/config';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';

const { Client } = pg;

function log(k, v) {
  console.log(`${k}=${v ?? ''}`);
}

console.log('--- sqrl env verification ---');
['NODE_ENV','PORT','DATABASE_URL','CORS_ORIGIN','API_KEY','RATE_LIMIT'].forEach(k=>log(k, process.env[k]));

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing. Aborting DB test.');
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const r = await client.query('SELECT current_user, current_database();');
    console.log('DB connection ok:', r.rows[0]);
  } catch (e) {
    console.error('DB connection failed:', e.code, e.message);
  } finally {
    await client.end();
  }
})();
