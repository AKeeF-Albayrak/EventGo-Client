import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'react-toastify'

enum ResetStage {
  EMAIL,
  CODE,
  NEW_PASSWORD
}

interface ResetPasswordFormProps {
  itemVariants: any;
  onResetPassword: (email: string) => Promise<void>;
}

export default function ResetPasswordForm({ itemVariants, onResetPassword }: ResetPasswordFormProps) {
  const [stage, setStage] = useState<ResetStage>(ResetStage.EMAIL)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { sendResetEmail, verifyResetCode, updatePassword } = useAuth()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await sendResetEmail(email)
      toast.success('Doğrulama kodu e-posta adresinize gönderildi')
      setStage(ResetStage.CODE)
    } catch (error) {
      toast.error('E-posta gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await verifyResetCode(email, code)
      toast.success('Kod doğrulandı')
      setStage(ResetStage.NEW_PASSWORD)
    } catch (error) {
      toast.error('Kod doğrulanamadı. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Şifreler eşleşmiyor')
      return
    }
    setIsLoading(true)
    try {
      await updatePassword(email, newPassword)
      toast.success('Şifreniz başarıyla güncellendi')
      // Form'u resetle
      setEmail('')
      setCode('')
      setNewPassword('')
      setConfirmPassword('')
      setStage(ResetStage.EMAIL)
    } catch (error) {
      toast.error('Şifre güncellenemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {stage === ResetStage.EMAIL && (
        <motion.form variants={itemVariants} onSubmit={handleEmailSubmit}>
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
            </Button>
          </div>
        </motion.form>
      )}

      {stage === ResetStage.CODE && (
        <motion.form variants={itemVariants} onSubmit={handleCodeSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="6 haneli doğrulama kodu"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Doğrulanıyor...' : 'Kodu Doğrula'}
            </Button>
          </div>
        </motion.form>
      )}

      {stage === ResetStage.NEW_PASSWORD && (
        <motion.form variants={itemVariants} onSubmit={handlePasswordSubmit}>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Yeni şifre"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Yeni şifre tekrar"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </Button>
          </div>
        </motion.form>
      )}
    </div>
  )
}