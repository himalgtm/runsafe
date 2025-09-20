import AqiGauge from "../components/AqiGauge.jsx";
import Card from "../components/Card.jsx";
import Chip from "../components/Chip.jsx";

export default function Home(){
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-sky-50 via-blue-100 to-white">
      <main className="mx-auto max-w-7xl px-6 py-8 grid lg:grid-cols-3 gap-6">
        {/* EPA-style gauge panel, spanning 2 cols */}
        <div className="lg:col-span-2">
          <AqiGauge aqi={74} pollutant="PM2.5" updated={new Date()} city="Denton, TX" />
        </div>

        {/* Best time today card stays on the right */}
        <Card title="Best time today" className="border-t-4 border-emerald-400">
          <div className="flex flex-wrap gap-2">
            <Chip className="bg-emerald-200 text-emerald-900">1–2 AM • med 49</Chip>
            <Chip className="bg-emerald-200 text-emerald-900">4–5 AM • med 55</Chip>
          </div>
        </Card>

        {/* Tips */}
        <Card className="lg:col-span-3 bg-gradient-to-br from-indigo-50 to-white">
          <h3 className="font-semibold text-indigo-600 mb-2">Tips</h3>
          <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
            <li>🌿 Prefer the best windows for outdoor runs.</li>
            <li>💨 Lower intensity during AQI peaks.</li>
            <li>🫁 Sensitive users: customize thresholds in Profile.</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
