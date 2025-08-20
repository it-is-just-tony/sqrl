import { Router } from 'express';
import { listTokens } from '../services/tokenService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tokens = await listTokens();
    res.json(tokens);
  } catch (e) { next(e); }
});

export default router;
