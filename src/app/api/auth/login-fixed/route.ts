import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {

    // Intentar parsear el JSON con mejor manejo de errores
    let body: any
    try {
      const rawBody = await request.text()

      if (!rawBody || rawBody.trim() === '') {
        return NextResponse.json({ error: 'Body vacío' }, { status: 400 })
      }

      body = JSON.parse(rawBody)
      console.log('📧 [FIXED] Email recibido:', body.email)
    } catch (parseError) {
      return NextResponse.json(
        {
          error: 'Error parseando JSON',
          details:
            parseError instanceof Error
              ? parseError.message
              : 'Error desconocido',
        },
        { status: 400 }
      )
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Simulación simple de autenticación
    if (email === 'admin@metanoia.click' && password === 'metanoia123') {

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
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('❌ [FIXED] Error en login:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
