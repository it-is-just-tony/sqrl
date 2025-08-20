import { query } from '../db/pool.js';

export async function listWallets() {
  const { rows } = await query('SELECT id, address, volume, trade_count, profit_estimate FROM wallets ORDER BY profit_estimate DESC NULLS LAST LIMIT 50');
  return rows;
}

export async function getWallet(id) {
  const { rows } = await query('SELECT id, address, volume, trade_count, profit_estimate FROM wallets WHERE id = $1', [id]);
  if (!rows.length) return null;
  const wallet = rows[0];
  const trades = await query('SELECT id, token, amount, price, timestamp FROM trades WHERE wallet_id = $1 ORDER BY timestamp DESC LIMIT 200', [id]);
  wallet.trades = trades.rows;
  return wallet;
}
