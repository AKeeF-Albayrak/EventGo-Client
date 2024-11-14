'use client'

import { AllEventsContent } from '../Content/AllEventsContent'
import { AdminProvider } from '@/contexts/AdminContext'

const AllEventsPage = () => {
  return (
    <AdminProvider>
      <div className="container mx-auto px-4 py-8">
        <AllEventsContent />
      </div>
    </AdminProvider>
  )
}

export default AllEventsPage