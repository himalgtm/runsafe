// server/src/api/route.controller.js
import { exposureForEncoded } from '../services/exposure.service.js';
import { badRequest } from '../middleware/error.js';

// --- Named handler: single route exposure (GET) ---
export async function routeExposure(req, res, next) {
  try {
    const encoded = req.query.encoded;
    if (!encoded) return badRequest(res, 'encoded polyline is required');
    const departTs = req.query.departTs ? Number(req.query.departTs) : undefined;
    const exposure = await exposureForEncoded(encoded, departTs);
    res.json({ exposure });
  } catch (e) { next(e); }
}

// --- Named handler: batch exposure (POST) ---
export async function routeExposureBatch(req, res, next) {
  try {
    const routes = req.body?.routes;
    if (!Array.isArray(routes) || routes.length === 0) {
      return badRequest(res, 'routes[] required');
    }
    const results = await Promise.all(
      routes.map(async (r, i) => {
        if (!r?.encoded) return { i, error: 'missing encoded' };
        const exposure = await exposureForEncoded(r.encoded, r?.departTs);
        return { i, exposure };
      })
    );
    res.json({ results });
  } catch (e) { next(e); }
}

// --- Controller object (for the "controller style" your router may use) ---
export function routeController() {
  return {
    exposure: routeExposure,
    batch: routeExposureBatch,
  };
}
