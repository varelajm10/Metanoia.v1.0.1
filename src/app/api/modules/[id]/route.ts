// ========================================
// API DE MÓDULO ESPECÍFICO
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { tenantModuleService } from '@/lib/modules/tenant-module-service'
import { ModuleRegistry } from '@/lib/modules/module-registry'
import { z } from 'zod'

// Esquemas de validación
const UpdateModuleSchema = z.object({
  config: z.record(z.any()).optional(),
  customFields: z.record(z.any()).optional(),
  features: z.record(z.boolean()).optional(),
  isEnabled: z.boolean().optional(),
})

/**
 * GET /api/modules/[id]
 * Obtener información específica de un módulo
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)
    const moduleId = params.id

    // Obtener información del módulo
    const moduleInfo = ModuleRegistry.getModuleById(moduleId)
    if (!moduleInfo) {
      return NextResponse.json(
        { error: 'Módulo no encontrado' },
        { status: 404 }
      )
    }

    // Obtener configuración del tenant para este módulo
    let tenantConfig = null
    try {
      tenantConfig = await tenantModuleService.getTenantModule(
        tenantId,
        moduleId
      )
    } catch (error) {
      // Módulo no activado para este tenant
      tenantConfig = null
    }

    const moduleWithInfo = {
      ...moduleInfo,
      tenantConfig,
      isActive: tenantConfig?.isActive || false,
      isEnabled: tenantConfig?.isEnabled || false,
      userPermissions: tenantConfig
        ? Object.keys(tenantConfig.permissions).filter(action =>
            tenantConfig.permissions[action].includes(user!.role)
          )
        : [],
    }

    return NextResponse.json({
      success: true,
      data: moduleWithInfo,
    })
  } catch (error) {
    console.error('Error en GET /api/modules/[id]:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/modules/[id]
 * Actualizar configuración de un módulo
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'write')
    if (error) return error

    const tenantId = getTenantId(user!)
    const moduleId = params.id
    const body = await request.json()

    // Validar datos de entrada
    const validation = UpdateModuleSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    // Verificar que el módulo esté activado
    const isModuleActive = await tenantModuleService.isModuleActive(
      tenantId,
      moduleId
    )
    if (!isModuleActive) {
      return NextResponse.json(
        {
          error: 'Módulo no activado',
          message: `El módulo ${moduleId} no está activado para este tenant`,
        },
        { status: 404 }
      )
    }

    // Actualizar el módulo
    const updatedModule = await tenantModuleService.updateModule(
      tenantId,
      moduleId,
      validation.data
    )

    // Obtener información completa del módulo
    const moduleInfo = ModuleRegistry.getModuleById(moduleId)
    const moduleWithInfo = {
      ...moduleInfo,
      tenantConfig: updatedModule,
    }

    return NextResponse.json({
      success: true,
      data: moduleWithInfo,
      message: `Módulo ${moduleInfo?.displayName} actualizado exitosamente`,
    })
  } catch (error) {
    console.error('Error en PUT /api/modules/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrado')) {
        return NextResponse.json(
          {
            error: 'Módulo no encontrado',
            message: error.message,
          },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/modules/[id]
 * Desactivar un módulo
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'write')
    if (error) return error

    const tenantId = getTenantId(user!)
    const moduleId = params.id

    // Verificar que el módulo no sea core
    const moduleInfo = ModuleRegistry.getModuleById(moduleId)
    if (moduleInfo?.isCore) {
      return NextResponse.json(
        {
          error: 'No se puede desactivar',
          message: `El módulo ${moduleInfo.displayName} es un módulo core y no se puede desactivar`,
        },
        { status: 403 }
      )
    }

    // Desactivar el módulo
    await tenantModuleService.deactivateModule(tenantId, moduleId)

    return NextResponse.json({
      success: true,
      message: `Módulo ${moduleInfo?.displayName} desactivado exitosamente`,
    })
  } catch (error) {
    console.error('Error en DELETE /api/modules/[id]:', error)

    if (error instanceof Error) {
      if (error.message.includes('No se puede desactivar')) {
        return NextResponse.json(
          {
            error: 'No se puede desactivar',
            message: error.message,
          },
          { status: 403 }
        )
      }

      if (error.message.includes('no encontrado')) {
        return NextResponse.json(
          {
            error: 'Módulo no encontrado',
            message: error.message,
          },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
