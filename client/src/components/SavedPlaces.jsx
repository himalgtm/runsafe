import { useEffect, useState } from "react";
import Card from "./Card.jsx";
import Chip from "./Chip.jsx";
import { loadPlaces, savePlaces } from "../utils/places.js";
import { quickAQI, bestWindows } from "../utils/air.js";

export default function SavedPlaces(){
  const [places, setPlaces] = useState(loadPlaces()); // [{name,lat,lon}]
  const [chips, setChips] = useState({}); // name -> windows

  function addPlace(){
    const name = prompt("Place name (e.g., Home):");
    const lat = parseFloat(prompt("Latitude:"));
    const lon = parseFloat(prompt("Longitude:"));
    if (!name || Number.isNaN(lat) || Number.isNaN(lon)) return;
    const next = [...places, {name, lat, lon}];
    setPlaces(next); savePlaces(next);
  }
  function removePlace(name){
    const next = places.filter(p=>p.name!==name);
    setPlaces(next); savePlaces(next);
  }

  useEffect(()=>{
    (async ()=>{
      const out = {};
      for (const p of places){
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${p.lat}&longitude=${p.lon}&hourly=pm2_5,ozone,no2&timezone=auto`;
        const data = await fetch(url).then(r=>r.json());
        const now = new Date().toISOString().slice(0,13);
        const idx = data.hourly.time.findIndex(t => t.startsWith(now));
        const series = data.hourly.time.slice(idx, idx+12).map((_,k)=> quickAQI(
          data.hourly.pm2_5[idx+k], data.hourly.ozone[idx+k], data.hourly.no2[idx+k]
        ));
        out[p.name] = bestWindows(series, 12);
      }
      setChips(out);
    })();
  },[places]);

  return (
    <Card title="Saved places (6–12h outlook)" className="lg:col-span-3 border-t-4 border-teal-400">
      <div className="flex flex-wrap gap-2 mb-3">
        {places.map(p=>(
          <span key={p.name} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
            {p.name}
            <button onClick={()=>removePlace(p.name)} className="text-slate-500 hover:text-rose-600">×</button>
          </span>
        ))}
        <button onClick={addPlace} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm hover:bg-emerald-200">
          + Add place
        </button>
      </div>

      {places.length===0 && <div className="text-sm text-slate-500">Add Home/Work/Gym to see quick forecasts.</div>}

      <div className="grid md:grid-cols-3 gap-3">
        {places.map(p=>(
          <div key={p.name} className="rounded-xl bg-white shadow p-3">
            <div className="font-semibold">{p.name}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(chips[p.name]||[]).map((w,i)=>(
                <Chip key={i} className="bg-emerald-200 text-emerald-900">
                  {w.label} • med {Math.round(w.median)}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
