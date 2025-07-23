// Script simplificado para crear el entorno ordenado
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function createSimpleEnvironment() {
  console.log('🔧 Creando entorno ordenado y profesional...\n');

  try {
    // 1. Crear usuarios
    console.log('👥 Creando usuarios...');
    
    const users = [
      {
        email: "walther.alcocer@cetemin.edu.pe",
        nombres: "WALTHER",
        apellidos: "ALCOCER",
        dni: "12345678",
        telefono: "999888777",
        role: "usuario",
        isRegistered: true,
        haAceptadoPolitica: true
      },
      {
        email: "m.limaco0191@gmail.com",
        nombres: "Michael",
        apellidos: "Limaco",
        dni: "87654321",
        telefono: "999777666",
        role: "usuario",
        isRegistered: true,
        haAceptadoPolitica: true
      },
      {
        email: "admin@upc.edu.pe",
        nombres: "Admin",
        apellidos: "UPC",
        dni: "11111111",
        telefono: "999111222",
        role: "admin",
        isRegistered: true,
        haAceptadoPolitica: true
      }
    ];

    for (const userData of users) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email }
        });

        if (existingUser) {
          const user = await prisma.user.update({
            where: { email: userData.email },
            data: userData
          });
          console.log(`✅ Usuario actualizado: ${user.email}`);
        } else {
          const user = await prisma.user.create({
            data: userData
          });
          console.log(`✅ Usuario creado: ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error con usuario ${userData.email}:`, error.message);
      }
    }
    console.log('');

    // 2. Crear startups
    console.log('🏢 Creando startups...');
    
    const startups = [
      {
        nombre: "Tech Innovators",
        razonSocial: "Tech Innovators SAC",
        ruc: "20123456789",
        fechaFundacion: new Date("2023-03-14"),
        categoria: "Tech",
        paginaWeb: "https://techinnovators.com",
        descripcion: "Plataforma de inteligencia artificial para optimización de procesos industriales.",
        etapa: "MVP",
        origen: "Idea",
        videoPitchUrl: "https://youtube.com/watch?v=techinnovators"
      },
      {
        nombre: "EduLearn",
        razonSocial: "EduLearn EIRL",
        ruc: "20123456790",
        fechaFundacion: new Date("2022-11-20"),
        categoria: "EdTech",
        paginaWeb: "https://edulearn.edu",
        descripcion: "Solución para educación remota con enfoque en experiencias interactivas.",
        etapa: "Idea",
        origen: "Curso",
        videoPitchUrl: "https://youtube.com/watch?v=edulearn"
      }
    ];

    const createdStartups = [];
    for (const startupData of startups) {
      try {
        const startup = await prisma.startup.create({
          data: startupData
        });
        createdStartups.push(startup);
        console.log(`✅ Startup creada: ${startup.nombre}`);
      } catch (error) {
        console.error(`❌ Error con startup ${startupData.nombre}:`, error.message);
      }
    }
    console.log('');

    // 3. Crear convocatorias
    console.log('📅 Creando convocatorias...');
    
    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" }
    });

    if (!adminUser) {
      console.log('⚠️ No se encontró usuario admin, usando el primer usuario disponible');
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) {
        throw new Error('No hay usuarios disponibles para crear convocatorias');
      }
      adminUser = firstUser;
    }

    const convocatorias = [
      {
        tipo: "Inqubalab",
        fechaInicio: new Date("2025-06-30"),
        fechaFin: new Date("2025-08-14"),
        creadoPorId: adminUser.id
      },
      {
        tipo: "Aceleracion",
        fechaInicio: new Date("2025-06-14"),
        fechaFin: new Date("2025-07-19"),
        creadoPorId: adminUser.id
      }
    ];

    const createdConvocatorias = [];
    for (const convData of convocatorias) {
      try {
        const convocatoria = await prisma.application.create({
          data: convData
        });
        createdConvocatorias.push(convocatoria);
        console.log(`✅ Convocatoria creada: ${convocatoria.tipo}`);
      } catch (error) {
        console.error(`❌ Error con convocatoria ${convData.tipo}:`, error.message);
      }
    }
    console.log('');

    // 4. Crear miembros de startups
    console.log('👤 Creando miembros de startups...');
    
    if (createdStartups.length >= 2) {
      const techInnovators = createdStartups[0];
      const eduLearn = createdStartups[1];

      const members = [
        {
          nombres: "WALTHER",
          apellidos: "ALCOCER",
          dni: "12345678",
          email: "walther.alcocer@cetemin.edu.pe",
          telefono: "999888777",
          rol: "Fundador",
          aceptado: true,
          startupId: techInnovators.id
        },
        {
          nombres: "Michael",
          apellidos: "Limaco",
          dni: "87654321",
          email: "m.limaco0191@gmail.com",
          telefono: "999777666",
          rol: "CEO",
          aceptado: true,
          startupId: techInnovators.id
        },
        {
          nombres: "Ana",
          apellidos: "García",
          dni: "11223344",
          email: "ana.garcia@example.com",
          telefono: "999555444",
          rol: "CTO",
          aceptado: true,
          startupId: techInnovators.id
        },
        {
          nombres: "Carlos",
          apellidos: "Rodríguez",
          dni: "55667788",
          email: "carlos.rodriguez@example.com",
          telefono: "999333222",
          rol: "Fundador",
          aceptado: true,
          startupId: eduLearn.id
        },
        {
          nombres: "María",
          apellidos: "López",
          dni: "99887766",
          email: "maria.lopez@example.com",
          telefono: "999111000",
          rol: "COO",
          aceptado: true,
          startupId: eduLearn.id
        }
      ];

      for (const memberData of members) {
        try {
          const member = await prisma.member.create({
            data: memberData
          });
          console.log(`✅ Miembro creado: ${member.nombres} ${member.apellidos}`);
        } catch (error) {
          console.error(`❌ Error con miembro ${memberData.nombres}:`, error.message);
        }
      }
    }
    console.log('');

    // 5. Crear postulaciones
    console.log('📝 Creando postulaciones...');
    
    if (createdStartups.length >= 2 && createdConvocatorias.length >= 2) {
      const techInnovators = createdStartups[0];
      const eduLearn = createdStartups[1];
      const inqubalab = createdConvocatorias[0];
      const aceleracion = createdConvocatorias[1];

      const postulaciones = [
        {
          startupId: techInnovators.id,
          convocatoriaId: inqubalab.id,
          estado: "aprobado"
        },
        {
          startupId: techInnovators.id,
          convocatoriaId: aceleracion.id,
          estado: "enRevision"
        },
        {
          startupId: eduLearn.id,
          convocatoriaId: inqubalab.id,
          estado: "desaprobado"
        }
      ];

      for (const postData of postulaciones) {
        try {
          const postulacion = await prisma.applicant.create({
            data: postData
          });
          console.log(`✅ Postulación creada: ${postData.startupId} → ${postData.convocatoriaId} (${postData.estado})`);
        } catch (error) {
          console.error(`❌ Error con postulación:`, error.message);
        }
      }
    }
    console.log('');

    console.log('✅ ENTORNO ORDENADO CREADO EXITOSAMENTE');
    console.log('');
    console.log('📊 RESUMEN DEL ENTORNO ORDENADO:');
    console.log('🎯 Navegación Simple:');
    console.log('  - Perfil (datos personales)');
    console.log('  - Startups (gestión de startups)');
    console.log('  - Convocatorias (postulaciones)');
    console.log('');
    console.log('👥 Usuarios:');
    console.log('  - walther.alcocer@cetemin.edu.pe (usuario)');
    console.log('  - m.limaco0191@gmail.com (usuario)');
    console.log('  - admin@upc.edu.pe (admin)');
    console.log('');
    console.log('🏢 Startups:');
    console.log('  - Tech Innovators (MVP, Tech)');
    console.log('  - EduLearn (Idea, EdTech)');
    console.log('');
    console.log('📅 Convocatorias:');
    console.log('  - Inqubalab (30/06/2025 - 14/08/2025)');
    console.log('  - Aceleración (14/06/2025 - 19/07/2025)');
    console.log('');
    console.log('🎯 El entorno está listo para una experiencia ordenada y profesional');

  } catch (error) {
    console.error('❌ Error creando entorno:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSimpleEnvironment(); 