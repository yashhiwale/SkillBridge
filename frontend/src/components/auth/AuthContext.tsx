// src/components/auth/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStorage, User } from './authStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setUser(authStorage.getCurrentUser());
  }, []);

  const login = (email: string) => {
    const users = authStorage.getUsers();
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      authStorage.setCurrentUser(foundUser);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    authStorage.setCurrentUser(null);
    setUser(null);
  };

  const register = (newUser: Omit<User, 'id'>) => {
    const user: User = { ...newUser, id: Math.random().toString(36).substring(2, 9) };
    authStorage.saveUser(user);
    authStorage.setCurrentUser(user);
    setUser(user);
    return user;
  };

  if (!isMounted) return null; // Prevent Next.js hydration errors

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};