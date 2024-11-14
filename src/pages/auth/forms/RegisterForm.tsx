'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useLoadScript, GoogleMap } from '@react-google-maps/api'

interface RegisterFormProps {
  itemVariants: any
  onRegister: (userData: any) => Promise<void>
}

const AVAILABLE_INTERESTS = [
  "Spor", "Müzik", "Sanat", "Teknoloji", "Bilim", "Edebiyat", "Sinema",
  "Tiyatro", "Fotoğrafçılık", "Seyahat", "Yemek", "Dans", "Yoga", "Doğa", "Tarih"
]

export default function RegisterForm({ itemVariants, onRegister }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    passwordHash: '',
    email: '',
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    interests: [] as string[],
    name: '',
    surname: '',
    birthDate: '',
    gender: '',
    phoneNumber: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 })
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
  });

  useEffect(() => {
    if (isLoaded && navigator.geolocation) { // Yalnızca API yüklendiyse çalıştırır
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          console.log('Current position:', pos)
          setMapCenter(pos)
          setMarkerPosition(pos)
          updateLocationInfo(pos) // Yalnızca `isLoaded` olduğunda çağrılır
        },
        () => {
          console.error("Error: The Geolocation service failed.")
        }
      )
    }
  }, [isLoaded]) // `isLoaded` yüklendiğinde çalışır

  const updateLocationInfo = (location: google.maps.LatLngLiteral) => {
    if (!window.google) { // Eğer google tanımlı değilse fonksiyonu çalıştırma
      console.error("Google Maps API not loaded");
      return;
    }
  
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: location }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const addressComponents = results[0].address_components
        let country = '', city = '', address = results[0].formatted_address
  
        addressComponents.forEach(component => {
          if (component.types.includes("country")) {
            country = component.long_name
          }
          if (component.types.includes("locality") || component.types.includes("administrative_area_level_1")) {
            city = component.long_name
          }
        })
  
        setFormData(prev => ({
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
  }

  // Haritaya tıklanınca tetiklenen fonksiyon
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInterestClick = (interest: string) => {
    setFormData(prev => {
      const currentInterests = prev.interests
      if (currentInterests.includes(interest)) {
        return { ...prev, interests: currentInterests.filter(i => i !== interest) }
      } else {
        return { ...prev, interests: [...currentInterests, interest] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onRegister(formData)
    } catch (error) {
      console.error('Kayıt başarısız:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.username &&
      formData.passwordHash &&
      formData.email &&
      formData.address &&
      formData.city &&
      formData.country &&
      formData.name &&
      formData.surname &&
      formData.birthDate &&
      formData.gender &&
      formData.phoneNumber &&
      formData.interests.length > 0
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Soyad</Label>
          <Input
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="passwordHash">Şifre</Label>
        <div className="relative">
          <Input
            id="passwordHash"
            name="passwordHash"
            type={showPassword ? "text" : "password"}
            value={formData.passwordHash}
            onChange={handleInputChange}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Doğum Tarihi</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Cinsiyet</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange('gender', value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Cinsiyet seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Erkek</SelectItem>
              <SelectItem value="female">Kadın</SelectItem>
              <SelectItem value="other">Diğer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="phoneNumber">Telefon Numarası</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          required
        />
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label>İlgi Alanları</Label>
        <div className="flex flex-wrap gap-2 p-4 border rounded-md">
          {AVAILABLE_INTERESTS.map((interest) => (
            <Badge
              key={interest}
              variant={formData.interests.includes(interest) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/90"
              onClick={() => handleInterestClick(interest)}
            >
              {interest}
              {formData.interests.includes(interest) && (
                <X className="w-3 h-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
        {formData.interests.length === 0 && (
          <p className="text-sm text-red-500 mt-2">
            Lütfen en az bir ilgi alanı seçin
          </p>
        )}
      </motion.div>

      {/* Harita Alanı */}
      <motion.div variants={itemVariants} className="space-y-2">
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
                streetViewControl: false, // Pegman'i devre dışı bırakır
                mapTypeControl: false, // İsteğe bağlı, harita türü kontrolünü ekler veya kaldırır
              }}
            >
              {/* Marker is now handled in handleMapClick */}
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
          value={formData.address}
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
            value={formData.country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <ClipLoader color="#1a365d" loading={isLoading} size={30} />
              <span className="ml-2">Kaydediliyor...</span>
            </div>
          ) : (
            'Kayıt Ol'
          )}
        </Button>
      </motion.div>
    </form>
  )
}