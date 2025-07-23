// Script para agregar startup de bajo rendimiento
const BASE_URL = 'http://localhost:3002';

async function addLowPerformanceStartup() {
  console.log('🚀 Agregando startup de bajo rendimiento...\n');

  try {
    // 1. Crear startup
    console.log('1️⃣ Creando startup QuickFix App...');
    const startupData = {
      id: 'startup-005',
      nombre: 'QuickFix App',
      descripcion: 'Aplicación para arreglar problemas domésticos simples',
      categoria: 'Consumer',
      sector: 'Servicios',
      estado: 'ACTIVA',
      fundadores: ['Juan Pérez'],
      miembros: ['Juan Pérez'],
      website: 'https://quickfix.com',
      linkedin: 'https://linkedin.com/company/quickfix',
      fechaFundacion: '2024-01-01',
      ubicacion: 'Lima, Perú',
      mercadoObjetivo: 'Personas que necesitan arreglar cosas',
      modeloNegocio: 'Freemium'
    };

    const startupResponse = await fetch(`${BASE_URL}/api/startups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(startupData)
    });

    if (startupResponse.ok) {
      console.log('   ✅ Startup creada exitosamente');
    } else {
      console.log('   ❌ Error creando startup');
    }

    // 2. Crear postulación
    console.log('\n2️⃣ Creando postulación...');
    const postulacionData = {
      id: 'post-005',
      startupId: 'startup-005',
      convocatoriaId: 'conv-001',
      estado: 'ENVIADA',
      fechaPostulacion: '2024-01-15'
    };

    const postulacionResponse = await fetch(`${BASE_URL}/api/postulaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postulacionData)
    });

    if (postulacionResponse.ok) {
      console.log('   ✅ Postulación creada exitosamente');
    } else {
      console.log('   ❌ Error creando postulación');
    }

    // 3. Agregar respuestas de bajo rendimiento
    console.log('\n3️⃣ Agregando respuestas de bajo rendimiento...');
    
    const respuestasBajoRendimiento = [
      {
        id: 'resp-005-001',
        postulacionId: 'post-005',
        criterioId: 'crit-complejidad',
        pregunta: '¿Cuál es el problema principal que resuelve su startup?',
        respuesta: 'La gente no sabe arreglar cosas simples en casa como cambiar un foco o arreglar una llave que gotea.',
        categoria: 'COMPLEJIDAD',
        peso: 1,
        orden: 1
      },
      {
        id: 'resp-005-002',
        postulacionId: 'post-005',
        criterioId: 'crit-complejidad',
        pregunta: '¿Qué evidencia tienen de que este problema es real y urgente?',
        respuesta: 'Mi hermano me dijo que no sabe cambiar un foco y mi vecino tiene una llave que gotea.',
        categoria: 'COMPLEJIDAD',
        peso: 1,
        orden: 2
      },
      {
        id: 'resp-005-003',
        postulacionId: 'post-005',
        criterioId: 'crit-complejidad',
        pregunta: '¿Qué soluciones ya existen en el mercado?',
        respuesta: 'Hay videos en YouTube y páginas web con tutoriales.',
        categoria: 'COMPLEJIDAD',
        peso: 1,
        orden: 3
      },
      {
        id: 'resp-005-004',
        postulacionId: 'post-005',
        criterioId: 'crit-complejidad',
        pregunta: '¿Por qué su solución es única o mejor?',
        respuesta: 'Es más fácil de usar que buscar en YouTube.',
        categoria: 'COMPLEJIDAD',
        peso: 1,
        orden: 4
      },
      {
        id: 'resp-005-005',
        postulacionId: 'post-005',
        criterioId: 'crit-mercado',
        pregunta: '¿Cuál es el tamaño de su mercado objetivo?',
        respuesta: 'Todas las personas que viven en casas o departamentos.',
        categoria: 'MERCADO',
        peso: 1,
        orden: 5
      },
      {
        id: 'resp-005-006',
        postulacionId: 'post-005',
        criterioId: 'crit-mercado',
        pregunta: '¿Cómo han validado la demanda de su producto?',
        respuesta: 'Le pregunté a algunos amigos y dijeron que sería útil.',
        categoria: 'MERCADO',
        peso: 1,
        orden: 6
      },
      {
        id: 'resp-005-007',
        postulacionId: 'post-005',
        criterioId: 'crit-mercado',
        pregunta: '¿Cuántos clientes potenciales han entrevistado?',
        respuesta: 'Como 5 o 6 personas.',
        categoria: 'MERCADO',
        peso: 1,
        orden: 7
      },
      {
        id: 'resp-005-008',
        postulacionId: 'post-005',
        criterioId: 'crit-mercado',
        pregunta: '¿Qué porcentaje mostró interés en su solución?',
        respuesta: 'Todos dijeron que sí, pero nadie ha pagado nada.',
        categoria: 'MERCADO',
        peso: 1,
        orden: 8
      },
      {
        id: 'resp-005-009',
        postulacionId: 'post-005',
        criterioId: 'crit-escalabilidad',
        pregunta: '¿Cómo planean adquirir clientes?',
        respuesta: 'Por redes sociales y boca a boca.',
        categoria: 'ESCALABILIDAD',
        peso: 1,
        orden: 9
      },
      {
        id: 'resp-005-010',
        postulacionId: 'post-005',
        criterioId: 'crit-escalabilidad',
        pregunta: '¿Cuál es su estrategia de crecimiento?',
        respuesta: 'Que más gente use la app.',
        categoria: 'ESCALABILIDAD',
        peso: 1,
        orden: 10
      },
      {
        id: 'resp-005-011',
        postulacionId: 'post-005',
        criterioId: 'crit-escalabilidad',
        pregunta: '¿Cómo se reduce el costo de adquisición de clientes?',
        respuesta: 'No sé, aún no he pensado en eso.',
        categoria: 'ESCALABILIDAD',
        peso: 1,
        orden: 11
      },
      {
        id: 'resp-005-012',
        postulacionId: 'post-005',
        criterioId: 'crit-escalabilidad',
        pregunta: '¿Qué efectos de red tiene su modelo de negocio?',
        respuesta: 'No entiendo qué son los efectos de red.',
        categoria: 'ESCALABILIDAD',
        peso: 1,
        orden: 12
      },
      {
        id: 'resp-005-013',
        postulacionId: 'post-005',
        criterioId: 'crit-equipo',
        pregunta: '¿Cuál es la experiencia del equipo en el sector?',
        respuesta: 'Soy programador y me gusta arreglar cosas.',
        categoria: 'EQUIPO',
        peso: 1,
        orden: 13
      },
      {
        id: 'resp-005-014',
        postulacionId: 'post-005',
        criterioId: 'crit-equipo',
        pregunta: '¿Cómo se complementan las habilidades del equipo?',
        respuesta: 'Solo soy yo trabajando en esto.',
        categoria: 'EQUIPO',
        peso: 1,
        orden: 14
      },
      {
        id: 'resp-005-015',
        postulacionId: 'post-005',
        criterioId: 'crit-equipo',
        pregunta: '¿Qué desafíos han superado juntos?',
        respuesta: 'Aún no hemos superado muchos desafíos.',
        categoria: 'EQUIPO',
        peso: 1,
        orden: 15
      },
      {
        id: 'resp-005-016',
        postulacionId: 'post-005',
        criterioId: 'crit-equipo',
        pregunta: '¿Cuál es su compromiso con el proyecto?',
        respuesta: 'Trabajo en esto cuando tengo tiempo libre.',
        categoria: 'EQUIPO',
        peso: 1,
        orden: 16
      }
    ];

    for (const respuesta of respuestasBajoRendimiento) {
      const respuestaResponse = await fetch(`${BASE_URL}/api/respuestas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(respuesta)
      });

      if (respuestaResponse.ok) {
        console.log(`   ✅ Respuesta ${respuesta.orden} agregada`);
      } else {
        console.log(`   ❌ Error agregando respuesta ${respuesta.orden}`);
      }
    }

    console.log('\n🎉 ¡Startup de bajo rendimiento creada exitosamente!');
    console.log('\n📋 Detalles:');
    console.log('   - Startup: QuickFix App');
    console.log('   - Postulación ID: post-005');
    console.log('   - 16 respuestas de bajo rendimiento');
    console.log('   - Estado: Pendiente de evaluación');
    console.log('\n🔍 Ahora puedes:');
    console.log('   1. Ir a /admin/evaluaciones');
    console.log('   2. Ver "QuickFix App" en la lista');
    console.log('   3. Hacer clic en "Revisar Respuestas"');
    console.log('   4. Iniciar evaluación IA para ver el bajo rendimiento');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Ejecutar el script
addLowPerformanceStartup(); 