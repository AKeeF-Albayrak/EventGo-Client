import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Calendar, Settings, Star, MessageSquare, Home, Plus, LogOut } from 'lucide-react' // LogOut ikonu ekliyoruz
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
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const [notifications, setNotifications] = React.useState(2)
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Navbar items
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Anasayfa' },
    { to: '/create-event', icon: Plus, label: 'Etkinlik Oluştur' },
    { to: '/city-events', icon: Star, label: 'Şehrimdeki Etkinlikler' },
  ]

  // Çıkış yapma işlevi
  const handleLogout = () => {
    logout()
    navigate('/auth') // Çıkıştan sonra giriş sayfasına yönlendirme
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
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
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-4 w-4 text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/events/1">Yeni yazılım etkinliği bildirimi</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/events/2">Yeni spor etkinliği bildirimi</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Kullanıcı Adı</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Menu Items */}
              <DropdownMenuItem asChild>
                <Link to="/profile/events">
                  <Calendar className="mr-2 h-4 w-4" />
                  Katıldığım Etkinlikler
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
                  <Star className="mr-2 h-4 w-4" />
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
  )
}
