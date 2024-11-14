import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/contexts/AxiosInstance';

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
}

interface AdminContextType {
  events: Event[];
  approveEvent: (eventId: string) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  fetchEvents: () => Promise<void>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/Event/GetAllEventsForAdmin');
      if (response.data.success) {
        setEvents(response.data.events);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const approveEvent = async (eventId: string) => {
    try {
      const response = await axiosInstance.post('/Event/ApproveEvent', {
        id: eventId  // Changed from eventId to match the API spec exactly
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setEvents(events.map(event => 
          event.id === eventId ? { ...event, isApproved: true } : event
        ));
      } else {
        throw new Error(response.data.message || 'Failed to approve event');
      }
    } catch (error) {
      console.error('Failed to approve event:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/Event/DeleteEvent`, {
        data: { id: eventId },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  };
  

  return (
    <AdminContext.Provider value={{ events, approveEvent, deleteEvent, fetchEvents, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};