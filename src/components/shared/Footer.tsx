import { Link } from 'react-router-dom';
import { Home, Calendar, Settings, MessageSquare, Plus, Star,Coins,Tickets   } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationItems = [
    { icon: Home, label: 'Ana Sayfa', path: '/home' },
    { icon: Tickets , label: 'Şehir Etkinlikleri', path: '/city-events' },
    { icon: Calendar, label: 'Katıldığım Etkinlikler', path: '/profile/events' },
    { icon: Star, label: 'Oluşturduğum Etkinlikler', path: '/profile/my-events' },
    { icon: Coins, label: 'Puan Geçmişi', path: '/profile/points' },
    { icon: Settings, label: 'Ayarlar', path: '/profile/settings' },
    { icon: MessageSquare, label: 'Geri Bildirim', path: '/feedback' },
  ];

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Quick Navigation */}
          <nav className="flex flex-wrap justify-center gap-4">
            <TooltipProvider>
              {navigationItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link to={item.path}>
                      <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-gray-700">
                        <item.icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>

          {/* Create Event Button */}
          <Link to="/create-event" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Yeni Etkinlik Oluştur
            </Button>
          </Link>

          {/* About Section */}
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">EventGo</h3>
            <p className="text-sm">
              Etkinlikleri keşfetmek ve katılımı kolaylaştırmak için tasarlanmış yenilikçi bir platform.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-400">
            <p>&copy; {currentYear} EventGo. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

