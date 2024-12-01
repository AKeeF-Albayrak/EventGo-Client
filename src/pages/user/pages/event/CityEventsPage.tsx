import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import concertImage from '@/assets/concert-deafultEventImage.jpg';
import { useEvent } from '@/contexts/EventContext';
import Swal from 'sweetalert2';
import axiosInstance from '@/contexts/AxiosInstance';

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

const categoryNames = {
  0: "Spor",
  1: "Müzik",
  2: "Sanat",
  3: "Teknoloji",
  4: "Bilim",
  5: "Edebiyat",
  6: "Sinema",
  7: "Tiyatro",
  8: "Fotoğrafçılık",
  9: "Seyahat",
  10: "Yemek",
  11: "Dans",
  12: "Yoga",
  13: "Doğa",
  14: "Tarih"
};

// Türkiye'deki illerin listesi
const cities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
].sort();

export default function CityEventsPage() {
  const { allEvents, isLoading, fetchAllEvents } = useEvent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleJoinEvent = async (eventId: string) => {
    try {
      const response = await axiosInstance.post('/Event/JoinEvent', {
        eventId: eventId
      });

      if (response.data.success) {
        Swal.fire({
          title: 'Başarılı!',
          text: 'Etkinliğe başarıyla katıldınız!',
          icon: 'success',
          confirmButtonText: 'Tamam'
        });
        fetchAllEvents();
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: 'Etkinliğe katılırken bir hata oluştu.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  useEffect(() => {
    const filtered = allEvents.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || selectedCategory === 'all' 
        ? true 
        : event.category === parseInt(selectedCategory);
      
      const matchesCity = !selectedCity || selectedCity === 'all'
        ? true
        : event.city === selectedCity;
      
      return matchesSearch && matchesCategory && matchesCity;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, selectedCity, allEvents]);

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
            <Select onValueChange={setSelectedCity} value={selectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Şehir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Şehirler</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="0">Spor</SelectItem>
                <SelectItem value="1">Müzik</SelectItem>
                <SelectItem value="2">Sanat</SelectItem>
                <SelectItem value="3">Teknoloji</SelectItem>
                <SelectItem value="4">Bilim</SelectItem>
                <SelectItem value="5">Edebiyat</SelectItem>
                <SelectItem value="6">Sinema</SelectItem>
                <SelectItem value="7">Tiyatro</SelectItem>
                <SelectItem value="8">Fotoğrafçılık</SelectItem>
                <SelectItem value="9">Seyahat</SelectItem>
                <SelectItem value="10">Yemek</SelectItem>
                <SelectItem value="11">Dans</SelectItem>
                <SelectItem value="12">Yoga</SelectItem>
                <SelectItem value="13">Doğa</SelectItem>
                <SelectItem value="14">Tarih</SelectItem>
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
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <img
                src={event.image || concertImage}
                alt={event.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = concertImage;
                }}
              />
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-3">{event.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(event.date).toLocaleDateString('tr-TR')}, {new Date(event.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{event.duration} dakika</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.city}, {event.country}</span>
                    </div>
                    <div className="flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      <span>{categoryNames[event.category]}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={() => handleJoinEvent(event.id)}
                    className="bg-purple-500 hover:bg-purple-600 w-full"
                  >
                    Katıl
                  </Button>
                </div>
              </div>
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