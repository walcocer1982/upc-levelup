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

// Simulación de base de datos en memoria
class MockDatabase {
  private data: {
    users: any[];
    startups: any[];
    members: any[];
    impacts: any[];
    metrics: any[];
    convocatorias: any[];
    postulaciones: any[];
    evaluaciones: any[];
    rubricas: any[];
    auditoria: any[];
    versiones: any[];
  };

  constructor() {
    // Inicializar con datos mock
    this.data = {
      users: [...mockUsers],
      startups: [...mockStartups],
      members: [...mockMembers],
      impacts: [...mockImpacts],
      metrics: [...mockMetrics],
      convocatorias: [...mockConvocatorias],
      postulaciones: [...mockPostulaciones],
      evaluaciones: [...mockEvaluaciones],
      rubricas: [...mockRubricas],
      auditoria: [...mockAuditoria],
      versiones: [...mockVersiones],
    };
  }

  // Operaciones CRUD genéricas
  async create(table: string, data: any): Promise<any> {
    const id = this.generateId(table);
    const newRecord = {
      ...data,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.data[table as keyof typeof this.data].push(newRecord);
    console.log(`[MockDB] Created ${table}:`, id);
    return newRecord;
  }

  async read(table: string, id?: string, filter?: any): Promise<any> {
    const tableData = this.data[table as keyof typeof this.data];
    
    if (id) {
      return tableData.find((item: any) => item.id === id);
    }
    
    if (filter) {
      return tableData.filter((item: any) => {
        return Object.keys(filter).every(key => item[key] === filter[key]);
      });
    }
    
    return tableData;
  }

  async update(table: string, id: string, data: any): Promise<any> {
    const tableData = this.data[table as keyof typeof this.data];
    const index = tableData.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      throw new Error(`Record not found in ${table} with id: ${id}`);
    }
    
    const updatedRecord = {
      ...tableData[index],
      ...data,
      updatedAt: new Date(),
    };
    
    tableData[index] = updatedRecord;
    console.log(`[MockDB] Updated ${table}:`, id);
    return updatedRecord;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const tableData = this.data[table as keyof typeof this.data];
    const index = tableData.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return false;
    }
    
    tableData.splice(index, 1);
    console.log(`[MockDB] Deleted ${table}:`, id);
    return true;
  }

  async query(table: string, query: any): Promise<any[]> {
    const tableData = this.data[table as keyof typeof this.data];
    
    return tableData.filter((item: any) => {
      return Object.keys(query).every(key => {
        const value = query[key];
        if (typeof value === 'object' && value.$in) {
          return value.$in.includes(item[key]);
        }
        if (typeof value === 'object' && value.$gte) {
          return item[key] >= value.$gte;
        }
        if (typeof value === 'object' && value.$lte) {
          return item[key] <= value.$lte;
        }
        return item[key] === value;
      });
    });
  }

  private generateId(table: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${table}-${timestamp}-${random}`;
  }

  // Métodos específicos para evaluaciones
  async getEvaluationsByPostulacion(postulacionId: string): Promise<any[]> {
    return this.data.evaluaciones.filter(evaluation => evaluation.postulacionId === postulacionId);
  }

  async saveEvaluation(evaluation: any): Promise<string> {
    const existingIndex = this.data.evaluaciones.findIndex(
      existingEval => existingEval.postulacionId === evaluation.postulacionId
    );

    if (existingIndex !== -1) {
      // Update existing
      this.data.evaluaciones[existingIndex] = {
        ...this.data.evaluaciones[existingIndex],
        ...evaluation,
        updatedAt: new Date(),
      };
      console.log(`[MockDB] Updated evaluation for postulacion:`, evaluation.postulacionId);
      return this.data.evaluaciones[existingIndex].id;
    } else {
      // Create new
      const newEvaluation = await this.create('evaluaciones', evaluation);
      return newEvaluation.id;
    }
  }

  async deleteEvaluationByPostulacion(postulacionId: string): Promise<boolean> {
    const index = this.data.evaluaciones.findIndex(
      evaluation => evaluation.postulacionId === postulacionId
    );
    
    if (index === -1) {
      return false;
    }
    
    this.data.evaluaciones.splice(index, 1);
    console.log(`[MockDB] Deleted evaluation for postulacion:`, postulacionId);
    return true;
  }

  // Métodos específicos para postulaciones
  async getPostulacionesByStartup(startupId: string): Promise<any[]> {
    return this.data.postulaciones.filter(post => post.startupId === startupId);
  }

  async getPostulacionesByConvocatoria(convocatoriaId: string): Promise<any[]> {
    return this.data.postulaciones.filter(post => post.convocatoriaId === convocatoriaId);
  }

  // Métodos específicos para startups
  async getStartupByFounder(founderId: string): Promise<any | null> {
    return this.data.startups.find(startup => startup.founderId === founderId) || null;
  }

  async getMembersByStartup(startupId: string): Promise<any[]> {
    return this.data.members.filter(member => member.startupId === startupId);
  }

  // Métodos específicos para usuarios
  async getUserByEmail(email: string): Promise<any | null> {
    return this.data.users.find(user => user.email === email) || null;
  }

  async getUsersByRole(role: string): Promise<any[]> {
    return this.data.users.filter(user => user.role === role);
  }

  // Estadísticas
  getStats() {
    return {
      totalUsers: this.data.users.length,
      totalStartups: this.data.startups.length,
      totalPostulaciones: this.data.postulaciones.length,
      totalEvaluaciones: this.data.evaluaciones.length,
      totalConvocatorias: this.data.convocatorias.length,
      
      postulacionesByEstado: {
        borrador: this.data.postulaciones.filter(p => p.estado === 'borrador').length,
        enviada: this.data.postulaciones.filter(p => p.estado === 'enviada').length,
        en_revision: this.data.postulaciones.filter(p => p.estado === 'en_revision').length,
        evaluada: this.data.postulaciones.filter(p => p.estado === 'evaluada').length,
        aprobada: this.data.postulaciones.filter(p => p.estado === 'aprobada').length,
        rechazada: this.data.postulaciones.filter(p => p.estado === 'rechazada').length,
      },
      
      evaluacionesByStatus: {
        evaluacion_ia: this.data.evaluaciones.filter(e => e.status === 'evaluacion_ia').length,
        en_revision_admin: this.data.evaluaciones.filter(e => e.status === 'en_revision_admin').length,
        evaluacion_final: this.data.evaluaciones.filter(e => e.status === 'evaluacion_final').length,
      },
    };
  }

  // Reset database (útil para testing)
  reset() {
    this.data = {
      users: [...mockUsers],
      startups: [...mockStartups],
      members: [...mockMembers],
      impacts: [...mockImpacts],
      metrics: [...mockMetrics],
      convocatorias: [...mockConvocatorias],
      postulaciones: [...mockPostulaciones],
      evaluaciones: [...mockEvaluaciones],
      rubricas: [...mockRubricas],
      auditoria: [...mockAuditoria],
      versiones: [...mockVersiones],
    };
    console.log('[MockDB] Database reset to initial state');
  }
}

// Instancia global de la base de datos mock
export const mockDB = new MockDatabase();

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

// Funciones de utilidad para acceder a los datos (mantener compatibilidad)
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