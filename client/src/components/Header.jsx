import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton, LogoutButton, UserBadge } from "./AuthButtons";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
          RunSafe
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <Nav to="/">Here &amp; Now</Nav>
          <Nav to="/route">Route</Nav>
          <Nav to="/diary">Diary</Nav>
          <Nav to="/summary">Summary</Nav>
          <Nav to="/profile">Profile</Nav>
        </nav>
        <div className="flex items-center gap-2">
          <UserBadge />
          <AuthSwitcher />
        </div>
      </div>
    </header>
  );
}

function Nav({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm ${isActive ? "text-indigo-600 font-medium" : "text-slate-700 hover:text-slate-900"}`
      }
    >
      {children}
    </NavLink>
  );
}

function AuthSwitcher() {
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
}
