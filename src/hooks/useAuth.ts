import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'BUSINESS_ADMIN' | 'FLOOR_MANAGER';
  isActive: boolean;
  storeId?: string;
  floorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token?: string;
  };
  message: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user data exists in localStorage
      const storedUser = localStorage.getItem('sarkar_crm_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check authentication');
      console.error('Error checking auth:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll use a simple mock login since we don't have a real auth API
      // In production, this would call a real authentication endpoint
      
      // Mock user data based on email
      let mockUser: User;
      
      if (email.includes('admin')) {
        mockUser = {
          id: '1',
          name: 'Business Admin',
          email: email,
          role: 'BUSINESS_ADMIN',
          isActive: true,
          storeId: '550e8400-e29b-41d4-a716-446655440000',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (email.includes('manager')) {
        mockUser = {
          id: '2',
          name: 'Floor Manager',
          email: email,
          role: 'FLOOR_MANAGER',
          isActive: true,
          storeId: '550e8400-e29b-41d4-a716-446655440000',
          floorId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Default to floor manager
        mockUser = {
          id: '3',
          name: 'Floor Manager',
          email: email,
          role: 'FLOOR_MANAGER',
          isActive: true,
          storeId: '550e8400-e29b-41d4-a716-446655440000',
          floorId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Store user data in localStorage
      localStorage.setItem('sarkar_crm_user', JSON.stringify(mockUser));
      setUser(mockUser);

      // Redirect based on role
      if (mockUser.role === 'BUSINESS_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/floor-manager/dashboard');
      }

      return { success: true, data: { user: mockUser } };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Clear user data from localStorage
      localStorage.removeItem('sarkar_crm_user');
      setUser(null);
      setError(null);
      
      // Redirect to login page
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'BUSINESS_ADMIN';
  const isManager = user?.role === 'FLOOR_MANAGER';

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isManager,
    login,
    logout,
    checkAuth,
  };
} 