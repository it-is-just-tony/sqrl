import pg from 'pg';
import '../loadEnv.js';

const { Pool } = pg;

const rawUrl = process.env.DATABASE_URL || 'postgres://appuser:CHANGE_ME@localhost:5432/appdb';

// Debug helper: parse and expose sanitized info
function describeConn(url) {
  try {
    const u = new URL(url);
    const pwd = u.password;
    return {
      protocol: u.protocol,
      host: u.hostname,
      port: u.port,
      db: u.pathname.replace('/', ''),
      user: u.username,
      pwdLen: pwd.length,
      pwdLastCharCode: pwd ? pwd.charCodeAt(pwd.length - 1) : null,
      hasTrailingCR: pwd.endsWith('\r'),
      sanitized: url.replace(/:(.*?)@/, ':****@'),
    };
  } catch (e) {
    return { parseError: e.message };
  }
}

if (process.env.DB_DEBUG === '1') {
  console.log('[db][debug] ENV DATABASE_URL raw:', rawUrl);
  console.log('[db][debug] Loaded environment variables from:', process.env.DATABASE_URL);
  console.log('[db][debug] Parsed:', describeConn(rawUrl));
}

export const pool = new Pool({ connectionString: rawUrl });

// Optional immediate test (non-fatal) to surface auth errors early in logs
pool.query('SELECT 1').then(()=>{
  if (process.env.DB_DEBUG === '1') console.log('[db] initial connection ok');
}).catch(e=>{
  const info = describeConn(rawUrl);
  console.error('[db] initial connection failed:', e.code, e.message);
  console.error('[db] connection info:', info);
  if (e.code === '28P01') {
    console.error('[db] HINT: Password mismatch. Possible hidden carriage return or outdated role password.');
    console.error("[db] To view raw password bytes: hexdump -C backend/.env | grep DATABASE_URL");
  }
});

export function getConnectionInfo() { return describeConn(rawUrl); }

export function query(text, params) {
  return pool.query(text, params);
}
