'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  itemVariants: any;
  onRegister: (token: string) => void;
}

export default function RegisterForm({ itemVariants, onRegister }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada gerçek bir API çağrısı yapılmalı
    onRegister('fake-token');
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="register-firstname">Ad</Label>
          <Input id="register-firstname" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-lastname">Soyad</Label>
          <Input id="register-lastname" required />
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="register-username">Kullanıcı Adı</Label>
        <Input id="register-username" required />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="register-email">E-posta</Label>
        <Input id="register-email" type="email" required />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="register-password">Şifre</Label>
        <div className="relative">
          <Input
            id="register-password"
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
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="register-birthdate">Doğum Tarihi</Label>
          <Input id="register-birthdate" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-gender">Cinsiyet</Label>
          <Select>
            <SelectTrigger id="register-gender">
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
        <Label htmlFor="register-phone">Telefon Numarası</Label>
        <Input id="register-phone" type="tel" />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="register-interests">İlgi Alanları</Label>
        <Textarea id="register-interests" placeholder="İlgi alanlarınızı virgülle ayırarak yazın" />
      </motion.div>
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="register-profile-image">Profil Fotoğrafı</Label>
        <Input id="register-profile-image" type="file" accept="image/*" onChange={handleImageUpload} />
        {profileImage && (
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={profileImage} alt="Profil fotoğrafı" />
            <AvatarFallback>PF</AvatarFallback>
          </Avatar>
        )}
      </motion.div>
      <motion.div variants={itemVariants} className="flex items-center space-x-2">
        <Checkbox id="terms" required />
        <Label htmlFor="terms">
          <span>
            <a href="#" className="text-primary hover:underline">Kullanım şartlarını</a> ve{' '}
            <a href="#" className="text-primary hover:underline">gizlilik politikasını</a> kabul ediyorum
          </span>
        </Label>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full">Kayıt Ol</Button>
      </motion.div>
    </form>
  );
}
