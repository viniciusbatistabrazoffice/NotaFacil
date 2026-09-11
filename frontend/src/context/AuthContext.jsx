import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { authStorage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStorage.getUser());

  const login = useCallback(async (username, password) => {
    const { token, user: loggedUser } = await authService.login({ username, password });
    authStorage.save(token, loggedUser);
    setUser(loggedUser);
  }, []);

  const register = useCallback((payload) => authService.register(payload), []);

  const logout = useCallback(async () => {
    await authService.logout();
    authStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return context;
}
