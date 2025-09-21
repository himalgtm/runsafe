import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react";

const LS_KEY = "runsafe_profile";

export default function Profile() {
 const { isAuthenticated, isLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const [p, setP] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
    catch { return {}; }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  }, [p]);

  async function saveRemote() {
    if (!isAuthenticated) return;
    try {
      setSaving(true);
      const token = await getAccessTokenSilently({
        authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE },
      });
      await api("/api/profile/save", { method: "POST", token, body: JSON.stringify(p) });
      alert("Profile saved.");
    } catch (e) {
      alert("Could not save profile.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const toggle = (k) => setP((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[radial-gradient(900px_600px_at_10%_0%,#e9d5ff33,transparent),radial-gradient(900px_600px_at_90%_0%,#a7f3d033,transparent)]">
      <main className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Health sensitivities</h2>
          <Check label="Asthma" value={!!p.asthma} onChange={() => toggle("asthma")} />
          <Check label="Cardiopulmonary disease" value={!!p.copd} onChange={() => toggle("copd")} />
          <Check label="Pregnancy" value={!!p.pregnancy} onChange={() => toggle("pregnancy")} />
          <Check label="Child" value={!!p.child} onChange={() => toggle("child")} />
          <Check label="Older adult" value={!!p.older} onChange={() => toggle("older")} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Home / lifestyle (context)</h2>
          <Check label="Smoker in home" value={!!p.smoker} onChange={() => toggle("smoker")} />
          <Check label="Gas stove" value={!!p.gas} onChange={() => toggle("gas")} />
          <Check label="Mold history" value={!!p.mold} onChange={() => toggle("mold")} />
          <p className="text-xs text-slate-500 mt-3">Used to tailor tips; not for diagnosis.</p>
        </section>

        <div className="md:col-span-2">
          {isAuthenticated && !isLoading && (
            <button
              onClick={saveRemote}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          )}
        </div>
        {/* Save bar */}
<section className="lg:col-span-3">
  <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
    <div className="text-sm text-slate-600">
      ✅ Changes are auto-saved on this device.
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => {
          if (confirm("Reset profile to defaults?")) {
            setP({ ...DEFAULT_PROFILE }); // clears profile
          }
        }}
        className="px-3 py-2 rounded-xl border text-sm hover:bg-slate-50"
      >
        Reset
      </button>

      {!isLoading && (isAuthenticated ? (
        <button
          onClick={saveRemote}   // this already exists in your code
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save to account"}
        </button>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Log in to save
        </button>
      ))}
    </div>
  </div>
</section>

      </main>
    </div>
  );
}

function Check({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3 py-2">
      <input type="checkbox" className="size-4" checked={value} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}
