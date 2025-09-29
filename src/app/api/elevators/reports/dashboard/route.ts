import { NextRequest, NextResponse } from 'next/server'
import { ElevatorService } from '@/lib/services/elevator'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'
import { ElevatorInspectionService } from '@/lib/services/elevator-inspection'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'

// GET /api/elevators/reports/dashboard - Obtener datos para dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Obtener datos específicos para el dashboard
    const [
      elevatorStats,
      maintenanceStats,
      inspectionStats,
      technicianStats,
      recentActivity,
    ] = await Promise.all([
      ElevatorService.getElevatorStats(tenantId),
      ElevatorMaintenanceService.getMaintenanceStats(tenantId),
      ElevatorInspectionService.getInspectionStats(tenantId),
      ElevatorTechnicianService.getTechnicianStats(tenantId),
      ElevatorService.getRecentActivity(tenantId),
    ])

    const dashboard = {
      stats: {
        totalElevators: elevatorStats.total,
        operationalElevators: elevatorStats.operational,
        underMaintenance: elevatorStats.underMaintenance,
        outOfService: elevatorStats.outOfService,
        upcomingInspections: inspectionStats.upcoming,
        expiredCertifications: inspectionStats.expired,
        activeTechnicians: technicianStats.active,
        totalMaintenanceRecords: maintenanceStats.totalRecords,
        completedMaintenance: maintenanceStats.completed,
        scheduledMaintenance: maintenanceStats.scheduled,
      },
      recentActivity,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: dashboard,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener datos del dashboard',
      },
      { status: 500 }
    )
  }
}
