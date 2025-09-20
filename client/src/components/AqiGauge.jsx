import React, { useMemo } from "react";

/**
 * EPA-style semicircle AQI gauge with bands + needle + center label.
 * Props:
 *  - aqi (0–500)
 *  - pollutant ("PM2.5", "O3", etc.)
 *  - updated (Date object or string)
 *  - city ("Denton, TX")
 */
export default function AqiGauge({ aqi = 74, pollutant = "PM2.5", updated, city }) {
  const meta = useMemo(() => aqiMeta(aqi), [aqi]);

  // semicircle from -100° to +100°
  const minDeg = -100, maxDeg = 100;
  const clamped = Math.max(0, Math.min(500, aqi));
  const needleDeg = minDeg + (clamped / 500) * (maxDeg - minDeg);

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl">
      {/* Blue flare background like EPA */}
      <div className="absolute inset-0 pointer-events-none opacity-60"
           style={{ background: "radial-gradient(1200px 600px at 70% 20%, rgba(59,130,246,.35), transparent 50%)" }} />

      <div className="relative grid md:grid-cols-2 gap-8 p-6">
        {/* LEFT: gauge */}
        <div className="flex items-center justify-center">
          <svg viewBox="0 0 600 360" className="w-[520px] max-w-full">
            {/* semicircle background */}
            <path d="M40,320 A260,260 0 0,1 560,320" fill="#0b1220" stroke="none" />
            {/* colored bands */}
            {bands.map((b, i) => (
              <Band key={i} degStart={degFor(b.start)} degEnd={degFor(b.end)} color={b.color} />
            ))}

            {/* tick labels */}
            {ticks.map((t, i) => (
              <Tick key={i} value={t} />
            ))}

            {/* center dome panel */}
            <path d="M100,320 A200,200 0 0,1 500,320" fill={meta.fill} stroke="#fff" strokeOpacity=".1" strokeWidth="4" />

            {/* needle */}
            <g transform={`rotate(${needleDeg} 300 320)`}>
              <polygon points="300,320 285,200 315,200" fill="#fff" />
              <circle cx="300" cy="320" r="12" fill="#fff" />
            </g>

            {/* center text */}
            <text x="300" y="242" textAnchor="middle" fontSize="60" fontWeight="800" fill="#111827">{meta.label}</text>
          </svg>
        </div>

        {/* RIGHT: location + numbers */}
        <div className="flex flex-col justify-center">
          <div className="mb-2">
            <input
              className="w-full max-w-sm rounded-xl bg-slate-700/50 px-4 py-2 text-sm placeholder:text-slate-300 outline-none ring-1 ring-slate-600 focus:ring-2 focus:ring-sky-400"
              placeholder="ZIP Code, City, or State"
            />
          </div>
          <div className="text-3xl font-extrabold tracking-tight">{city || "Your Location"}</div>
          <div className="text-slate-300 mb-4">Local Reporting Area</div>

          {/* details strip */}
          <div className="rounded-xl bg-slate-900/50 ring-1 ring-white/10 p-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="text-lg font-bold">{aqi}</div>
            <div className="text-slate-300 text-sm">NowCast AQI</div>
            <div className="h-5 w-px bg-white/10" />
            <div className="text-sm"><span className="font-semibold">{pollutant}</span></div>
            <div className="h-5 w-px bg-white/10" />
            <div className="text-xs text-slate-300">
              Current Air Quality&nbsp;
              <span className="font-semibold">{formatTime(updated)}</span>
            </div>
          </div>

          {/* forecast chips */}
          <div className="mt-4 grid grid-cols-3 max-w-md gap-3">
            <Forecast title="Forecast AQI" value={meta.badge} />
            <Forecast title="Today" value={meta.todayBadge} />
            <Forecast title="Tomorrow" value="Moderate" />
          </div>
        </div>
      </div>
    </div>
  );

  function degFor(val){ // map AQI value to degree on semicircle
    return minDeg + (val / 500) * (maxDeg - minDeg);
  }
}

function Band({ degStart, degEnd, color }){
  // draw arc segment as thick stroke
  const r = 260, cx = 300, cy = 320, w = 40;
  const s = polar(cx, cy, r, degStart), e = polar(cx, cy, r, degEnd);
  const large = Math.abs(degEnd - degStart) > 180 ? 1 : 0;
  const path = `
    M ${s.x} ${s.y}
    A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}
  `;
  return <path d={path} stroke={color} strokeWidth={w} strokeLinecap="butt" fill="none" />;
}

function Tick({ value }){
  const deg = -100 + (value/500)*200;
  const inner = polar(300, 320, 230, deg);
  const outer = polar(300, 320, 250, deg);
  const label = polar(300, 320, 205, deg);
  return (
    <g>
      <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#cbd5e1" strokeWidth="3" />
      <text x={label.x} y={label.y} fill="#cbd5e1" fontSize="18" textAnchor="middle" dominantBaseline="middle">{value}</text>
    </g>
  );
}

function polar(cx, cy, r, deg){
  const rad = (Math.PI/180)*(deg+90);
  return { x: cx + r*Math.cos(rad), y: cy + r*Math.sin(rad) };
}

const bands = [
  { start:   0, end:  50, color: "#16a34a" }, // green
  { start:  50, end: 100, color: "#facc15" }, // yellow
  { start: 100, end: 150, color: "#f97316" }, // orange
  { start: 150, end: 200, color: "#ef4444" }, // red
  { start: 200, end: 300, color: "#a855f7" }, // purple
  { start: 300, end: 500, color: "#7f1d1d" }, // maroon
];

const ticks = [50,100,150,200,300];

function aqiMeta(aqi){
  if (aqi <= 50)  return { label:"Good", fill:"#bef264", badge:"Good", todayBadge:"Good" };
  if (aqi <= 100) return { label:"Moderate", fill:"#fde047", badge:"Moderate", todayBadge:"USG" };
  if (aqi <= 150) return { label:"USG", fill:"#fdba74", badge:"USG", todayBadge:"USG" }; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return { label:"Unhealthy", fill:"#fca5a5", badge:"Unhealthy", todayBadge:"Unhealthy" };
  if (aqi <= 300) return { label:"Very Unhealthy", fill:"#d8b4fe", badge:"Very Unhealthy", todayBadge:"Very Unhealthy" };
  return { label:"Hazardous", fill:"#fecaca", badge:"Hazardous", todayBadge:"Hazardous" };
}

function Forecast({ title, value }){
  return (
    <div className="rounded-xl bg-slate-900/40 ring-1 ring-white/10 p-4">
      <div className="text-xs text-slate-300">{title}</div>
      <div className="mt-1 text-white font-semibold">{value}</div>
    </div>
  );
}

function formatTime(t){
  const d = t ? new Date(t) : new Date();
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
