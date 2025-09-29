// ========================================
// API DE GESTIÓN DE MÓDULOS
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { tenantModuleService } from '@/lib/modules/tenant-module-service'
import { ModuleRegistry } from '@/lib/modules/module-registry'
import { z } from 'zod'

// Esquemas de validación
const ActivateModuleSchema = z.object({
  moduleId: z.string().min(1, 'ID del módulo es requerido'),
  config: z.record(z.any()).optional(),
  customFields: z.record(z.any()).optional(),
  features: z.record(z.boolean()).optional(),
})

const UpdateModuleSchema = z.object({
  config: z.record(z.any()).optional(),
  customFields: z.record(z.any()).optional(),
  features: z.record(z.boolean()).optional(),
  isEnabled: z.boolean().optional(),
})

/**
 * GET /api/modules
 * Obtener módulos activados para el tenant actual
 */
export async function GET(request: NextRequest) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)
    const tenantModules = await tenantModuleService.getTenantModules(tenantId)

    // Combinar con información de módulos disponibles
    const modulesWithInfo = tenantModules.map(tm => {
      const moduleInfo = ModuleRegistry.getModuleById(tm.moduleId)
      return {
        ...moduleInfo,
        tenantConfig: tm,
        isActive: tm.isActive,
        isEnabled: tm.isEnabled,
      }
    })

    return NextResponse.json({
      success: true,
      data: modulesWithInfo,
      count: modulesWithInfo.length,
    })
  } catch (error) {
    console.error('Error en GET /api/modules:', error)
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
 * POST /api/modules
 * Activar un módulo para el tenant actual
 */
export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'write')
    if (error) return error

    const tenantId = getTenantId(user!)
    const body = await request.json()

    // Validar datos de entrada
    const validation = ActivateModuleSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { moduleId, config, customFields, features } = validation.data

    // Activar el módulo
    const tenantModule = await tenantModuleService.activateModule(tenantId, {
      moduleId,
      config,
      customFields,
      features,
    })

    // Obtener información completa del módulo
    const moduleInfo = ModuleRegistry.getModuleById(moduleId)
    const moduleWithInfo = {
      ...moduleInfo,
      tenantConfig: tenantModule,
    }

    return NextResponse.json(
      {
        success: true,
        data: moduleWithInfo,
        message: `Módulo ${moduleInfo?.displayName} activado exitosamente`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/modules:', error)

    if (error instanceof Error) {
      if (error.message.includes('ya está activado')) {
        return NextResponse.json(
          {
            error: 'Error de validación',
            message: error.message,
          },
          { status: 409 }
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
