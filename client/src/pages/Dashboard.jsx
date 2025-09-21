/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react";
import AqiHeroCard from "../components/AqiHeroCard";
import Badges from "../components/Badges";
import RadonCard from "../components/RadonCard";
import Outlook from "../components/Outlook";
import SavedPlaces from "../components/SavedPlaces";
import useLiveAQI from "../hooks/useLiveAQI.js"; // keep .js to avoid path issues

export default function Dashboard() {
  const [coord, setCoord] = useState(null); // { lat, lon }
  const [city, setCity] = useState("Here & Now");
  const watchId = useRef(null);

  // GPS watch
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => setCoord({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {}, // non-blocking; users can select Saved Places
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );
    return () => {
      if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
    };
  }, []);

  const { data: now, loading, error } = useLiveAQI({
    lat: coord?.lat,
    lon: coord?.lon,
    refreshMs: 300000, // 5 min
    enabled: !!coord,
  });

  useEffect(() => {
    if (now?.city) setCity(now.city);
  }, [now?.city]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff,transparent_40%),radial-gradient(1200px_700px_at_20%_-10%,#e9d5ff40,transparent),radial-gradient(1200px_700px_at_90%_10%,#a7f3d040,transparent)] font-sans">
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <AqiHeroCard
          showSearch={false}
          city={city}
          aqi={now?.aqi ?? 0}
          pollutant={now?.pm25 != null ? "PM2.5" : now?.pm10 != null ? "PM10" : "AQI"}
          updated={
            now?.updatedAt
              ? new Date(now.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
              : "—"
          }
          forecast={now?.forecastLabel ?? "—"}
          today={now?.todayLabel ?? "—"}
          tomorrow={now?.tomorrowLabel ?? "—"}
        />

        {loading && <p className="text-sm text-slate-600">Updating air quality…</p>}
        {error && <p className="text-sm text-rose-600">Couldn’t fetch AQI. Check server URL & CORS.</p>}

        {now && (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur space-y-4">
            <Badges pm25={now.pm25} pm10={now.pm10} o3={now.o3} no2={now.no2} smoke={now.smoke} />
            <Outlook lat={coord?.lat} lon={coord?.lon} hours={12} />
            <RadonCard radonZone={now.radonZone} />
          </section>
        )}

        <section className="mt-2">
          <SavedPlaces
            onPick={(place) => {
              if (place?.lat != null && place?.lon != null) {
                setCoord({ lat: place.lat, lon: place.lon });
                if (place?.name) setCity(place.name);
              }
            }}
          />
        </section>
      </main>
    </div>
  );
}
