import { getNow, bestWindow } from '../services/airQuality.service.js';
import { num } from '../middleware/validate.js';

export async function airNow(req, res){
    console.log("Air Now called with query:", req.query);
  const lat=num(req.query.lat), lon=num(req.query.lon);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)) return res.status(400).json({error:{code:'BAD_REQUEST',message:'lat/lon required'}});
  const s = req.query.sensitivity ? JSON.parse(req.query.sensitivity) : {};
  res.json(await getNow(lat, lon, s));
}

export async function airBestWindow(req, res){
  const lat=num(req.query.lat), lon=num(req.query.lon), hours=num(req.query.hours,12);
  if(!Number.isFinite(lat)||!Number.isFinite(lon)) return res.status(400).json({error:{code:'BAD_REQUEST',message:'lat/lon required'}});
  const s = req.query.sensitivity ? JSON.parse(req.query.sensitivity) : {};
  res.json(await bestWindow(lat, lon, hours, s));
}