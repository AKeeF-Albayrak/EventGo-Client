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

interface RegisterFormProps {
  itemVariants: any
  onRegister: (userData: any) => Promise<void>
}

const AVAILABLE_INTERESTS = [
  "Spor", "Müzik", "Sanat", "Teknoloji", "Bilim", "Edebiyat", "Sinema",
  "Tiyatro", "Fotoğrafçılık", "Seyahat", "Yemek", "Dans", "Yoga", "Doğa", "Tarih"
]

interface Country {
  name: {
    common: string
  }
  cca2: string
}

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
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoadingCountries, setIsLoadingCountries] = useState(false)

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true)
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
        const data = await response.json()
        setCountries(data.sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common)))
      } catch (error) {
        console.error('Error fetching countries:', error)
      } finally {
        setIsLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

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
      await new Promise(resolve => setTimeout(resolve, 2000))
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
      formData.country && formData.country !== 'loading' && formData.country !== 'error' &&
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
          <Select
            value={formData.country}
            onValueChange={(value) => handleSelectChange('country', value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Ülke seçin" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCountries ? (
                <SelectItem value="loading" disabled>Yükleniyor...</SelectItem>
              ) : countries.length === 0 ? (
                <SelectItem value="error" disabled>Ülkeler yüklenemedi</SelectItem>
              ) : (
                countries.map((country) => (
                  <SelectItem key={country.cca2} value={country.cca2}>
                    {country.name.common}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
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