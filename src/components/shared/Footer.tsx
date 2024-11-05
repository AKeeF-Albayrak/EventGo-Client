import * as React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0 px-4">
        {/* About Section */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold">EventGo</h3>
          <p className="text-sm mt-1">
            Etkinlikleri keşfetmek ve katılımı kolaylaştırmak için tasarlanmış bir platform.
          </p>
        </div>

        {/* Quick Links */}
        <ul className="flex flex-col items-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
          <li>
            <Link to="/about" className="text-sm hover:underline">
              Hakkımızda
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-sm hover:underline">
              İletişim
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="text-sm hover:underline">
              Gizlilik Politikası
            </Link>
          </li>
          <li>
            <Link to="/terms" className="text-sm hover:underline">
              Kullanım Şartları
            </Link>
          </li>
        </ul>

        {/* Social Links */}
        <div className="flex space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <Facebook className="h-5 w-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <Instagram className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 text-center text-xs text-gray-400">
        <p>&copy; {new Date().getFullYear()} EventGo. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}
