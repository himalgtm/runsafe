import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Chip from "../components/Chip.jsx";
import AqiGauge from "../components/AqiGauge.jsx";
import SavedPlaces from "../components/SavedPlaces.jsx";
import { loadProfile } from "../utils/profile.js";
import { quickAQI, classifyAQI, rationaleOneLine, bestWindows } from "../utils/air.js";

export default function Home(){
  const [loc, setLoc] = useState(null); // {lat, lon}
  const [aqi, setAqi] = useState(62);
  const [pol, setPol] = useState({ pm25: 0, pm10: 0, o3: 0, no2: 0 });
  const [updatedAt, setUpdatedAt] = useState(null);
  const [hourlyAQI, setHourlyAQI] = useState([]);
  const profile = loadProfile();

  // Geolocate once
  useEffect(()=>{
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({coords}) => setLoc({ lat: coords.latitude, lon: coords.longitude }),
      () => setLoc({ lat: 29.7174, lon: -95.4018 }) // fallback: Rice Univ
    );
  },[]);

  // Fetch Open-Meteo when we have location
  useEffect(()=>{
    if (!loc) return;
    (async ()=>{
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.lat}&longitude=${loc.lon}&hourly=pm2_5,pm10,ozone,no2&timezone=auto`;
      const data = await fetch(url).then(r=>r.json());

      const hour = new Date().toISOString().slice(0,13); // "YYYY-MM-DDTHH"
      const idx  = data.hourly.time.findIndex(t => t.startsWith(hour));
      const pm25 = data.hourly.pm2_5[idx];
      const pm10 = data.hourly.pm10[idx];
      const o3   = data.hourly.ozone[idx];
      const no2  = data.hourly.no2[idx];

      const aqiNow = Math.round(quickAQI(pm25, o3, no2));
      setAqi(aqiNow);
      setPol({ pm25, pm10, o3, no2 });
      setUpdatedAt(new Date());

      const hours  = data.hourly.time.slice(idx, idx+12);
      const series = hours.map((_, k) => quickAQI(
        data.hourly.pm2_5[idx+k],
        data.hourly.ozone[idx+k],
        data.hourly.no2[idx+k]
      ));
      setHourlyAQI(series);
    })();
  },[loc]);

  const status  = useMemo(()=> classifyAQI(aqi, profile), [aqi, profile]);
  const why     = useMemo(()=> rationaleOneLine(aqi, pol, false), [aqi, pol]);
  const windows = useMemo(()=> bestWindows(hourlyAQI, 12), [hourlyAQI]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-sky-50 via-blue-100 to-white">
      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">

        {/* =================== HERO PANEL =================== */}
        <section className="rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-gradient-to-br from-[#0f1a2b] to-[#0c1524]">
          <div className="relative grid lg:grid-cols-2 gap-0">
            {/* subtle blue flare bg */}
            <div className="absolute inset-0 pointer-events-none opacity-60"
              style={{ background: "radial-gradient(1200px 600px at 65% 10%, rgba(59,130,246,.25), transparent 55%)" }}
            />

            {/* LEFT: gauge, centered with padding */}
            <div className="relative p-6 md:p-10 flex items-center justify-center">
              <div className="w-full max-w-[520px]">
                <AqiGauge aqi={aqi} />
              </div>
            </div>

            {/* RIGHT: location + stats */}
            <div className="relative p-6 md:p-10">
              {/* search input */}
              <input
                className="w-full max-w-md rounded-2xl bg-white/10 text-white/90 placeholder:text-slate-300 px-4 py-3 outline-none ring-1 ring-white/15 focus:ring-2 focus:ring-sky-400"
                placeholder="ZIP Code, City, or State"
              />

              <h1 className="mt-6 leading-tight text-white font-extrabold tracking-tight">
                <span className="block text-3xl sm:text-4xl md:text-5xl">Your</span>
                <span className="block text-3xl sm:text-4xl md:text-5xl">Location</span>
              </h1>
              <div className="text-slate-300 mt-1">Local Reporting Area</div>

              {/* stats card */}
              <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 text-white max-w-md">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 items-center">
                  <div className="text-2xl font-bold">{aqi}</div>
                  <div className="text-slate-300">NowCast AQI</div>

                  <div className="h-px col-span-2 bg-white/10 my-2" />

                  <div className="font-semibold">PM2.5</div>
                  <div className="text-slate-300">|  {Math.round(pol.pm25 || 0)}</div>

                  <div className="font-semibold">O₃</div>
                  <div className="text-slate-300">|  {Math.round(pol.o3 || 0)}</div>

                  <div className="font-semibold">NO₂</div>
                  <div className="text-slate-300">|  {Math.round(pol.no2 || 0)}</div>

                  <div className="h-px col-span-2 bg-white/10 my-2" />

                  <div className="text-xs text-slate-300 col-span-2">
                    Current Air Quality{" "}
                    <span className="font-semibold">
                      {updatedAt ? updatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* badges + rationale */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Chip className="bg-indigo-100 text-indigo-800">{status}</Chip>
                {profile?.__active && (
                  <Chip className="bg-rose-100 text-rose-700">Sensitive profile</Chip>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-200/90 max-w-md">{why}</p>

              {/* tiny forecast tiles */}
              <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
                <Tile title="Forecast AQI" value={status} />
                <Tile title="Today" value="USG" />
                <Tile title="Tomorrow" value="Moderate" />
              </div>
            </div>
          </div>
        </section>

        {/* =================== BEST TIME =================== */}
        <Card title="Best time today" className="border-t-4 border-emerald-400">
          <div className="flex flex-wrap gap-2">
            {windows.length ? windows.map((w,i)=>(
              <Chip key={i} className="bg-gradient-to-r from-emerald-200 to-emerald-400 text-emerald-900 shadow">
                {w.label} • med {Math.round(w.median)}
              </Chip>
            )) : <div className="text-sm text-slate-500">Fetching outlook…</div>}
          </div>
        </Card>

        {/* =================== SAVED PLACES =================== */}
        <SavedPlaces />
      </main>
    </div>
  );
}

function Tile({ title, value }){
  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white">
      <div className="text-[11px] uppercase tracking-wide text-slate-300">{title}</div>
      <div className="text-lg font-semibold mt-0.5">{value}</div>
    </div>
  );
}
