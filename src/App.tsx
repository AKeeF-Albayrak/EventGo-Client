import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthProvider';
import RootLayout from './layouts/RootLayout';
import AuthLayout from './layouts/AuthLayout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/auth/AuthPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import NotFoundPage from './pages/NotFoundPage'; // Hata Mesajı Sayfasını içe aktarın

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />
      } />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
        } />
      </Route>

      {/* Protected routes */}
      <Route element={<RootLayout />}>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
      </Route>

      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFoundPage />} /> {/* Tüm diğer rotaları yakalar */}
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
