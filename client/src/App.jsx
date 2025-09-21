import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RoutePage from "./pages/Route";
import Diary from "./pages/Diary";
import Summary from "./pages/Summary";
import Profile from "./pages/Profile";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
