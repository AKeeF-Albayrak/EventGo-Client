import { useParams } from 'react-router-dom';
import { useEvent } from '../../../../contexts/EventContext';
import type { Event } from '../../../../contexts/EventContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import ChatSection from './ChatSection';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { events, isLoading, fetchCurrentEvents } = useEvent();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchCurrentEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const selectedEvent = events.find(event => event.id == eventId);
      setEvent(selectedEvent);
    }
  }, [events, eventId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Etkinlik Bulunamadı</h2>
          <p className="text-gray-600">İstediğiniz etkinlik mevcut değil veya silinmiş olabilir.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
          <div className="space-y-3 text-gray-600 mb-6">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(event.date).toLocaleDateString('tr-TR')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{event.duration} dakika</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event.city}, {event.country}</span>
            </div>
          </div>
          <p className="text-gray-700 mb-8">{event.description}</p>
          
          {/* Chat Bölümü */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Etkinlik Sohbeti</h2>
            <ChatSection eventId={eventId} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetailPage; 