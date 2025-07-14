import { useState, useEffect } from 'react';

interface UserData {
  id: string;
  email: string;
  nombres: string | null;
  apellidos: string | null;
  dni: string | null;
  telefono: string | null;
  correoLaureate: string | null;
  linkedin: string | null;
  biografia: string | null;
  role: string;
  haAceptadoPolitica: boolean;
  isRegistered: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/register-profile', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const { user } = await response.json();
          setUserData(user);
        } else {
          setError('Error al cargar datos del usuario');
        }
      } catch (err) {
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error, refetch: () => setLoading(true) };
};