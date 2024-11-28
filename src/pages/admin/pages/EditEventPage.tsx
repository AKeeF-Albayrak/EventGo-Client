'use client'

import { EditEventContent } from '../Content/EditEventContent'
import { AdminProvider } from '@/contexts/AdminContext'

const EditEventPage = () => {
  return (
    <AdminProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Etkinlik Düzenle</h1>
        <EditEventContent />
      </div>
    </AdminProvider>
  )
}

export default EditEventPage