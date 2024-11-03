'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  itemVariants: any;
  onLogin: (token: string) => void;
}

export default function LoginForm({ itemVariants, onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada gerçek bir API çağrısı yapılmalı
    onLogin('fake-token');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="login-username">Kullanıcı Adı</Label>
        <Input id="login-username" required />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="login-password">Şifre</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
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
        <Button type="submit" className="w-full">Giriş Yap</Button>
      </motion.div>
    </form>
  );
}