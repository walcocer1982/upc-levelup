import { NextRequest, NextResponse } from "next/server";
import { mockAuth } from "@/lib/mock-auth";
import { getMockData } from "@/data/mock";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = mockAuth.getSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const startupId = (await params).id;
        console.log("📝 Datos solicitados para startup:", startupId);

        // Verificar que el usuario existe en mock data
        const user = getMockData.getUserByEmail(session.user.email);

        if (!user || !user.dni) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        // Buscar la startup en mock data
        const startup = getMockData.getStartupById(startupId);

        if (!startup) {
            return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
        }

        console.log("✅ Metrics encontradas (MOCK):", startup.metrics ? "Sí" : "No");

        return NextResponse.json({
            metrics: startup.metrics ? {
                hasHadSales: startup.metrics.ventas || false,
                totalSalesAmount: startup.metrics.montoVentas?.toString() || "",
                salesCurrency: startup.metrics.monedaVentas || "",
                hasPilot: startup.metrics.tienePiloto || false,
                pilotLink: startup.metrics.enlacePiloto || "",
                solutionApplication: startup.metrics.lugarAplicacion || "",
                technologyUsed: startup.metrics.tecnologia || "",
                hasTechDepartment: startup.metrics.tieneAreaTech || false,
                hasReceivedInvestment: startup.metrics.inversionExterna || false,
                investmentAmount: startup.metrics.montoInversion?.toString() || "",
                investmentCurrency: startup.metrics.monedaInversion || "",
            } : null
        });

    } catch (error) {
        console.error("💥 Error en GET /api/startups/[id]/metrics (MOCK):", error);
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
        const session = mockAuth.getSession();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const startupId = (await params).id;
        const body = await request.json();
        console.log("📝 Datos recibidos para startup:", startupId);
        console.log("📝 Body recibido:", JSON.stringify(body, null, 2));

        // Verificar que el usuario existe en mock data
        const user = getMockData.getUserByEmail(session.user.email);

        if (!user || !user.dni) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        // Verificar que la startup existe
        const startup = getMockData.getStartupById(startupId);

        if (!startup) {
            return NextResponse.json({ error: "Startup no encontrada" }, { status: 404 });
        }

        const parseNumber = (value: string | undefined | null): number | null => {
            if (!value || value.trim() === "") return null;
            const parsed = parseFloat(value);
            return isNaN(parsed) ? null : parsed;
        };

        // En modo mock, simplemente devolver éxito
        console.log("✅ Metrics creadas/actualizadas (MOCK)");

        return NextResponse.json({
            message: "Métricas creadas/actualizadas exitosamente (MOCK)",
            metrics: {
                startupId: startupId,
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
            }
        });

    } catch (error) {
        console.error("💥 Error en POST /api/startups/[id]/metrics (MOCK):", error);
        return NextResponse.json(
            {
                error: "Error interno del servidor",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}