import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Get vacation statistics
    const totalRequests = await prisma.vacation.count({
      where: {
        tenantId,
      },
    })

    const pendingRequests = await prisma.vacation.count({
      where: {
        tenantId,
        status: 'PENDING',
      },
    })

    const approvedRequests = await prisma.vacation.count({
      where: {
        tenantId,
        status: 'APPROVED',
      },
    })

    const rejectedRequests = await prisma.vacation.count({
      where: {
        tenantId,
        status: 'REJECTED',
      },
    })

    // Get total days from approved vacations
    const approvedVacations = await prisma.vacation.findMany({
      where: {
        tenantId,
        status: 'APPROVED',
      },
      select: {
        days: true,
      },
    })

    const totalDays = approvedVacations.reduce(
      (sum, vacation) => sum + vacation.days,
      0
    )

    const stats = {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalDays,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching vacation stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas de vacaciones',
      },
      { status: 500 }
    )
  }
}
