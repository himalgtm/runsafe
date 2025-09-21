export default function Badges({ pm25, pm10, o3, no2, smoke }) {
  const Item = ({ label, value, unit }) => (
    <div className="px-3 py-1.5 rounded-full text-xs border border-white/15 bg-white/8">
      <span className="opacity-80">{label}</span>{" "}
      <b className="font-semibold">{value ?? "—"}</b>{unit ? ` ${unit}` : ""}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2">
      <Item label="PM2.5" value={pm25} unit="µg/m³" />
      <Item label="PM10"  value={pm10} unit="µg/m³" />
      <Item label="O₃"    value={o3}   unit="ppb" />
      <Item label="NO₂"   value={no2}  unit="ppb" />
      {smoke?.present && (
        <div className="px-3 py-1.5 rounded-full text-xs border border-amber-400/40 bg-amber-400/10 text-amber-200">
          Wildfire smoke{smoke.source ? ` · ${smoke.source}` : ""}
        </div>
      )}
    </div>
  );
}
