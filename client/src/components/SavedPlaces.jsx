import { useEffect, useState } from "react";
import { api } from "../services/api";

const KEY = "runsafe_places"; // [{id,name,lat,lon}]

function load() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } }
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export default function SavedPlaces({ onPick }) {
  const [places, setPlaces] = useState(load());
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [preview, setPreview] = useState(null);

  useEffect(() => save(places), [places]);

  async function quickCheck(p) {
    const res = await api(`/api/air/now?lat=${p.lat}&lon=${p.lon}`);
    setPreview({ place: p, aqi: res.aqi, label: res.forecastLabel ?? res.todayLabel ?? "" });
    onPick?.(p, res);
  }

  function add() {
    if (!name || !lat || !lon) return;
    const id = crypto.randomUUID();
    const item = { id, name, lat: +lat, lon: +lon };
    setPlaces([...places, item]);
    setName(""); setLat(""); setLon("");
  }

  function remove(id) { setPlaces(places.filter(p => p.id !== id)); }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium mb-2">Saved places</div>
      <ul className="space-y-2">
        {places.map(p => (
          <li key={p.id} className="flex items-center justify-between">
            <div className="text-sm">{p.name}</div>
            <div className="flex gap-2">
              <button className="text-indigo-600 hover:underline text-sm" onClick={() => quickCheck(p)}>Check</button>
              <button className="text-rose-600 hover:underline text-sm" onClick={() => remove(p.id)}>Remove</button>
            </div>
          </li>
        ))}
        {!places.length && <li className="text-sm text-slate-500">No saved places.</li>}
      </ul>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <input placeholder="Name" className="border rounded p-2 text-sm" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Lat" className="border rounded p-2 text-sm" value={lat} onChange={e=>setLat(e.target.value)} />
        <input placeholder="Lon" className="border rounded p-2 text-sm" value={lon} onChange={e=>setLon(e.target.value)} />
      </div>
      <div className="mt-2">
        <button onClick={add} className="px-3 py-2 rounded border text-sm">Add place</button>
      </div>

      {preview && (
        <div className="mt-3 text-sm rounded-xl border border-slate-200 p-3">
          <div><b>{preview.place.name}</b>: AQI {preview.aqi} {preview.label ? `• ${preview.label}` : ""}</div>
        </div>
      )}
    </div>
  );
}
