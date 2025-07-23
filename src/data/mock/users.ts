// Definir UserRole localmente para evitar importación circular
export enum UserRole {
  ADMIN = 'ADMIN',
  FUNDADOR = 'FUNDADOR',
  MIEMBRO = 'MIEMBRO',
}

export interface MockUser {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  correoLaureate?: string;
  linkedin?: string;
  biografia?: string;
  role: UserRole;
  haAceptadoPolitica: boolean;
  isRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const mockUsers: MockUser[] = [
  // ADMIN
  {
    id: 'admin-001',
    email: 'walcocer.1982@gmail.com',
    nombres: 'Walther',
    apellidos: 'Alcocer',
    dni: '12345678',
    telefono: '999888777',
    correoLaureate: 'walcocer@upc.edu.pe',
    linkedin: 'https://linkedin.com/in/walther-alcocer',
    biografia: 'Administrador principal de StartUPC con experiencia en gestión de emprendimientos',
    role: UserRole.ADMIN,
    haAceptadoPolitica: true,
    isRegistered: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  
  // FUNDADOR
  {
    id: 'fundador-001',
    email: 'walther.alcocer@cetemin.edu.pe',
    nombres: 'Walther',
    apellidos: 'Alcocer',
    dni: '87654321',
    telefono: '999777666',
    correoLaureate: 'walther.alcocer@upc.edu.pe',
    linkedin: 'https://linkedin.com/in/walther-alcocer-fundador',
    biografia: 'Emprendedor tecnológico con experiencia en desarrollo de software y gestión de startups',
    role: UserRole.FUNDADOR,
    haAceptadoPolitica: true,
    isRegistered: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  
  // FUNDADORES ADICIONALES
  {
    id: 'fundador-002',
    email: 'maria.garcia@startup.com',
    nombres: 'María',
    apellidos: 'García',
    dni: '11111111',
    telefono: '999111222',
    linkedin: 'https://linkedin.com/in/maria-garcia',
    biografia: 'Emprendedora en el sector de salud digital',
    role: UserRole.FUNDADOR,
    haAceptadoPolitica: true,
    isRegistered: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  
  {
    id: 'fundador-003',
    email: 'carlos.rodriguez@fintech.com',
    nombres: 'Carlos',
    apellidos: 'Rodríguez',
    dni: '22222222',
    telefono: '999333444',
    linkedin: 'https://linkedin.com/in/carlos-rodriguez',
    biografia: 'Fundador de startup FinTech con experiencia en banca digital',
    role: UserRole.FUNDADOR,
    haAceptadoPolitica: true,
    isRegistered: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  
  // MIEMBROS
  {
    id: 'miembro-001',
    email: 'ana.lopez@startup.com',
    nombres: 'Ana',
    apellidos: 'López',
    dni: '33333333',
    telefono: '999555666',
    linkedin: 'https://linkedin.com/in/ana-lopez',
    biografia: 'Desarrolladora frontend con experiencia en React y TypeScript',
    role: UserRole.MIEMBRO,
    haAceptadoPolitica: true,
    isRegistered: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  
  {
    id: 'miembro-002',
    email: 'juan.perez@startup.com',
    nombres: 'Juan',
    apellidos: 'Pérez',
    dni: '44444444',
    telefono: '999777888',
    linkedin: 'https://linkedin.com/in/juan-perez',
    biografia: 'Especialista en marketing digital y crecimiento de usuarios',
    role: UserRole.MIEMBRO,
    haAceptadoPolitica: true,
    isRegistered: true,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
  },
  
  {
    id: 'miembro-003',
    email: 'lucia.martinez@startup.com',
    nombres: 'Lucía',
    apellidos: 'Martínez',
    dni: '55555555',
    telefono: '999999000',
    linkedin: 'https://linkedin.com/in/lucia-martinez',
    biografia: 'UX/UI Designer con experiencia en diseño de productos digitales',
    role: UserRole.MIEMBRO,
    haAceptadoPolitica: true,
    isRegistered: true,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
]; 