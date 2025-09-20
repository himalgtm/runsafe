import { Router } from 'express';
import { airNow, airBestWindow } from './api/air.controller.js';
import { routeExposure } from './api/route.controller.js';
import { diaryController } from './api/diary.controller.js';
import { summaryController } from './api/summary.controller.js';
import { fhirController } from './api/fhir.controller.js';
import { pdfController } from './api/pdf.controller.js';

export function createRouter(store) {
  const r = Router();
  r.get('/health', (_req, res) => res.json({ ok: true }));

  r.get('/air/now', airNow);
  r.get('/air/best-window', airBestWindow);
  r.get('/route/exposure', routeExposure);

  const diary = diaryController(store);
  r.post('/diary/log', diary.log);
  r.get('/diary/list', diary.list);

  const summary = summaryController(store);
  r.get('/summary/weekly', summary.weekly);

  const fhir = fhirController(store);
  r.get('/fhir/export', fhir.export);

  const pdf = pdfController(store);
  r.get('/summary/pdf', pdf.weekly);

  return r;
}