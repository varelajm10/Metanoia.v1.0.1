import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Función para verificar si un usuario es super admin
async function isSuperAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    return user?.role === 'SUPER_ADMIN'
  } catch (error) {
    console.error('Error checking super admin status:', error)
    return false
  }
}

// Middleware para proteger rutas de super admin
export async function superAdminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Solo aplicar a rutas de super admin
  if (!pathname.startsWith('/super-admin')) {
    return NextResponse.next()
  }

  // Obtener el token de la cookie o header
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.redirect(
      new URL('/login?redirect=/super-admin', request.url)
    )
  }

  try {
    // Verificar el token y obtener el usuario
    // Aquí deberías implementar la lógica de verificación del token
    // Por ahora, asumimos que tienes una función para verificar el token
    const userId = await verifyToken(token)

    if (!userId) {
      return NextResponse.redirect(
        new URL('/login?redirect=/super-admin', request.url)
      )
    }

    // Verificar si es super admin
    const isAdmin = await isSuperAdmin(userId)

    if (!isAdmin) {
      return NextResponse.redirect(
        new URL('/dashboard?error=unauthorized', request.url)
      )
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error in super admin middleware:', error)
    return NextResponse.redirect(
      new URL('/login?redirect=/super-admin', request.url)
    )
  }
}

// Función placeholder para verificar el token
// Debes implementar esta función según tu sistema de autenticación
async function verifyToken(token: string): Promise<string | null> {
  try {
    // Implementar verificación del token JWT
    // Por ahora, retornamos null para forzar la autenticación
    return null
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}
