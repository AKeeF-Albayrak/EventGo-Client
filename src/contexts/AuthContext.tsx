'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '@/services/api'

interface AuthContextType {
  user: any | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('AccessToken')
    if (token) {
      // Validate token and set user
      validateToken(token)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await axiosInstance.get('/Auth/ValidateToken', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Token validation failed:', error)
      logout()
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post('/Auth/Login', { username, password })
      localStorage.setItem('AccessToken', response.data.token)
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await axiosInstance.post('/Auth/SignUp', userData)
      localStorage.setItem('AccessToken', response.data.token)
      setUser(response.data.user)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('AccessToken')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}