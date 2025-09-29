// ========================================
// API DE MÓDULOS DISPONIBLES
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { tenantModuleService } from '@/lib/modules/tenant-module-service'
import { ModuleRegistry } from '@/lib/modules/module-registry'

/**
 * GET /api/modules/available
 * Obtener módulos disponibles para activar (no activados aún)
 */
export async function GET(request: NextRequest) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return error

    const tenantId = getTenantId(user!)
    const availableModules =
      await tenantModuleService.getAvailableModules(tenantId)

    return NextResponse.json({
      success: true,
      data: availableModules,
      count: availableModules.length,
    })
  } catch (error) {
    console.error('Error en GET /api/modules/available:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
