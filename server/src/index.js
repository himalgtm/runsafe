import express from 'express';
import { corsMw } from './middleware/cors.js';
import { rateLimitMw } from './middleware/rateLimit.js';
import { errorMw } from './middleware/error.js';
import { ENV } from './config/env.js';
import { createRouter } from './router.js';
import { jsonStore } from './data/json.store.js';
import { mongoStore } from './data/mongo.store.js';

const app = express();
app.use(corsMw);
app.use(express.json({ limit: '512kb' }));
app.use((_, res, next) => {
  // ASCII only in headers!
  res.set('X-Demo-Disclaimer', 'RunSafe prototype - not medical advice');
  next();
});

const store = ENV.STORE_IMPL === 'mongo' ? mongoStore() : jsonStore();
app.use('/api', createRouter(store));

app.use(errorMw);
app.listen(ENV.PORT, () => console.log(`RunSafe API :${ENV.PORT} [store=${ENV.STORE_IMPL}]`));