import { Router } from 'express';
import { triggerRefresh, getHealth } from '../services/systemService.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json(getHealth());
});

router.post('/refresh', async (req, res, next) => {
  try {
    const result = await triggerRefresh();
    res.json(result);
  } catch (e) { next(e); }
});

export default router;
