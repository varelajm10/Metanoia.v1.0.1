import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [NO-PRISMA] Iniciando login sin Prisma...')

    const body = await request.json()
    console.log('📧 [NO-PRISMA] Datos recibidos:', { email: body.email })

    const { email, password } = body

    if (!email || !password) {
      console.log('❌ [NO-PRISMA] Email o contraseña faltantes')
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Simulación simple de autenticación
    if (email === 'admin@metanoia.click' && password === 'metanoia123') {
      console.log('✅ [NO-PRISMA] Credenciales correctas')

      const mockResponse = {
        user: {
          id: 'test-id',
          email: email,
          firstName: 'Administrador',
          lastName: 'Metanoia',
          role: 'ADMIN',
          tenantId: 'test-tenant',
        },
        token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      }

      console.log('🎉 [NO-PRISMA] Login exitoso')

      // Crear respuesta con cookies
      const response = NextResponse.json(mockResponse)

      // Configurar cookies HTTP-only
      response.cookies.set('access_token', 'mock-access-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutos
        path: '/',
      })

      response.cookies.set('refresh_token', 'mock-refresh-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 días
        path: '/',
      })

      return response
    } else {
      console.log('❌ [NO-PRISMA] Credenciales incorrectas')
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('❌ [NO-PRISMA] Error en login:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
