import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Schema de validación para actualizar módulos
const UpdateModulesSchema = z.object({
  enabledModules: z.array(z.string()).min(0, 'Debe proporcionar al menos un módulo')
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { tenantId } = params

    // Validar que el tenantId existe
    if (!tenantId) {
      return NextResponse.json(
        { message: 'ID de tenant requerido' },
        { status: 400 }
      )
    }

    // Parsear y validar el cuerpo de la petición
    const body = await request.json()
    const validatedData = UpdateModulesSchema.parse(body)

    // Verificar que el tenant existe
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true }
    })

    if (!existingTenant) {
      return NextResponse.json(
        { message: 'Tenant no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar los módulos habilitados del tenant
    // Nota: En el schema actual, los módulos se manejan a través de la tabla TenantModule
    // pero para simplificar, vamos a usar el campo settings JSON del tenant
    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: {
          enabledModules: validatedData.enabledModules
        }
      },
      select: {
        id: true,
        name: true,
        settings: true
      }
    })

    // Log de la operación para auditoría
    console.log(`Módulos actualizados para tenant ${existingTenant.name} (${tenantId}):`, {
      enabledModules: validatedData.enabledModules,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      message: 'Módulos actualizados correctamente',
      tenant: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        enabledModules: validatedData.enabledModules
      }
    })

  } catch (error) {
    console.error('Error updating tenant modules:', error)

    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Datos de entrada inválidos',
          errors: error.errors 
        },
        { status: 400 }
      )
    }

    // Manejar otros errores
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// Endpoint GET para obtener los módulos actuales del tenant
export async function GET(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  try {
    const { tenantId } = params

    if (!tenantId) {
      return NextResponse.json(
        { message: 'ID de tenant requerido' },
        { status: 400 }
      )
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        settings: true
      }
    })

    if (!tenant) {
      return NextResponse.json(
        { message: 'Tenant no encontrado' },
        { status: 404 }
      )
    }

    // Extraer módulos habilitados del campo settings
    const settings = tenant.settings as any || {}
    const enabledModules = settings.enabledModules || []

    return NextResponse.json({
      tenant: {
        id: tenant.id,
        name: tenant.name,
        enabledModules
      }
    })

  } catch (error) {
    console.error('Error fetching tenant modules:', error)
    
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
