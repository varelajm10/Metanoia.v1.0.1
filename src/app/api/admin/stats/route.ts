import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  console.log('--- [API] Iniciando /api/admin/stats ---');
  try {
    console.log('[API] Iniciando consultas a la base de datos...');
    
    // Obtener estadísticas reales de la base de datos
    const [
      totalClients,
      activeClients,
      totalModules,
      clientsThisMonth,
      recentActivity,
    ] = await Promise.all([
      // Total de clientes
      (async () => {
        console.log('[API] Ejecutando prisma.tenant.count()...');
        const result = await prisma.tenant.count();
        console.log(`[API] prisma.tenant.count() completado: ${result}`);
        return result;
      })(),

      // Clientes activos
      (async () => {
        console.log('[API] Ejecutando prisma.tenant.count({ where: { isActive: true } })...');
        const result = await prisma.tenant.count({
          where: { isActive: true },
        });
        console.log(`[API] prisma.tenant.count({ isActive: true }) completado: ${result}`);
        return result;
      })(),

      // Total de módulos disponibles
      (async () => {
        console.log('[API] Ejecutando prisma.module.count()...');
        const result = await prisma.module.count();
        console.log(`[API] prisma.module.count() completado: ${result}`);
        return result;
      })(),

      // Clientes creados este mes
      (async () => {
        console.log('[API] Ejecutando prisma.tenant.count({ where: { createdAt: gte } })...');
        const result = await prisma.tenant.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        });
        console.log(`[API] prisma.tenant.count({ createdAt: gte }) completado: ${result}`);
        return result;
      })(),

      // Actividad reciente (últimos 10 registros)
      (async () => {
        console.log('[API] Ejecutando prisma.tenant.findMany({ include: { tenantModules: { include: { module: true } } } })...');
        const result = await prisma.tenant.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            tenantModules: {
              include: {
                module: true,
              },
            },
          },
        });
        console.log(`[API] prisma.tenant.findMany({ include: ... }) completado: ${result.length} registros`);
        return result;
      })(),
    ])

    console.log('[API] Todas las consultas a la base de datos completadas exitosamente');

    console.log('[API] Iniciando cálculo de ingresos...');
    // Calcular ingresos (simulado por ahora)
    const monthlyRevenue = activeClients * 375 // $375 por cliente activo
    const totalRevenue = monthlyRevenue * 6 // 6 meses de ingresos
    console.log(`[API] Ingresos calculados - Mensual: ${monthlyRevenue}, Total: ${totalRevenue}`);

    console.log('[API] Iniciando procesamiento de actividad reciente...');
    // Procesar actividad reciente
    const processedActivity = recentActivity.map((tenant, index) => {
      const modules = tenant.tenantModules
        .filter(tm => tm.isEnabled)
        .map(tm => tm.module.displayName)
        .join(', ')

      return {
        id: tenant.id,
        type: 'tenant_created',
        message: `Cliente "${tenant.name}" creado`,
        timestamp: tenant.createdAt.toISOString(),
        metadata: {
          clientName: tenant.name,
          modules: modules ? modules.split(', ') : [],
        },
      }
    })
    console.log(`[API] Actividad reciente procesada: ${processedActivity.length} actividades`);

    console.log('[API] Construyendo objeto de estadísticas...');
    const stats = {
      totalClients,
      activeClients,
      totalModules,
      totalRevenue,
      monthlyRevenue,
      clientsThisMonth,
      modulesUsage: {
        Customers: { enabled: 0, revenue: 0 },
        Servers: { enabled: 0, revenue: 0 },
        HR: { enabled: 0, revenue: 0 },
        CRM: { enabled: 0, revenue: 0 },
        Inventory: { enabled: 0, revenue: 0 },
        Accounting: { enabled: 0, revenue: 0 },
        Sales: { enabled: 0, revenue: 0 },
        Analytics: { enabled: 0, revenue: 0 },
        ForeignTrade: { enabled: 0, revenue: 0 },
      },
      recentActivity: processedActivity,
    }

    console.log('[API] Enviando respuesta JSON...');
    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('🔥🔥🔥 [API] Error crítico en /api/admin/stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de administración',
      },
      { status: 500 }
    )
  } finally {
    console.log('[API] Desconectando Prisma...');
    await prisma.$disconnect()
    console.log('--- [API] Finalizando /api/admin/stats ---');
  }
}
