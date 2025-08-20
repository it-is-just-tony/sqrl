import { query } from '../db/pool.js';

export async function listTokens() {
  const { rows } = await query('SELECT id, symbol, name FROM tokens ORDER BY symbol ASC');
  return rows;
}
