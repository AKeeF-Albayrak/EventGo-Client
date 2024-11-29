import { useState, useEffect, useMemo } from 'react';
import axiosInstance from '@/contexts/AxiosInstance';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  role: number;
  birthDate: string;
  gender: boolean;
  latitude?: number;
  longitude?: number;
  interests: number[];
  image?: string | null;
  createdTime: string;
  passwordHash?: string;
}

export default function UserManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/Users/GetUsers');
      const userData = response.data.users || [];
      setUsers(userData);
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Hatası:', error);
      toast.error('Kullanıcılar yüklenirken bir hata oluştu');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await axiosInstance.delete('/Users/DeleteUser', {
          data: { id: userId }
        });
        toast.success('Kullanıcı başarıyla silindi');
        fetchUsers();
      } catch (error) {
        toast.error('Kullanıcı silinirken bir hata oluştu');
      }
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      console.log('Güncellenecek kullanıcı verisi:', updatedUser);
      const response = await axiosInstance.put('/Users/UpdateUser', {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        address: updatedUser.address,
        city: updatedUser.city,
        country: updatedUser.country,
        latitude: updatedUser.latitude,
        longitude: updatedUser.longitude,
        interests: updatedUser.interests,
        name: updatedUser.name,
        surname: updatedUser.surname,
        phoneNumber: updatedUser.phoneNumber,
        image: updatedUser.image,
        passwordHash: updatedUser.passwordHash || "",
        role: updatedUser.role,
        birthDate: updatedUser.birthDate,
        gender: updatedUser.gender
      });
      
      console.log('API Yanıtı:', response.data);
      
      if (response.data.success) {
        toast.success('Kullanıcı başarıyla güncellendi');
        setIsEditDialogOpen(false);
        await fetchUsers(); // Kullanıcı listesini yeniden yükle
      } else {
        toast.error('Güncelleme başarısız: ' + (response.data.message || 'Bilinmeyen hata'));
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      toast.error('Kullanıcı güncellenirken bir hata oluştu');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!user) return false;
      
      return Object.values(user).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [users, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('Users state:', users);
  }, [users]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatRole = (role: number) => {
    switch (role) {
      case 0:
        return 'Kullanıcı';
      case 1:
        return 'Admin';
      default:
        return 'Bilinmiyor';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kullanıcı ara..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad Soyad</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Şehir</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.name} ${user.surname}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{formatRole(user.role)}</TableCell>
                <TableCell>{formatDate(user.createdTime)}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingUser(user);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                {loading ? 'Yükleniyor...' : 'Kullanıcı bulunamadı'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Kullanıcı Düzenle</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(editingUser);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Input
                    id="username"
                    value={editingUser.username}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, username: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Ad</Label>
                  <Input
                    id="name"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Soyad</Label>
                  <Input
                    id="surname"
                    value={editingUser.surname}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, surname: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Telefon</Label>
                  <Input
                    id="phoneNumber"
                    value={editingUser.phoneNumber}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    value={editingUser.address}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, address: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Şehir</Label>
                  <Input
                    id="city"
                    value={editingUser.city}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Ülke</Label>
                  <Input
                    id="country"
                    value={editingUser.country}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, country: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Enlem</Label>
                  <Input
                    id="latitude"
                    type="number"
                    value={editingUser.latitude}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, latitude: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Boylam</Label>
                  <Input
                    id="longitude"
                    type="number"
                    value={editingUser.longitude}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, longitude: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Doğum Tarihi</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={editingUser.birthDate.split('T')[0]}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, birthDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Cinsiyet</Label>
                  <Select
                    value={editingUser.gender ? "true" : "false"}
                    onValueChange={(value) =>
                      setEditingUser({ ...editingUser, gender: value === "true" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Cinsiyet seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Erkek</SelectItem>
                      <SelectItem value="false">Kadın</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={editingUser.role.toString()}
                    onValueChange={(value) =>
                      setEditingUser({ ...editingUser, role: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rol seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Kullanıcı</SelectItem>
                      <SelectItem value="1">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Profil Resmi URL</Label>
                  <Input
                    id="image"
                    value={editingUser.image || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, image: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>İlgi Alanları</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={editingUser.interests.includes(interest)}
                        onCheckedChange={(checked) => {
                          const newInterests = checked
                            ? [...editingUser.interests, interest]
                            : editingUser.interests.filter((i) => i !== interest);
                          setEditingUser({ ...editingUser, interests: newInterests });
                        }}
                      />
                      <Label htmlFor={`interest-${interest}`}>İlgi Alanı {interest}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type="submit">Kaydet</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

