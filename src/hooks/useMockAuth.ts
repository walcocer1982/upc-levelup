import { useState, useEffect } from 'react';
import { mockAuth, MockSession } from '@/lib/mock-auth';

export function useMockAuth() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de sesión
    const loadSession = () => {
      const mockSession = mockAuth.getSession();
      setSession(mockSession);
      setLoading(false);
    };

    // Simular delay de carga
    setTimeout(loadSession, 500);
  }, []);

  return {
    data: session,
    status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
    user: session?.user,
    isAuthenticated: !!session,
    hasRole: (role: string) => mockAuth.hasRole(role),
    isRegistered: () => mockAuth.isRegistered(),
  };
} 