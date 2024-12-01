import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Settings, Users, Home, LogOut, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import Swal from 'sweetalert2'

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Kullanıcı Yönetimi' },
    { to: '/admin/all-events', icon: Calendar, label: 'Tüm Etkinlikler' },
    { to: '/admin/events-pending', icon: Calendar, label: 'Onay Bekleyen Etkinlikler' },
  ]

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
        logout()
        navigate('/auth')
        Swal.fire(
          'Çıkış Yapıldı!',
          'Başarıyla çıkış yaptınız.',
          'success'
        )
      }
    })
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <Link to="/admin/dashboard" className="mr-6 flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">EventGo Admin</span>
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

        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          {/* Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 overflow-hidden rounded-full">
                  <AvatarImage
                    src={user?.image ? `data:image/jpeg;base64,${user.image}` : '/placeholder.svg'}
                    alt="Admin"
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || 'admin@example.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Menu Items */}
              <DropdownMenuItem asChild>
                <Link to="/admin/feedbacks">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Geri Bildirimler
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
  )
}