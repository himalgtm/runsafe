// server/src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

const get = (k, d) => (process.env[k] ?? d);

const toBool = (v, d = false) => {
  if (v === undefined || v === null) return d;
  const s = String(v).toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(s);
};

const parseCSV = (s, fallback = []) =>
  String(s ?? '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean)
    // dedupe + append fallback entries (like both 5173/5174)
    .concat(fallback)
    .filter((v, i, a) => a.indexOf(v) === i);

export const ENV = {
  NODE_ENV: get('NODE_ENV', 'development'),

  // Core
  PORT: Number(get('PORT', 4000)),
  STORE_IMPL: get('STORE_IMPL', 'json'), // keep 'json' (no Mongo for hackathon)
  OPEN_METEO_BASE: get('OPEN_METEO_BASE', 'https://air-quality-api.open-meteo.com/v1/air-quality'),
  CORS_ALLOW_ORIGINS: parseCSV(
    get('CORS_ALLOW_ORIGINS', 'http://localhost:5173,http://localhost:5174'),
  ),
  RATE_LIMIT_PER_MIN: Number(get('RATE_LIMIT_PER_MIN', 60)),

  // Auth0 (optional; leave disabled until FE is ready)
  AUTH0_ENFORCE: toBool(get('AUTH0_ENFORCE', 'false')),
  AUTH0_DOMAIN: get('AUTH0_DOMAIN', ''),
  AUTH0_AUDIENCE: get('AUTH0_AUDIENCE', ''),

  // Cloudflare Workers AI
  CF_ACCOUNT_ID: get('CF_ACCOUNT_ID', ''),
  CF_API_TOKEN: get('CF_API_TOKEN', ''),
  CF_MODEL: get('CF_MODEL', '@cf/meta/llama-3.1-8b-instruct'),
};

