export default function RadonCard({ radonZone }) {
  if (!radonZone) return null;
  const tone = radonZone === "High" ? "text-rose-300 border-rose-400/30 bg-rose-400/10"
              : radonZone === "Moderate" ? "text-amber-200 border-amber-400/30 bg-amber-400/10"
              : "text-emerald-200 border-emerald-400/30 bg-emerald-400/10";

  return (
    <div className={`mt-4 rounded-2xl border ${tone} p-4`}>
      <div className="text-sm font-semibold">Radon context</div>
      <div className="text-sm mt-1">
        Your county is classified <b>{radonZone}</b> radon zone.
        Consider a home radon test if not already done.
      </div>
    </div>
  );
}
