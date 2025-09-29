import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Obtener estadísticas reales de la base de datos
    const [
      totalClients,
      activeClients,
      totalModules,
      clientsThisMonth,
      recentActivity,
    ] = await Promise.all([
      // Total de clientes
      prisma.tenant.count(),

      // Clientes activos
      prisma.tenant.count({
        where: { isActive: true },
      }),

      // Total de módulos disponibles
      prisma.module.count(),

      // Clientes creados este mes
      prisma.tenant.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),

      // Actividad reciente (últimos 10 registros)
      prisma.tenant.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          tenantModules: {
            include: {
              module: true,
            },
          },
        },
      }),
    ])

    // Calcular ingresos (simulado por ahora)
    const monthlyRevenue = activeClients * 375 // $375 por cliente activo
    const totalRevenue = monthlyRevenue * 6 // 6 meses de ingresos

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

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de administración',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
