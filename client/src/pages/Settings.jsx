import Header from "../components/Header.jsx";
export default function Settings() {
  return (
    <>
      <Header title="RunSafe" sub="Settings" />
      <main className="mx-auto max-w-xl px-4 py-4 space-y-4">
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h3 className="font-semibold mb-2">Data & Privacy</h3>
          <ul className="list-disc pl-5 text-sm text-neutral-300 space-y-1">
            <li>Location is used only when you opt in for GPS.</li>
            <li>Profile settings are stored locally unless you sign in.</li>
            <li>We call public air-quality services through our backend.</li>
          </ul>
        </section>
      </main>
    </>
  );
}
