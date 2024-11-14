import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Calendar, Settings, Users, FileText, Home, LogOut } from 'lucide-react'
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

export default function AdminNavbar() {
  const [notifications, setNotifications] = React.useState(2)
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Admin Navbar items
  const navItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Kullanıcı Yönetimi' },
    { to: '/admin/all-events', icon: Calendar, label: 'Tüm Etkinlikler' },
    { to: '/admin/events-pending', icon: Calendar, label: 'Onay Bekleyen Etkinlikler' },
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
                <Link to="/admin/events">Yeni etkinlik onay bekliyor</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/admin/users">Yeni kullanıcı kaydı</Link>
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
                    alt="Admin"
                  />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Menu Items */}
              <DropdownMenuItem asChild>
                <Link to="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Ayarları
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