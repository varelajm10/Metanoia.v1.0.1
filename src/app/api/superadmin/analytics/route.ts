import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos de super admin
    // Nota: En un entorno real, deberías verificar el token JWT aquí
    
    // Calcular métricas de analytics
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      modulesData,
      monthlyRevenue,
      churnData
    ] = await Promise.all([
      // Total de tenants
      prisma.tenant.count(),
      
      // Tenants activos (con usuarios)
      prisma.tenant.count({
        where: {
          users: {
            some: {}
          }
        }
      }),
      
      // Total de usuarios
      prisma.user.count(),
      
      // Datos de módulos más populares
      prisma.tenantModule.groupBy({
        by: ['moduleKey'],
        _count: {
          moduleKey: true
        },
        where: {
          isActive: true
        }
      }),
      
      // Ingresos mensuales (simulado - en producción vendría de Stripe)
      calculateMonthlyRevenue(),
      
      // Datos de churn (simulado)
      calculateChurnRate()
    ])

    // Procesar datos de módulos
    const moduleNames = {
      'crm': 'CRM',
      'inventory': 'Inventario',
      'accounting': 'Contabilidad',
      'hr': 'Recursos Humanos',
      'elevators': 'Ascensores',
      'servers': 'Servidores',
      'schools': 'Educación'
    }

    const popularModules = modulesData.map(module => ({
      name: moduleNames[module.moduleKey as keyof typeof moduleNames] || module.moduleKey,
      value: module._count.moduleKey,
      moduleKey: module.moduleKey
    })).sort((a, b) => b.value - a.value)

    // Calcular MRR (Monthly Recurring Revenue)
    const mrr = monthlyRevenue.currentMonth

    // Calcular tasa de churn
    const churnRate = churnData.churnRate

    // Calcular crecimiento de usuarios
    const userGrowth = await calculateUserGrowth()

    // Datos para gráficos de tendencias
    const revenueTrend = monthlyRevenue.last6Months
    const userTrend = await getUserTrend()

    const analytics = {
      mrr: {
        current: mrr,
        growth: monthlyRevenue.growth,
        trend: revenueTrend
      },
      churn: {
        rate: churnRate,
        trend: churnData.trend
      },
      customers: {
        total: totalTenants,
        active: activeTenants,
        growth: userGrowth
      },
      users: {
        total: totalUsers,
        trend: userTrend
      },
      modules: popularModules,
      summary: {
        totalRevenue: monthlyRevenue.total,
        averageRevenuePerTenant: activeTenants > 0 ? mrr / activeTenants : 0,
        moduleAdoptionRate: activeTenants > 0 ? (modulesData.length / activeTenants) * 100 : 0
      }
    }

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// Función para calcular ingresos mensuales (simulado)
async function calculateMonthlyRevenue() {
  // En producción, esto vendría de Stripe
  const currentMonth = new Date()
  const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
  
  // Simular datos de ingresos
  const baseRevenue = 50000 // Base de $50,000
  const growth = 0.15 // 15% de crecimiento mensual
  
  const currentMonthRevenue = baseRevenue * (1 + growth)
  const lastMonthRevenue = baseRevenue
  
  return {
    currentMonth: currentMonthRevenue,
    lastMonth: lastMonthRevenue,
    growth: ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100,
    total: currentMonthRevenue * 12, // ARR estimado
    last6Months: [
      { month: 'Ene', revenue: baseRevenue * 0.7 },
      { month: 'Feb', revenue: baseRevenue * 0.8 },
      { month: 'Mar', revenue: baseRevenue * 0.9 },
      { month: 'Abr', revenue: baseRevenue * 0.95 },
      { month: 'May', revenue: baseRevenue },
      { month: 'Jun', revenue: currentMonthRevenue }
    ]
  }
}

// Función para calcular tasa de churn
async function calculateChurnRate() {
  // En producción, esto vendría de análisis de datos de Stripe
  const currentMonth = new Date()
  const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
  
  // Simular datos de churn
  const totalTenants = await prisma.tenant.count()
  const churnedTenants = Math.floor(totalTenants * 0.05) // 5% de churn simulado
  
  return {
    churnRate: 5.2, // 5.2% de churn
    churnedTenants,
    trend: [
      { month: 'Ene', churn: 7.2 },
      { month: 'Feb', churn: 6.8 },
      { month: 'Mar', churn: 6.1 },
      { month: 'Abr', churn: 5.9 },
      { month: 'May', churn: 5.5 },
      { month: 'Jun', churn: 5.2 }
    ]
  }
}

// Función para calcular crecimiento de usuarios
async function calculateUserGrowth() {
  const currentMonth = new Date()
  const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
  
  const currentUsers = await prisma.user.count()
  const lastMonthUsers = Math.floor(currentUsers * 0.9) // Simular 10% de crecimiento
  
  return {
    current: currentUsers,
    lastMonth: lastMonthUsers,
    growth: ((currentUsers - lastMonthUsers) / lastMonthUsers) * 100
  }
}

// Función para obtener tendencia de usuarios
async function getUserTrend() {
  // Simular datos de tendencia de usuarios
  return [
    { month: 'Ene', users: 45 },
    { month: 'Feb', users: 52 },
    { month: 'Mar', users: 61 },
    { month: 'Abr', users: 68 },
    { month: 'May', users: 74 },
    { month: 'Jun', users: 82 }
  ]
}
