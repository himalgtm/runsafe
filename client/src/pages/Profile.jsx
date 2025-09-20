import { useEffect, useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { loadProfile, saveProfile, defaultProfile } from "../utils/profile.js";

export default function Profile(){
  const [p, setP] = useState(defaultProfile);

  useEffect(()=>{ setP(loadProfile()); },[]);
  function toggle(k){ setP(prev => ({ ...prev, [k]: !prev[k] })); }
  function toggleHome(k){ setP(prev => ({ ...prev, home: { ...prev.home, [k]: !prev.home[k] }})); }
  function save(){ saveProfile({ ...p, __active: (p.asthma||p.copd||p.pregnant||p.child||p.older) }); alert("Saved."); }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-violet-50 via-fuchsia-100 to-white">
      <main className="mx-auto max-w-4xl px-6 py-8 grid md:grid-cols-2 gap-6">
        <Card title="Health sensitivities" className="border-t-4 border-violet-400">
          <Toggle label="Asthma" checked={p.asthma} onChange={()=>toggle('asthma')} />
          <Toggle label="Cardiopulmonary disease" checked={p.copd} onChange={()=>toggle('copd')} />
          <Toggle label="Pregnancy" checked={p.pregnant} onChange={()=>toggle('pregnant')} />
          <Toggle label="Child" checked={p.child} onChange={()=>toggle('child')} />
          <Toggle label="Older adult" checked={p.older} onChange={()=>toggle('older')} />
        </Card>

        <Card title="Home / lifestyle (context)" className="border-t-4 border-fuchsia-400">
          <Toggle label="Smoker in home" checked={p.home.smoker} onChange={()=>toggleHome('smoker')} />
          <Toggle label="Gas stove" checked={p.home.gas} onChange={()=>toggleHome('gas')} />
          <Toggle label="Mold history" checked={p.home.mold} onChange={()=>toggleHome('mold')} />
          <div className="text-xs text-slate-500 mt-2">Used to tailor tips; not for diagnosis.</div>
        </Card>

        <div className="md:col-span-2 flex items-center justify-end">
          <Button onClick={save}>Save profile</Button>
        </div>
      </main>
    </div>
  );
}

function Toggle({label, checked, onChange}){
  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-indigo-600 h-4 w-4"/>
    </label>
  );
}
