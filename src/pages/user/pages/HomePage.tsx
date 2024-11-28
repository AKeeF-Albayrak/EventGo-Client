import { useAuth } from '../../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  image: string;
}

const HomePage = () => {
  const { user } = useAuth();
  const [participatedEvents, setParticipatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipatedEvents = async () => {
      // API çağrısı simülasyonu
      setTimeout(() => {
        const events = [
          {
            id: 1,
            name: 'Tech Conference 2024',
            date: '2024-05-15',
            time: '10:00',
            location: 'İstanbul',
            participants: 250,
            image: 'https://source.unsplash.com/random/800x600/?tech'
          },
          // Daha fazla etkinlik eklenebilir
        ];
        setParticipatedEvents(events);
        setIsLoading(false);
      }, 1000);
    };

    fetchParticipatedEvents();
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
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participatedEvents.map((event) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
                variants={itemVariants}
              >
                <Link to={`/events/${event.id}`}>
                  <img 
                    src={event.image} 
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{event.name}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.participants} Katılımcı</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HomePage;

