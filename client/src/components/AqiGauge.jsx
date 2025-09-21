// Simple semicircle gauge (0..150 -> -90..+90 degrees)
export default function AqiGauge({ aqi = 62, label = "Moderate" }) {
  const clamped = Math.max(0, Math.min(150, aqi));
  const angle = -90 + (clamped / 150) * 180; // -90..+90

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Arc background using conic gradient masked to half circle */}
      <div
        className="aspect-[2/1] rounded-b-[999px] overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(black,black) top/100% 50% no-repeat, linear-gradient(transparent,transparent) bottom/100% 50% no-repeat",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          background:
            "conic-gradient(from 180deg, #10b981 0deg, #facc15 90deg, #f97316 135deg, #ef4444 170deg, #7c3aed 180deg)",
        }}
      />

      {/* Face */}
      <div className="absolute inset-0 flex items-end justify-center pb-6">
        <div className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">{label}</div>
      </div>

      {/* Needle */}
      <div
        className="absolute left-1/2 bottom-[44%] h-[2px] w-[40%] origin-left"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className="h-full w-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.25)]" />
        <div className="absolute -right-2 -top-1 h-3.5 w-3.5 rounded-full bg-white shadow" />
      </div>

      {/* Scale labels */}
      <div className="absolute left-[14%] bottom-3 text-xs text-slate-500">0</div>
      <div className="absolute right-[12%] bottom-3 text-xs text-slate-500">50</div>
    </div>
  );
}
