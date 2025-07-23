-- CreateEnum
CREATE TYPE "Role" AS ENUM ('usuario', 'admin');

-- CreateEnum
CREATE TYPE "TipoConvocatoria" AS ENUM ('Inqubalab', 'Aceleracion');

-- CreateEnum
CREATE TYPE "EstadoPostulacion" AS ENUM ('postulado', 'aprobado', 'desaprobado', 'enRevision');

-- CreateEnum
CREATE TYPE "TipoComunicacion" AS ENUM ('notificacion', 'recordatorio', 'estado_postulacion');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombres" TEXT,
    "apellidos" TEXT,
    "dni" TEXT,
    "telefono" TEXT,
    "correoLaureate" TEXT,
    "linkedin" TEXT,
    "biografia" TEXT,
    "role" "Role" NOT NULL DEFAULT 'usuario',
    "haAceptadoPolitica" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isRegistered" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "action" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "startups" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "razonSocial" TEXT,
    "ruc" TEXT,
    "fechaFundacion" TIMESTAMP(3) NOT NULL,
    "categoria" TEXT NOT NULL,
    "paginaWeb" TEXT,
    "descripcion" TEXT NOT NULL,
    "etapa" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "videoPitchUrl" TEXT,

    CONSTRAINT "startups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impacts" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "casoReal" TEXT NOT NULL,
    "abordajeProblema" TEXT NOT NULL,
    "consecuencias" TEXT NOT NULL,
    "afectados" TEXT NOT NULL,
    "tamanoMercado" TEXT NOT NULL,
    "potencialesClientes" TEXT NOT NULL,
    "interesPagar" TEXT NOT NULL,
    "segmentoInteres" TEXT NOT NULL,
    "estrategiaAdquisicion" TEXT NOT NULL,
    "costoAdquisicion" TEXT NOT NULL,
    "facilidadExpansion" TEXT NOT NULL,
    "escalabilidad" TEXT NOT NULL,
    "trayectoria" TEXT NOT NULL,
    "experiencia" TEXT NOT NULL,
    "roles" TEXT NOT NULL,
    "desafios" TEXT NOT NULL,

    CONSTRAINT "impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "ventas" BOOLEAN NOT NULL,
    "montoVentas" INTEGER,
    "monedaVentas" TEXT,
    "tienePiloto" BOOLEAN NOT NULL,
    "enlacePiloto" TEXT,
    "lugarAplicacion" TEXT,
    "tecnologia" TEXT,
    "tieneAreaTech" BOOLEAN NOT NULL,
    "inversionExterna" BOOLEAN NOT NULL,
    "montoInversion" INTEGER,
    "monedaInversion" TEXT,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "linkedin" TEXT,
    "biografia" TEXT,
    "rol" TEXT NOT NULL,
    "aceptado" BOOLEAN NOT NULL DEFAULT false,
    "startupId" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "tipo" "TipoConvocatoria" NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "creadoPorId" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_forms" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "convocatoriaId" TEXT NOT NULL,
    "solucion" TEXT NOT NULL,
    "razon" TEXT NOT NULL,
    "necesidades" TEXT[],
    "participacionPasada" BOOLEAN NOT NULL,
    "programaPasado" TEXT,
    "aprendizaje" TEXT,
    "startupNombre" TEXT NOT NULL,
    "pregunta" TEXT,
    "respuesta" TEXT,
    "categoria" TEXT,
    "peso" INTEGER DEFAULT 1,
    "orden" INTEGER DEFAULT 0,

    CONSTRAINT "application_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicants" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "convocatoriaId" TEXT NOT NULL,
    "estado" "EstadoPostulacion" NOT NULL,
    "feedbackEvaluador" TEXT,
    "feedbackIA" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluaciones_ia" (
    "id" TEXT NOT NULL,
    "postulacionId" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "confianza" DOUBLE PRECISION NOT NULL,
    "puntajeTotal" DOUBLE PRECISION NOT NULL,
    "analisis" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "evaluaciones_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "criterios_evaluacion" (
    "id" TEXT NOT NULL,
    "evaluacionId" TEXT NOT NULL,
    "criterioId" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "puntajeOriginal" INTEGER NOT NULL,
    "puntajeNormalizado" DOUBLE PRECISION NOT NULL,
    "justificacion" TEXT NOT NULL,
    "recomendaciones" TEXT,
    "confianza" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "criterios_evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "convocatorias" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "criterios" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "convocatorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunicaciones" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "asunto" TEXT NOT NULL,
    "cuerpo" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipo" "TipoComunicacion" NOT NULL,

    CONSTRAINT "comunicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_dni_key" ON "users"("dni");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "session_logs_userId_idx" ON "session_logs"("userId");

