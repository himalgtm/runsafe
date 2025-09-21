import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

/**
 * useLiveAQI({ lat, lon, refreshMs, enabled })
 * Calls your server: GET /air/now?lat=<>&lon=<>
 * Expected JSON (adjust mapping if your fields are different):
 * {
 *   aqi: number, pm25?: number, pm10?: number, o3?: number, no2?: number,
 *   forecastLabel?: string, todayLabel?: string, tomorrowLabel?: string,
 *   updatedAt?: number|ISO, city?: string
 * }
 */
export default function useLiveAQI({ lat, lon, refreshMs = 300000, enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tick = useRef(null);

  const fetchNow = async () => {
    if (!enabled || lat == null || lon == null) return;
    setLoading(true); setError(null);
    try {
      const res = await api(`/api/air/now?lat=${lat}&lon=${lon}`);
      // normalize if server uses different keys
     setData({
  aqi: res.aqi ?? res.aqiNowcast ?? null,
  pm25: res.pm25, pm10: res.pm10, o3: res.o3, no2: res.no2,
  smoke: res.smoke ?? null,             // { present:boolean, source?:string, density?:number }
  radonZone: res.radonZone ?? null,     // "Low" | "Moderate" | "High"
  station: res.station ?? null,         // monitoring site id/name (optional)
  forecastLabel: res.forecastLabel ?? res.forecast,
  todayLabel: res.todayLabel ?? res.today,
  tomorrowLabel: res.tomorrowLabel ?? res.tomorrow,
  updatedAt: res.updatedAt ?? res.timestamp ?? Date.now(),
  city: res.city ?? res.place ?? res.location_name ?? "Here & Now",
});

    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNow(); // first fetch
    if (enabled && lat != null && lon != null) {
      tick.current = setInterval(fetchNow, refreshMs);
      return () => clearInterval(tick.current);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, enabled, refreshMs]);

  return { data, loading, error, refresh: fetchNow };
}
