import React, { createContext, useContext, useState } from 'react';
import axiosInstance from './AxiosInstance';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  duration: number;
  address: string;
  city: string;
  country: string;
  category: number;
  isApproved: boolean;
  createdTime: string;
  latitude?: number;
  longitude?: number;
  image?: string;
}

interface EventContextType {
  events: Event[];
  userEvents: Event[];
  allEvents: Event[];
  isLoading: boolean;
  fetchCurrentEvents: () => Promise<void>;
  fetchPastEvents: () => Promise<void>;
  fetchAllEvents: () => Promise<void>;
  addEvent: (eventData: FormData) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  joinEvent: (eventId: string) => Promise<void>;
  leaveEvent: (eventId: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/Event/GetUsersCurrentEvents');
      if (response.data.success) {
        const eventsWithImages = response.data.events.map((event: Event) => ({
          ...event,
          image: event.image ? `data:image/jpeg;base64,${event.image}` : null
        }));
        setEvents(eventsWithImages);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Mevcut etkinlikler getirilemedi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPastEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/Event/GetUsersPastEvents');
      if (response.data.success) {
        const pastEventsWithImages = response.data.events.map((event: Event) => ({
          ...event,
          image: event.image ? `data:image/jpeg;base64,${event.image}` : null
        }));
        setUserEvents(pastEventsWithImages);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Geçmiş etkinlikler getirilemedi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/Event/GetEventsForUser');
      if (response.data.events) {
        const eventsWithImages = response.data.events.map((event: Event) => ({
          ...event,
          image: event.image ? `data:image/jpeg;base64,${event.image}` : null
        }));
        setAllEvents(eventsWithImages);
      }
    } catch (error) {
      console.error('Tüm etkinlikler getirilemedi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: FormData) => {
    try {
      // FormData'dan JSON objesine dönüştürme
      const imageFile = eventData.get('Image') as File;
      
      // Base64'e dönüştürme
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Base64 string'in data:image/jpeg;base64, kısmını kaldır
          resolve(base64String.split(',')[1]);
        };
        reader.readAsDataURL(imageFile);
      });

      const eventPayload = {
        name: eventData.get('Name'),
        description: eventData.get('Description'),
        date: eventData.get('Date'),
        duration: Number(eventData.get('Duration')),
        address: eventData.get('Address'),
        city: eventData.get('City'),
        country: eventData.get('Country'),
        latitude: Number(eventData.get('Latitude')),
        longitude: Number(eventData.get('Longitude')),
        category: Number(eventData.get('Category')),
        image: base64Image
      };

      const response = await axiosInstance.post('/Event/AddEvent', eventPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Etkinlik eklenirken bir hata oluştu');
      }
      
      console.log('Sunucu yanıtı:', response.data);
      
      await fetchCurrentEvents();
      return response.data;
      
    } catch (error) {
      console.error('Etkinlik eklenirken hata:', error);
      throw error;
    }
  };

  const updateEvent = async (event: Event) => {
    try {
      const response = await axiosInstance.put('/Event/UpdateEvent', event);
      if (response.data.success) {
        setEvents(events.map(e => e.id === event.id ? { ...e, ...event } : e));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Etkinlik güncellenemedi:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await axiosInstance.delete('/Event/DeleteEvent', {
        data: { id: eventId }
      });
      if (response.data.success) {
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Etkinlik silinemedi:', error);
      throw error;
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      const response = await axiosInstance.post('/Event/JoinEvent', { eventId });
      if (response.data.success) {
        await fetchPastEvents(); // Kullanıcının etkinlik listesini güncelle
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Etkinliğe katılınamadı:', error);
      throw error;
    }
  };

  const leaveEvent = async (eventId: string) => {
    try {
      const response = await axiosInstance.post('/Event/LeaveEvent', { eventId });
      if (response.data.success) {
        await fetchPastEvents(); // Kullanıcının etkinlik listesini güncelle
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Etkinlikten ayrılınamadı:', error);
      throw error;
    }
  };

  return (
    <EventContext.Provider value={{
      events,
      userEvents,
      allEvents,
      isLoading,
      fetchCurrentEvents,
      fetchPastEvents,
      fetchAllEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      joinEvent,
      leaveEvent
    }}>
      {children}
    </EventContext.Provider>
  );
}; 