import { useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Chip from "../components/Chip.jsx";

export default function RoutePage(){
  const [origin, setOrigin] = useState("");
  const [dest, setDest]     = useState("");
  const [routes, setRoutes] = useState([]);

  function plan(){
    setRoutes([
      { id:1, label:"Cleanest (est.)", exposure:13200, km: 2.9, min: 24 },
      { id:2, label:"Alternative",     exposure:14980, km: 2.6, min: 22 },
    ]);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-50 via-teal-100 to-white">
      <main className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-3 gap-6">
        <Card title="Route planner" className="lg:col-span-2 border-t-4 border-emerald-400">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="border rounded-xl px-3 py-2" placeholder="Origin" value={origin} onChange={e=>setOrigin(e.target.value)} />
            <input className="border rounded-xl px-3 py-2" placeholder="Destination" value={dest} onChange={e=>setDest(e.target.value)} />
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={plan}>Find cleanest route</Button>
            <Button variant="outline" onClick={()=>{ setOrigin(""); setDest(""); setRoutes([]); }}>Reset</Button>
          </div>
          <div className="mt-5 h-72 rounded-2xl overflow-hidden shadow-soft bg-[url('https://maps.gstatic.com/tactile/omnibox/stripes.png')] bg-center bg-cover flex items-center justify-center text-slate-600">
            Map appears here once Maps API is added
          </div>
        </Card>

        <Card title="Options" className="border-t-4 border-teal-400">
          <div className="space-y-3">
            {routes.map(r=>(
              <div key={r.id} className="border rounded-xl p-4 bg-white shadow hover:shadow-xl hover:scale-[1.02] transition">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{r.label}</div>
                  <Chip className="bg-emerald-100 text-emerald-800">Exposure {r.exposure.toLocaleString()}</Chip>
                </div>
                <div className="text-sm text-slate-600 mt-1">{r.km.toFixed(1)} km • {r.min} min</div>
              </div>
            ))}
            {!routes.length && <div className="text-sm text-slate-500">Enter origin & destination to see alternatives.</div>}
          </div>
        </Card>
      </main>
    </div>
  );
}
