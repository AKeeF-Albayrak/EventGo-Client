'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LayoutGrid, List, Check, X } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  duration: number;
  address: string;
  city: string;
  country: string;
  category: number;
  isApproved: boolean;
  createdTime: string;
}

export default function PendingEventsContent() {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const { events, approveEvent, deleteEvent, isLoading } = useAdmin()
  const unapprovedEvents = events.filter(event => !event.isApproved);

  const handleApprove = async (id: string) => {
    try {
      await approveEvent(id)
      toast.success('Etkinlik başarıyla onaylandı.')
    } catch (error) {
      console.error(`Failed to approve event: ${id}`, error)
      toast.error('Etkinlik onaylanırken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleReject = async (id: string) => {
    const result = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu işlemi geri alamazsınız!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'İptal'
    })

    if (result.isConfirmed) {
      try {
        await deleteEvent(id)
        toast.success('Etkinlik başarıyla silindi.')
      } catch (error) {
        console.error(`Failed to delete event: ${id}`, error)
        toast.error('Etkinlik silinirken bir hata oluştu. Lütfen tekrar deneyin.')
      }
    }
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (unapprovedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <LayoutGrid className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Onay Bekleyen Etkinlik Bulunamadı
        </h3>
        <p className="text-gray-500">
          Şu anda onay bekleyen herhangi bir etkinlik bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Onay Bekleyen Etkinlikler</h1>
        <div className="space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'card' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('card')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Etkinlik Adı</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unapprovedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{new Date(event.date).toLocaleString('tr-TR')}</TableCell>
                <TableCell>{`${event.city}, ${event.country}`}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>{event.isApproved ? 'Onaylandı' : 'Beklemede'}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleApprove(event.id)}>
                      <Check className="h-4 w-4 mr-1" /> Onayla
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(event.id)}>
                      <X className="h-4 w-4 mr-1" /> Sil
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unapprovedEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Tarih:</strong> {new Date(event.date).toLocaleString('tr-TR')}</p>
                <p><strong>Konum:</strong> {`${event.city}, ${event.country}`}</p>
                <p><strong>Adres:</strong> {event.address}</p>
                <p><strong>Kategori:</strong> {event.category}</p>
                <p><strong>Durum:</strong> {event.isApproved ? 'Onaylandı' : 'Beklemede'}</p>
                <p><strong>Açıklama:</strong> {event.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button size="sm" onClick={() => handleApprove(event.id)}>
                  <Check className="h-4 w-4 mr-1" /> Onayla
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleReject(event.id)}>
                  <X className="h-4 w-4 mr-1" /> Sil
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}