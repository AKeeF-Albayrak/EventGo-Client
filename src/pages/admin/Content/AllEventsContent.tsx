'use client'

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LayoutGrid, List, Edit } from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import axiosInstance from '@/contexts/AxiosInstance'
import { toast } from 'react-toastify'

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

export function AllEventsContent() {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const { events, isLoading } = useAdmin()
  const approvedEvents = events.filter(event => event.isApproved)
  const navigate = useNavigate()

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  if (approvedEvents.length === 0) {
    return <div>Onaylanmış etkinlik bulunmamaktadır.</div>
  }

  const handleEdit = async (eventId: string) => {
    try {
      navigate(`/admin/events/edit/${eventId}`)
    } catch (error) {
      console.error('Yönlendirme hatası:', error)
      toast.error('Düzenleme sayfasına yönlendirilemedi. Lütfen tekrar deneyin.')
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tüm Onaylanmış Etkinlikler</h1>
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
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{new Date(event.date).toLocaleString('tr-TR')}</TableCell>
                <TableCell>{`${event.city}, ${event.country}`}</TableCell>
                <TableCell>{event.category}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleEdit(event.id)}>
                    <Edit className="h-4 w-4 mr-1" /> Düzenle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approvedEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Tarih:</strong> {new Date(event.date).toLocaleString('tr-TR')}</p>
                <p><strong>Konum:</strong> {`${event.city}, ${event.country}`}</p>
                <p><strong>Adres:</strong> {event.address}</p>
                <p><strong>Kategori:</strong> {event.category}</p>
                <p><strong>Açıklama:</strong> {event.description}</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" onClick={() => handleEdit(event.id)}>
                  <Edit className="h-4 w-4 mr-1" /> Düzenle
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}