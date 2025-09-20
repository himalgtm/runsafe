import { useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

function Row({label, value, setValue}) {
  return (
    <div className="grid grid-cols-[140px_1fr_48px] items-center gap-3">
      <div className="text-sm text-slate-700">{label} (0–3)</div>
      <input type="range" min="0" max="3" value={value}
             onChange={e=>setValue(Number(e.target.value))}
             className="accent-pink-500" />
      <div className="text-right font-semibold">{value}</div>
    </div>
  );
}

export default function Diary(){
  const [cough, setC] = useState(0);
  const [wheeze, setW] = useState(0);
  const [breath, setB] = useState(0);
  const [note, setN] = useState("");

  function save(){
    alert("Entry saved (mock).");
    setC(0); setW(0); setB(0); setN("");
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-rose-50 via-pink-100 to-white">
      <main className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-3 gap-6">
        <Card title="Symptom diary" className="lg:col-span-2 border-t-4 border-pink-400">
          <div className="space-y-4">
            <Row label="Cough" value={cough} setValue={setC}/>
            <Row label="Wheeze" value={wheeze} setValue={setW}/>
            <Row label="Shortness of breath" value={breath} setValue={setB}/>
            <textarea className="w-full mt-2 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-pink-300 outline-none"
                      rows="3" placeholder="Optional notes…" value={note} onChange={e=>setN(e.target.value)} />
            <div className="pt-2">
              <Button onClick={save} className="bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95">Save entry</Button>
            </div>
          </div>
        </Card>

        <Card title="How it helps" className="border-t-4 border-rose-400">
          <p className="text-sm text-slate-700">
            We combine your diary with local AQI to generate a weekly provider summary (FHIR-ready).
            This aligns with Commure’s focus on better care workflows.
          </p>
        </Card>
      </main>
    </div>
  );
}
