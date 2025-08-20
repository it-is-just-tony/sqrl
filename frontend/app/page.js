export default function Page() {
  return (
    <main className="space-y-12">
      <section className="text-center py-16">
        <h2 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text mb-6">
          sqrl
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Solana wallet profitability insights. Track smart money flows, surface consistently winning addresses,
          and analyze token trade performance. This is a placeholder landing page to verify deployment.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#" className="px-6 py-3 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow">
            Coming Soon
          </a>
          <a href="/health-check" className="px-6 py-3 rounded-md border border-gray-600 hover:border-gray-400 text-gray-200 font-medium">
            System Health (placeholder)
          </a>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Discovery', desc: 'Scan recent SPL token trades & surface active wallets.' },
          { title: 'Profit Heuristics', desc: 'Estimate realized / unrealized PnL with lightweight models.' },
          { title: 'Analytics UI', desc: 'Filter, sort, and visualize wallet performance.' }
        ].map(card => (
          <div key={card.title} className="rounded-lg border border-gray-800 p-6 bg-gray-900/40 backdrop-blur">
            <h3 className="font-semibold text-emerald-300 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </section>
      <section className="text-center text-xs text-gray-600 pt-8 border-t border-gray-800">
        <p>Deployment smoke test: if you can see this page via your domain / Cloudflare, frontend is live.</p>
      </section>
    </main>
  );
}
