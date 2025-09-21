import polyline from '@mapbox/polyline';
import dayjs from 'dayjs';
import fetch from 'node-fetch';

function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const s = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function pathLengthMeters(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) total += haversineMeters(coords[i-1], coords[i]);
  return total;
}
function centroid(coords) {
  const s = coords.reduce((acc, p) => ({ lat: acc.lat + p.lat, lon: acc.lon + p.lon }), { lat: 0, lon: 0 });
  return { lat: s.lat / coords.length, lon: s.lon / coords.length };
}
async function fetchHourlyAQI(lat, lon) {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi`;
  const r = await fetch(url);
  const j = await r.json();
  const times = j?.hourly?.time || [];
  const aqi = j?.hourly?.us_aqi || [];
  const map = new Map();
  for (let i = 0; i < times.length; i++) {
    map.set(String(times[i]).slice(0,13), Number(aqi[i] ?? 100)); // "YYYY-MM-DDTHH"
  }
  return map;
}

export async function exposureForEncoded(encoded, departTs) {
  if (!encoded) return 0;
  const coordsRaw = polyline.decode(encoded); // [[lat,lon],...]
  if (!coordsRaw?.length) return 0;
  const coords = coordsRaw.map(([lat, lon]) => ({ lat, lon }));

  const lenM = pathLengthMeters(coords);
  const speed = 4; // m/s
  const durHours = Math.max(0.01, lenM / (speed * 3600));

  const c = centroid(coords);
  const hourly = await fetchHourlyAQI(c.lat, c.lon);

  const start = departTs ? dayjs(Number(departTs)) : dayjs();
  const hoursNeeded = Math.max(1, Math.ceil(durHours));
  let sum = 0;
  for (let i = 0; i < hoursNeeded; i++) {
    const key = start.add(i, 'hour').toISOString().slice(0,13);
    const aqi = hourly.get(key) ?? 100;
    const part = (i === hoursNeeded - 1) ? (durHours - Math.floor(durHours) || 1) : 1;
    sum += aqi * part;
  }
  return Number((sum / hoursNeeded).toFixed(2));
}