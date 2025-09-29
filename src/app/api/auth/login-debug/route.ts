import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = (process.env.JWT_SECRET || 'dev-secret-key') as string

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Iniciando login...')

    const body = await request.json()
    console.log('📧 [DEBUG] Datos recibidos:', {
      email: body.email,
      password: '***',
    })

    const { email, password } = body

    if (!email || !password) {
      console.log('❌ [DEBUG] Email o contraseña faltantes')
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    console.log('🔍 [DEBUG] Buscando usuario...')

    // Buscar usuario
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        tenant: true,
      },
    })

    if (!user) {
      console.log('❌ [DEBUG] Usuario no encontrado')
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    console.log('✅ [DEBUG] Usuario encontrado:', user.email)

    if (!user.isActive) {
      console.log('❌ [DEBUG] Usuario inactivo')
      return NextResponse.json({ error: 'Usuario inactivo' }, { status: 401 })
    }

    console.log('🔐 [DEBUG] Verificando contraseña...')

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.log('❌ [DEBUG] Contraseña incorrecta')
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    console.log('✅ [DEBUG] Contraseña correcta')

    // Generar tokens
    console.log('🎫 [DEBUG] Generando tokens...')

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

    console.log('✅ [DEBUG] Tokens generados')

    // Crear sesión
    console.log('💾 [DEBUG] Creando sesión...')

    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        },
      })
      console.log('✅ [DEBUG] Sesión creada')
    } catch (sessionError) {
      console.log('❌ [DEBUG] Error creando sesión:', sessionError)
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

    console.log('🎉 [DEBUG] Login exitoso para:', user.email)

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

    console.log('✅ [DEBUG] Respuesta preparada')
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
