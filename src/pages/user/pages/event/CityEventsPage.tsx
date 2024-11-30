import { useEffect, useState } from 'react';
// import { useEvent } from '@/contexts/EventContext';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import concertImage from '@/assets/concert-deafultEventImage.jpg';

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

// Mock data for events
const mockEvents = [
  {
    id: '1',
    name: 'Summer Music Festival',
    description: 'A vibrant celebration of music featuring local and international artists.',
    date: '2024-07-15',
    duration: 480,
    address: 'Central Park, Istanbul',
    image: 'https://source.unsplash.com/random/800x600/?concert',
    category: '1'
  },
  {
    id: '2',
    name: 'Tech Conference 2024',
    description: 'Explore the latest innovations in technology and digital transformation.',
    date: '2024-09-22',
    duration: 480,
    address: 'Istanbul Congress Center',
    image: 'https://source.unsplash.com/random/800x600/?technology',
    category: '4'
  },
  {
    id: '3',
    name: 'Istanbul Marathon',
    description: 'Join thousands of runners in this annual city-wide running event.',
    date: '2024-11-03',
    duration: 300,
    address: 'Sultanahmet Square, Istanbul',
    image: 'https://source.unsplash.com/random/800x600/?marathon',
    category: '2'
  },
  {
    id: '4',
    name: 'Modern Art Exhibition',
    description: 'A showcase of contemporary art from emerging Turkish artists.',
    date: '2024-08-10',
    duration: 180,
    address: 'Istanbul Modern, Karaköy',
    image: 'https://source.unsplash.com/random/800x600/?art',
    category: '3'
  }
];

export default function CityEventsPage() {
  // const { events, isLoading, fetchEvents } = useEvent();
  const [events, setEvents] = useState(mockEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(events);

  useEffect(() => {
    // Simulating data fetching
    setIsLoading(true);
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory && selectedCategory !== 'all' ? event.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, events]);

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Şehrimdeki Etkinlikler</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Etkinlik ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="1">Müzik</SelectItem>
                <SelectItem value="2">Spor</SelectItem>
                <SelectItem value="3">Sanat</SelectItem>
                <SelectItem value="4">Teknoloji</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Link to={`/events/${event.id}`}>
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={event.image || concertImage}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{event.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
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
                      <span>{event.address}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && filteredEvents.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 text-gray-500"
        >
          <Filter className="w-12 h-12 mx-auto mb-4" />
          <p>Aradığınız kriterlere uygun etkinlik bulunamadı.</p>
        </motion.div>
      )}
    </motion.div>
  );
}

