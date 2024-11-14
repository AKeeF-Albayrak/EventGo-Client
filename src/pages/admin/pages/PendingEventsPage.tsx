'use client'

import PendingEventsContent from '../Content/PendingEventsContent'
import { AdminProvider } from '@/contexts/AdminContext'

export default function PendingEventsPage() {
  return (
    <AdminProvider>
      <div className="container mx-auto px-4 py-8">
        <PendingEventsContent />
      </div>
    </AdminProvider>
  )
}