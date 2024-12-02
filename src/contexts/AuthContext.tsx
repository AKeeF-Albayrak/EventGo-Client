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
  image?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendResetEmail: (email: string) => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
  updatePassword: (email: string, newPassword: string) => Promise<void>;
  updateUser: (userData: {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    country: string;
    image?: string | null;
  }) => Promise<boolean>;
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
        setUser(JSON.parse(storedUser));
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
      localStorage.setItem('User', JSON.stringify(userDetails));
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
      localStorage.setItem('User', JSON.stringify(userDetails));
      setUser(userDetails);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('AccessToken');
    localStorage.removeItem('User');
    setUser(null); 
    setIsAuthenticated(false);
  };

  const sendResetEmail = async (email: string) => {
    try {
      await axiosInstance.post('/Auth/SendEmail', { email });
    } catch (error) {
      console.error('Email gönderimi başarısız:', error);
      throw error;
    }
  };

  const verifyResetCode = async (email: string, code: string) => {
    try {
      await axiosInstance.post('/Auth/VerifyCode', { 
        email, 
        enteredCode: code 
      });
    } catch (error) {
      console.error('Kod doğrulama başarısız:', error);
      throw error;
    }
  };

  const updatePassword = async (email: string, newPassword: string) => {
    try {
      await axiosInstance.post('/Auth/UpdatePassword', { 
        email, 
        newPassword 
      });
    } catch (error) {
      console.error('Şifre güncelleme başarısız:', error);
      throw error;
    }
  };

  const updateUser = async (userData: {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    country: string;
    image?: string | null;
  }) => {
    try {
      const response = await axiosInstance.put('/Users/UpdateUser', {
        Id: user?.id,
        Email: userData.email,
        Address: userData.address,
        City: userData.city,
        Country: userData.country,
        Name: userData.name,
        Surname: userData.surname,
        PhoneNumber: userData.phoneNumber,
        Image: userData.image,
        Username: user?.username,
        Interests: user?.interests || [],
        PasswordHash: user?.passwordHash,
        Role: user?.role,
        BirthDate: user?.birthDate,
        Gender: user?.gender,
        Latitude: user?.latitude || 0,
        Longitude: user?.longitude || 0
      });

      if (response.data) {
        const updatedUser = {
          ...user,
          ...userData
        };
        setUser(updatedUser);
        localStorage.setItem('User', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Kullanıcı güncelleme hatası:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated, 
      isLoading,
      sendResetEmail,
      verifyResetCode,
      updatePassword,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
