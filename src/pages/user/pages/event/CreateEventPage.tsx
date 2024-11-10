'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function CreateEventPage() {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    date: new Date(),
    duration: 0,
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    category: '',
    image: null as File | null,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
  });

  useEffect(() => {
    if (navigator.geolocation) {
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
  }, [])

  const updateLocationInfo = useCallback((location: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const addressComponents = results[0].address_components
        let country = '', city = '', address = results[0].formatted_address

        addressComponents.forEach(component => {
          if (component.types.includes("country")) {
            country = component.long_name
          }
          if (component.types.includes("locality")) {
            city = component.long_name
          }
        })

        setEventData(prev => ({
          ...prev,
          address,
          city,
          country,
          latitude: location.lat,
          longitude: location.lng
        }))
      } else {
        console.error("Geocoder failed due to: " + status)
      }
    })
  }, [])

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const location = e.latLng.toJSON()
      setMarkerPosition(location)
      updateLocationInfo(location)
    }
  }, [updateLocationInfo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setEventData(prev => ({ ...prev, category: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEventData(prev => ({ ...prev, date }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEventData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Here you would typically send the data to your backend
      // For demonstration, we'll just log it and simulate a delay
      console.log(eventData)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      // After successful submission, you might want to reset the form or navigate to another page
    } catch (error) {
      console.error('Event creation failed:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return eventData.name && eventData.description && eventData.address && eventData.category && eventData.image
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Etkinlik Oluştur</h1>
      <motion.form onSubmit={handleSubmit} className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="name">Etkinlik Adı</Label>
          <Input id="name" name="name" value={eventData.name} onChange={handleInputChange} required />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="description">Açıklama</Label>
          <Textarea id="description" name="description" value={eventData.description} onChange={handleInputChange} required />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="date">Tarih</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventData.date ? format(eventData.date, "PPP") : <span>Tarih Seç</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={eventData.date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="duration">Süre (dakika)</Label>
          <Input id="duration" name="duration" type="number" value={eventData.duration} onChange={handleInputChange} required />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label>Konum Seçin</Label>
          {isLoaded ? (
            <div style={{ height: '400px', width: '100%' }}>
              <GoogleMap
                center={mapCenter}
                zoom={10}
                onClick={handleMapClick}
                mapContainerStyle={{ height: '100%', width: '100%' }}
              >
                {markerPosition && <Marker position={markerPosition} />}
              </GoogleMap>
            </div>
          ) : (
            <div>Harita yükleniyor...</div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="address">Adres</Label>
          <Input
            id="address"
            name="address"
            value={eventData.address}
            onChange={handleInputChange}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">Ülke</Label>
            <Input
              id="country"
              name="country"
              value={eventData.country}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Şehir</Label>
            <Input
              id="city"
              name="city"
              value={eventData.city}
              onChange={handleInputChange}
              required
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="music">Müzik</SelectItem>
              <SelectItem value="sports">Spor</SelectItem>
              <SelectItem value="arts">Sanat</SelectItem>
              <SelectItem value="technology">Teknoloji</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="image">Etkinlik Görseli</Label>
          <Input id="image" name="image" type="file" onChange={handleImageChange} accept="image/*" required />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Kaydediliyor...</span>
              </div>
            ) : (
              'Etkinlik Oluştur'
            )}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  )
}