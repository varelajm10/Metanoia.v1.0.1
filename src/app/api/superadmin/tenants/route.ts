import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// TODO: Importa tu lógica de sesión aquí para verificar al super-admin
// import { getServerSession } from "next-auth" o tu sistema de auth
// import { authOptions } from "@/lib/auth"

const tenantFormSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  adminFirstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  adminLastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  adminEmail: z.string().email("El email no es válido"),
})

/**
 * POST /api/superadmin/tenants
 * Crea un nuevo tenant (empresa) y su usuario administrador
 */
export async function POST(req: Request) {
  try {
    // TODO: Proteger esta ruta verificando que el usuario es SUPER_ADMIN
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'SUPER_ADMIN') {
    //   return NextResponse.json(
    //     { message: 'No autorizado. Solo los super-administradores pueden crear tenants.' },
    //     { status: 403 }
    //   )
    // }

    const json = await req.json()
    const body = tenantFormSchema.parse(json)

    // Verificar si ya existe un tenant con ese nombre
    const existingTenant = await prisma.tenant.findFirst({ 
      where: { 
        name: {
          equals: body.companyName,
          mode: 'insensitive'
        }
      } 
    })
    
    if (existingTenant) {
      return NextResponse.json(
        { message: 'Ya existe una empresa con ese nombre.' },
        { status: 409 }
      )
    }

    // Verificar si ya existe un usuario con ese email
    const existingUser = await prisma.user.findFirst({ 
      where: { 
        email: {
          equals: body.adminEmail,
          mode: 'insensitive'
        }
      } 
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Ya existe un usuario con ese email.' },
        { status: 409 }
      )
    }

    // Generar slug a partir del nombre de la empresa
    const slug = body.companyName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .trim()

    // Verificar que el slug no exista
    const existingSlug = await prisma.tenant.findUnique({
      where: { slug }
    })

    if (existingSlug) {
      // Agregar un sufijo único si el slug ya existe
      const timestamp = Date.now()
      const uniqueSlug = `${slug}-${timestamp}`
      
      // Usar el slug único
      return await createTenantWithUser(body, uniqueSlug)
    }

    // Generar una contraseña temporal segura
    const tempPassword = generateSecurePassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Usar una transacción para asegurar la integridad de los datos
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear el tenant
      const tenant = await tx.tenant.create({
        data: {
          name: body.companyName,
          slug: slug,
          email: body.adminEmail,
          isActive: true,
        },
      })

      // 2. Crear el usuario administrador del tenant
      const user = await tx.user.create({
        data: {
          firstName: body.adminFirstName,
          lastName: body.adminLastName,
          email: body.adminEmail,
          password: hashedPassword,
          role: 'ADMIN', // Asignar el rol de ADMIN del tenant, no SUPER_ADMIN
          tenantId: tenant.id,
          isActive: true,
        },
      })

      return { tenant, user, tempPassword }
    })

    // ¡IMPORTANTE! En una app real, aquí enviarías un email de bienvenida
    // al administrador con su contraseña temporal y el enlace para acceder.
    console.log(`
    =========================================
    NUEVO TENANT CREADO:
    =========================================
    Empresa: ${result.tenant.name}
    Slug: ${result.tenant.slug}
    Email Admin: ${result.user.email}
    Contraseña Temporal: ${result.tempPassword}
    =========================================
    ⚠️ IMPORTANTE: En producción, enviar este dato por email
    =========================================
    `)

    // TODO: Aquí deberías enviar un email al administrador
    // await sendWelcomeEmail({
    //   to: body.adminEmail,
    //   companyName: body.companyName,
    //   tempPassword: result.tempPassword,
    //   loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`
    // })

    return NextResponse.json(
      {
        success: true,
        message: 'Tenant y usuario administrador creados correctamente',
        data: {
          tenantId: result.tenant.id,
          tenantName: result.tenant.name,
          tenantSlug: result.tenant.slug,
          adminEmail: result.user.email,
          // NO devolver la contraseña en la respuesta en producción
          // Solo para desarrollo/pruebas:
          tempPassword: result.tempPassword,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating tenant:', error)

    // Errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Datos de entrada inválidos',
          errors: error.issues 
        },
        { status: 422 }
      )
    }

    // Error de Prisma (ej: constraint violation)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'Ya existe un registro con esos datos.' },
        { status: 409 }
      )
    }

    // Error genérico
    return NextResponse.json(
      { message: 'Error interno del servidor al crear el tenant.' },
      { status: 500 }
    )
  }
}

/**
 * Función auxiliar para crear tenant con slug personalizado
 */
async function createTenantWithUser(body: z.infer<typeof tenantFormSchema>, slug: string) {
  const tempPassword = generateSecurePassword()
  const hashedPassword = await bcrypt.hash(tempPassword, 10)

  const result = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: body.companyName,
        slug: slug,
        email: body.adminEmail,
        isActive: true,
      },
    })

    const user = await tx.user.create({
      data: {
        firstName: body.adminFirstName,
        lastName: body.adminLastName,
        email: body.adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        tenantId: tenant.id,
        isActive: true,
      },
    })

    return { tenant, user, tempPassword }
  })

  console.log(`
  =========================================
  NUEVO TENANT CREADO:
  =========================================
  Empresa: ${result.tenant.name}
  Slug: ${result.tenant.slug}
  Email Admin: ${result.user.email}
  Contraseña Temporal: ${result.tempPassword}
  =========================================
  `)

  return NextResponse.json(
    {
      success: true,
      message: 'Tenant y usuario administrador creados correctamente',
      data: {
        tenantId: result.tenant.id,
        tenantName: result.tenant.name,
        tenantSlug: result.tenant.slug,
        adminEmail: result.user.email,
        tempPassword: result.tempPassword,
      },
    },
    { status: 201 }
  )
}

/**
 * Genera una contraseña segura aleatoria
 */
function generateSecurePassword(): string {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Asegurar al menos un carácter de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  // Completar el resto
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Mezclar los caracteres
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * GET /api/superadmin/tenants
 * Obtiene la lista de todos los tenants
 */
export async function GET(req: Request) {
  try {
    // TODO: Proteger esta ruta
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'SUPER_ADMIN') {
    //   return NextResponse.json(
    //     { message: 'No autorizado' },
    //     { status: 403 }
    //   )
    // }

    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            customers: true,
            products: true,
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ success: true, data: tenants })

  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json(
      { message: 'Error al obtener los tenants' },
      { status: 500 }
    )
  }
}
