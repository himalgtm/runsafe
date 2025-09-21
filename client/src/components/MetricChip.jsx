export default function MetricChip({ label, value, unit, hint, statusClass = "text-emerald-400" }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className={`text-lg font-semibold ${statusClass}`}>{value}{unit && <span className="text-sm text-neutral-400 ml-1">{unit}</span>}</div>
        {hint && <div className="text-[10px] text-neutral-400">{hint}</div>}
      </div>
    </div>
  );
}
