export default function ProfileSheet({ profile, onChange }) {
  const toggle = (key) => onChange?.({ ...profile, [key]: !profile[key] });
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <h3 className="font-semibold mb-2">Personalized Profile</h3>
      <div className="space-y-2 text-sm">
        {[
          ["asthma","Asthma / reactive airways"],
          ["cardio","Cardiopulmonary disease"],
          ["pregnant","Pregnancy"],
          ["child","Child"],
          ["older","Older adult"]
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-3">
            <input type="checkbox" checked={!!profile[key]} onChange={() => toggle(key)} className="h-4 w-4 accent-emerald-500" />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
