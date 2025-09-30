#!/usr/bin/env tsx

/**
 * Script de prueba de performance para verificar optimizaciones
 * Ejecutar: npm run test-performance
 */

import { PrismaClient } from '@prisma/client'
import { CustomerCacheService } from '../src/lib/services/customer-cache'
import { LazyLoadingService } from '../src/lib/services/lazy-loading'
import { performance } from 'perf_hooks'

const prisma = new PrismaClient()

async function testDatabaseIndexes() {
  console.log('🔍 Probando índices de base de datos...')
  
  const startTime = performance.now()
  
  try {
    // Probar consulta optimizada con índices
    const customers = await prisma.customer.findMany({
      where: {
        tenantId: 'test-tenant', // Cambiar por un tenant real
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`✅ Consulta ejecutada en ${duration.toFixed(2)}ms`)
    console.log(`📊 Clientes encontrados: ${customers.length}`)
    
    return { success: true, duration, count: customers.length }
  } catch (error) {
    console.error('❌ Error en consulta:', error)
    return { success: false, error: error.message }
  }
}

async function testCachePerformance() {
  console.log('🔍 Probando sistema de caché...')
  
  try {
    // Probar caché de estadísticas
    const startTime = performance.now()
    const stats = await CustomerCacheService.getCachedStats('test-tenant')
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`✅ Caché de estadísticas: ${duration.toFixed(2)}ms`)
    console.log(`📊 Estadísticas:`, stats)
    
    return { success: true, duration, stats }
  } catch (error) {
    console.error('❌ Error en caché:', error)
    return { success: false, error: error.message }
  }
}

async function testLazyLoading() {
  console.log('🔍 Probando lazy loading...')
  
  try {
    // Probar lazy loading de relaciones
    const startTime = performance.now()
    const customer = await LazyLoadingService.getCustomerWithLazyRelations(
      'test-customer-id', // Cambiar por un ID real
      'test-tenant'
    )
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`✅ Lazy loading: ${duration.toFixed(2)}ms`)
    console.log(`📊 Cliente cargado:`, customer ? 'Sí' : 'No')
    
    return { success: true, duration, loaded: !!customer }
  } catch (error) {
    console.error('❌ Error en lazy loading:', error)
    return { success: false, error: error.message }
  }
}

async function testMemoryUsage() {
  console.log('🔍 Probando uso de memoria...')
  
  const memUsage = process.memoryUsage()
  
  console.log(`📈 RSS: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`)
  console.log(`🧠 Heap Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`)
  console.log(`🧠 Heap Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`)
  console.log(`🔗 External: ${(memUsage.external / 1024 / 1024).toFixed(2)} MB`)
  
  // Verificar si está dentro de límites saludables
  const isHealthy = memUsage.heapUsed < 100 * 1024 * 1024 // 100MB
  console.log(`✅ Memoria saludable: ${isHealthy ? 'Sí' : 'No'}`)
  
  return {
    rss: memUsage.rss,
    heapUsed: memUsage.heapUsed,
    heapTotal: memUsage.heapTotal,
    isHealthy,
  }
}

async function testRedisConnection() {
  console.log('🔍 Probando conexión a Redis...')
  
  try {
    const redis = require('ioredis')
    const client = new redis({
      host: 'localhost',
      port: 6379,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    })
    
    const startTime = performance.now()
    await client.ping()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    console.log(`✅ Redis conectado en ${duration.toFixed(2)}ms`)
    
    // Probar operaciones de caché
    await client.set('test:performance', 'optimized', 'EX', 60)
    const value = await client.get('test:performance')
    
    console.log(`✅ Operación de caché: ${value === 'optimized' ? 'Exitosa' : 'Fallida'}`)
    
    await client.disconnect()
    
    return { success: true, duration, cacheTest: value === 'optimized' }
  } catch (error) {
    console.error('❌ Error conectando a Redis:', error)
    return { success: false, error: error.message }
  }
}

async function runPerformanceTests() {
  console.log('🚀 Iniciando pruebas de performance...\n')
  
  const results = {
    database: await testDatabaseIndexes(),
    cache: await testCachePerformance(),
    lazyLoading: await testLazyLoading(),
    memory: await testMemoryUsage(),
    redis: await testRedisConnection(),
  }
  
  console.log('\n📊 RESUMEN DE PRUEBAS:')
  console.log('====================')
  
  Object.entries(results).forEach(([test, result]) => {
    if (test === 'memory') {
      console.log(`🧠 Memoria: ${result.isHealthy ? '✅ Saludable' : '❌ Crítica'}`)
    } else if (test === 'redis') {
      console.log(`🔴 Redis: ${result.success ? '✅ Conectado' : '❌ Error'}`)
    } else {
      console.log(`${test}: ${result.success ? '✅ Exitoso' : '❌ Fallido'}`)
    }
  })
  
  const allTestsPassed = Object.values(results).every(result => 
    result.success !== false && result.isHealthy !== false
  )
  
  console.log(`\n🎯 RESULTADO GENERAL: ${allTestsPassed ? '✅ TODAS LAS OPTIMIZACIONES FUNCIONAN' : '❌ ALGUNAS OPTIMIZACIONES FALLAN'}`)
  
  return results
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runPerformanceTests()
    .then(() => {
      console.log('\n✅ Pruebas completadas')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error en pruebas:', error)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
}

export { runPerformanceTests }

