const base = {
  pm25: { good: 12, caution: 35 },
  pm10: { good: 50, caution: 150 },
  o3:   { good: 70, caution: 100 },
  no2:  { good: 30, caution: 53 },
  aqi:  { good: 50, caution: 100 },
};
const tighten = (v, f = 0.8) => ({ good: Math.round(v.good * f), caution: Math.round(v.caution * f) });

export function classifyNow(now, profile = {}) {
  if (!now) return { level: "Good", reason: "Waiting for data…" };
  const sensitive = !!(profile.asthma || profile.cardio || profile.pregnant || profile.child || profile.older);
  const T = sensitive
    ? { pm25: tighten(base.pm25), pm10: tighten(base.pm10), o3: tighten(base.o3), no2: tighten(base.no2), aqi: tighten(base.aqi) }
    : base;

  const flags = [];
  const check = (label, val, thr) => {
    if (val == null) return;
    if (val <= thr.good) return;
    if (val <= thr.caution) flags.push(`${label} elevated`); else flags.push(`${label} high`);
  };
  check("PM2.5", now.pm25, T.pm25);
  check("PM10",  now.pm10, T.pm10);
  check("O₃",    now.o3,   T.o3);
  check("NO₂",   now.no2,  T.no2);
  check("AQI",   now.aqi,  T.aqi);

  if (!flags.length) {
    return { level: "Good", reason: sensitive ? "Air is OK for sensitive groups with caution." : "Air is good for outdoor activity." };
  }
  const severe = flags.some(f => /high$/.test(f));
  return {
    level: severe ? "Avoid" : "Caution",
    reason: severe ? `Unhealthy now: ${flags.join(", ")}.` : `Moderate: ${flags.join(", ")}. Consider shorter outdoor time.`,
  };
}
