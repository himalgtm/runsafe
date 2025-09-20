import { AQI_LABELS } from '../config/constants.js';
export const sensOffset = s => (s?.asthma||s?.child||s?.elderly||s?.cardio||s?.pregnant) ? 25 : 0;
export function riskBadge(aqi, s) {
  const off = sensOffset(s);
  for (const band of AQI_LABELS) if (aqi <= (band.max - off)) return { label: band.label, color: band.color };
  return { label:'Hazardous', color:'#7f1d1d' };
}
