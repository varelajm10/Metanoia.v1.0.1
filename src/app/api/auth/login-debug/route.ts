import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = (process.env.JWT_SECRET || 'dev-secret-key') as string

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Iniciando login debug...')
    
    const body = await request.json()
    console.log('📧 [DEBUG] Email recibido:', body.email)
    console.log('🔐 [DEBUG] Password recibido:', '***')

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }


    // Buscar usuario
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        tenant: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }


    if (!user.isActive) {
      return NextResponse.json({ error: 'Usuario inactivo' }, { status: 401 })
    }


    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }


    // Generar tokens

    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      {
        userId: user.id,
        tokenVersion: 1,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )


    // Crear sesión

    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        },
      })
    } catch (sessionError) {
      // Continuar sin la sesión por ahora
    }

    // Preparar respuesta
    const authResponse = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant,
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
    console.error('❌ [DEBUG] Error en login:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
