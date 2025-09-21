import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react";

const LS_KEY = "runsafe_diary";

export default function Summary() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    setEntries(local);
  }, []);

  // Optional: refresh from server when authenticated
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        });
        const data = await api("/api/diary/list", { token });
        if (Array.isArray(data?.entries)) setEntries(data.entries);
      } catch (e) {
        console.warn("summary load failed:", e?.message || e);
      }
    })();
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // 7-day tallies
  const tallies = useMemo(() => {
    const since = Date.now() - 7 * 24 * 3600 * 1000;
    const last7 = entries.filter((e) => e.ts >= since);
    const sum = (k) => last7.reduce((s, e) => s + (Number(e[k]) || 0), 0);
    return { cough: sum("cough"), wheeze: sum("wheeze"), sob: sum("sob") };
  }, [entries]);

  async function downloadFHIR() {
    try {
      let token;
      if (isAuthenticated) {
        token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        });
      }
      const bundle = await api("/api/summary/fhir", { token });
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), { href: url, download: "runsafe_fhir_summary.json" });
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("FHIR download failed.");
      console.error(e);
    }
  }

  async function openPDF() {
    try {
      let token;
      if (isAuthenticated) {
        token = await getAccessTokenSilently({
          authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
        });
      }
      const res = await api("/api/summary/pdf", { token });
      // If backend returns a URL string, open it. If it returns base64, you’ll adapt here.
      if (typeof res === "string") window.open(res, "_blank");
      else alert("PDF endpoint not returning a URL.");
    } catch (e) {
      alert("Open PDF failed.");
      console.error(e);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[radial-gradient(900px_600px_at_10%_0%,#e9d5ff33,transparent),radial-gradient(900px_600px_at_90%_0%,#a7f3d033,transparent)]">
      <main className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Weekly provider summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric title="COUGH" value={tallies.cough} />
            <Metric title="WHEEZE" value={tallies.wheeze} />
            <Metric title="SOB" value={tallies.sob} />
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={downloadFHIR} className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">
              Download FHIR JSON
            </button>
            <button onClick={openPDF} className="px-4 py-2 rounded-xl border hover:bg-slate-50">
              Open PDF
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold mb-3">What doctors see</h3>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
            <li>Concise weekly trends (not a diagnosis)</li>
            <li>Exposure context (AQI peaks/windows)</li>
            <li>FHIR-shaped bundle for EHR intake</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <div className="text-xs tracking-wide text-slate-500">{title}</div>
      <div className="text-4xl font-bold mt-2">{value || 0}</div>
    </div>
  );
}
