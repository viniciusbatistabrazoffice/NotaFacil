import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../services/api';

const STORAGE_KEY = 'notafacil.auth';

const AuthContext = createContext(null);

function loadStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadStoredAuth);

  const persist = (value) => {
    setAuth(value);
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = async ({ tenant, email, password }) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { tenant, email, password },
    });
    persist({ token: data.token, user: data.user, tenant: data.tenant });
    return data;
  };

  const register = async ({ companyName, name, email, password }) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { companyName, name, email, password },
    });
    persist({ token: data.token, user: data.user, tenant: data.tenant });
    return data;
  };

  const logout = () => persist(null);

  const value = {
    user: auth?.user ?? null,
    tenant: auth?.tenant ?? null,
    token: auth?.token ?? null,
    isAuthenticated: Boolean(auth?.token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
