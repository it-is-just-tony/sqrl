// Profitability estimation heuristics placeholder
export function estimateProfitability(trades) {
  // Simple FIFO realized PnL per token.
  const fifo = new Map();
  let realized = 0;
  for (const tr of trades) {
    const { token, amount, price } = tr;
    if (price == null || amount == null) continue;
    const qty = Number(amount);
    if (!Number.isFinite(qty) || !token) continue;
    const key = token.toUpperCase();
    if (!fifo.has(key)) fifo.set(key, []);
    if (qty > 0) {
      fifo.get(key).push({ amount: qty, price: Number(price) });
    } else if (qty < 0) {
      let remaining = -qty;
      const lots = fifo.get(key);
      while (remaining > 0 && lots.length) {
        const lot = lots[0];
        const use = Math.min(lot.amount, remaining);
        realized += use * (Number(price) - lot.price);
        lot.amount -= use;
        remaining -= use;
        if (lot.amount <= 0.0000001) lots.shift();
      }
      if (remaining > 0) {
        realized += remaining * Number(price); // oversell zero basis assumption
      }
    }
  }
  return Number(realized.toFixed(6));
}
