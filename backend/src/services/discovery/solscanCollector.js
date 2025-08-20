// Solscan collector placeholder. Real implementation will call the Solscan API
// Functions: fetchRecentSPLTrades -> normalized trade records

export async function fetchRecentSPLTrades({ limit = 100 } = {}) {
  const now = Date.now();
  return [
    { wallet: 'MockWallet1111111111111111111111111111111', token: 'MOCK', amount: 10, price: 1.23, timestamp: new Date(now - 60000).toISOString() },
    { wallet: 'MockWallet1111111111111111111111111111111', token: 'MOCK', amount: -4, price: 1.4, timestamp: new Date(now - 30000).toISOString() }
  ].slice(0, limit);
}
