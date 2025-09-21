import fetch from 'node-fetch';
import { ENV } from '../config/env.js';
export async function fetchAirQuality(lat, lon){
  console.log("Fetching air quality for", lat, lon);
  const url = `${ENV.OPEN_METEO_BASE}?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm2_5,ozone,nitrogen_dioxide`;
  const r = await fetch(url, { timeout: 10_000 }).catch(()=>null);
  if (!r || !r.ok) return null; return r.json();
}
