import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export class PrismaRepository {
  // Evaluaciones IA
  static async getEvaluacionIAByPostulacion(postulacionId: string) {
    return prisma.evaluacionIA.findFirst({
      where: { postulacionId },
      include: { criteriosEvaluados: true },
    });
  }

  static async getAllEvaluacionesIA() {
    return prisma.evaluacionIA.findMany({
      include: { criteriosEvaluados: true },
    });
  }

  static async saveEvaluacionIA(evaluacion: any) {
    // Crea o actualiza la evaluación IA y sus criterios
    const { criteriosEvaluados, ...evaluacionData } = evaluacion;
    
    // Limpiar los criterios evaluados para quitar campos que no existen en el modelo
    const criteriosLimpios = criteriosEvaluados.map((criterio: any) => {
      const { evaluacionId, ...criterioLimpio } = criterio;
      return criterioLimpio;
    });
    
    const upserted = await prisma.evaluacionIA.upsert({
      where: { id: evaluacion.id },
      update: {
        ...evaluacionData,
        criteriosEvaluados: {
          deleteMany: {},
          create: criteriosLimpios,
        },
      },
      create: {
        ...evaluacionData,
        criteriosEvaluados: { create: criteriosLimpios },
      },
      include: { criteriosEvaluados: true },
    });
    return upserted;
  }

  // Criterios de Evaluación (puedes extender según tu modelo)
  static async getCriteriosEvaluacion() {
    return prisma.criterioEvaluacion.findMany();
  }

  // Convocatorias
  static async getConvocatorias() {
    return prisma.convocatoria.findMany();
  }

  static async getConvocatoriaById(id: string) {
    return prisma.convocatoria.findUnique({ where: { id } });
  }

  static async saveConvocatoria(convocatoria: any) {
    return prisma.convocatoria.upsert({
      where: { id: convocatoria.id },
      update: convocatoria,
      create: convocatoria,
    });
  }

  // Startups
  static async getStartupById(startupId: string) {
    return prisma.startup.findUnique({
      where: { id: startupId }
    });
  }

  static async getAllStartups() {
    return prisma.startup.findMany({
      orderBy: { nombre: 'asc' }
    });
  }

  static async updateStartup(startupId: string, data: any) {
    return prisma.startup.update({
      where: { id: startupId },
      data: data
    });
  }

  static async createStartup(data: any) {
    return prisma.startup.create({
      data
    });
  }

  // Users
  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  static async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId }
    });
  }

  static async updateUser(userId: string, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  static async updateUserByEmail(email: string, data: any) {
    return prisma.user.update({
      where: { email },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  static async createUser(data: any) {
    return prisma.user.create({
      data
    });
  }

  // Applicants (Postulaciones)
  static async getAllApplicants() {
    return prisma.applicant.findMany({
      include: {
        startup: true,
        convocatoria: true
      }
    });
  }

  static async getApplicantById(id: string) {
    return prisma.applicant.findUnique({
      where: { id },
      include: {
        startup: true,
        convocatoria: true
      }
    });
  }

  static async getApplicantsByStartup(startupId: string) {
    return prisma.applicant.findMany({
      where: { startupId },
      include: {
        startup: true,
        convocatoria: true
      }
    });
  }

  static async createApplicant(data: any) {
    return prisma.applicant.create({
      data,
      include: {
        startup: true,
        convocatoria: true
      }
    });
  }

  static async updateApplicant(id: string, data: any) {
    return prisma.applicant.update({
      where: { id },
      data,
      include: {
        startup: true,
        convocatoria: true
      }
    });
  }

  // Application Forms (Respuestas)
  static async getApplicationFormsByStartup(startupId: string) {
    return prisma.applicationForm.findMany({
      where: { startupId },
      orderBy: { orden: 'asc' }
    });
  }

  static async getApplicationFormsByApplicant(applicantId: string) {
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId }
    });
    
    if (!applicant) return [];
    
    return prisma.applicationForm.findMany({
      where: { startupId: applicant.startupId },
      orderBy: { orden: 'asc' }
    });
  }

  // Alias para compatibilidad con el mock
  static async getAllPostups() {
    return this.getAllApplicants();
  }

  static async getStartup(startupId: string) {
    return this.getStartupById(startupId);
  }

  static async getPostulacion(applicantId: string) {
    return this.getApplicantById(applicantId);
  }

  static async getRespuestasByPostulacion(applicantId: string) {
    return this.getApplicationFormsByApplicant(applicantId);
  }

  // Métricas de Startups
  static async getStartupMetrics(startupId: string) {
    // Por ahora retornamos métricas simuladas, pero podríamos crear un modelo Metrics
    // y obtener datos reales de la base de datos
    return {
      startupId,
      usuariosActivos: Math.floor(Math.random() * 10000) + 1000,
      ingresosMensuales: Math.floor(Math.random() * 100000) + 10000,
      tasaRetencion: Math.floor(Math.random() * 30) + 70,
      crecimientoMensual: Math.floor(Math.random() * 20) + 5,
      metricasDetalladas: {
        usuariosNuevos: Math.floor(Math.random() * 500) + 100,
        usuariosRecurrentes: Math.floor(Math.random() * 800) + 200,
        tiempoPromedioSesion: Math.floor(Math.random() * 30) + 10,
        conversionRate: Math.floor(Math.random() * 10) + 2
      },
      tendencias: [
        { mes: "Enero", usuarios: 1200, ingresos: 15000 },
        { mes: "Febrero", usuarios: 1400, ingresos: 18000 },
        { mes: "Marzo", usuarios: 1600, ingresos: 22000 },
        { mes: "Abril", usuarios: 1800, ingresos: 25000 }
      ],
      updatedAt: new Date()
    };
  }

  static async updateStartupMetrics(startupId: string, metricsData: any) {
    // Por ahora simulamos la actualización
    return {
      startupId,
      ...metricsData,
      updatedAt: new Date()
    };
  }

  // Impacto de Startups
  static async getStartupImpact(startupId: string) {
    // Métricas de impacto social y ambiental
    return {
      startupId,
      impactoSocial: {
        personasBeneficiadas: Math.floor(Math.random() * 10000) + 1000,
        empleosCreados: Math.floor(Math.random() * 100) + 10,
        comunidadesImpactadas: Math.floor(Math.random() * 50) + 5
      },
      impactoAmbiental: {
        co2Reducido: Math.floor(Math.random() * 1000) + 100,
        residuosReciclados: Math.floor(Math.random() * 500) + 50,
        energiaRenovable: Math.floor(Math.random() * 100) + 10
      },
      impactoEconomico: {
        pibGenerado: Math.floor(Math.random() * 1000000) + 100000,
        impuestosPagados: Math.floor(Math.random() * 100000) + 10000,
        inversionAtraida: Math.floor(Math.random() * 500000) + 50000
      },
      updatedAt: new Date()
    };
  }
} 