import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import ExplorePage from './pages/ExplorePage'
import MotifDetailPage from './pages/MotifDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminCollectionPage from './pages/AdminCollectionPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/hasil" element={<ResultPage />} />
        <Route path="/jelajah" element={<ExplorePage />} />
        <Route path="/motif/:id" element={<MotifDetailPage />} />
        <Route path="/favorit" element={<FavoritesPage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/koleksi" element={<AdminCollectionPage />} />
      </Route>
    </Routes>
  )
}
