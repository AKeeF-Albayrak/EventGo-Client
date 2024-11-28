'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdmin } from '@/contexts/AdminContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import { ClipLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import { ImageUpload } from './ImageUpload'



export function EditEventContent() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { events, updateEvent } = useAdmin()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null)
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    date: '',
    duration: 0,
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    category: 0,
    image: ''
  })

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  })

  useEffect(() => {
    const event = events.find(e => e.id === eventId)
    if (event) {
      setFormData({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0],
        latitude: event.latitude || 0,
        longitude: event.longitude || 0
      })
      setSelectedLocation({
        lat: event.latitude || 0,
        lng: event.longitude || 0
      })
    }
  }, [eventId, events])

  const updateLocationInfo = useCallback(async (location: google.maps.LatLngLiteral) => {
    try {
      const geocoder = new google.maps.Geocoder()
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            resolve(results[0])
          } else {
            reject(status)
          }
        })
      })

      const result = response as google.maps.GeocoderResult
      const addressComponents = result.address_components
      let country = '', city = '', address = result.formatted_address

      for (const component of addressComponents) {
        if (component.types.includes("country")) {
          country = component.long_name
        }
        if (component.types.includes("administrative_area_level_1")) {
          city = component.long_name
        }
      }

      setFormData(prev => ({
        ...prev,
        address,
        city: city || 'Bilinmiyor',
        country: country || 'Bilinmiyor',
        latitude: location.lat,
        longitude: location.lng
      }))
    } catch (error) {
      console.error("Geocoding hatası:", error)
    }
  }, [])

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const point = e.latLng.toJSON()
      setSelectedLocation(point)
      updateLocationInfo(point)
    }
  }, [updateLocationInfo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Etkinliği güncellemek istediğinizden emin misiniz?',
      text: "Bu işlem geri alınamaz!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, güncelle!',
      cancelButtonText: 'İptal'
    })

    if (result.isConfirmed) {
      setIsLoading(true)
      try {
        await updateEvent(formData)
        Swal.fire(
          'Güncellendi!',
          'Etkinlik başarıyla güncellendi.',
          'success'
        )
        navigate('/admin/all-events')
      } catch (error) {
        console.error('Güncelleme hatası:', error)
        Swal.fire(
          'Hata!',
          'Etkinlik güncellenirken bir hata oluştu.',
          'error'
        )
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }))
  }

  if (!formData.id) {
    return <div>Etkinlik bulunamadı.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Etkinlik Adı</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select
            value={formData.category.toString()}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: parseInt(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {/* Kategorileri burada listeleyebilirsiniz */}
              <SelectItem value="0">Spor</SelectItem>
              <SelectItem value="1">Müzik</SelectItem>
              {/* Diğer kategoriler... */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Etkinlik Görseli</Label>
        <ImageUpload
          currentImage={formData.image}
          onImageChange={handleImageChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Tarih</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Süre (dakika)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
            required
          />
        </div>
      </div>

      {/* Harita */}
      <div className="space-y-2">
        <Label>Konum</Label>
        {isLoaded ? (
          <div style={{ height: '400px', width: '100%' }}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={selectedLocation || { lat: 39.9334, lng: 32.8597 }}
              zoom={13}
              onClick={handleMapClick}
              options={{
                mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
              }}
            >
              {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
          </div>
        ) : (
          <div>Harita yükleniyor...</div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adres</Label>
        <Input
          id="address"
          value={formData.address}
          readOnly
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            value={formData.city}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Ülke</Label>
          <Input
            id="country"
            value={formData.country}
            readOnly
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <ClipLoader color="#ffffff" size={20} />
            <span className="ml-2">Güncelleniyor...</span>
          </div>
        ) : (
          'Güncelle'
        )}
      </Button>
    </form>
  )
}