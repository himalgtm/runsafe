import { ENV } from '../config/env.js';
const bucket = new Map();
export function rateLimitMw(req, res, next) {
  const key = req.ip || req.headers['x-forwarded-for'] || 'anon';
  const now = Date.now(), win = 60_000, lim = ENV.RATE_LIMIT_PER_MIN;
  const b = bucket.get(key) || { c:0, reset: now+win };
  if (now > b.reset) { b.c = 0; b.reset = now+win; }
  b.c++; bucket.set(key, b);
  res.set('X-RateLimit-Limit', String(lim));
  res.set('X-RateLimit-Remaining', String(Math.max(0, lim-b.c)));
  if (b.c > lim) return res.status(429).json({ error:{ code:'RATE_LIMIT', message:'Too many requests' }});
  next();
}
