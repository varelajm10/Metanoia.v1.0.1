import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [SIMPLE] Iniciando login simple...')

    const body = await request.json()
    console.log('📧 [SIMPLE] Datos recibidos:', { email: body.email })

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Simulación simple de autenticación
    if (email === 'admin@metanoia.click' && password === 'metanoia123') {
      console.log('✅ [SIMPLE] Credenciales correctas')

      const mockResponse = {
        user: {
          id: 'test-id',
          email: email,
          firstName: 'Administrador',
          lastName: 'Metanoia',
          role: 'ADMIN',
          tenantId: 'test-tenant',
        },
        token: 'mock-token',
        refreshToken: 'mock-refresh-token',
      }

      return NextResponse.json(mockResponse)
    } else {
      console.log('❌ [SIMPLE] Credenciales incorrectas')
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('❌ [SIMPLE] Error en login:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
