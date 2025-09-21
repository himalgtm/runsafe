import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Outlook({ lat, lon, hours = 12 }) {
  const [data, setData] = useState([]); // [{ts, aqi}]
  useEffect(() => {
    if (lat == null || lon == null) return;
    api(`/api/air/outlook?lat=${lat}&lon=${lon}&hours=${hours}`).then((r) => {
      setData(r?.hours || []);
    }).catch(()=>{});
  }, [lat, lon, hours]);

  if (!data.length) return null;

  const W = 320, H = 70, pad = 6;
  const max = Math.max(...data.map(d => d.aqi || 0), 100);
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad*2);
    const y = H - pad - ((d.aqi || 0) / max) * (H - pad*2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs opacity-80 mb-1">Next {hours}h outlook (AQI)</div>
      <svg width={W} height={H} className="text-emerald-300/90">
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}
