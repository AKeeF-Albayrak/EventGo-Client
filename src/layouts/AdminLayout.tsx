import { Outlet } from 'react-router-dom'
import AdminNavbar from '../components/shared/AdminNavbar'

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminNavbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-20">
        <Outlet />
      </main>
    </div>
  )
}