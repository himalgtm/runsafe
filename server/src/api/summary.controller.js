import { weekly } from '../services/summary.service.js';
export function summaryController(store){
  return { weekly: async (req,res)=> res.json(await weekly(store, req.query.lat, req.query.lon)) };
}
