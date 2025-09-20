import dayjs from 'dayjs';
import { getNow } from './airQuality.service.js';
export async function weekly(store, lat, lon){
  const to=dayjs(), from=to.subtract(7,'day');
  const entries = (await store.listEntries()).filter(e=>dayjs(e.ts).isAfter(from));
  const totals = entries.reduce((a,e)=>({cough:a.cough+(e.cough||0),wheeze:a.wheeze+(e.wheeze||0),breath:a.breath+(e.breath||0)}),
                                {cough:0,wheeze:0,breath:0});
  const aqiContextNow = (lat && lon) ? await getNow(lat, lon, {}) : null;
  return { range:{from:from.toISOString(),to:to.toISOString()}, totals, entries, aqiContextNow };
}
