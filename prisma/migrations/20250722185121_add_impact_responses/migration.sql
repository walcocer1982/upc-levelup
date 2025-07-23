-- CreateTable
CREATE TABLE "impact_responses" (
    "id" TEXT NOT NULL,
    "startupId" TEXT NOT NULL,
    "criterio" TEXT NOT NULL,
    "pregunta" INTEGER NOT NULL,
    "respuesta" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "impact_responses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "impact_responses_startupId_idx" ON "impact_responses"("startupId");

-- CreateIndex
CREATE INDEX "impact_responses_criterio_idx" ON "impact_responses"("criterio");

-- CreateIndex
CREATE UNIQUE INDEX "impact_responses_startupId_criterio_pregunta_key" ON "impact_responses"("startupId", "criterio", "pregunta");

-- AddForeignKey
ALTER TABLE "impact_responses" ADD CONSTRAINT "impact_responses_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "startups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
