import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff } from 'lucide-react'

interface RegisterFormProps {
  itemVariants: any
  onRegister: (userData: any) => Promise<void>
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
    interests: '',
    name: '',
    surname: '',
    birthDate: '',
    gender: '',
    phoneNumber: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onRegister(formData)
    } catch (error) {
      console.error('Kayıt başarısız:', error)
    } finally {
      setIsSubmitting(false)
    }
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
        <Label htmlFor="interests">İlgi Alanları</Label>
        <Textarea
          id="interests"
          name="interests"
          placeholder="İlgi alanlarınızı virgülle ayırarak yazın"
          value={formData.interests}
          onChange={handleInputChange}
        />
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
          <Label htmlFor="city">Şehir</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
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
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </Button>
      </motion.div>
    </form>
  )
}