import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useAnimation, useScroll } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Footer: React.FC = () => {
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { 
    once: true, 
    amount: 0.1,
    margin: "0px 0px -100px 0px"
  });
  const controls = useAnimation();
  const location = useLocation();
  const { scrollY } = useScroll();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

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
    <motion.footer 
      ref={footerRef}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="bg-gradient-to-b from-gray-900 to-black text-white py-12"    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
          variants={containerVariants}
        >
          {/* Logo Section */}
          <motion.div 
            className="md:col-span-3"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold mb-2">EventGo</h2>
            <p className="text-sm text-gray-400">
              Etkinlikleri keşfedin, katılın ve unutulmaz deneyimler yaşayın.
            </p>
          </motion.div>

          {/* Quick Links */}
          {Object.entries(quickLinks).map(([category, links]) => (
            <motion.div 
              key={category} 
              className="md:col-span-3"
              variants={itemVariants}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <motion.li 
                  key={link.path}
                  variants={itemVariants}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
                  >
                    {link.label}
                  </Link>
                </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-800"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p 
              className="text-xs text-gray-400"
              variants={itemVariants}
            >
              &copy; {currentYear} EventGo. Tüm hakları saklıdır.
            </motion.p>
            <motion.div 
              className="flex items-center space-x-4 mt-4 md:mt-0"
              variants={itemVariants}
            >
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;