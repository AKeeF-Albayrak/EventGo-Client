'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps {
  itemVariants: any;
}

export default function ResetPasswordForm({ itemVariants }: ResetPasswordFormProps) {
  return (
    <form className="space-y-6">
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="reset-email">E-posta</Label>
        <Input id="reset-email" type="email" required />
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full">Şifre Sıfırlama Bağlantısı Gönder</Button>
      </motion.div>
    </form>
  );
}