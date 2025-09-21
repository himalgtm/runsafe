// server/src/middleware/cors.js (ESM)

const ALLOW_ORIGINS = (process.env.CORS_ALLOW_ORIGINS || '*')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const ALLOW_METHODS = 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
const ALLOW_HEADERS = 'Content-Type, Authorization';

// Export name is **cors**
export function cors(req, res, next) {
  const origin = req.headers.origin;

  if (origin && (ALLOW_ORIGINS.includes('*') || ALLOW_ORIGINS.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', ALLOW_METHODS);
  res.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  next();
}
