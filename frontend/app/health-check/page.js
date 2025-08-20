"use client";
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function HealthCheckPage() {
  const [api, setApi] = useState(null);
  const [error, setError] = useState(null);
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

  useEffect(() => {
    let cancelled = false;
    fetch(`${base}/health`).then(r => r.json()).then(d => {
      if (!cancelled) setApi(d);
    }).catch(e => {
      if (!cancelled) setError(e.message);
    });
    return () => { cancelled = true; };
  }, [base]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">System Health</h2>
      <p className="text-sm text-gray-400">Live status fetched from backend /health.</p>
      <div className="text-sm">
        <p><span className="font-medium text-emerald-400">Frontend:</span> OK (Next.js served)</p>
        {error && <p className="text-red-400">Backend error: {error}</p>}
        {api && (
          <p><span className="font-medium text-emerald-400">Backend:</span> {api.status} {api.lastRefresh && `(last refresh ${api.lastRefresh})`}</p>
        )}
        {!api && !error && <p className="text-gray-500 animate-pulse">Checking backend...</p>}
      </div>
      <p className="text-xs text-gray-500">API base: {base}</p>
    </div>
  );
}
