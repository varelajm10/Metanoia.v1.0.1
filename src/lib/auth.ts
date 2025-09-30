import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { PrismaClient, User } from '@prisma/client'
import { JWTPayload, RefreshTokenPayload } from '@/types/auth'

const prisma = new PrismaClient()

const JWT_SECRET = (process.env.JWT_SECRET || 'dev-secret-key') as string

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(password, hashedPassword)
}

export function generateAccessToken(
  payload: Omit<JWTPayload, 'iat' | 'exp'>
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

export function generateRefreshToken(
  payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = generateRefreshToken({
    userId,
    tokenVersion: 1,
  })

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    },
  })

  return token
}

export async function revokeSession(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  })
}

export async function getUserFromToken(token: string): Promise<User | null> {
  const payload = verifyAccessToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      tenant: true,
    },
  })

  return user
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: { email },
    include: {
      tenant: true,
    },
  })

  if (!user || !user.isActive) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }

  return user
}
