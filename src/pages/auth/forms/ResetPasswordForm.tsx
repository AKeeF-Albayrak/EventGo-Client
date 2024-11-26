import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'react-toastify'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

enum ResetStage {
  EMAIL,
  CODE,
  NEW_PASSWORD
}

interface ResetPasswordFormProps {
  itemVariants: any;
  onResetPassword: (email: string) => Promise<void>;
}

export default function EnhancedResetPasswordForm({ itemVariants, onResetPassword }: ResetPasswordFormProps) {
  const [stage, setStage] = useState<ResetStage>(ResetStage.EMAIL)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(180)
  const [isExpired, setIsExpired] = useState<boolean>(false)
  
  const { sendResetEmail, verifyResetCode, updatePassword } = useAuth()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (stage === ResetStage.CODE && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsExpired(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [stage, timeLeft])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await sendResetEmail(email)
      toast.success('Doğrulama kodu e-posta adresinize gönderildi')
      setStage(ResetStage.CODE)
      setTimeLeft(180)
      setIsExpired(false)
    } catch (error) {
      toast.error('E-posta gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isExpired) {
      toast.error('Doğrulama kodunun süresi doldu. Lütfen yeni kod talep edin.')
      return
    }
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
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={timeLeft}
                  maxValue={180}
                  text={`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathTransitionDuration: 0.5,
                    pathColor: isExpired ? '#EF4444' : '#3B82F6',
                    textColor: isExpired ? '#EF4444' : '#1F2937',
                    trailColor: '#E5E7EB',
                  })}
                />
              </div>
              <p className="text-sm text-gray-500">
                {isExpired 
                  ? 'Yeni bir doğrulama kodu talep edebilirsiniz' 
                  : 'Doğrulama kodunu girin'}
              </p>
            </div>

            <Input
              type="text"
              placeholder="6 haneli doğrulama kodu"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
              disabled={isExpired}
              className={`text-center text-lg tracking-wider ${
                isExpired ? 'opacity-50' : ''
              }`}
            />

            {isExpired ? (
              <Button 
                type="button" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent)}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                  Yeni Kod Gönder
                </div>
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Doğrulanıyor...' : 'Kodu Doğrula'}
              </Button>
            )}
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

