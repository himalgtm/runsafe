import dayjs from 'dayjs';
import { decodePolyline } from '../integrations/maps.polyline.js';
import { fetchAirQuality } from '../integrations/openMeteo.client.js';
import { downsample } from '../utils/geometry.js';

export async function scoreExposure(encoded, departTs){
  const coords = decodePolyline(encoded);
  const slim = downsample(coords, 200);
  const c = slim[Math.floor(slim.length/2)];
  const data = await fetchAirQuality(c.lat, c.lon);
  if(!data) return { exposure: null, note:'AQ API unavailable' };
  const times = data.hourly.time.map(t=>dayjs(t)), aq = data.hourly.us_aqi;
  const start = departTs ? dayjs(Number(departTs)) : dayjs();
  const stepSec = 50; let exposure = 0;
  for(let i=0;i<slim.length;i++){
    const t = start.add(i*stepSec, 'second');
    let idx=0,b=1e9; for(let j=0;j<times.length;j++){ const d=Math.abs(t.diff(times[j],'minute')); if(d<b){b=d;idx=j;} }
    exposure += (aq[idx] ?? 100) * (stepSec/3600);
  }
  return { exposure: Number(exposure.toFixed(2)) };
}