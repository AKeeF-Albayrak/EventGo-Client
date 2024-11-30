import { useAuth } from '../../../contexts/AuthContext';
import { useEvent } from '../../../contexts/EventContext';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import concertImage from '@/assets/concert-deafultEventImage.jpg';

const HomePage = () => {
  const { user } = useAuth();
  const { events, isLoading, fetchCurrentEvents } = useEvent();

  useEffect(() => {
    fetchCurrentEvents();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-8 text-white"
        variants={itemVariants}
      >
        <h1 className="text-4xl font-bold mb-4">Hoş Geldin, {user?.name}!</h1>
        <p className="text-lg opacity-90">Bugün nasıl bir maceraya atılmak istersin?</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-6">Katıldığın Etkinlikler</h2>
        
        {isLoading ? (
          <motion.div 
            className="flex justify-center items-center h-40"
            variants={itemVariants}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500" />
          </motion.div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
                variants={itemVariants}
              >
                <Link to={`/events/${event.id}`}>
                  <img 
                    src={event.image || concertImage} 
                    alt={event.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = concertImage;
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{event.name}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{event.duration} dakika</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.city}, {event.country}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 text-center"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-4">Henüz bir etkinliğe katılmadınız.</h3>
            <p className="text-gray-600 mb-6">Hemen yeni etkinliklere göz atın ve maceraya atılın!</p>
            <Link 
              to="/events" 
              className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors duration-300"
            >
              Etkinlikleri Keşfet
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;

