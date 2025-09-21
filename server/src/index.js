// server/src/index.js
import express from 'express';

// import { cors as corsMw } from './middleware/cors.js';   // <-- alias the named export
import { errorHandler, notFound } from './middleware/error.js';

import { ENV } from './config/env.js';
import { createRouter } from './router.js';

import { jsonStore } from './data/json.store.js';
import { mongoStore } from './data/mongo.store.js';
import cors from "cors";

const app = express();
const corsMw = cors({
  origin: [
    "https://runsafe-client.vercel.app", 
    "http://localhost:5173",             
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
});
app.use(corsMw);
app.use(express.json({ limit: '512kb' }));

// demo header
app.use((_, res, next) => {
  res.set('X-Demo-Disclaimer', 'RunSafe prototype - not medical advice');
  next();
});

// health probe
app.get('/health', (_req, res) => res.json({ ok: true }));

// choose store
const store = ENV.STORE_IMPL === 'mongo' ? mongoStore() : jsonStore();


// mount API
app.use('/api', createRouter(store));

// 404 + error handler LAST
app.use(notFound);
app.use(errorHandler);

// start
const port = Number(ENV.PORT) || 4000;
app.listen(port, () => console.log(`RunSafe API :${port} [store=${ENV.STORE_IMPL}]`));

