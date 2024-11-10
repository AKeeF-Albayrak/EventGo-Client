import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/contexts/AxiosInstance';

interface User {
  name: string;
  role: number;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  interests?: string[];
  surname?: string;
  birthDate?: string;
  gender?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('AccessToken');
      const storedUser = localStorage.getItem('User');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser)); // Kullanıcı bilgilerini state'e yükle
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    try {
      const response = await axiosInstance.post('/Auth/Login', { username, password });
      const { token, user: userDetails } = response.data;
  
      localStorage.setItem('AccessToken', token); 
      localStorage.setItem('User', JSON.stringify(userDetails)); // Kullanıcı bilgilerini sakla
      setUser(userDetails); 
      setIsAuthenticated(true);
  
      return userDetails;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await axiosInstance.post('/Auth/SignUp', userData);
      const { token, user: userDetails } = response.data;
  
      localStorage.setItem('AccessToken', token);
      localStorage.setItem('User', JSON.stringify(userDetails)); // Kullanıcı bilgilerini sakla
      setUser(userDetails);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('AccessToken'); // Token’ı ve kullanıcıyı kaldır
    localStorage.removeItem('User');
    setUser(null); 
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
