import { UserRole } from '@prisma/client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  tenantId?: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  tenantId: string
  tenant?: {
    id: string
    name: string
    slug: string
    domain?: string
  }
  enabledModules?: string[]
}

export interface AuthResponse {
  user: AuthUser
  token: string
  refreshToken: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  tenantId: string
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: string
  tokenVersion: number
  iat?: number
  exp?: number
}
