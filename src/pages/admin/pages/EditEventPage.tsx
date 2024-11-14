import React from 'react'
import { useParams } from 'react-router-dom'

export function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Etkinlik Düzenleme</h1>
      <p>Etkinlik ID: {eventId}</p>
      <p>Bu sayfa henüz geliştirme aşamasındadır.</p>
    </div>
  )
}