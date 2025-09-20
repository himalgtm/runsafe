import { weeklyPdf } from '../services/pdf.service.js';
export function pdfController(store){
  return { weekly: async (_req,res)=>{ const bytes=await weeklyPdf(await store.listEntries());
    res.set('Content-Type','application/pdf'); res.set('Content-Disposition','inline; filename="runsafe-weekly.pdf"');
    res.end(Buffer.from(bytes)); } };
}
