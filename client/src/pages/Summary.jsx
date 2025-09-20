import { useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import Chip from "../components/Chip.jsx";

export default function Summary(){
  const [data] = useState({
    range: { start: new Date(Date.now()-7*86400e3).toISOString(), end: new Date().toISOString() },
    totals: { cough: 4, wheeze: 3, breath: 2 },
    aqiContextNow: 62
  });

  function downloadJson(){
    const blob = new Blob([JSON.stringify({ mock:"FHIR bundle here" },null,2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='runsafe_fhir.json'; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-indigo-50 via-purple-100 to-white">
      <main className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-3 gap-6">
        <Card title="Weekly provider summary" className="lg:col-span-2 border-t-4 border-indigo-400">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <Chip className="bg-slate-100 text-slate-800">
              {new Date(data.range.start).toLocaleDateString()} — {new Date(data.range.end).toLocaleDateString()}
            </Chip>
            <Chip className="bg-indigo-100 text-indigo-800">AQI now {data.aqiContextNow}</Chip>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Metric label="Cough" value={data.totals.cough} />
            <Metric label="Wheeze" value={data.totals.wheeze} />
            <Metric label="SOB" value={data.totals.breath} />
          </div>

          <div className="mt-5 flex gap-2">
            <Button onClick={downloadJson} className="bg-indigo-600 hover:bg-indigo-700">Download FHIR JSON</Button>
            <Button variant="outline" onClick={()=>window.open('#','_blank')}>Open PDF</Button>
          </div>
        </Card>

        <Card title="What doctors see" className="border-t-4 border-purple-400">
          <ul className="text-sm text-slate-700 list-disc list-inside space-y-1">
            <li>Concise weekly trends (not a diagnosis)</li>
            <li>Exposure context (AQI peaks/windows)</li>
            <li>FHIR-shaped bundle for EHR intake</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}

function Metric({label, value}){
  return (
    <div className="rounded-xl bg-white shadow-lg p-4 text-center hover:shadow-xl hover:-translate-y-0.5 transition">
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-3xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
