import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { login as apiLogin, loginDevToken as apiLoginDevToken, getMe, type User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithDevToken: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('auth_token'));

  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token, fetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('auth_token', res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  const loginWithDevToken = useCallback(async (devToken: string) => {
    const res = await apiLoginDevToken(devToken);
    localStorage.setItem('auth_token', res.token);
    setToken(res.token);
    setUser(res.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoading, login, loginWithDevToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
