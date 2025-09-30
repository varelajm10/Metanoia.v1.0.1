'use server'

import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Esquema de validación para el registro
const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().min(2).max(100),
  companySlug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
})

type RegisterData = z.infer<typeof registerSchema>

interface RegisterResult {
  success: boolean
  error?: string
  userId?: string
  tenantId?: string
}

export async function registerUser(
  data: RegisterData
): Promise<RegisterResult> {
  try {
    // Validar los datos de entrada
    const validatedData = registerSchema.parse(data)

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Ya existe un usuario con este email',
      }
    }

    // Verificar si el slug de la empresa ya existe
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        slug: validatedData.companySlug,
      },
    })

    if (existingTenant) {
      return {
        success: false,
        error:
          'Ya existe una empresa con este slug. Por favor, elige otro nombre.',
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Crear usuario y tenant en una transacción
    const result = await prisma.$transaction(async tx => {
      // Crear el tenant primero
      const tenant = await tx.tenant.create({
        data: {
          name: validatedData.companyName,
          slug: validatedData.companySlug,
          email: validatedData.email,
          contactName: `${validatedData.firstName} ${validatedData.lastName}`,
          contactEmail: validatedData.email,
          subscriptionPlan: 'BASIC',
          subscriptionStartDate: new Date(),
          maxUsers: 5,
          maxServers: 10,
          maxStorageGB: 100,
          settings: {
            theme: 'light',
            language: 'es',
            timezone: 'America/Mexico_City',
            currency: 'MXN',
          },
        },
      })

      // Crear el usuario como administrador del tenant
      const user = await tx.user.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          password: hashedPassword,
          role: 'ADMIN', // El primer usuario es siempre admin
          tenantId: tenant.id,
        },
      })

      return { user, tenant }
    })

    return {
      success: true,
      userId: result.user.id,
      tenantId: result.tenant.id,
    }
  } catch (error) {
    console.error('Error en registerUser:', error)

    // Manejar errores específicos de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        if (error.message.includes('email')) {
          return {
            success: false,
            error: 'Ya existe un usuario con este email',
          }
        }
        if (error.message.includes('slug')) {
          return {
            success: false,
            error:
              'Ya existe una empresa con este slug. Por favor, elige otro nombre.',
          }
        }
      }
    }

    return {
      success: false,
      error: 'Error interno del servidor. Por favor, inténtalo de nuevo.',
    }
  }
}

// Función para verificar si un slug está disponible
export async function checkSlugAvailability(slug: string): Promise<boolean> {
  try {
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        slug: slug,
      },
    })

    return !existingTenant
  } catch (error) {
    console.error('Error verificando disponibilidad del slug:', error)
    return false
  }
}

// Función para verificar si un email está disponible
export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    return !existingUser
  } catch (error) {
    console.error('Error verificando disponibilidad del email:', error)
    return false
  }
}
