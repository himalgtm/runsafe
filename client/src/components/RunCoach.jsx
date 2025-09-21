import { Compass, Timer, Footprints } from "lucide-react";
export default function RunCoach({ plan }) {
  if (!plan) return null;
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Footprints className="h-5 w-5" />
        <h3 className="font-semibold">Run Coach (Beta)</h3>
      </div>
      <ul className="space-y-2 text-sm text-neutral-300">
        <li className="flex items-center gap-2"><Timer className="h-4 w-4" /> Best window: <b className="ml-1">{plan.window}</b></li>
        <li className="flex items-center gap-2"><Compass className="h-4 w-4" /> Cleaner direction: <b className="ml-1">{plan.direction}</b></li>
        <li className="flex items-center gap-2"><Timer className="h-4 w-4" /> Suggested duration: <b className="ml-1">{plan.duration}</b></li>
      </ul>
    </section>
  );
}
