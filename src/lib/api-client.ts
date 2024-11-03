import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // ASP.NET Core API'nizin URL'sini buraya yazın
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - her istekte token eklemek için
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoint'leri için tip tanımlamaları
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
  phoneNumber?: string;
  interests?: string;
  profileImage?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// API fonksiyonları
export const authApi = {
  register: (data: RegisterRequest) => 
    apiClient.post<AuthResponse>('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data),
};

export default apiClient;