import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import AppLayout from "./components/AppLayout";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import ComparePage from "./pages/ComparePage";
import HistoryPage from "./pages/HistoryPage";
import FavoritesPage from "./pages/FavoritesPage";
import AboutPage from "./pages/AboutPage";
import ResultPage from "./pages/ResultPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page Penuh (Sebelum masuk ke Dashboard AppLayout) */}
            <Route path="/" element={<LandingPage />} />

            {/* Ruang Kerja Dashboard dengan Collapsible Sidebar */}
            <Route element={<AppLayout />}>
              <Route path="/studio" element={<HomePage />} />
              <Route path="/jelajah" element={<ExplorePage />} />
              <Route path="/bandingkan" element={<ComparePage />} />
              <Route path="/riwayat" element={<HistoryPage />} />
              <Route path="/favorit" element={<FavoritesPage />} />
              <Route path="/tentang" element={<AboutPage />} />
              <Route path="/hasil" element={<ResultPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}