// src/hooks/useAuth.tsx (Fixed version)
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { User, AuthResponse } from '@/lib/types';
import { api } from '@/lib/types/api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the login function to prevent unnecessary re-renders
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('token', response.token);
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }, []);

  // Memoize the logout function
  const logout = useCallback((): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const response = await api.get<{ success: boolean; user: User }>('/auth/me');
          
          if (response.success && response.user) {
            setUser(response.user);
            setToken(storedToken);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Memoize computed values
  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    (): AuthContextType => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated,
      isAdmin,
    }),
    [user, token, loading, login, logout, isAuthenticated, isAdmin]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};