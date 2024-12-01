import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: null as File | null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Yeni şifreler eşleşmiyor')
        return
      }

      const updateData = new FormData()
      updateData.append('name', formData.name)
      updateData.append('email', formData.email)
      if (formData.image) {
        updateData.append('image', formData.image)
      }
      if (formData.currentPassword && formData.newPassword) {
        updateData.append('currentPassword', formData.currentPassword)
        updateData.append('newPassword', formData.newPassword)
      }

      await updateUser(updateData)
      toast.success('Profil başarıyla güncellendi')
    } catch (error) {
      toast.error('Profil güncellenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profil Ayarları</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user?.image ? `data:image/jpeg;base64,${user.image}` : '/placeholder.svg'}
                  alt={user?.name}
                />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG veya GIF (max. 2MB)
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="text-lg font-medium">Şifre Değiştir</h3>
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">Yeni Şifre</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}