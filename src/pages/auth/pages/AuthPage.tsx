import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import LoginForm from '../forms/LoginForm'
import RegisterForm from '../forms/RegisterForm'
import ResetPasswordForm from '../forms/ResetPasswordForm'
import { containerVariants, itemVariants } from '@/lib/animations'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import axiosInstance from '@/contexts/AxiosInstance'

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const handleLogin = async (username: string, password: string) => {
    try {
      const user = await login(username, password); // `user` now has type `User`
      toast.success('Giriş başarılı!');
  
      // Redirect based on user role
      if (user.role === 1) {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Giriş başarısız:', error);
      toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      const user = await register(userData)
      toast.success('Kayıt başarılı!')
      // Redirect based on user role (assuming new registrations are always regular users)
      navigate('/home')
    } catch (error) {
      console.error('Kayıt başarısız:', error)
      toast.error('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.')
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await axiosInstance.post('/Auth/ResetPassword', { email })
      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
    } catch (error) {
      console.error('Şifre sıfırlama başarısız:', error)
      toast.error('Şifre sıfırlama başarısız. Lütfen e-posta adresinizi kontrol edin.')
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">EventGo</CardTitle>
          <CardDescription className="text-center text-lg">
            Giriş yapın, kayıt olun veya şifrenizi sıfırlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="login">Giriş</TabsTrigger>
              <TabsTrigger value="register">Kayıt</TabsTrigger>
              <TabsTrigger value="reset">Şifre Sıfırlama</TabsTrigger>
            </TabsList>
            <AnimatePresence>
              {activeTab === 'login' && (
                <motion.div
                  key="login"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TabsContent value="login">
                    <LoginForm itemVariants={itemVariants} onLogin={handleLogin} />
                  </TabsContent>
                </motion.div>
              )}
              {activeTab === 'register' && (
                <motion.div
                  key="register"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TabsContent value="register">
                    <RegisterForm itemVariants={itemVariants} onRegister={handleRegister} />
                  </TabsContent>
                </motion.div>
              )}
              {activeTab === 'reset' && (
                <motion.div
                  key="reset"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TabsContent value="reset">
                    <ResetPasswordForm itemVariants={itemVariants} onResetPassword={handleResetPassword} />
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {activeTab === 'login' && "Hesabınız yok mu? "}
            {activeTab === 'register' && "Zaten hesabınız var mı? "}
            {activeTab === 'reset' && "Şifrenizi hatırladınız mı? "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            >
              {activeTab === 'login' && "Kayıt olun"}
              {activeTab === 'register' && "Giriş yapın"}
              {activeTab === 'reset' && "Giriş yapın"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}