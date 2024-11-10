import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClipLoader } from 'react-spinners'

interface ResetPasswordFormProps {
  itemVariants: any
  onResetPassword: (email: string) => Promise<void>
}

export default function ResetPasswordForm({ itemVariants, onResetPassword }: ResetPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onResetPassword(email)
      setEmail('')
    } catch (error) {
      console.error('Şifre sıfırlama başarısız:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="reset-email">E-posta</Label>
        <Input 
          id="reset-email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@email.com"
          required 
          disabled={isLoading}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <ClipLoader color="#ffffff" loading={isLoading} size={20} />
          ) : (
            'Şifre Sıfırlama Bağlantısı Gönder'
          )}
        </Button>
      </motion.div>
    </form>
  )
}