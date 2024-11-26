'use client'

import React,{ useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Upload } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'

interface RegisterFormProps {
  itemVariants: any
  onRegister: (userData: any) => Promise<void>
}

const AVAILABLE_INTERESTS = [
  "Spor", "Müzik", "Sanat", "Teknoloji", "Bilim", "Edebiyat", "Sinema",
  "Tiyatro", "Fotoğrafçılık", "Seyahat", "Yemek", "Dans", "Yoga", "Doğa", "Tarih"
]

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const INTEREST_MAPPING: { [key: string]: number } = {
  "Spor": 0,
  "Müzik": 1,
  "Sanat": 2,
  "Teknoloji": 3,
  "Bilim": 4,
  "Edebiyat": 5,
  "Sinema": 6,
  "Tiyatro": 7,
  "Fotoğrafçılık": 8,
  "Seyahat": 9,
  "Yemek": 10,
  "Dans": 11,
  "Yoga": 12,
  "Doğa": 13,
  "Tarih": 14
};

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
    image: null as File | null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597 })
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    if (loadError) {
      console.error("Harita yükleme hatası:", loadError);
    }
  }, [loadError]);

  const updateLocationInfo = useCallback(async (location: google.maps.LatLngLiteral) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (results, status) => {
          if (status === "OK" && results?.[0]) {
            resolve(results[0]);
          } else {
            reject(status);
          }
        });
      });

      const result = response as google.maps.GeocoderResult;
      const addressComponents = result.address_components;
      let country = '', city = '', address = result.formatted_address;

      for (const component of addressComponents) {
        if (component.types.includes("country")) {
          country = component.long_name;
        }
        if (component.types.includes("administrative_area_level_1")) {
          city = component.long_name;
        }
      }

      setFormData(prev => ({
        ...prev,
        address,
        city: city || 'Bilinmiyor',
        country: country || 'Bilinmiyor',
        latitude: location.lat,
        longitude: location.lng
      }));
    } catch (error) {
      console.error("Geocoding hatası:", error);
      setFormData(prev => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng
      }));
    }
  }, []);

  const updateOrCreateMarker = useCallback((position: google.maps.LatLngLiteral) => {
    if (marker) {
      marker.setMap(null);
    }
    setSelectedLocation(position);
  }, [marker]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const point = e.latLng.toJSON();
      setSelectedLocation(point);
      updateLocationInfo(point);
      updateOrCreateMarker(point);
    }
  }, [updateLocationInfo, updateOrCreateMarker]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          setMapCenter(pos);
          setSelectedLocation(pos);
          updateLocationInfo(pos);
          updateOrCreateMarker(pos);
        },
        () => {
          const defaultCenter = { lat: 39.9334, lng: 32.8597 };
          map.setCenter(defaultCenter);
          setMapCenter(defaultCenter);
          setSelectedLocation(defaultCenter);
          updateLocationInfo(defaultCenter);
          updateOrCreateMarker(defaultCenter);
        }
      );
    }
  }, [updateLocationInfo, updateOrCreateMarker]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let imageBase64 = '';
      if (formData.image) {
        imageBase64 = await convertFileToBase64(formData.image);
      }

      const numericInterests = formData.interests.map(interest => INTEREST_MAPPING[interest]);

      const genderBoolean = formData.gender === "1";

      const submitData = {
        ...formData,
        interests: numericInterests,
        image: imageBase64,
        gender: genderBoolean,
        birthDate: new Date(formData.birthDate).toISOString()
      };

      await onRegister(submitData);
    } catch (error) {
      console.error('Kayıt başarısız:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Profile Section */}
      <motion.div variants={itemVariants} className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-muted/50">
        <div className="relative w-32 h-32 group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full border-4 border-background transition-opacity duration-200 group-hover:opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </>
          ) : (
            <div className="w-full h-full rounded-full bg-muted flex items-center justify-center border-4 border-background">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            variant="secondary"
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Profil Resmi Yükle</span>
          </Button>
          <input
            type="file"
            id="profilePicture"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <p className="text-sm text-muted-foreground">
            JPG, PNG veya GIF • Max 2MB
          </p>
        </div>
      </motion.div>

      {/* Personal Information Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
      </motion.div>

      {/* Kullanıcı Adı */}
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="username">Kullanıcı Adı</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
          autoComplete="off"
        />
      </motion.div>

      {/* E-posta */}
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

      {/* Şifre */}
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

      {/* Doğum Tarihi ve Cinsiyet */}
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
              <SelectItem value="1">Erkek</SelectItem>
              <SelectItem value="0">Kadın</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Telefon Numarası */}
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

      {/* İlgi Alanları */}
      <motion.div variants={itemVariants} className="space-y-2">
        <Label>İlgi Alanları</Label>
        <div className="flex flex-wrap gap-2 p-4 border rounded-md">
          {AVAILABLE_INTERESTS.map((interest) => (
            <Badge
              key={interest}
              variant={formData.interests.includes(interest) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors duration-200"
            
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
        {!isLoaded ? (
          <div className="flex items-center justify-center h-[400px] bg-muted">
            <div className="text-center">
              <ClipLoader color="#1a365d" size={40} />
              <p className="mt-2">Harita yükleniyor...</p>
            </div>
          </div>
        ) : (
          <div style={{ height: '400px', width: '100%', position: 'relative' }}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={mapCenter}
              zoom={12}
              onClick={handleMapClick}
              onLoad={onMapLoad}
              options={{
                mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControl: true,
                scrollwheel: true,
                gestureHandling: 'greedy',
                fullscreenControl: true,
                scaleControl: true,
                rotateControl: false,
                clickableIcons: false,
              }}
            >
              {selectedLocation && (
                <Marker
                  position={selectedLocation}
                  title="Seçilen Konum"
                />
              )}
            </GoogleMap>
          </div>
        )}
      </motion.div>
      
      {/* Adres */}
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="address">Adres</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          readOnly
        />
      </motion.div>

      {/* Ülke ve Şehir */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country">Ülke</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            readOnly
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            readOnly
          />
        </div>
      </motion.div>

      {/* Kayıt ol butonu */}
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