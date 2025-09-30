import { NextRequest, NextResponse } from 'next/server'

// Rate limiting simple en memoria (para producción usar Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutos
) {
  return (request: NextRequest) => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    // Limpiar entradas expiradas
    for (const [key, value] of requestCounts.entries()) {
      if (value.resetTime < windowStart) {
        requestCounts.delete(key)
      }
    }

    const current = requestCounts.get(ip)
    
    if (!current) {
      requestCounts.set(ip, { count: 1, resetTime: now })
      return null
    }

    if (current.resetTime < windowStart) {
      requestCounts.set(ip, { count: 1, resetTime: now })
      return null
    }

    if (current.count >= maxRequests) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Máximo ${maxRequests} requests por ${windowMs / 1000 / 60} minutos`,
        },
        { status: 429 }
      )
    }

    current.count++
    return null
  }
}

