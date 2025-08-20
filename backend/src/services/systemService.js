let lastRefresh = null;

export function getHealth() {
  return { status: 'ok', lastRefresh };
}

export async function triggerRefresh() {
  // TODO: orchestrate collectors + profitability estimator
  lastRefresh = new Date().toISOString();
  return { status: 'refresh_enqueued', at: lastRefresh };
}
