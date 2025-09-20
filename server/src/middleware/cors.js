import cors from 'cors';
import { ENV } from '../config/env.js';
export const corsMw = cors({
  origin: (origin, cb) => (!origin || ENV.CORS_ALLOW_ORIGINS.includes(origin)) ? cb(null, true) : cb(null, false),
  credentials: true
});
