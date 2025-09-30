import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'

const prisma = new PrismaClient()

// GET /api/health - Endpoint de monitoreo del sistema
export async function GET(request: NextRequest) {
  try {
    // Verificar conexión a la base de datos
    const dbCheck = await checkDatabaseConnection()
    
    // Verificar conexión a Redis (si está disponible)
    const redisCheck = await checkRedisConnection()
    
    // Si ambas verificaciones son exitosas
    if (dbCheck.success && redisCheck.success) {
      return NextResponse.json(
        {
          status: 'ok',
          database: 'connected',
          redis: 'connected',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        },
        { status: 200 }
      )
    }
    
    // Si alguna verificación falla
    const errors = []
    if (!dbCheck.success) {
      errors.push(`Database: ${dbCheck.error}`)
    }
    if (!redisCheck.success) {
      errors.push(`Redis: ${redisCheck.error}`)
    }
    
    return NextResponse.json(
      {
        status: 'error',
        database: dbCheck.success ? 'connected' : 'disconnected',
        redis: redisCheck.success ? 'connected' : 'disconnected',
        errors: errors,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
    
  } catch (error) {
    console.error('Error en health check:', error)
    
    return NextResponse.json(
      {
        status: 'error',
        database: 'unknown',
        redis: 'unknown',
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}

/**
 * Verifica la conexión a la base de datos PostgreSQL
 */
async function checkDatabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    // Realizar una consulta simple y rápida
    await prisma.$queryRaw`SELECT 1`
    
    return { success: true }
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido de base de datos'
    }
  }
}

/**
 * Verifica la conexión a Redis
 */
async function checkRedisConnection(): Promise<{ success: boolean; error?: string }> {
  let redisClient: any = null
  
  try {
    // Verificar si Redis está configurado
    const redisUrl = process.env.REDIS_URL
    
    if (!redisUrl) {
      return {
        success: false,
        error: 'REDIS_URL no configurada'
      }
    }
    
    // Crear cliente Redis
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000, // 5 segundos timeout
        lazyConnect: true,
      },
    })
    
    // Conectar y hacer ping
    await redisClient.connect()
    await redisClient.ping()
    
    return { success: true }
    
  } catch (error) {
    console.error('Error de conexión a Redis:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido de Redis'
    }
  } finally {
    // Cerrar conexión Redis si se abrió
    if (redisClient) {
      try {
        await redisClient.quit()
      } catch (closeError) {
        console.error('Error cerrando conexión Redis:', closeError)
      }
    }
  }
}
