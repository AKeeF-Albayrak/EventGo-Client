'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Loader2, Upload } from "lucide-react"
import { format } from "date-fns"
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { motion } from 'framer-motion'
import { tr } from 'date-fns/locale'

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

interface EventFormData {
  name: string;
  description: string;
  date: Date | null;
  duration: number;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  category: number;
  image: File | null;
}

const CATEGORY_MAPPING: { [key: string]: number } = {
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

export default function CreateEventPage() {
  const [eventData, setEventData] = useState<EventFormData>({
    name: '',
    description: '',
    date: null,
    duration: 0,
    address: '',
    city: '',
    country: '',
    latitude: 0,
    longitude: 0,
    category: 0,
    image: null
  });

  const [isLoading, setIsLoading] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597 });
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", 
  });

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

      setEventData(prev => ({
        ...prev,
        address,
        city: city || 'Bilinmiyor',
        country: country || 'Bilinmiyor',
        latitude: location.lat,
        longitude: location.lng
      }));
    } catch (error) {
      console.error("Geocoding hatası:", error);
      setEventData(prev => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng
      }));
    }
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const point = e.latLng.toJSON();
      setSelectedLocation(point);
      updateLocationInfo(point);
    }
  }, [updateLocationInfo]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
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
        },
        () => {
          const defaultCenter = { lat: 39.9334, lng: 32.8597 };
          map.setCenter(defaultCenter);
          setMapCenter(defaultCenter);
          setSelectedLocation(defaultCenter);
          updateLocationInfo(defaultCenter);
        }
      );
    }
  }, [updateLocationInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEventData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setEventData(prev => ({ ...prev, category: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEventData((prev) => ({ ...prev, date: date }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEventData(prev => ({ ...prev, image: file }))
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
      if (eventData.image) {
        imageBase64 = await convertFileToBase64(eventData.image);
      }

      const submitData = {
        ...eventData,
        date: eventData.date?.toISOString(),
        image: imageBase64
      };

      // API call here
      await createEvent(submitData);
      
      toast.success('Etkinlik başarıyla oluşturuldu');
      // Redirect or clear form
    } catch (error) {
      toast.error('Etkinlik oluşturulurken bir hata oluştu');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const isFormValid = () => {
    return eventData.name && eventData.description && eventData.address && eventData.category && eventData.image
  }

  const minDate = new Date()
  minDate.setHours(0, 0, 0, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Yeni Etkinlik Oluştur
        </h1>

        <motion.form onSubmit={handleSubmit} className="space-y-8">
          {/* Resim ve Temel Bilgiler Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sol Kolon - Resim */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div 
                className="relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Event Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Etkinlik görseli yüklemek için tıklayın</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG veya GIF • Max 2MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </motion.div>

            {/* Sağ Kolon - Temel Bilgiler */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium">Etkinlik Adı</Label>
                <Input
                  id="name"
                  placeholder="Etkinliğinize bir isim verin"
                  className="h-11"
                  value={eventData.name}
                  onChange={(e) => setEventData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-medium">Kategori</Label>
                <Select 
                  onValueChange={(value) => setEventData(prev => ({ 
                    ...prev, 
                    category: CATEGORY_MAPPING[value] 
                  }))}
                  value={Object.keys(CATEGORY_MAPPING)[eventData.category]}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORY_MAPPING).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-medium">Tarih</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full h-11 justify-start text-left font-normal truncate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {eventData.date ? (
                        <span className="truncate">
                          {format(eventData.date, "d MMMM yyyy", { locale: tr })}
                        </span>
                      ) : (
                        <span>Tarih Seç</span>
                      )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={eventData.date}
                        onSelect={(date) => setEventData(prev => ({ ...prev, date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-base font-medium">Süre (Dakika)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    className="h-11"
                    value={eventData.duration}
                    onChange={(e) => setEventData(prev => ({ 
                      ...prev, 
                      duration: parseInt(e.target.value) || 0 
                    }))}
                    required
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Açıklama */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Etkinliğinizi detaylı bir şekilde anlatın"
              className="min-h-[120px] resize-none"
              value={eventData.description}
              onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </motion.div>

          {/* Harita Alanı */}
          <motion.div variants={itemVariants} className="space-y-4">
            <Label className="text-base font-medium">Konum Seçin</Label>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {isLoaded ? (
                <div className="h-[400px] w-full">
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
                        title="Etkinlik Konumu"
                      />
                    )}
                  </GoogleMap>
                </div>
              ) : (
                <div className="h-[400px] bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Harita yükleniyor...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Adres Bilgileri */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-base font-medium">Adres</Label>
              <Input
                id="address"
                value={eventData.address}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-base font-medium">Şehir</Label>
              <Input
                id="city"
                value={eventData.city}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-base font-medium">Ülke</Label>
              <Input
                id="country"
                value={eventData.country}
                readOnly
                className="bg-muted"
              />
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span>Oluşturuluyor...</span>
                </div>
              ) : (
                'Etkinliği Oluştur'
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  )
}