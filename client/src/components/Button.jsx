export default function Button({ children, onClick, variant = "primary", className = "", disabled = false }) {
  const base = "px-4 py-2 rounded-xl text-sm font-semibold transition active:scale-[0.98]";
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-100",
    ghost: "hover:bg-slate-100"
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
