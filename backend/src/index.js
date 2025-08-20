import './loadEnv.js';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import apiKey from './middleware/apiKey.js';
import pino from 'pino';
import pinoHttp from 'pino-http';
import walletRoutes from './routes/wallets.js';
import tokenRoutes from './routes/tokens.js';
import systemRoutes from './routes/system.js';

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*'}));
app.use(express.json());
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT || '60', 10),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Apply API key middleware to POST /refresh (mounted later) by putting on app and allowing public GETs
app.use(apiKey(['/health','/wallets','/tokens']));
app.use('/wallets', walletRoutes);
app.use('/tokens', tokenRoutes);
app.use('/', systemRoutes);

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'internal_error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  logger.info(`sqrl backend listening on :${port}`);
});
