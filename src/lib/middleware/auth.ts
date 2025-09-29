import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { UserRole } from '@prisma/client'

// Definición de permisos por entidad y acción
export const PERMISSIONS = {
  customers: {
    read: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'],
    write: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
  },
  products: {
    read: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'],
    write: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
  },
  orders: {
    read: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'],
    write: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
  },
  invoices: {
    read: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'],
    write: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
  },
  modules: {
    read: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'],
    write: ['SUPER_ADMIN', 'ADMIN'],
    delete: ['SUPER_ADMIN', 'ADMIN'],
  },
} as const

export type Entity = keyof typeof PERMISSIONS
export type Action = 'read' | 'write' | 'delete'

// Función para verificar si un rol tiene permisos para una acción
function hasPermission(
  role: UserRole,
  entity: Entity,
  action: Action
): boolean {
  const allowedRoles = PERMISSIONS[entity][action]
  return allowedRoles.includes(role as any)
}

// Middleware de autenticación
export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'No autorizado - Token requerido' },
        { status: 401 }
      ),
      user: null,
    }
  }

  const user = await getUserFromToken(token)
  if (!user || !user.isActive) {
    return {
      error: NextResponse.json(
        { error: 'Token inválido o usuario inactivo' },
        { status: 401 }
      ),
      user: null,
    }
  }

  return { error: null, user }
}

// Middleware de autorización
export async function requirePermission(
  request: NextRequest,
  entity: Entity,
  action: Action
) {
  // Primero verificar autenticación
  const { error, user } = await requireAuth(request)
  if (error) {
    return { error, user: null }
  }

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      ),
      user: null,
    }
  }

  // Verificar permisos
  if (!hasPermission(user.role, entity, action)) {
    return {
      error: NextResponse.json(
        {
          error: 'Permisos insuficientes',
          message: `No tienes permisos para ${action} en ${entity}`,
          requiredRole: PERMISSIONS[entity][action].join(' o '),
          currentRole: user.role,
        },
        { status: 403 }
      ),
      user,
    }
  }

  return { error: null, user }
}

// Helper para extraer tenant ID del usuario autenticado
export function getTenantId(user: any): string {
  return user.tenantId
}

// Helper para verificar si el usuario es super admin
export function isSuperAdmin(user: any): boolean {
  return user.role === 'SUPER_ADMIN'
}

// Helper para verificar si el usuario es admin o superior
export function isAdmin(user: any): boolean {
  return ['SUPER_ADMIN', 'ADMIN'].includes(user.role)
}
