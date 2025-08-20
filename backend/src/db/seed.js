import { query } from './pool.js';

async function seed() {
  await query(`INSERT INTO wallets(address, volume, trade_count, profit_estimate)
    VALUES ('DemoWallet1', 10000, 25, 1200), ('DemoWallet2', 8000, 18, 950)
    ON CONFLICT (address) DO NOTHING`);
  await query(`INSERT INTO tokens(symbol, name)
    VALUES ('SOL', 'Solana'), ('USDC', 'USD Coin')
    ON CONFLICT (symbol) DO NOTHING`);
  console.log('Seed complete');
}

seed().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
