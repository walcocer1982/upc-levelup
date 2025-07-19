// Datos consolidados para uso fácil
import { mockUsers } from './users';
import { mockStartups, mockMembers, mockImpacts, mockMetrics } from './startups';
import { mockConvocatorias } from './convocatorias';
import { mockPostulaciones } from './postulaciones';
import { mockEvaluaciones, mockRubricas } from './evaluaciones';
import { mockAuditoria, mockVersiones } from './auditoria';

// Re-exportar para uso directo
export { roleDescriptions, rolePermissions } from './roles';
export { UserRole, mockUsers } from './users';
export { mockStartups, mockMembers, mockImpacts, mockMetrics } from './startups';
export { mockConvocatorias } from './convocatorias';
export { mockPostulaciones } from './postulaciones';
export { mockEvaluaciones, mockRubricas } from './evaluaciones';
export { mockAuditoria, mockVersiones } from './auditoria';

export const mockData = {
  users: mockUsers,
  startups: mockStartups,
  members: mockMembers,
  impacts: mockImpacts,
  metrics: mockMetrics,
  convocatorias: mockConvocatorias,
  postulaciones: mockPostulaciones,
  evaluaciones: mockEvaluaciones,
  rubricas: mockRubricas,
  auditoria: mockAuditoria,
  versiones: mockVersiones,
};

// Funciones de utilidad para acceder a los datos
export const getMockData = {
  // Usuarios
  getUserByEmail: (email: string) => mockUsers.find(user => user.email === email),
  getUserById: (id: string) => mockUsers.find(user => user.id === id),
  getUsersByRole: (role: string) => mockUsers.filter(user => user.role === role),
  getAllUsers: () => mockUsers,
  
  // Startups
  getAllStartups: () => mockStartups,
  getStartupById: (id: string) => mockStartups.find(startup => startup.id === id),
  getStartupByFounder: (founderId: string) => mockStartups.find(startup => startup.founderId === founderId),
  getMembersByStartup: (startupId: string) => mockMembers.filter(member => member.startupId === startupId),
  getImpactByStartup: (startupId: string) => mockImpacts.find(impact => impact.startupId === startupId),
  getMetricsByStartup: (startupId: string) => mockMetrics.find(metrics => metrics.startupId === startupId),
  
  // Convocatorias
  getAllConvocatorias: () => mockConvocatorias,
  getConvocatoriaById: (id: string) => mockConvocatorias.find(conv => conv.id === id),
  getConvocatoriasByEstado: (estado: string) => mockConvocatorias.filter(conv => conv.estado === estado),
  getConvocatoriasByTipo: (tipo: string) => mockConvocatorias.filter(conv => conv.tipo === tipo),
  
  // Postulaciones
  getAllPostulaciones: () => mockPostulaciones,
  getPostulacionById: (id: string) => mockPostulaciones.find(post => post.id === id),
  getPostulacionesByStartup: (startupId: string) => mockPostulaciones.filter(post => post.startupId === startupId),
  getPostulacionesByConvocatoria: (convocatoriaId: string) => mockPostulaciones.filter(post => post.convocatoriaId === convocatoriaId),
  getPostulacionesByEstado: (estado: string) => mockPostulaciones.filter(post => post.estado === estado),
  
  // Evaluaciones
  getAllEvaluaciones: () => mockEvaluaciones,
  getEvaluacionById: (id: string) => mockEvaluaciones.find(evaluacion => evaluacion.id === id),
  getEvaluacionesByPostulacion: (postulacionId: string) => mockEvaluaciones.filter(evaluacion => evaluacion.postulacionId === postulacionId),
  getEvaluacionesByEvaluador: (evaluadorId: string) => mockEvaluaciones.filter(evaluacion => evaluacion.evaluadorId === evaluadorId),
  getRubricasByCriterio: (criterioId: string) => mockRubricas.filter(rubrica => rubrica.criterioId === criterioId),
  
  // Auditoría
  getAuditoriaByPostulacion: (postulacionId: string) => mockAuditoria.filter(audit => audit.postulacionId === postulacionId),
  getAuditoriaByUsuario: (usuarioId: string) => mockAuditoria.filter(audit => audit.usuarioId === usuarioId),
  getVersionesByPostulacion: (postulacionId: string) => mockVersiones.filter(version => version.postulacionId === postulacionId),
};

// Resumen de datos disponibles
export const mockDataSummary = {
  totalUsers: mockUsers.length,
  totalStartups: mockStartups.length,
  totalMembers: mockMembers.length,
  totalConvocatorias: mockConvocatorias.length,
  totalPostulaciones: mockPostulaciones.length,
  totalEvaluaciones: mockEvaluaciones.length,
  totalAuditoria: mockAuditoria.length,
  totalVersiones: mockVersiones.length,
  
  usersByRole: {
    ADMIN: mockUsers.filter(u => u.role === 'ADMIN').length,
    FUNDADOR: mockUsers.filter(u => u.role === 'FUNDADOR').length,
    MIEMBRO: mockUsers.filter(u => u.role === 'MIEMBRO').length,
  },
  
  postulacionesByEstado: {
    borrador: mockPostulaciones.filter(p => p.estado === 'borrador').length,
    enviada: mockPostulaciones.filter(p => p.estado === 'enviada').length,
    en_revision: mockPostulaciones.filter(p => p.estado === 'en_revision').length,
    evaluada: mockPostulaciones.filter(p => p.estado === 'evaluada').length,
    aprobada: mockPostulaciones.filter(p => p.estado === 'aprobada').length,
    rechazada: mockPostulaciones.filter(p => p.estado === 'rechazada').length,
  },
  
  convocatoriasByEstado: {
    borrador: mockConvocatorias.filter(c => c.estado === 'borrador').length,
    abierta: mockConvocatorias.filter(c => c.estado === 'abierta').length,
    cerrada: mockConvocatorias.filter(c => c.estado === 'cerrada').length,
    en_evaluacion: mockConvocatorias.filter(c => c.estado === 'en_evaluacion').length,
    finalizada: mockConvocatorias.filter(c => c.estado === 'finalizada').length,
  },
}; 