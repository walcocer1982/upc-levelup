// Repositorio y servicios unificados
export { Repository } from './repository';
export { EvaluacionService } from './services';

// Tipos centralizados
export * from './types';

// Datos mock individuales (solo los que aún existen)
export { mockUsers, type MockUser } from './users';
export { mockConvocatorias } from './convocatorias';
export { mockAuditoria } from './auditoria';

// Importar datos de la base de datos mock unificada
import { mockDb } from './database';
import { mockUsers } from './users';
import { mockConvocatorias } from './convocatorias';

// Función para obtener todos los datos mock
export function getMockData() {
  return {
    users: mockUsers,
    startups: mockDb.getAllStartups(),
    convocatorias: mockConvocatorias,
    postulaciones: mockDb.getAllPostulaciones(),
    respuestas: mockDb.getAllRespuestas(),
    evaluaciones: mockDb.getAllEvaluacionesIA(),
    supervisiones: mockDb.getAllSupervisiones()
  };
}

// Exportar la base de datos mock para acceso directo
export { mockDb } from './database'; 