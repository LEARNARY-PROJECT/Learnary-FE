"use client";

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean; 
<<<<<<< Updated upstream
  login: (token: string) => void;
=======
  login: (accessToken: string) => AuthUser | null;
>>>>>>> Stashed changes
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode<AuthUser>(storedToken);
        setUser(decodedUser);
        setToken(storedToken);
      } catch (error: unknown) {
        console.error("Lỗi giải mã token:", error);
        localStorage.removeItem('authToken');
      }
<<<<<<< Updated upstream
=======
    };
    checkAuthOnLoad();  
  }, []);

  const logout = useCallback(async() => {
    try {
      // Gọi BE để xóa data (HttpOnly cookie)
      await api.post('/auth/logout'); 
    } catch (error) {
      console.error("Lỗi logout:", error);
    } finally {
      sessionStorage.removeItem('accessToken');
      setUser(null);
      setToken(null);
      window.location.href = '/';
>>>>>>> Stashed changes
    }
    setIsLoading(false); 
  }, []);

<<<<<<< Updated upstream
  const login = useCallback((newToken: string) => {
=======
  const login = useCallback((newAccessToken: string): AuthUser | null => {
>>>>>>> Stashed changes
    try {
      localStorage.setItem('authToken', newToken);
      const decodedUser = jwtDecode<AuthUser>(newToken);
      setUser(decodedUser);
<<<<<<< Updated upstream
      setToken(newToken);
=======
      setToken(newAccessToken);
      sessionStorage.setItem('accessToken', newAccessToken);
      return decodedUser;
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      logout();
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isLoggedIn: !!user,
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider');
  }
  return context;
}