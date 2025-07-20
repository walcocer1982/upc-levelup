import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EstadoPostulacion } from "@/generated/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    console.log("🔐 POST Apply - Sesión verificada:", session?.user?.email);

    if (!session || !session.user?.email) {
      console.log("❌ POST Apply - No autorizado - Sin sesión");
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const applicationId = (await params).id;
    const body = await request.json();
    console.log("📝 POST Apply - Datos recibidos para convocatoria:", applicationId);
    console.log("📝 POST Apply - Body:", JSON.stringify(body, null, 2));

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.dni) {
      console.log("❌ POST Apply - Usuario no encontrado o sin DNI");
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar que la convocatoria existe y está activa
    const application = await prisma.application.findUnique({
      where: { id: applicationId }
    });

    if (!application) {
      console.log("❌ POST Apply - Convocatoria no encontrada");
      return NextResponse.json({ error: "Convocatoria no encontrada" }, { status: 404 });
    }

    // Verificar que la convocatoria esté activa
    const now = new Date();
    if (now < application.fechaInicio || now > application.fechaFin) {
      console.log("❌ POST Apply - Convocatoria no está activa");
      return NextResponse.json({ error: "La convocatoria no está activa" }, { status: 400 });
    }

    // Verificar que la startup existe y el usuario es miembro
    const startup = await prisma.startup.findUnique({
      where: { id: body.startupId }
    });

    if (!startup) {
      console.log("❌ POST Apply - Startup no encontrada");
      return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
    }

    // Verificar que el usuario es miembro de la startup
    const memberCheck = await prisma.member.findFirst({
      where: {
        dni: user.dni,
        startupId: body.startupId
      }
    });

    if (!memberCheck) {
      console.log("❌ POST Apply - Usuario no es miembro de la startup");
      return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
    }

    // Verificar que la startup no haya postulado ya a esta convocatoria
    const existingApplicant = await prisma.applicant.findUnique({
      where: {
        startupId_convocatoriaId: {
          startupId: body.startupId,
          convocatoriaId: applicationId
        }
      }
    });

    if (existingApplicant) {
      console.log("❌ POST Apply - La startup ya postuló a esta convocatoria");
      return NextResponse.json({ 
        error: "Esta startup ya ha postulado a esta convocatoria" 
      }, { status: 400 });
    }

    // Usar transacción para crear ApplicationForm y Applicant
    const result = await prisma.$transaction(async (tx) => {
      // Crear ApplicationForm
      const applicationForm = await tx.applicationForm.create({
        data: {
          startupId: body.startupId,
          convocatoriaId: applicationId,
          solucion: body.solucion,
          razon: body.razonIngreso,
          necesidades: body.necesidades,
          participacionPasada: body.participacionPrevia,
          programaPasado: body.programaPrevio || null,
          aprendizaje: body.aprendizajes || null,
          startupNombre: startup.nombre
        }
      });

      console.log("✅ POST Apply - ApplicationForm creado:", applicationForm.id);

      // Crear Applicant
      const applicant = await tx.applicant.create({
        data: {
          startupId: body.startupId,
          convocatoriaId: applicationId,
          estado: EstadoPostulacion.postulado,
          fecha: new Date(),
          locked: false
        }
      });

      console.log("✅ POST Apply - Applicant creado:", applicant.id);

      return { applicationForm, applicant };
    });

    console.log("✅ POST Apply - Postulación completada exitosamente");

    return NextResponse.json({
      message: "Postulación enviada exitosamente",
      data: {
        applicationFormId: result.applicationForm.id,
        applicantId: result.applicant.id,
        startup: startup.nombre,
        estado: result.applicant.estado
      }
    }, { status: 201 });

  } catch (error) {
    console.error("💥 Error en POST /api/applications/[id]/apply:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}