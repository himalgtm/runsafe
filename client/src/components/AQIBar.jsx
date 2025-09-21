import cn from "../utils/classnames";
const bands = [
  { label: "Good", min: 0, max: 50, color: "bg-emerald-500" },
  { label: "Moderate", min: 51, max: 100, color: "bg-yellow-500" },
  { label: "Unhealthy (SG)", min: 101, max: 150, color: "bg-orange-500" },
  { label: "Unhealthy", min: 151, max: 200, color: "bg-red-500" },
  { label: "Very Unhealthy", min: 201, max: 300, color: "bg-fuchsia-600" },
  { label: "Hazardous", min: 301, max: 500, color: "bg-purple-900" },
];
export default function AQIBar({ aqi = 42 }) {
  const pct = Math.min(100, (aqi / 500) * 100);
  return (
    <div className="w-full">
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        {bands.map((b) => (
          <div key={b.label} className={cn("h-full", b.color)} style={{ width: `${(b.max - b.min + 1) / 5}%` }} />
        ))}
      </div>
      <div className="relative mt-2 h-6">
        <div className="absolute -translate-x-1/2 -top-2 text-xs bg-neutral-800 text-white px-2 py-0.5 rounded-full shadow" style={{ left: `${pct}%` }}>
          AQI {aqi}
        </div>
      </div>
    </div>
  );
}
