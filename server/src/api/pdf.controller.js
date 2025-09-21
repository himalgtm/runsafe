// server/src/api/pdf.controller.js
import { num } from '../middleware/validate.js';
import { weekly as buildSummary } from '../services/summary.service.js';
import { weeklyPdf } from '../services/pdf.service.js';

export function pdfController(store) {
  return {
    weekly: async (req, res, next) => {
  try {
    const lat = num(req.query.lat, NaN);
    const lon = num(req.query.lon, NaN);

    const summary = await buildSummary(
      store,
      Number.isFinite(lat) ? lat : undefined,
      Number.isFinite(lon) ? lon : undefined
    );

    const bytes = await weeklyPdf(summary);
    console.log(`Generated PDF, ${bytes.length} bytes`);
    const buffer = Buffer.from(bytes);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="runsafe-weekly.pdf"');
    res.send(buffer);
  } catch (e) {
    console.error("Weekly PDF generation failed:", e);
    next(e);
  }
}
}
}
