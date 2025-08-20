// Discovery orchestrator: fetch recent trades, normalize, persist, update wallet stats.
import { fetchRecentSPLTrades } from './solscanCollector.js';
import { fetchHeliusTrades } from './heliusCollector.js';
import { query } from '../../db/pool.js';
import { estimateProfitability } from '../profitability/estimator.js';

function normalizeNumber(n) { if (n == null) return null; const num = Number(n); return Number.isFinite(num) ? num : null; }

async function upsertWallet(address) {
  await query('INSERT INTO wallets(address, volume, trade_count, profit_estimate) VALUES($1, 0, 0, NULL) ON CONFLICT(address) DO NOTHING', [address]);
  const { rows } = await query('SELECT id, address, volume, trade_count, profit_estimate FROM wallets WHERE address = $1', [address]);
  return rows[0];
}

async function insertTrade(walletId, t) {
  const { token, amount, price, timestamp } = t;
  await query('INSERT INTO trades(wallet_id, token, amount, price, timestamp) VALUES($1,$2,$3,$4,$5)', [walletId, token, amount, price, timestamp || new Date()]);
}

async function recomputeWalletStats(walletId) {
  const { rows } = await query('SELECT token, amount, price, timestamp FROM trades WHERE wallet_id = $1 ORDER BY timestamp ASC', [walletId]);
  const trades = rows;
  let volume = 0;
  for (const tr of trades) {
    if (tr.price != null) volume += Math.abs(Number(tr.amount) * Number(tr.price));
  }
  const profit = estimateProfitability(trades);
  await query('UPDATE wallets SET volume = $2, trade_count = $3, profit_estimate = $4 WHERE id = $1', [walletId, volume, trades.length, profit]);
}

export async function runDiscovery({ sources = ['solscan'], limit = 200 } = {}) {
  const trades = [];
  if (sources.includes('solscan')) {
    try { trades.push(...await fetchRecentSPLTrades({ limit })); } catch (e) { console.error('[discovery] solscan error', e.message); }
  }
  if (sources.includes('helius')) {
    try { trades.push(...await fetchHeliusTrades({ limit })); } catch (e) { console.error('[discovery] helius error', e.message); }
  }
  if (!trades.length) return { processed: 0, walletsAffected: 0 };

  const byWallet = new Map();
  for (const raw of trades) {
    if (!raw.wallet || !raw.token || raw.amount == null) continue;
    const normalized = {
      wallet: raw.wallet,
      token: String(raw.token).toUpperCase(),
      amount: normalizeNumber(raw.amount),
      price: normalizeNumber(raw.price),
      timestamp: raw.timestamp ? new Date(raw.timestamp) : new Date()
    };
    if (!normalized.amount) continue;
    if (!byWallet.has(normalized.wallet)) byWallet.set(normalized.wallet, []);
    byWallet.get(normalized.wallet).push(normalized);
  }

  const walletIds = new Map();
  for (const [wallet, wTrades] of byWallet.entries()) {
    const w = await upsertWallet(wallet);
    walletIds.set(wallet, w.id);
    for (const t of wTrades) {
      try { await insertTrade(w.id, t); } catch (e) { console.error('[discovery] insertTrade fail', e.code, e.message); }
    }
    try { await recomputeWalletStats(w.id); } catch (e) { console.error('[discovery] recompute stats fail', e.message); }
  }

  return { processed: trades.length, walletsAffected: walletIds.size };
}
