import AQIBar from "./AQIBar.jsx";
import MetricChip from "./MetricChip.jsx";
import { ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { classifyNow } from "../utils/aqi.js";

export default function RiskCard({ now, profile }) {
  const status = classifyNow(now, profile);
  const Icon = status.level === "Good" ? CheckCircle2 : status.level === "Caution" ? AlertTriangle : ShieldAlert;
  const color =
    status.level === "Good" ? "bg-emerald-500/10 text-emerald-400 border-emerald-700/30" :
    status.level === "Caution" ? "bg-amber-500/10 text-amber-400 border-amber-700/30" :
    "bg-rose-500/10 text-rose-400 border-rose-700/30";

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 ${color}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{status.level}</span>
      </div>
      <p className="text-sm text-neutral-300">{status.reason}</p>

      <div className="mt-4"><AQIBar aqi={now?.aqi ?? 42} /></div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MetricChip label="PM2.5" value={now?.pm25 ?? 8} unit="µg/m³" hint="24h avg-ish" />
        <MetricChip label="PM10"  value={now?.pm10 ?? 18} unit="µg/m³" />
        <MetricChip label="O₃"    value={now?.o3 ?? 31} unit="ppb" />
        <MetricChip label="NO₂"   value={now?.no2 ?? 12} unit="ppb" />
      </div>
    </section>
  );
}
