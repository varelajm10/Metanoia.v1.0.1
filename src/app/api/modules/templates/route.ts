// ========================================
// API DE TEMPLATES DE NEGOCIO
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'
import { tenantModuleService } from '@/lib/modules/tenant-module-service'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Esquemas de validación
const ApplyTemplateSchema = z.object({
  templateId: z.string().min(1, 'ID del template es requerido'),
})

/**
 * GET /api/modules/templates
 * Obtener templates de negocio disponibles
 */
export async function GET(request: NextRequest) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'read')
    if (error) return error

    const templates = await prisma.businessTemplate.findMany({
      where: { isActive: true },
      include: {
        templateModules: {
          include: {
            module: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
    })
  } catch (error) {
    console.error('Error en GET /api/modules/templates:', error)
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
 * POST /api/modules/templates
 * Aplicar un template de negocio al tenant actual
 */
export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requirePermission(request, 'modules', 'write')
    if (error) return error

    const tenantId = getTenantId(user!)
    const body = await request.json()

    // Validar datos de entrada
    const validation = ApplyTemplateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { templateId } = validation.data

    // Aplicar el template
    await tenantModuleService.applyBusinessTemplate(tenantId, templateId)

    // Obtener información del template aplicado
    const template = await prisma.businessTemplate.findUnique({
      where: { id: templateId },
      include: {
        templateModules: {
          include: {
            module: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: template,
        message: `Template ${template?.name} aplicado exitosamente`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en POST /api/modules/templates:', error)

    if (error instanceof Error) {
      if (error.message.includes('no encontrado')) {
        return NextResponse.json(
          {
            error: 'Template no encontrado',
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
