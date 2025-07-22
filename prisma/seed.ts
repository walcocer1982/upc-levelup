import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos de prueba...');

  // 1. Crear un usuario admin de prueba (PRIMERO)
  console.log('👤 Creando usuario admin de prueba...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      nombres: 'Admin',
      apellidos: 'Test',
      dni: '12345678',
      telefono: '999999999',
      role: 'admin',
      haAceptadoPolitica: true,
      isRegistered: true
    }
  });
  console.log('✅ Usuario admin creado:', adminUser.id);

  // 2. Crear una convocatoria de prueba
  console.log('📋 Creando convocatoria de prueba...');
  const convocatoria = await prisma.convocatoria.upsert({
    where: { id: 'conv-test-001' },
    update: {},
    create: {
      id: 'conv-test-001',
      titulo: 'Convocatoria de Prueba 2024',
      descripcion: 'Convocatoria para probar el sistema de evaluaciones IA',
      fechaInicio: new Date('2024-01-01'),
      fechaFin: new Date('2024-12-31'),
      estado: 'ACTIVA',
      criterios: {
        complejidad: { peso: 25 },
        mercado: { peso: 25 },
        escalabilidad: { peso: 25 },
        equipo: { peso: 25 }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  console.log('✅ Convocatoria creada:', convocatoria.id);

  // 3. Crear una startup de prueba
  console.log('🚀 Creando startup de prueba...');
  const startup = await prisma.startup.upsert({
    where: { id: 'startup-test-001' },
    update: {},
    create: {
      id: 'startup-test-001',
      nombre: 'Startup de Prueba',
      razonSocial: 'Startup Test S.A.C.',
      ruc: '12345678901',
      fechaFundacion: new Date('2023-01-01'),
      categoria: 'TECH',
      paginaWeb: 'https://startuptest.com',
      descripcion: 'Startup de prueba para evaluaciones IA',
      etapa: 'MVP',
      origen: 'UNIVERSIDAD',
      videoPitchUrl: 'https://youtube.com/watch?v=test'
    }
  });
  console.log('✅ Startup creada:', startup.id);

  // 4. Crear una aplicación (convocatoria) - AHORA CON EL USUARIO EXISTENTE
  console.log('📝 Creando aplicación de prueba...');
  const application = await prisma.application.upsert({
    where: { id: 'app-test-001' },
    update: {},
    create: {
      id: 'app-test-001',
      tipo: 'Inqubalab',
      fechaInicio: new Date('2024-01-01'),
      fechaFin: new Date('2024-12-31'),
      creadoPorId: adminUser.id // Usar el ID del usuario creado
    }
  });
  console.log('✅ Aplicación creada:', application.id);

  // 5. Crear un applicant (postulación)
  console.log('📋 Creando postulación de prueba...');
  const applicant = await prisma.applicant.upsert({
    where: { 
      startupId_convocatoriaId: {
        startupId: 'startup-test-001',
        convocatoriaId: 'app-test-001'
      }
    },
    update: {},
    create: {
      id: 'applicant-test-001',
      startupId: 'startup-test-001',
      convocatoriaId: 'app-test-001',
      estado: 'postulado',
      feedbackEvaluador: null,
      feedbackIA: null,
      fecha: new Date(),
      locked: false
    }
  });
  console.log('✅ Postulación creada:', applicant.id);

  // 6. Crear respuestas de formulario de prueba
  console.log('📝 Creando respuestas de formulario...');
  const respuestas = [
    {
      id: 'resp-test-001',
      startupId: 'startup-test-001',
      convocatoriaId: 'app-test-001',
      solucion: 'Solución innovadora para problemas complejos',
      razon: 'Porque creemos en el impacto social',
      necesidades: ['Mentoría', 'Financiamiento', 'Networking'],
      participacionPasada: false,
      programaPasado: null,
      aprendizaje: null,
      startupNombre: 'Startup de Prueba',
      pregunta: 'Describe un caso real del problema que resuelves',
      respuesta: 'Las empresas pequeñas pierden 30% de sus ventas por falta de automatización',
      categoria: 'complejidad',
      peso: 1,
      orden: 1
    },
    {
      id: 'resp-test-002',
      startupId: 'startup-test-001',
      convocatoriaId: 'app-test-001',
      solucion: 'Solución innovadora para problemas complejos',
      razon: 'Porque creemos en el impacto social',
      necesidades: ['Mentoría', 'Financiamiento', 'Networking'],
      participacionPasada: false,
      programaPasado: null,
      aprendizaje: null,
      startupNombre: 'Startup de Prueba',
      pregunta: '¿Cuál es el tamaño de tu mercado?',
      respuesta: 'TAM: $500M, SAM: $50M, SOM: $5M',
      categoria: 'mercado',
      peso: 1,
      orden: 2
    },
    {
      id: 'resp-test-003',
      startupId: 'startup-test-001',
      convocatoriaId: 'app-test-001',
      solucion: 'Solución innovadora para problemas complejos',
      razon: 'Porque creemos en el impacto social',
      necesidades: ['Mentoría', 'Financiamiento', 'Networking'],
      participacionPasada: false,
      programaPasado: null,
      aprendizaje: null,
      startupNombre: 'Startup de Prueba',
      pregunta: '¿Cómo planeas escalar tu solución?',
      respuesta: 'A través de partnerships estratégicos y automatización',
      categoria: 'escalabilidad',
      peso: 1,
      orden: 3
    },
    {
      id: 'resp-test-004',
      startupId: 'startup-test-001',
      convocatoriaId: 'app-test-001',
      solucion: 'Solución innovadora para problemas complejos',
      razon: 'Porque creemos en el impacto social',
      necesidades: ['Mentoría', 'Financiamiento', 'Networking'],
      participacionPasada: false,
      programaPasado: null,
      aprendizaje: null,
      startupNombre: 'Startup de Prueba',
      pregunta: '¿Cuál es la experiencia de tu equipo?',
      respuesta: 'Equipo con 5+ años en el sector y experiencia en startups',
      categoria: 'equipo',
      peso: 1,
      orden: 4
    }
  ];

  for (const respuesta of respuestas) {
    await prisma.applicationForm.upsert({
      where: { id: respuesta.id },
      update: {},
      create: respuesta
    });
  }
  console.log('✅ Respuestas creadas:', respuestas.length);

  console.log('🎉 Seed completado exitosamente!');
  console.log('📊 Datos creados:');
  console.log('   - Usuario Admin:', adminUser.id);
  console.log('   - Convocatoria:', convocatoria.id);
  console.log('   - Startup:', startup.id);
  console.log('   - Postulación:', applicant.id);
  console.log('   - Respuestas:', respuestas.length);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 