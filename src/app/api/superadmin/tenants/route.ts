import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Aquí deberías añadir tu lógica para verificar que el que hace la petición es un SUPER_ADMIN

const tenantFormSchema = z.object({
  companyName: z.string().min(2),
  adminFirstName: z.string().min(2),
  adminLastName: z.string().min(2),
  adminEmail: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = tenantFormSchema.parse(json)

    const existingTenant = await prisma.tenant.findFirst({ where: { name: body.companyName } })
    if (existingTenant) {
      return new NextResponse(JSON.stringify({ message: 'Ya existe una empresa con ese nombre.' }), { status: 409 })
    }
    const existingUser = await prisma.user.findFirst({ where: { email: body.adminEmail } })
    if (existingUser) {
      return new NextResponse(JSON.stringify({ message: 'Ya existe un usuario con ese email.' }), { status: 409 })
    }

    const tempPassword = Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const newTenant = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: body.companyName,
          slug: body.companyName.toLowerCase().replace(/\s+/g, '-'),
          email: body.adminEmail,
          contactName: `${body.adminFirstName} ${body.adminLastName}`,
          contactEmail: body.adminEmail,
          timezone: 'UTC',
          currency: 'USD',
          subscriptionStartDate: new Date(),
          subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          maxUsers: 5,
          maxServers: 10,
          maxStorageGB: 100,
        },
      })

      await tx.user.create({
        data: {
          firstName: body.adminFirstName,
          lastName: body.adminLastName,
          email: body.adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          tenantId: tenant.id,
        },
      })

      return tenant
    })

    console.log(`
      =================================================
      NUEVO CLIENTE CREADO:
      Empresa: ${body.companyName}
      Usuario: ${body.adminEmail}
      Contraseña Temporal: ${tempPassword}
      =================================================
    `)

    // En modo test, incluir la contraseña temporal en la respuesta
    const responseData = {
      ...newTenant,
      ...(process.env.NODE_ENV === 'test' && { tempPassword: tempPassword })
    }

    return new NextResponse(JSON.stringify(responseData), { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    console.error(error);
    return new NextResponse(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 })
  }
}