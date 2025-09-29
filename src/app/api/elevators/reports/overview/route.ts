import { NextRequest, NextResponse } from 'next/server'
import { ElevatorService } from '@/lib/services/elevator'
import { ElevatorClientService } from '@/lib/services/elevator-client'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'
import { ElevatorInspectionService } from '@/lib/services/elevator-inspection'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'

// GET /api/elevators/reports/overview - Obtener reporte general del módulo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Obtener estadísticas de todas las entidades
    const [
      elevatorStats,
      clientStats,
      maintenanceStats,
      inspectionStats,
      technicianStats,
      sparePartStats,
      workOrderStats,
    ] = await Promise.all([
      ElevatorService.getElevatorStats(tenantId),
      ElevatorClientService.getClientStats(tenantId),
      ElevatorMaintenanceService.getMaintenanceStats(tenantId),
      ElevatorInspectionService.getInspectionStats(tenantId),
      ElevatorTechnicianService.getTechnicianStats(tenantId),
      ElevatorTechnicianService.getSparePartStats(tenantId),
      ElevatorTechnicianService.getWorkOrderStats(tenantId),
    ])

    const overview = {
      elevators: elevatorStats,
      clients: clientStats,
      maintenance: maintenanceStats,
      inspections: inspectionStats,
      technicians: technicianStats,
      spareParts: sparePartStats,
      workOrders: workOrderStats,
      generatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: overview,
    })
  } catch (error) {
    console.error('Error fetching overview report:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener reporte general',
      },
      { status: 500 }
    )
  }
}
