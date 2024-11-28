import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = {
    'Keşfet': [
      { label: 'Ana Sayfa', path: '/home' },
      { label: 'Şehir Etkinlikleri', path: '/city-events' },
      { label: 'Yeni Etkinlik Oluştur', path: '/create-event' },
    ],
    'Profilim': [
      { label: 'Katıldığım Etkinlikler', path: '/profile/events' },
      { label: 'Oluşturduğum Etkinlikler', path: '/profile/my-events' },
      { label: 'Puan Geçmişi', path: '/profile/points' },
    ],
    'Destek': [
      { label: 'Geri Bildirim', path: '/feedback' },
      { label: 'Ayarlar', path: '/profile/settings' },
      { label: 'Yardım Merkezi', path: '#' },
    ]
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo Section */}
          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-2">EventGo</h2>
            <p className="text-sm text-gray-400">
              Etkinlikleri keşfedin, katılın ve unutulmaz deneyimler yaşayın.
            </p>
          </div>

          {/* Quick Links */}
          {Object.entries(quickLinks).map(([category, links]) => (
            <div key={category} className="md:col-span-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-400">
              &copy; {currentYear} EventGo. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link 
                to="#" 
                className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
              >
                Kullanım Şartları
              </Link>
              <Link 
                to="#" 
                className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
              >
                Gizlilik Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

