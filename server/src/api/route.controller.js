import { scoreExposure } from '../services/exposure.service.js';
export async function routeExposure(req, res){
  const { encoded, departTs } = req.query;
  if(!encoded) return res.status(400).json({ error:{ code:'BAD_REQUEST', message:'encoded polyline required' }});
  res.json(await scoreExposure(encoded, departTs));
}