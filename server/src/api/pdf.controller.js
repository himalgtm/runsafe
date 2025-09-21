// server/src/api/pdf.controller.js
import { num } from '../middleware/validate.js';
import { weekly as buildSummary } from '../services/summary.service.js';
import { weeklyPdf } from '../services/pdf.service.js';

export function pdfController(store) {
  return {
    weekly: async (req, res, next) => {
      try {
        // lat/lon are optional; summary() should handle undefined
        const lat = num(req.query.lat, NaN);
        const lon = num(req.query.lon, NaN);

        const summary = await buildSummary(
          store,
          Number.isFinite(lat) ? lat : undefined,
          Number.isFinite(lon) ? lon : undefined
        );

        const bytes = await weeklyPdf(summary);
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'inline; filename="runsafe-weekly.pdf"');
        res.send(Buffer.from(bytes));
      } catch (e) { next(e); }
    }
  };
}
