import '../styles/globals.css';

export const metadata = { title: 'sqrl | motionless', description: 'Solana wallet profitability tracker' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <div className="max-w-6xl mx-auto p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">sqrl</h1>
            <p className="text-sm text-gray-400">motionless tekStak</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
