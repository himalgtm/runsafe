// server/src/api/ai.controller.js
import { num } from '../middleware/validate.js';
import { aiAdvice, aiCoach, aiWeeklyNarrative } from '../services/ai.service.js';

export function aiController(store) {
  return {
    advice: async (req, res, next) => {
      try {
        const lat = num(req.query.lat), lon = num(req.query.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          return res.status(400).json({ error:{code:'BAD_REQUEST', message:'lat/lon required'} });
        }
        const sensitivity = req.query.sensitivity ? JSON.parse(req.query.sensitivity) : {};
        const out = await aiAdvice({ lat, lon, sensitivity });
        res.json(out);
      } catch (e) { next(e); }
    },

    coach: async (req, res, next) => {
      try {
        const lat = num(req.query.lat), lon = num(req.query.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
          return res.status(400).json({ error:{code:'BAD_REQUEST', message:'lat/lon required'} });
        }
        const hours = num(req.query.hours, 12);
        const distanceKm = num(req.query.distanceKm, 5);
        const sensitivity = req.query.sensitivity ? JSON.parse(req.query.sensitivity) : {};
        const out = await aiCoach({ lat, lon, hours, distanceKm, sensitivity });
        res.json(out);
      } catch (e) { next(e); }
    },

    weekly: async (_req, res, next) => {
      try {
        const out = await aiWeeklyNarrative(store, {});
        res.json(out);
      } catch (e) { next(e); }
    }
  };
}
