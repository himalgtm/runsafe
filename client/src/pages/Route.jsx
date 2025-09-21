/* eslint-disable no-undef */
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { api } from "../services/api";

const GMAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const COLORS = ["#10b981", "#60a5fa", "#f59e0b", "#9ca3af"]; // best → others

export default function RoutePage() {
  const mapRef = useRef(null);
  const map = useRef(null);
  const svc = useRef(null);
  const renderers = useRef([]);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]); // [{i, route, exposure}]
  const [selected, setSelected] = useState(0);
  const [origin, setOrigin] = useState("Rice University, Houston, TX");
  const [destination, setDestination] = useState("Houston Zoo, Houston, TX");
  const [travelMode, setTravelMode] = useState("WALKING");

  // Load Google Maps
  useEffect(() => {
    const loader = new Loader({ apiKey: GMAPS_KEY, version: "weekly", libraries: ["places"] });
    loader.load().then(() => {
      map.current = new google.maps.Map(mapRef.current, { center: { lat: 29.717, lng: -95.401 }, zoom: 13 });
      svc.current = new google.maps.DirectionsService();
    });
  }, []);

  const clearRenderers = () => {
    renderers.current.forEach((r) => r.setMap(null));
    renderers.current = [];
  };

  const drawRoutes = (dirResult, ranked) => {
    clearRenderers();
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
    });
  };

  // Get alternatives → score via backend → render ranked
  const findRoutes = async () => {
    if (!svc.current) return;
    setLoading(true);
    setRoutes([]);
    setSelected(0);

    try {
      const resp = await svc.current.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode[travelMode],
        provideRouteAlternatives: true,
      });

      const now = Date.now();
      const payload = {
        routes: resp.routes.map((r) => ({
          encoded: r.overview_polyline.points,
          departTs: now,
        })),
      };

      const scored = await api("/api/route/exposure/batch", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const merged = resp.routes.map((r, i) => {
        const exposure = scored.results.find((x) => x.i === i)?.exposure ?? Number.POSITIVE_INFINITY;
        return { i, route: r, exposure };
      });

      merged.sort((a, b) => a.exposure - b.exposure);
      setRoutes(merged);
      drawRoutes(resp, merged);
    } catch (e) {
      console.error(e);
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

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[radial-gradient(900px_600px_at_10%_0%,#e9d5ff33,transparent),radial-gradient(900px_600px_at_90%_0%,#a7f3d033,transparent)]">
      <main className="mx-auto max-w-6xl px-4 py-6 flex gap-6">
        {/* Left controls */}
        <div className="w-96 p-4 space-y-4 rounded-2xl border bg-white">
          <h1 className="text-lg font-semibold">Cleanest Route</h1>
          <div className="space-y-2">
            <label className="text-sm">Origin</label>
            <input className="w-full border rounded p-2" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            <label className="text-sm">Destination</label>
            <input className="w-full border rounded p-2" value={destination} onChange={(e) => setDestination(e.target.value)} />
            <div className="flex gap-2">
              <select className="border rounded p-2" value={travelMode} onChange={(e) => setTravelMode(e.target.value)}>
                <option value="WALKING">Walking</option>
                <option value="BICYCLING">Bicycling</option>
                <option value="DRIVING">Driving</option>
              </select>
              <button onClick={findRoutes} disabled={loading} className="px-3 py-2 bg-black text-white rounded">
                {loading ? "Scoring…" : "Find routes"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-medium">Alternatives</h2>
            {!routes.length && <p className="text-sm text-gray-500">No routes yet</p>}
            <ul className="space-y-2">
              {routes.map((r, idx) => (
                <li key={r.i}>
                  <button
                    onClick={() => choose(idx)}
                    className={`w-full text-left p-2 rounded border ${
                      idx === selected ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">Route {String.fromCharCode(65 + r.i)}</span>
                      <span className="text-xs">exposure {r.exposure?.toFixed?.(2) ?? "—"}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(r.route.legs[0].distance.value / 1000)} km •{" "}
                      {Math.round(r.route.legs[0].duration.value / 60)} min
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2">
            <button onClick={coach} className="px-3 py-2 rounded border w-full">
              Run Coach (AI)
            </button>
          </div>

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
