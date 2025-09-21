/* eslint-disable no-undef */
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { api } from "../services/api";

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const COLORS = ["#10b981", "#60a5fa", "#f59e0b", "#9ca3af"]; // best → others

export default function RoutePage() {
  const mapRef = useRef(null);
  const map = useRef(null);
  const directions = useRef(null);
  const renderers = useRef([]);
  const markers = useRef([]); // midpoint markers

  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]); // [{ i, route, exposure, mid }]
  const [selected, setSelected] = useState(0);

  const [origin, setOrigin] = useState("Rice University, Houston, TX");
  const [destination, setDestination] = useState("Houston Zoo, Houston, TX");
  const [travelMode, setTravelMode] = useState("WALKING");

  // ---------- Google Maps boot ----------
  useEffect(() => {
    if (!GMAPS_KEY) {
      alert("Missing VITE_GOOGLE_MAPS_API_KEY in your client/.env");
      return;
    }
    const loader = new Loader({
      apiKey: GMAPS_KEY,
      version: "weekly",
      libraries: ["places"],
    });
    loader.load().then(() => {
      map.current = new google.maps.Map(mapRef.current, {
        center: { lat: 29.717, lng: -95.401 },
        zoom: 13,
      });
      directions.current = new google.maps.DirectionsService();
    });
  }, []);

  // ---------- helpers ----------
  const clearRenderers = () => {
    renderers.current.forEach(r => r.setMap(null));
    renderers.current = [];
  };

  const clearMarkers = () => {
    markers.current.forEach(m => m.setMap(null));
    markers.current = [];
  };

  const drawRoutes = (dirResult, ranked) => {
    clearRenderers();
    clearMarkers();

    ranked.forEach((item, rankIdx) => {
      const renderer = new google.maps.DirectionsRenderer({
        map: map.current,
        directions: dirResult,
        routeIndex: item.i,
        suppressMarkers: false,
        preserveViewport: false,
        polylineOptions: {
          strokeColor: COLORS[rankIdx] || COLORS.at(-1),
          strokeOpacity: 0.95,
          strokeWeight: rankIdx === 0 ? 7 : 4,
        },
      });
      renderers.current.push(renderer);

      // Draw midpoint marker
      if (item.mid) {
        const marker = new google.maps.Marker({
          position: { lat: item.mid.lat, lng: item.mid.lon },
          map: map.current,
          label: String.fromCharCode(65 + item.i), // A, B, C...
        });
        markers.current.push(marker);
      }
    });
  };

  // Try to read an encoded polyline from either v3 or v2 shapes
  const encodedFromRoute = (r) =>
    r?.overview_polyline?.points ??
    r?.overviewPolyline?.encodedPolyline ??
    "";

  // Midpoint helper
  function midpointLatLng(path) {
    if (!path?.length) return null;
    const mid = Math.floor(path.length / 2);
    const midLatLng = path[mid];
    return {
      lat: midLatLng.lat(),
      lon: midLatLng.lng(),
    };
  }

  // ---------- main action ----------
  const findRoutes = async () => {
    if (!directions.current) return;
    setLoading(true);
    setRoutes([]);
    setSelected(0);

    try {
      // 1) get alternatives from Google
      const dirResult = await directions.current.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode[travelMode],
        provideRouteAlternatives: true,
      });

      const googleRoutes = dirResult?.routes ?? [];
      if (!googleRoutes.length) {
        alert("No routes returned by Google Maps.");
        return;
      }

      // 2) prepare payload: polyline + midpoint
      const payload = googleRoutes.map((r, i) => {
        const encoded = encodedFromRoute(r);
        const mid = midpointLatLng(r.overview_path);
        return {
          i,
          polyline: encoded,
          lat: mid?.lat,
          lon: mid?.lon,
        };
      });

      const scored = await api("/api/ai/coach", {
        method: "POST",
        body: { routes: payload },
      });

      // The backend may return {scores:[{i,exposure}]} or {results:[...]}.
      const scores = scored?.scores || scored?.results || [];
      const byIndex = new Map(
        scores.map(s => [s.i ?? s.index ?? 0, s.exposure ?? s.score ?? Infinity])
      );

      // 3) merge & rank
      const merged = googleRoutes.map((r, i) => {
        const mid = payload[i];
        return {
          i,
          route: r,
          exposure: byIndex.get(i) ?? Infinity,
          mid: { lat: mid.lat, lon: mid.lon },
        };
      });
      merged.sort((a, b) => a.exposure - b.exposure);

      setRoutes(merged);
      drawRoutes(dirResult, merged);
    } catch (err) {
      console.error(err);
      alert("Failed to get routes. Check API key & server.");
    } finally {
      setLoading(false);
    }
  };

  const best = useMemo(() => routes[0], [routes]);

  const choose = (idx) => {
    setSelected(idx);
    renderers.current.forEach((r, i) => {
      const color = i === idx ? COLORS[0] : COLORS[i + 1] || COLORS.at(-1);
      r.setOptions({
        polylineOptions: {
          strokeColor: color,
          strokeOpacity: 0.95,
          strokeWeight: i === idx ? 7 : 4,
        },
      });
    });
  };

  const coach = async () => {
    try {
      const pos = map.current.getCenter();
      const qs = new URLSearchParams({
        lat: pos.lat().toString(),
        lon: pos.lng().toString(),
        hours: "12",
        distanceKm: "5",
      }).toString();
      const res = await api(`/api/ai/coach?${qs}`);
      alert(res.plan || "No plan");
    } catch (e) {
      console.error(e);
      alert("Coach unavailable");
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[radial-gradient(900px_600px_at_10%_0%,#e9d5ff33,transparent),radial-gradient(900px_600px_at_90%_0%,#a7f3d033,transparent)]">
      <main className="mx-auto max-w-6xl px-4 py-6 flex gap-6">
        {/* Left controls */}
        <div className="w-96 p-4 space-y-4 rounded-2xl border bg-white">
          <h1 className="text-lg font-semibold">Cleanest Route</h1>

          <div className="space-y-2">
            <label className="text-sm">Origin</label>
            <input className="w-full border rounded p-2"
              value={origin} onChange={(e) => setOrigin(e.target.value)} />
            <label className="text-sm">Destination</label>
            <input className="w-full border rounded p-2"
              value={destination} onChange={(e) => setDestination(e.target.value)} />
            <div className="flex gap-2">
              <select className="border rounded p-2"
                value={travelMode}
                onChange={(e) => setTravelMode(e.target.value)}>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
                <option value="DRIVING">Driving</option>
              </select>
              <button onClick={findRoutes} disabled={loading}
                className="px-3 py-2 bg-black text-white rounded">
                {loading ? "Scoring…" : "Find routes"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium">Alternatives</h2>
            {!routes.length && <p className="text-sm text-gray-500">No routes yet</p>}
            <ul className="space-y-2">
              {routes.map((r, idx) => {
                const isBest = idx === 0;
                const isWorst = idx === routes.length - 1;
                return (
                  <li key={r.i}>
                    <button
                      onClick={() => choose(idx)}
                      className={`w-full text-left p-2 rounded border ${
                        idx === selected
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-2">
                          Route {String.fromCharCode(65 + r.i)}
                          {isBest && (
                            <span className="text-green-600 font-bold">↑ Good</span>
                          )}
                          {isWorst && (
                            <span className="text-red-600 font-bold">✕ Bad</span>
                          )}
                        </span>
                        <span className="text-xs">
                          exposure {Number.isFinite(r.exposure) ? r.exposure.toFixed(2) : "—"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(r.route.legs?.[0]?.distance?.value / 1000)} km •{" "}
                        {Math.round(r.route.legs?.[0]?.duration?.value / 60)} min
                      </div>
                      {r.mid && (
                        <div className="text-xs text-gray-400">
                          Midpoint: {r.mid.lat.toFixed(4)}, {r.mid.lon.toFixed(4)}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* <div className="pt-2">
            <button onClick={coach} className="px-3 py-2 rounded border w-full">
              Run Coach (AI)
            </button>
          </div> */}

          {best && <p className="text-xs text-gray-500 pt-2">Best route is highlighted in green.</p>}
        </div>

        {/* Map */}
        <div className="flex-1 rounded-2xl overflow-hidden border bg-white">
          <div ref={mapRef} className="w-full h-[calc(100vh-120px)]" />
        </div>
      </main>
    </div>
  );
}
