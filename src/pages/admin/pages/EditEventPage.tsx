import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-toastify'

interface EventFormData {
  id: string;
  name: string;
  description: string;
  date: string;
  duration: number;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  category: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}

export function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, watch } = useForm<EventFormData>()
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  })

  useEffect(() => {
    // Fetch event data and set form values
    const fetchEventData = async () => {
      setIsLoading(true)
      try {
        // Replace with your actual API call
        const response = await fetch(`/api/events/${eventId}`)
        const eventData = await response.json()
        Object.keys(eventData).forEach(key => {
          setValue(key as keyof EventFormData, eventData[key])
        })
        setMapCenter({ lat: eventData.latitude, lng: eventData.longitude })
        setMarkerPosition({ lat: eventData.latitude, lng: eventData.longitude })
      } catch (error) {
        console.error('Failed to fetch event data:', error)
        toast.error('Etkinlik verisi yüklenemedi.')
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      fetchEventData()
    }
  }, [eventId, setValue])

  useEffect(() => {
    if (isLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setMapCenter(pos)
          setMarkerPosition(pos)
          updateLocationInfo(pos)
        },
        () => {
          console.error("Error: The Geolocation service failed.")
        }
      )
    }
  }, [isLoaded])

  const updateLocationInfo = (location: google.maps.LatLngLiteral) => {
    if (!window.google) {
      console.error("Google Maps API not loaded")
      return
    }
  
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const addressComponents = results[0].address_components
        let country = '', city = ''
        const address = results[0].formatted_address
  
        addressComponents.forEach(component => {
          if (component.types.includes("country")) {
            country = component.long_name
          }
          if (component.types.includes("locality") || component.types.includes("administrative_area_level_1")) {
            city = component.long_name
          }
        })
  
        setValue('address', address)
        setValue('city', city)
        setValue('country', country)
        setValue('latitude', location.lat)
        setValue('longitude', location.lng)
      } else {
        console.error("Geocoder failed due to: " + status)
      }
    })
  }

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && map) {
      const location = e.latLng.toJSON()
      setMarkerPosition(location)
      updateLocationInfo(location)

      if (marker) {
        marker.setMap(null)
      }

      const newMarker = new google.maps.Marker({
        position: location,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        },
      })
      setMarker(newMarker)

      const infoWindow = new google.maps.InfoWindow({
        content: `<div>Seçilen Konum</div>`
      })
      infoWindow.open(map, newMarker)

      map.addListener('click', () => {
        infoWindow.close()
      })
    }
  }

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true)
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        toast.success('Etkinlik başarıyla güncellendi.')
        navigate('/admin/all-events')
      } else {
        throw new Error('Failed to update event')
      }
    } catch (error) {
      console.error('Failed to update event:', error)
      toast.error('Etkinlik güncellenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Etkinlik Düzenleme</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <motion.div variants={itemVariants}>
              <Label htmlFor="name">Etkinlik Adı</Label>
              <Input id="name" {...register('name', { required: true })} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" {...register('description', { required: true })} />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Tarih</Label>
                <Input type="datetime-local" id="date" {...register('date', { required: true })} />
              </div>
              <div>
                <Label htmlFor="duration">Süre (dakika)</Label>
                <Input type="number" id="duration" {...register('duration', { required: true, min: 0 })} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label>Konum Seçin</Label>
              {isLoaded ? (
                <div style={{ height: '400px', width: '100%' }}>
                  <GoogleMap
                    center={mapCenter}
                    zoom={10}
                    onClick={handleMapClick}
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    onLoad={setMap}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                    }}
                  >
                    {markerPosition && <Marker position={markerPosition} />}
                  </GoogleMap>
                </div>
              ) : (
                <div>Harita yükleniyor...</div>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="address">Adres</Label>
              <Input id="address" {...register('address', { required: true })} />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Ülke</Label>
                <Input id="country" {...register('country', { required: true })} />
              </div>
              <div>
                <Label htmlFor="city">Şehir</Label>
                <Input id="city" {...register('city', { required: true })} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="category">Kategori</Label>
              <Select onValueChange={(value) => setValue('category', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Kategori 1</SelectItem>
                  <SelectItem value="1">Kategori 2</SelectItem>
                  <SelectItem value="2">Kategori 3</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}