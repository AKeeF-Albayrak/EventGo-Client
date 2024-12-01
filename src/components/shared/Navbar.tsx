import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Calendar, Settings, Star, MessageSquare, Home, Plus, LogOut, Coins, Tickets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import { useSignalRNotifications } from '@/hooks/useSignalRNotifications';
import axiosInstance from '@/contexts/AxiosInstance';

interface Notification {
  id: string;
  message: string;
  link: string;
  createdAt: string;
  isRead: boolean;
  isDeleted: boolean;
}

export default function Navbar() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const hubUrl = "https://localhost:7059/notificationsHub";
  const newNotifications = useSignalRNotifications(hubUrl);

  React.useEffect(() => {
    if (newNotifications.length > 0) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
        return [...prev, ...uniqueNewNotifications];
      });
    }
  }, [newNotifications]);

  // Navbar items
  const navItems = [
    { to: '/home', icon: Home, label: 'Anasayfa' },
    { to: '/create-event', icon: Plus, label: 'Etkinlik Oluştur' },
    { to: '/city-events', icon: Tickets , label: 'Şehrimdeki Etkinlikler' },
  ];

  // Çıkış yapma işlevi
  const handleLogout = () => {
    Swal.fire({
      title: 'Çıkış yapmak istediğinize emin misiniz?',
      text: "Oturumunuz sonlandırılacak.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Evet, çıkış yap',
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/auth');
        Swal.fire(
          'Çıkış Yapıldı!',
          'Başarıyla çıkış yaptınız.',
          'success'
        );
      }
    });
  };

  // Bildirimleri yükle
  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/Users/GetNotifications');
        if (response.data.success) {
          // Sadece silinmemiş bildirimleri göster
          const activeNotifications = response.data.notifications.filter(
            (n: Notification) => !n.isDeleted
          );
          setNotifications(activeNotifications);
        }
      } catch (error) {
        console.error('Bildirimler alınamadı:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Bildirimi sil fonksiyonu (markAsRead yerine)
  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await axiosInstance.delete('/Users/DeleteNotifications', {
        data: { 
          id: notificationId,
          permanentDelete: true // Backend'e kalıcı silme işareti gönder
        }
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        console.log('Bildirim kalıcı olarak silindi:', notificationId);
      } else {
        console.error('Bildirim silme başarısız:', response.data);
      }
    } catch (error) {
      console.error('Bildirim silinemedi:', error);
    }
  };

  // Tarih formatlama yardımcı fonksiyonu ekleyelim
  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Az önce";
    if (diffInMinutes < 60) return `${diffInMinutes} dakika önce`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <Link to="/home" className="mr-6 flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">EventGo</span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.to}
              variant="ghost"
              size="sm"
              asChild
            >
              <Link to={item.to} className="flex items-center space-x-2">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>

        {/* Notification & Profile Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications.filter(n => !n.isRead).length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 max-h-[32rem] overflow-y-auto">
              <DropdownMenuLabel className="flex justify-between items-center py-2">
                <span>Bildirimler</span>
                {notifications.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {notifications.filter(n => !n.isRead).length} okunmamış
                  </span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`flex flex-col items-start p-3 hover:bg-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between w-full gap-2">
                      <Link 
                        to={notification.link} 
                        className="flex-1 text-sm line-clamp-2 break-words"
                      >
                        {notification.message}
                      </Link>
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-6 px-2 text-xs shrink-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          Sil
                        </Button>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {formatNotificationDate(notification.createdAt)}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="text-center py-4">
                  Bildirim bulunmamaktadır
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                  <AvatarImage
                    src={user?.image ? `data:image/jpeg;base64,${user.image}` : '/placeholder.svg'}
                    alt="User"
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || 'Kullanıcı Adı'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Menu Items */}
              <DropdownMenuItem asChild>
                <Link to="/profile/events">
                  <Calendar className="mr-2 h-4 w-4" />
                  Geçmiş Etkinliklerim
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile/my-events">
                  <Star className="mr-2 h-4 w-4" />
                  Oluşturduğum Etkinlikler
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile/points">
                  <Coins className="mr-2 h-4 w-4" />
                  Puan Geçmişi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Ayarlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/feedback">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Geri Bildirim Gönder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Logout Item */}
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}