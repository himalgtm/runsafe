import { useAuth0 } from "@auth0/auth0-react";

export default function Protected({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  if (isLoading) return <p className="p-4 text-sm">Loading…</p>;
  if (!isAuthenticated) { loginWithRedirect(); return null; }
  return children;
}
