import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, userService, type UserProfile } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'company') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCachedUser = (): UserProfile | null => {
  try {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole') as 'student' | 'company' | null;
    if (token && name && email && role) {
      return {
        id: '',
        name,
        email,
        role,
        preferences: { emailNotifications: true, darkMode: true },
      };
    }
  } catch {}
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cached = getCachedUser();
  const [user, setUser] = useState<UserProfile | null>(cached);
  const [isLoading, setIsLoading] = useState(!cached);

  const isAuthenticated = !!user;

  const storeAuthData = (token: string, userData: UserProfile) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', userData.role);
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  const refreshUser = useCallback(async () => {
    try {
      const data = await userService.me();
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userRole', data.user.role);
      }
    } catch {
      clearAuthData();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password });
    storeAuthData(data.token, data.user);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'company') => {
    const data = await authService.register({ name, email, password, role });
    storeAuthData(data.token, data.user);
    setUser(data.user);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
