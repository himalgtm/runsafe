export default function Card({ title, actions, children, className = "" }) {
  return (
    <section className={`rounded-2xl p-5 bg-white shadow-md ${className}`}>
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between">
          {title ? (
            <h2 className="text-sm font-semibold tracking-wide text-slate-700">{title}</h2>
          ) : <div />}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
