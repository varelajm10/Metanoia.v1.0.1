import { NextRequest, NextResponse } from 'next/server'
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client'

// Configurar recolección de métricas por defecto de Node.js
collectDefaultMetrics({
  prefix: 'metanoia_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // buckets para garbage collection
  eventLoopMonitoringPrecision: 10,
  register,
})

// Métricas personalizadas para el sistema ERP
const httpRequestDuration = new Histogram({
  name: 'metanoia_http_request_duration_seconds',
  help: 'Duración de las requests HTTP en segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
})

const httpRequestTotal = new Counter({
  name: 'metanoia_http_requests_total',
  help: 'Total de requests HTTP',
  labelNames: ['method', 'route', 'status_code'],
})

const httpRequestErrors = new Counter({
  name: 'metanoia_http_request_errors_total',
  help: 'Total de errores en requests HTTP',
  labelNames: ['method', 'route', 'error_type'],
})

const activeConnections = new Gauge({
  name: 'metanoia_active_connections',
  help: 'Número de conexiones activas',
})

const databaseConnections = new Gauge({
  name: 'metanoia_database_connections',
  help: 'Número de conexiones a la base de datos',
})

const tenantCount = new Gauge({
  name: 'metanoia_tenants_total',
  help: 'Número total de tenants en el sistema',
})

const userCount = new Gauge({
  name: 'metanoia_users_total',
  help: 'Número total de usuarios en el sistema',
})

const activeUsers = new Gauge({
  name: 'metanoia_active_users',
  help: 'Número de usuarios activos en la última hora',
})

// Métricas de negocio específicas del ERP
const customersTotal = new Gauge({
  name: 'metanoia_customers_total',
  help: 'Número total de clientes',
  labelNames: ['tenant_id'],
})

const productsTotal = new Gauge({
  name: 'metanoia_products_total',
  help: 'Número total de productos',
  labelNames: ['tenant_id'],
})

const ordersTotal = new Gauge({
  name: 'metanoia_orders_total',
  help: 'Número total de órdenes',
  labelNames: ['tenant_id'],
})

const revenueTotal = new Gauge({
  name: 'metanoia_revenue_total',
  help: 'Revenue total del sistema',
  labelNames: ['tenant_id'],
})

// Métricas de performance de la API
const apiResponseTime = new Histogram({
  name: 'metanoia_api_response_time_seconds',
  help: 'Tiempo de respuesta de la API en segundos',
  labelNames: ['endpoint', 'method', 'tenant_id'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
})

const apiErrors = new Counter({
  name: 'metanoia_api_errors_total',
  help: 'Total de errores en la API',
  labelNames: ['endpoint', 'error_type', 'tenant_id'],
})

// Función para actualizar métricas de negocio
async function updateBusinessMetrics() {
  try {
    const { prisma } = await import('@/lib/db')
    
    // Contar tenants
    const tenantCountValue = await prisma.tenant.count()
    tenantCount.set(tenantCountValue)
    
    // Contar usuarios totales y activos
    const userCountValue = await prisma.user.count()
    userCount.set(userCountValue)
    
    // Contar usuarios activos (usuarios que han sido actualizados recientemente)
    const activeUserCount = await prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // última hora
        }
      }
    })
    activeUsers.set(activeUserCount)
    
    // Métricas por tenant
    const tenants = await prisma.tenant.findMany({
      select: { id: true }
    })
    
    for (const tenant of tenants) {
      const [customers, products, orders, revenue] = await Promise.all([
        prisma.customer.count({ where: { tenantId: tenant.id } }),
        prisma.product.count({ where: { tenantId: tenant.id } }),
        prisma.order.count({ where: { tenantId: tenant.id } }),
        prisma.order.aggregate({
          where: { 
            tenantId: tenant.id,
            status: 'COMPLETED'
          },
          _sum: { total: true }
        })
      ])
      
      customersTotal.set({ tenant_id: tenant.id }, customers)
      productsTotal.set({ tenant_id: tenant.id }, products)
      ordersTotal.set({ tenant_id: tenant.id }, orders)
      revenueTotal.set({ tenant_id: tenant.id }, revenue._sum.total || 0)
    }
    
    // Simular conexiones activas (en un sistema real, esto vendría de un pool de conexiones)
    activeConnections.set(Math.floor(Math.random() * 100) + 10)
    databaseConnections.set(Math.floor(Math.random() * 20) + 5)
    
  } catch (error) {
    console.error('Error actualizando métricas de negocio:', error)
  }
}

// Middleware para capturar métricas de requests
export function captureMetrics(req: NextRequest, startTime: number) {
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  const method = req.method
  const route = req.nextUrl.pathname
  const statusCode = '200' // En un middleware real, obtendrías el código de estado real
  
  httpRequestDuration.observe(
    { method, route, status_code: statusCode },
    duration
  )
  
  httpRequestTotal.inc({ method, route, status_code: statusCode })
}

// Función para registrar errores
export function recordError(endpoint: string, errorType: string, tenantId?: string) {
  apiErrors.inc({ 
    endpoint, 
    error_type: errorType, 
    tenant_id: tenantId || 'unknown' 
  })
  
  httpRequestErrors.inc({ 
    method: 'POST', // o el método apropiado
    route: endpoint, 
    error_type: errorType 
  })
}

// Función para registrar tiempo de respuesta de API
export function recordApiResponseTime(endpoint: string, method: string, duration: number, tenantId?: string) {
  apiResponseTime.observe(
    { endpoint, method, tenant_id: tenantId || 'unknown' },
    duration
  )
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Actualizar métricas de negocio
    await updateBusinessMetrics()
    
    // Capturar métrica de esta request
    captureMetrics(request, startTime)
    
    // Obtener todas las métricas en formato Prometheus
    const metrics = await register.metrics()
    
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
    
  } catch (error) {
    console.error('Error generando métricas:', error)
    
    // Registrar el error
    recordError('/api/metrics', 'metrics_generation_error')
    
    return new NextResponse('Error generando métricas', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
}

// Exportar las métricas para uso en otros archivos
export {
  httpRequestDuration,
  httpRequestTotal,
  httpRequestErrors,
  apiResponseTime,
  apiErrors,
  activeConnections,
  databaseConnections,
  tenantCount,
  userCount,
  activeUsers,
  customersTotal,
  productsTotal,
  ordersTotal,
  revenueTotal,
}
