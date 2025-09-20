import dayjs from 'dayjs';
import { fetchAirQuality } from '../integrations/openMeteo.client.js';
import { riskBadge, sensOffset } from '../utils/aqi.js';

const nearestIdx = times => {
  const now = dayjs(); let i=0,b=1e9; times.forEach((t,k)=>{ const d=Math.abs(now.diff(dayjs(t),'minute')); if(d<b){b=d;i=k;}});
  return i;
};

export async function getNow(lat, lon, sensitivity) {
  const data = await fetchAirQuality(lat, lon);
  if (!data) return { aqi: 100, badge: riskBadge(100, sensitivity), rationale: 'API fallback' };
  const idx = nearestIdx(data.hourly.time);
  const aqi = data.hourly.us_aqi?.[idx] ?? 100;
  return { aqi, badge: riskBadge(aqi, sensitivity), rationale: `Nearest hour ${data.hourly.time[idx]}` };
}

export async function bestWindow(lat, lon, hours=12, sensitivity) {
  const data = await fetchAirQuality(lat, lon);
  if (!data) return { windows: [] };
  const times = data.hourly.time, aq = data.hourly.us_aqi;
  const thr = 100 - sensOffset(sensitivity);
  const spans=[]; let s=null;
  for(let i=0;i<aq.length;i++){ if(aq[i]<=thr){ if(s===null) s=i; } else if(s!==null){ spans.push([s,i-1]); s=null; } }
  if(s!==null) spans.push([s, aq.length-1]);
  const windows = spans.map(([a,b])=>{
    const slice = aq.slice(a, Math.min(a+Number(hours), b+1)); if(!slice.length) return null;
    const sorted=[...slice].sort((x,y)=>x-y); const med=sorted[Math.floor(sorted.length/2)];
    return { start: times[a], end: times[a+slice.length-1], medianAQI: med };
  }).filter(Boolean);
  return { windows };
}
