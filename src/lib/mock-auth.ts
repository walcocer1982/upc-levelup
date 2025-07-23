import { mockUsers } from "@/data/mock";

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
    return mockUsers.find(user => user.email === email);
  },

  // Obtener usuario por ID
  getUserById: (id: string) => {
    return mockUsers.find(user => user.id === id);
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

// Función para obtener usuario por email
export function getUserByEmail(email: string) {
  return mockUsers.find(user => user.email === email);
}

// Función para obtener usuario por ID
export function getUserById(id: string) {
  return mockUsers.find(user => user.id === id);
}

// Función para validar credenciales
export function validateCredentials(email: string, password: string) {
  const user = getUserByEmail(email);
  if (!user) return null;
  
  // En el sistema mock, cualquier contraseña es válida
  return user;
}

// Función para crear sesión
export function createSession(user: any) {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: `${user.nombres} ${user.apellidos}`,
      role: user.role,
      isRegistered: user.isRegistered
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
  };
}

// Función para verificar si el usuario existe
export function userExists(email: string) {
  return getUserByEmail(email) !== undefined;
}

// Función para obtener todos los usuarios
export function getAllUsers() {
  return mockUsers;
}

// Función para obtener usuario por email (alias para compatibilidad)
export function getMockUserByEmail(email: string) {
  return getUserByEmail(email);
}

// Función para obtener usuario por ID (alias para compatibilidad)
export function getMockUserById(id: string) {
  return getUserById(id);
} 