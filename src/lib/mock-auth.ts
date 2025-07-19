import { getMockData } from "@/data/mock";

// Simular sesión de usuario mock
export interface MockSession {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: string;
    isRegistered: boolean;
    haAceptadoPolitica: boolean;
    nombres?: string;
    apellidos?: string;
  };
  expires: string;
}

// Usuario mock por defecto (admin)
const DEFAULT_MOCK_USER = {
  id: 'admin-001',
  email: 'walcocer.1982@gmail.com',
  name: 'Walther Alcocer',
  role: 'admin',
  isRegistered: true,
  haAceptadoPolitica: true,
  nombres: 'Walther',
  apellidos: 'Alcocer',
};

// Simular autenticación mock
export const mockAuth = {
  // Obtener sesión mock
  getSession: (): MockSession | null => {
    // Por ahora, siempre devolver el usuario admin mock
    // En el futuro, esto podría leer de localStorage o cookies
    return {
      user: DEFAULT_MOCK_USER,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    };
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    return true; // Siempre autenticado en modo mock
  },

  // Obtener usuario por email
  getUserByEmail: (email: string) => {
    return getMockData.getUserByEmail(email);
  },

  // Obtener usuario por ID
  getUserById: (id: string) => {
    return getMockData.getUserById(id);
  },

  // Verificar si el usuario tiene rol específico
  hasRole: (role: string): boolean => {
    const session = mockAuth.getSession();
    return session?.user.role === role;
  },

  // Verificar si el usuario está registrado
  isRegistered: (): boolean => {
    const session = mockAuth.getSession();
    return session?.user.isRegistered || false;
  },
}; 