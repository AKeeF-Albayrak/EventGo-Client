import { useParams } from 'react-router-dom';
import { useEvent } from '../../../../contexts/EventContext';
import type { Event } from '../../../../contexts/EventContext';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Share2, Heart, X } from 'lucide-react';
import ChatSection from './ChatSection';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { getRouteInfo } from '../../../../lib/routeService';
import { Card, CardContent } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import RouteMap from '@/components/maps/RouteMap';

interface RouteInfo {
  walkingRoute: {
    duration: string;
    distance: string;
    directions: string[];
  };
  drivingRoute: {
    duration: string;
    distance: string;
    directions: string[];
  };
}

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { events, isLoading, fetchCurrentEvents } = useEvent();
  const [event, setEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lon: number} | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  if (!eventId) return <div>Etkinlik bulunamadı</div>;

  useEffect(() => {
    fetchCurrentEvents();
  }, []);

  useEffect(() => {
    if (events) {
      const foundEvent = events.find((e) => e.id === eventId);
      setEvent(foundEvent || null);
    }
  }, [events, eventId]);

  useEffect(() => {
    // Kullanıcının konumunu al
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Konum alınamadı:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchRouteInfo = async () => {
      if (userLocation && event?.latitude && event?.longitude) {
        try {
          const info = await getRouteInfo(
            userLocation.lat,
            userLocation.lon,
            event.latitude,
            event.longitude
          );
          setRouteInfo(info);
        } catch (error) {
          console.error("Rota bilgisi alınamadı:", error);
        }
      }
    };

    fetchRouteInfo();
  }, [userLocation, event]);

  if (isLoading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="container mx-auto px-4 py-8 max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sol Kolon - Etkinlik Detayları */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {event.image && (
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-[400px] object-cover cursor-zoom-in"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="p-6 space-y-6">
                <div>
                  <Badge className="mb-2">Aktif Etkinlik</Badge>
                  <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2 h-5 w-5" />
                    <span>{format(new Date(event.date), 'dd MMMM yyyy, HH:mm', { locale: tr })}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="mr-2 h-5 w-5" />
                    <span>Süre: {event.duration} dakika</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>{event.city}, {event.country}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-2">Etkinlik Açıklaması</h2>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Sohbet Bölümü */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg sticky top-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Etkinlik Sohbeti</h2>
                <ChatSection eventId={eventId} />
              </div>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <DialogContent className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-screen-xl mx-auto"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={event.image}
                alt={event.name}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </motion.div>
          </DialogContent>
        </Dialog>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Konum ve Rota Bilgileri</h3>

            {/* Harita */}
            {userLocation && event?.latitude && event?.longitude && (
              <div className="mb-6">
                <RouteMap
                  origin={{
                    lat: userLocation.lat,
                    lng: userLocation.lon
                  }}
                  destination={{
                    lat: event.latitude,
                    lng: event.longitude
                  }}
                />
              </div>
            )}

            {/* Mevcut rota bilgileri */}
            {isLoadingRoute ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : routeInfo ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Yürüyüş Rotası */}
                  {routeInfo.walkingRoute && (
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <MapPin className="w-5 h-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-medium">Yürüyerek</h4>
                        <p className="text-muted-foreground">
                          {routeInfo.walkingRoute.distance} - {routeInfo.walkingRoute.duration}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Araç Rotası */}
                  {routeInfo.drivingRoute && (
                    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <Car className="w-5 h-5 mt-1 text-primary" />
                      <div>
                        <h4 className="font-medium">Araçla</h4>
                        <p className="text-muted-foreground">
                          {routeInfo.drivingRoute.distance} - {routeInfo.drivingRoute.duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <details className="group">
                    <summary className="font-medium mb-2 cursor-pointer hover:text-primary transition-colors">
                      Detaylı Yol Tarifi
                    </summary>
                    <div className="mt-3 pl-4 border-l-2 border-primary/20">
                      <div className="space-y-4">
                        {routeInfo.drivingRoute?.steps?.length > 0 && (
                          <div>
                            <h5 className="font-medium text-sm text-primary mb-2">Araçla</h5>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                              {routeInfo.drivingRoute.steps.map((step, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {routeInfo.walkingRoute?.steps?.length > 0 && (
                          <div>
                            <h5 className="font-medium text-sm text-primary mb-2">Yürüyerek</h5>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                              {routeInfo.walkingRoute.steps.map((step, index) => (
                                <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Rota bilgileri için konum izni gerekiyor.
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventDetailPage;