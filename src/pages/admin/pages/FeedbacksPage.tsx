'use client'

import { FeedbacksContent } from '../Content/FeedbacksContent'
import { AdminProvider } from '@/contexts/AdminContext'

const FeedbacksPage = () => {
  return (
    <AdminProvider>
      <div className="container mx-auto px-4 py-8">
        <FeedbacksContent />
      </div>
    </AdminProvider>
  )
}

export default FeedbacksPage