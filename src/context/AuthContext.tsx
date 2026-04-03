import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUsername: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'gym-auth-session';

const getSavedSession = (): { isAuthenticated: boolean; username: string | null } => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, username: null };
  }

  try {
    const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) {
      return { isAuthenticated: false, username: null };
    }

    const parsedSession = JSON.parse(rawSession) as { isAuthenticated?: boolean; username?: string };
    return {
      isAuthenticated: Boolean(parsedSession.isAuthenticated),
      username: parsedSession.username ?? null,
    };
  } catch {
    return { isAuthenticated: false, username: null };
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialSession = getSavedSession();
  const [isAuthenticated, setIsAuthenticated] = useState(initialSession.isAuthenticated);
  const [currentUsername, setCurrentUsername] = useState<string | null>(initialSession.username);

  const appUsername = import.meta.env.VITE_APP_USERNAME || 'admin';
  const appPassword = import.meta.env.VITE_APP_PASSWORD || 'admin123';

  const login = (username: string, password: string) => {
    const isValid = username.trim() === appUsername && password === appPassword;

    if (!isValid) {
      return false;
    }

    setIsAuthenticated(true);
    setCurrentUsername(username.trim());
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: true,
        username: username.trim(),
      }),
    );

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUsername(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ isAuthenticated, currentUsername, login, logout }),
    [isAuthenticated, currentUsername],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
