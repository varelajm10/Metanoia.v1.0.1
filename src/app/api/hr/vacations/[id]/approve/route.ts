import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { VacationService } from '@/lib/services/vacation'
import { requireAuth } from '@/lib/middleware/auth'

const prisma = new PrismaClient()
const vacationService = new VacationService(prisma)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const tenantId = user.tenantId

    // Verificar permisos de aprobación de vacaciones
    if (!['MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para aprobar vacaciones' },
        { status: 403 }
      )
    }

    const result = await vacationService.approveVacation(
      params.id,
      user.id,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Vacaciones aprobadas exitosamente',
    })
  } catch (error) {
    console.error('Error approving vacation:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
