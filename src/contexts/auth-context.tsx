'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'BUSINESS_ADMIN' | 'FLOOR_MANAGER' | 'SALESPERSON';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  floor?: string;
  businessId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // Check localStorage for demo purposes
        const storedUser = localStorage.getItem('sarkar_crm_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Real authentication - try API first
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('sarkar_crm_user', JSON.stringify(userData));
        return;
      }

      // Fallback for demo - create user based on email pattern
      let demoUser: User;
      
      if (email.includes('admin') || email === 'admin@example.com') {
        demoUser = {
          id: '1',
          email,
          name: 'Business Admin',
          role: 'BUSINESS_ADMIN',
          businessId: 'business-1',
        };
      } else if (email.includes('manager') || email === 'manager@example.com') {
        demoUser = {
          id: '2',
          email,
          name: 'Floor Manager',
          role: 'FLOOR_MANAGER',
          floor: 'Floor 1',
          businessId: 'business-1',
        };
      } else {
        demoUser = {
          id: '3',
          email,
          name: 'Salesperson',
          role: 'SALESPERSON',
          floor: 'Floor 1',
          businessId: 'business-1',
        };
      }
      
      setUser(demoUser);
      localStorage.setItem('sarkar_crm_user', JSON.stringify(demoUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sarkar_crm_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('sarkar_crm_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 