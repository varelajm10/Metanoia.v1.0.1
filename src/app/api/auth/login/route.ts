import { NextRequest, NextResponse } from 'next/server'
import {
  authenticateUser,
  createSession,
  generateAccessToken,
} from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export async function POST(request: NextRequest) {
  try {
    // Verificar que el request tiene body
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 400 }
      )
    }

    // Obtener el body de forma segura
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError)
      return NextResponse.json(
        { error: 'JSON inválido en el body de la request' },
        { status: 400 }
      )
    }

    // Verificar que el body no esté vacío
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Body de la request vacío' },
        { status: 400 }
      )
    }

    // Validar datos de entrada
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    // Autenticar usuario
    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Generar tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    })

    const refreshToken = await createSession(user.id)

    // Preparar respuesta
    const authResponse = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: (user as any).tenant,
      },
      token: accessToken,
      refreshToken,
    }

    // Crear respuesta con cookies
    const response = NextResponse.json(authResponse)

    // Configurar cookies HTTP-only
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutos
      path: '/',
    })

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
