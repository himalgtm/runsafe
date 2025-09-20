import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import RoutePage from "./pages/Route.jsx";
import Diary from "./pages/Diary.jsx";
import Summary from "./pages/Summary.jsx";
import Profile from "./pages/Profile.jsx"; // ✅ NEW

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg transition-all font-semibold ${
          isActive
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
            : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200 shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 font-extrabold text-2xl tracking-tight brand-glow drop-shadow-lg">
            RunSafe
          </div>
          <nav className="flex items-center gap-3">
            <NavItem to="/">Here & Now</NavItem>
            <NavItem to="/route">Route</NavItem>
            <NavItem to="/diary">Diary</NavItem>
            <NavItem to="/summary">Summary</NavItem>
            <NavItem to="/profile">Profile</NavItem> {/* ✅ NEW */}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/profile" element={<Profile />} />   {/* ✅ NEW */}
      </Routes>

      <footer className="py-8 text-center text-sm text-slate-500">
        Built for HackRice • Gemini + Cloudflare + MongoDB Atlas ready
      </footer>
    </>
  );
}
