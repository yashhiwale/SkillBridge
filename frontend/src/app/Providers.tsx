// src/app/Providers.tsx
'use client';

import { AuthProvider } from '@/components/auth/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}