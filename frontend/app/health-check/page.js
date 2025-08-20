export const dynamic = 'force-dynamic';

export default async function HealthCheckPage() {
  // Simple client-side fetch could also be used; keeping static placeholder for now
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">System Health</h2>
      <p className="text-sm text-gray-400">Backend connectivity & richer metrics will appear here later.</p>
      <ul className="text-sm list-disc list-inside text-gray-300">
        <li>Frontend: OK (served Next.js)</li>
        <li>Backend: Pending integration (will fetch /health)</li>
        <li>DB: Pending integration</li>
      </ul>
    </div>
  );
}
