import { Search } from "lucide-react";
export default function LocationSearch({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }} className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2">
      <Search className="h-4 w-4 text-neutral-400" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Search city or use GPS…"
        className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
      />
      <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium hover:bg-emerald-500">Check</button>
    </form>
  );
}
