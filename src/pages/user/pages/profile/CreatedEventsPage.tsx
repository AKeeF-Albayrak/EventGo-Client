import { useEffect } from 'react';
import { useEvent } from '@/contexts/EventContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import concertImage from '@/assets/concert-deafultEventImage.jpg';
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock as ClockIcon } from 'lucide-react';

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

export default function CreatedEventsPage() {
  const { createdEvents = [], isLoading, fetchCreatedEvents } = useEvent();

  useEffect(() => {
    fetchCreatedEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500" />
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-2xl font-bold mb-6"
        variants={itemVariants}
      >
        Oluşturduğum Etkinlikler
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {Array.isArray(createdEvents) && createdEvents.map((event) => (
          <motion.div
            key={event.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <Link to={`/events/${event.id}`}>
              <div className="w-full overflow-hidden">
                <img 
                  src={event.image || concertImage} 
                  alt={event.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = concertImage;
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{event.name}</h3>
                  <Badge 
                    variant={event.isApproved === true ? "success" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {event.isApproved === true ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Onaylandı
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        Onay Bekliyor
                      </>
                    )}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{format(new Date(event.date), 'dd MMMM yyyy, HH:mm', { locale: tr })}</span>
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
        
        {(!createdEvents || createdEvents.length === 0) && (
          <motion.div 
            className="col-span-full text-center py-8 text-gray-500"
            variants={itemVariants}
          >
            <h3 className="text-xl font-semibold mb-4">Henüz hiç etkinlik oluşturmadınız.</h3>
            <p className="text-gray-600 mb-6">Hemen yeni bir etkinlik oluşturun ve insanları bir araya getirin!</p>
            <Link 
              to="/create-event" 
              className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors duration-300"
            >
              Etkinlik Oluştur
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}