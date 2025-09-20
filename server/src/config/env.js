import dotenv from 'dotenv';
dotenv.config();
const get = (k, d) => (process.env[k] ?? d);

export const ENV = {
  PORT: Number(get('PORT', 4000)),
  STORE_IMPL: get('STORE_IMPL', 'json'),
  OPEN_METEO_BASE: get('OPEN_METEO_BASE', 'https://air-quality-api.open-meteo.com/v1/air-quality'),
  CORS_ALLOW_ORIGINS: (get('CORS_ALLOW_ORIGINS', 'http://localhost:5173') || '').split(','),
  RATE_LIMIT_PER_MIN: Number(get('RATE_LIMIT_PER_MIN', 60)),
  ATLAS_DATA_API_URL: get('ATLAS_DATA_API_URL'),
  ATLAS_DATA_API_KEY: get('ATLAS_DATA_API_KEY'),
  ATLAS_PROJECT_ID: get('ATLAS_PROJECT_ID'),
  ATLAS_CLUSTER_NAME: get('ATLAS_CLUSTER_NAME'),
  ATLAS_DATABASE: get('ATLAS_DATABASE'),
  ATLAS_COLLECTION: get('ATLAS_COLLECTION', 'symptom_entries'),
};
