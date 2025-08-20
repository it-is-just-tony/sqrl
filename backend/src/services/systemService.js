let lastRefresh = null;
import { runDiscovery } from './discovery/discoveryService.js';

export function getHealth() {
  return { status: 'ok', lastRefresh };
}

export async function triggerRefresh() {
  const started = Date.now();
  const discovery = await runDiscovery({ sources: ['solscan'] });
  lastRefresh = new Date().toISOString();
  return { status: 'refresh_complete', at: lastRefresh, ms: Date.now() - started, discovery };
}
