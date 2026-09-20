import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  full_name: string;
  organization: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; full_name: string; organization?: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'usr_001',
  email: 'analyst@geoready.ai',
  full_name: 'Rahul Patel',
  organization: 'GeoReady Spatial Intelligence',
  role: 'Senior GIS Analyst',
  created_at: '2026-09-20 00:00:00 UTC',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('geoready_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verify stored token on load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('geoready_token');
      const storedUser = localStorage.getItem('geoready_user');
      
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);

          // Verify with backend
          const res = await fetch('http://localhost:8000/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem('geoready_user', JSON.stringify(data));
          }
        } catch {
          // Token might be offline/invalid, keep stored demo if available
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
        return { success: false, error: errorData.detail || 'Authentication failed' };
      }

      const data = await res.json();
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('geoready_token', data.access_token);
      localStorage.setItem('geoready_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      // Local fallback for quick demonstration if backend is starting
      if (email.toLowerCase() === 'analyst@geoready.ai' && password === 'password123') {
        quickDemoLogin();
        return { success: true };
      }
      return { success: false, error: 'Could not connect to authentication server' };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    full_name: string;
    organization?: string;
    role?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Registration failed' }));
        return { success: false, error: errorData.detail || 'Registration failed' };
      }

      const data = await res.json();
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('geoready_token', data.access_token);
      localStorage.setItem('geoready_user', JSON.stringify(data.user));
      return { success: true };
    } catch {
      return { success: false, error: 'Could not connect to authentication server' };
    }
  };

  const quickDemoLogin = () => {
    setUser(DEMO_USER);
    setToken('mock_jwt_analyst_session_token_2026');
    localStorage.setItem('geoready_token', 'mock_jwt_analyst_session_token_2026');
    localStorage.setItem('geoready_user', JSON.stringify(DEMO_USER));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('geoready_token');
    localStorage.removeItem('geoready_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
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
