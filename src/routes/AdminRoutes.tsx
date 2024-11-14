import { Routes, Route } from 'react-router-dom'
import DashboardPage from '../pages/admin/pages/DashboardPage'
import UserManagementPage from '../pages/admin/pages/UserManagementPage'
import PendingEventsPage from '../pages/admin/pages/PendingEventsPage'
import AllEventsPage from '../pages/admin/pages/AllEventsPage'
import AdminSettingsPage from '../pages/admin/pages/AdminSettingsPage'

const AdminRoutes = () => (
  <Routes>
    <Route path="dashboard" element={<DashboardPage />} />
    <Route path="users" element={<UserManagementPage />} />
    <Route path="events-pending" element={<PendingEventsPage />} />
    <Route path="all-events" element={<AllEventsPage />} />
    <Route path="settings" element={<AdminSettingsPage />} />
  </Routes>
)

export default AdminRoutes