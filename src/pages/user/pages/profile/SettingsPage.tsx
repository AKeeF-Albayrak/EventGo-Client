import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageUpload } from '@/pages/admin/Content/ImageUpload'
import Swal from 'sweetalert2'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    image: user?.image || null,
  })

  const handleImageChange = (imageBase64: string) => {
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1];
      setFormData(prev => ({ ...prev, image: base64Data }));
    } else {
      setFormData(prev => ({ ...prev, image: null }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Onay dialogu göster
    const result = await Swal.fire({
      title: 'Profil Güncellemesi',
      text: 'Profil bilgilerinizi güncellemek istediğinizden emin misiniz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Evet, Güncelle',
      cancelButtonText: 'İptal',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (result.isConfirmed) {
      setIsLoading(true)
      try {
        await updateUser(formData)
        
        // Başarılı güncelleme mesajı
        await Swal.fire({
          title: 'Başarılı!',
          text: 'Profil bilgileriniz başarıyla güncellendi.',
          icon: 'success',
          confirmButtonText: 'Tamam'
        });
      } catch (error) {
        // Hata mesajı
        await Swal.fire({
          title: 'Hata!',
          text: 'Profil güncellenirken bir hata oluştu.',
          icon: 'error',
          confirmButtonText: 'Tamam'
        });
        console.error('Güncelleme hatası:', error)
      } finally {
        setIsLoading(false)
      }
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
              <div className="flex-1">
                <ImageUpload
                  currentImage={user?.image ? `data:image/jpeg;base64,${user.image}` : ''}
                  onImageChange={handleImageChange}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  PNG, JPG veya GIF (max. 2MB)
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Soyad</Label>
                  <Input
                    id="surname"
                    value={formData.surname}
                    onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                  />
                </div>
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

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Telefon Numarası</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">Şehir</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Ülke</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  />
                </div>
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