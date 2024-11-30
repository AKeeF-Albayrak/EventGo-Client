import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { AdminProvider } from './contexts/AdminContext'
import { EventProvider } from './contexts/EventContext'
import NotFoundPage from './pages/NotFoundPage'
import AuthLayout from './layouts/AuthLayout'
import AuthPage from './pages/auth/pages/AuthPage'
import RootLayout from './layouts/RootLayout'
import AdminLayout from './layouts/AdminLayout'
import UserRoutes from './routes/UserRoutes'
import AdminRoutes from './routes/AdminRoutes'

const ProtectedRoute: React.FC<{ children: React.ReactNode; role: number }> = ({ children, role }) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/auth" state={{ from: location }} replace />
  if (user?.role !== role) return <Navigate to="/" replace />

  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to={user?.role === 1 ? '/admin/dashboard' : '/home'} replace /> : <Navigate to="/auth" replace />}
      />

      <Route element={<AuthLayout />}>
        <Route 
          path="/auth" 
          element={
            isAuthenticated 
              ? <Navigate to={user?.role === 1 ? '/admin/dashboard' : '/home'} replace /> 
              : <AuthPage />
          } 
        />
      </Route>

      <Route element={<RootLayout />}>
        <Route
          path="/*"
          element={
            <ProtectedRoute role={0}>
              <EventProvider> 
                <UserRoutes />
              </EventProvider>
            </ProtectedRoute>
          }
        />
      </Route>

      <Route element={<AdminLayout />}>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role={1}>
              <AdminProvider>
                <AdminRoutes />
              </AdminProvider>
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes