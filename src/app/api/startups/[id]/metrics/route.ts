import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const startupId = (await params).id;
        console.log("📝 Datos solicitados para startup:", startupId);

        // Verificar que el usuario es miembro de la startup
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || !user.dni) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const memberCheck = await prisma.member.findFirst({
            where: {
                dni: user.dni,
                startupId: startupId
            }
        });

        if (!memberCheck) {
            return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
        }

        // Buscar las métricas de la startup
        const metrics = await prisma.metrics.findUnique({
            where: { startupId: startupId }
        });

        console.log("✅ Metrics encontradas:", metrics ? "Sí" : "No");

        return NextResponse.json({
            metrics: metrics ? {
                hasHadSales: metrics.ventas,
                totalSalesAmount: metrics.montoVentas?.toString() || "",
                salesCurrency: metrics.monedaVentas || "",
                hasPilot: metrics.tienePiloto,
                pilotLink: metrics.enlacePiloto || "",
                solutionApplication: metrics.lugarAplicacion || "",
                technologyUsed: metrics.tecnologia || "",
                hasTechDepartment: metrics.tieneAreaTech,
                hasReceivedInvestment: metrics.inversionExterna,
                investmentAmount: metrics.montoInversion?.toString() || "",
                investmentCurrency: metrics.monedaInversion || "",
            } : null
        });

    } catch (error) {
        console.error("💥 Error en GET /api/startups/[id]/metrics:", error);
        return NextResponse.json(
            {
                error: "Error interno del servidor",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const startupId = (await params).id;
        const body = await request.json();
        console.log("📝 Datos recibidos para startup:", startupId);
        console.log("📝 Body recibido:", JSON.stringify(body, null, 2));

        // Verificar que el usuario es miembro de la startup
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || !user.dni) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const memberCheck = await prisma.member.findFirst({
            where: {
                dni: user.dni,
                startupId: startupId
            }
        });

        if (!memberCheck) {
            return NextResponse.json({ error: "No tienes acceso a esta startup" }, { status: 403 });
        }

        // Verificar que la startup existe
        const startup = await prisma.startup.findUnique({
            where: { id: startupId }
        });

        if (!startup) {
            return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
        }

        const parseNumber = (value: string | undefined | null): number | null => {
            if (!value || value.trim() === "") return null;
            const parsed = parseFloat(value);
            return isNaN(parsed) ? null : parsed;
        };
        // Preparar los datos para actualizar/crear
        const metricsData = {
            ventas: body.hasHadSales || false,
            montoVentas: parseNumber(body.totalSalesAmount),
            monedaVentas: body.salesCurrency || null,
            tienePiloto: body.hasPilot || false,
            enlacePiloto: body.pilotLink || null,
            lugarAplicacion: body.solutionApplication || null,
            tecnologia: body.technologyUsed || null,
            tieneAreaTech: body.hasTechDepartment || false,
            inversionExterna: body.hasReceivedInvestment || false,
            montoInversion: parseNumber(body.investmentAmount),
            monedaInversion: body.investmentCurrency || null,
        };
        console.log("📝 Datos preparados:", JSON.stringify(metricsData, null, 2));

        let metrics;

        // Buscar si ya existen métricas para esta startup
        const existingMetrics = await prisma.metrics.findUnique({
            where: { startupId: startupId }
        });

        if (existingMetrics) {
            // Actualizar las métricas existentes
            metrics = await prisma.metrics.update({
                where: { startupId: startupId },
                data: metricsData
            });
            console.log("✅ Metrics actualizadas exitosamente");
        } else {
            metrics = await prisma.metrics.create({
                data: {
                    ...metricsData,
                    startupId: startupId
                }
            });
            console.log("✅ Metrics creadas exitosamente");
        }

        return NextResponse.json({
            message: existingMetrics ? "Métricas actualizadas exitosamente" : "Métricas creadas exitosamente",
            metrics: metrics
        });

    } catch (error) {
        console.error("💥 Error en POST /api/startups/[id]/metrics:", error);
        return NextResponse.json(
            {
                error: "Error interno del servidor",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}