import { Router } from 'express';
import { listWallets, getWallet } from '../services/walletService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const wallets = await listWallets();
    res.json(wallets);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const wallet = await getWallet(req.params.id);
    if (!wallet) return res.status(404).json({ error: 'not_found' });
    res.json(wallet);
  } catch (e) { next(e); }
});

export default router;
