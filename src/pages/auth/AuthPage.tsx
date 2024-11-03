'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useAuth } from '@/contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (token: string) => {
    login(token);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Etkinlik Platformu</CardTitle>
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
            <AnimatePresence mode="sync">
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
                    <RegisterForm itemVariants={itemVariants} onRegister={handleLogin} />
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
                    <ResetPasswordForm itemVariants={itemVariants} />
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
  );
}