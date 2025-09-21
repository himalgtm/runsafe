import { useAuth0 } from '@auth0/auth0-react';

export function LoginButton() {
  const { loginWithRedirect} = useAuth0();

  async function go() {
    try {
      // Don’t block; still allow click during isLoading to see issues
      await loginWithRedirect();
    } catch (e) {
      console.error("Auth0 login error:", e);
      alert(`Login failed: ${e?.message || e}`);
    }
  }

  return (
    <button
      onClick={go}
      className="px-3 py-2 rounded border hover:bg-neutral-50"
      title={"Log in"}
    >
      Log in
    </button>
  );
}

export function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="px-3 py-2 rounded border hover:bg-neutral-50"
    >
      Log out
    </button>
  );
}

export function UserBadge() {
  const { user, isAuthenticated } = useAuth0();
  if (!isAuthenticated) return null;
  return (
    <span className="text-xs opacity-80">
      👤 {user?.name || user?.email || "Signed in"}
    </span>
  );
}