-- CreateIndex
CREATE INDEX "session_logs_createdAt_idx" ON "session_logs"("createdAt");

-- CreateIndex
CREATE INDEX "startups_nombre_idx" ON "startups"("nombre");

-- CreateIndex
CREATE INDEX "startups_etapa_idx" ON "startups"("etapa");

-- CreateIndex
CREATE INDEX "startups_categoria_idx" ON "startups"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "impacts_startupId_key" ON "impacts"("startupId");

-- CreateIndex
CREATE INDEX "impacts_startupId_idx" ON "impacts"("startupId");

-- CreateIndex
CREATE UNIQUE INDEX "metrics_startupId_key" ON "metrics"("startupId");

-- CreateIndex
CREATE INDEX "metrics_startupId_idx" ON "metrics"("startupId");

-- CreateIndex
CREATE INDEX "members_startupId_idx" ON "members"("startupId");

-- CreateIndex
CREATE INDEX "members_dni_idx" ON "members"("dni");

-- CreateIndex
CREATE INDEX "members_email_idx" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_dni_startupId_key" ON "members"("dni", "startupId");

-- CreateIndex
CREATE INDEX "applications_tipo_idx" ON "applications"("tipo");

-- CreateIndex
CREATE INDEX "applications_fechaInicio_fechaFin_idx" ON "applications"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "applications_creadoPorId_idx" ON "applications"("creadoPorId");

-- CreateIndex
CREATE INDEX "application_forms_startupId_idx" ON "application_forms"("startupId");

-- CreateIndex
CREATE INDEX "application_forms_convocatoriaId_idx" ON "application_forms"("convocatoriaId");

-- CreateIndex
CREATE INDEX "application_forms_categoria_idx" ON "application_forms"("categoria");

-- CreateIndex
CREATE INDEX "applicants_estado_idx" ON "applicants"("estado");

-- CreateIndex
CREATE INDEX "applicants_fecha_idx" ON "applicants"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "applicants_startupId_convocatoriaId_key" ON "applicants"("startupId", "convocatoriaId");

-- CreateIndex
CREATE INDEX "evaluaciones_ia_postulacionId_idx" ON "evaluaciones_ia"("postulacionId");

-- CreateIndex
CREATE INDEX "evaluaciones_ia_estado_idx" ON "evaluaciones_ia"("estado");

-- CreateIndex
CREATE INDEX "evaluaciones_ia_createdAt_idx" ON "evaluaciones_ia"("createdAt");

-- CreateIndex
CREATE INDEX "criterios_evaluacion_evaluacionId_idx" ON "criterios_evaluacion"("evaluacionId");

-- CreateIndex
CREATE INDEX "criterios_evaluacion_categoria_idx" ON "criterios_evaluacion"("categoria");

-- CreateIndex
CREATE INDEX "convocatorias_estado_idx" ON "convocatorias"("estado");

-- CreateIndex
CREATE INDEX "convocatorias_fechaInicio_fechaFin_idx" ON "convocatorias"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "comunicaciones_userId_idx" ON "comunicaciones"("userId");

-- CreateIndex
CREATE INDEX "comunicaciones_startupId_idx" ON "comunicaciones"("startupId");

-- CreateIndex
CREATE INDEX "comunicaciones_fecha_idx" ON "comunicaciones"("fecha");

-- CreateIndex
CREATE INDEX "comunicaciones_tipo_idx" ON "comunicaciones"("tipo");

-- AddForeignKey
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impacts" ADD CONSTRAINT "impacts_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_dni_fkey" FOREIGN KEY ("dni") REFERENCES "users"("dni") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_forms" ADD CONSTRAINT "application_forms_convocatoriaId_fkey" FOREIGN KEY ("convocatoriaId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_forms" ADD CONSTRAINT "application_forms_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_convocatoriaId_fkey" FOREIGN KEY ("convocatoriaId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluaciones_ia" ADD CONSTRAINT "evaluaciones_ia_postulacionId_fkey" FOREIGN KEY ("postulacionId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "criterios_evaluacion" ADD CONSTRAINT "criterios_evaluacion_evaluacionId_fkey" FOREIGN KEY ("evaluacionId") REFERENCES "evaluaciones_ia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunicaciones" ADD CONSTRAINT "comunicaciones_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comunicaciones" ADD CONSTRAINT "comunicaciones_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
