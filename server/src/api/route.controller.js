// server/src/api/route.controller.js
import { exposureForEncoded } from '../services/exposure.service.js';

export function routeController() {
  return {
    // ...exposure: (single polyline) ...

    batch: async (req, res) => {
      try {
        const body = req.body || {};
        const routesIn = Array.isArray(body.routes) ? body.routes : null;
        const polysIn  = Array.isArray(body.polylines) ? body.polylines : null;

        let items = [];
        if (routesIn) {
          items = routesIn.map((r) => ({
            encoded: r?.encoded || r?.polyline || r?.points || r?.path || r?.overview_polyline?.points || r,
            departTs: Number(r?.departTs) || Date.now(),
          }));
        } else if (polysIn) {
          items = polysIn.map((p) => ({
            encoded: p,
            departTs: Date.now(),
          }));
        } else {
          return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'routes[] required' } });
        }

        // compute exposures
        const results = [];
        for (let i = 0; i < items.length; i++) {
          const { encoded, departTs } = items[i];
          const exposure = await exposureForEncoded(encoded, { departTs });
          results.push({ i, exposure });
        }
        return res.json({ results });
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: { code: 'SERVER_ERROR', message: e.message } });
      }
    },
  };
}
