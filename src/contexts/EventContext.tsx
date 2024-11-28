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
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  fetchUserEvents: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/Event/GetEventsForUser');
      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Etkinlikler getirilemedi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/Event/GetUserEvents');
      if (response.data.success) {
        setUserEvents(response.data.events);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Kullanıcı etkinlikleri getirilemedi:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addEvent = async (eventData: FormData) => {
    try {
      const response = await axiosInstance.post('/Event/AddEvent', eventData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        await fetchEvents(); // Etkinlik listesini güncelle
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Etkinlik eklenemedi:', error);
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
        await fetchUserEvents(); // Kullanıcının etkinlik listesini güncelle
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
        await fetchUserEvents(); // Kullanıcının etkinlik listesini güncelle
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
      isLoading,
      fetchEvents,
      fetchUserEvents,
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