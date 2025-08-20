import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, existsSync } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// We originally pointed two levels up (project root), which skipped backend/.env.
// Here we search preferred locations in order.
const candidates = [
	join(__dirname, '..', '.env'),        // backend/.env (preferred)
	join(__dirname, '../../', '.env'),    // repo root .env (fallback if user puts one there)
];

for (const p of candidates) {
	if (existsSync(p)) {
		dotenv.config({ path: p });
		if (process.env.DB_DEBUG === '1') {
			console.log('[env][debug] loaded .env from:', p);
		}
		break;
	}
}

// If still no DATABASE_URL warn (only in debug mode)
if (process.env.DB_DEBUG === '1' && !process.env.DATABASE_URL) {
	console.warn('[env][debug] DATABASE_URL not set after loading candidates');
}
