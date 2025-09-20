export default function Chip({ children, className = "" }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}
