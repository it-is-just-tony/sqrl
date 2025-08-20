// Simple API key middleware
// Provide array of public path prefixes to skip auth
export default function apiKey(publicPrefixes = []) {
  const key = process.env.API_KEY;
  return function(req, res, next) {
    if (!key) return next(); // not enforced
    const path = req.path;
    if (publicPrefixes.some(p => path.startsWith(p))) return next();
    const header = req.header('X-API-Key');
    if (header && header === key) return next();
    return res.status(401).json({ error: 'unauthorized' });
  };
}
