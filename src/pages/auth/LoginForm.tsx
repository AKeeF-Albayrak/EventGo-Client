'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from 'lucide-react'
import { ClipLoader } from 'react-spinners'

interface LoginFormProps {
  itemVariants: any
  onLogin: (username: string, password: string) => Promise<void>
}

export default function LoginForm({ itemVariants, onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Yükleme durumunu simüle etmek için 2 saniye bekleyin
      await new Promise(resolve => setTimeout(resolve, 2000))
      await onLogin(username, password)
    } catch (error) {
      console.error('Giriş başarısız:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="login-username">Kullanıcı Adı</Label>
        <Input 
          id="login-username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="login-password">Şifre</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      <motion.div variants={itemVariants} className="flex items-center space-x-2">
        <Checkbox id="remember-me" />
        <Label htmlFor="remember-me">Beni hatırla</Label>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <ClipLoader color="#1a365d" loading={isLoading} size={30} />
              <span className="ml-2">Giriş Yapılıyor...</span>
            </div>
          ) : (
            'Giriş Yap'
          )}
        </Button>
      </motion.div>
    </form>
  )
}