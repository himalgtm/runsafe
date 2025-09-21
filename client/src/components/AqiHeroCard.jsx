import AqiGauge from "./AqiGauge";

function Chip({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 shadow-sm">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default function AqiHeroCard({
  city = "Denton, TX",
  aqi = 74,
  pollutant = "PM2.5",
  updated = "2:59 AM",
  forecast = "Moderate",
  today = "USG",
  tomorrow = "Moderate",
}) {
  const label =
    aqi <= 50 ? "Good" : aqi <= 100 ? "Moderate" : aqi <= 150 ? "USG" : aqi <= 200 ? "Unhealthy" : "Very Unhealthy";

  return (
    <div className="rounded-[28px] bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 md:p-8 shadow-xl border border-slate-700/30">
      {/* Search box */}
      <div className="flex items-center gap-3">
        <input
          placeholder="ZIP Code, City, or State"
          className="w-full md:w-[420px] rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 outline-none placeholder:text-slate-300/70"
        />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6 items-center">
        {/* Gauge */}
        <AqiGauge aqi={aqi} label={label} />

        {/* Right side stats */}
        <div>
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{city}</div>
          <div className="text-slate-300 mt-1">Local Reporting Area</div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-6">
              <div className="text-4xl font-extrabold">{aqi}</div>
              <div className="text-sm">
                <div className="font-medium">NowCast AQI</div>
                <div className="text-slate-300 mt-1">{pollutant}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-300">Current Air Quality {updated}</div>
          </div>

          {/* Chips row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <Chip title="Forecast AQI" value={forecast} />
            <Chip title="Today" value={today} />
            <Chip title="Tomorrow" value={tomorrow} />
          </div>
        </div>
      </div>
    </div>
  );
}
