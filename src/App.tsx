import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import NotFoundPage from './pages/NotFoundPage'
//auth pages routes
import AuthLayout from './layouts/AuthLayout'
import AuthPage from './pages/auth/pages/AuthPage'
//user-navbar routes
import RootLayout from './layouts/RootLayout'
import CreateEventPage from './pages/user/pages/event/CreateEventPage'
import CityEventsPage from './pages/user/pages/event/CityEventsPage'
import HomePage from './pages/user/pages/HomePage'
//user-profile section pages routes
import MyEventsPage from './pages/user/pages/profile/MyEventsPage'
import CreatedEventsPage from './pages/user/pages/profile/CreatedEventsPage'
import PointsHistoryPage from './pages/user/pages/profile/PointsHistoryPage'
import SettingsPage from './pages/user/pages/profile/SettingsPage'
import FeedbackPage from './pages/user/pages/profile/FeedbackPage'
//admin pages routes
import AdminLayout from './layouts/AdminLayout'
import DashboardPage from './pages/admin/pages/DashboardPage'
import AdminSettingsPage from './pages/admin/pages/AdminSettingsPage'
import EventManagementPage from './pages/admin/pages/EventManagementPage'
import UserManagementPage from './pages/admin/pages/UserManagementPage'

const ProtectedRoute: React.FC<{ children: React.ReactNode; role: number }> = ({ children, role }) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to={user?.role === 1 ? '/admin/dashboard' : '/home'} replace /> : <Navigate to="/auth" replace />}
      />

      {/* Auth routes */}
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

      {/* Protected routes based on role */}
      <Route element={<RootLayout />}>
        {/* User routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute role={0}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute role={0}>
              <CreateEventPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/city-events"
          element={
            <ProtectedRoute role={0}>
              <CityEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/events"
          element={
            <ProtectedRoute role={0}>
              <MyEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/my-events"
          element={
            <ProtectedRoute role={0}>
              <CreatedEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/points"
          element={
            <ProtectedRoute role={0}>
              <PointsHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute role={0}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute role={0}>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role={1}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role={1}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role={1}>
              <EventManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role={1}>
              <AdminSettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes