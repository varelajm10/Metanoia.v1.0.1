import { NextRequest, NextResponse } from 'next/server'
import { ElevatorService } from '@/lib/services/elevator'
import { ElevatorClientService } from '@/lib/services/elevator-client'
import { ElevatorMaintenanceService } from '@/lib/services/elevator-maintenance'
import { ElevatorInspectionService } from '@/lib/services/elevator-inspection'
import { ElevatorTechnicianService } from '@/lib/services/elevator-technician'

// GET /api/elevators/search - Búsqueda global en el módulo
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'
    const query = searchParams.get('q') || ''
    const entity = searchParams.get('entity') || 'all' // all, elevators, clients, maintenance, inspections, technicians
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: {
          elevators: [],
          clients: [],
          maintenance: [],
          inspections: [],
          technicians: [],
          total: 0,
        },
      })
    }

    const searchResults = {
      elevators: [],
      clients: [],
      maintenance: [],
      inspections: [],
      technicians: [],
      total: 0,
    }

    // Búsqueda en ascensores
    if (entity === 'all' || entity === 'elevators') {
      try {
        const elevatorResults = await ElevatorService.searchElevators(
          tenantId,
          query,
          { limit }
        )
        searchResults.elevators = elevatorResults.data || []
      } catch (error) {
        console.error('Error searching elevators:', error)
      }
    }

    // Búsqueda en clientes
    if (entity === 'all' || entity === 'clients') {
      try {
        const clientResults = await ElevatorClientService.searchClients(
          tenantId,
          query,
          { limit }
        )
        searchResults.clients = clientResults.data || []
      } catch (error) {
        console.error('Error searching clients:', error)
      }
    }

    // Búsqueda en mantenimiento
    if (entity === 'all' || entity === 'maintenance') {
      try {
        const maintenanceResults =
          await ElevatorMaintenanceService.searchMaintenanceRecords(
            tenantId,
            query,
            { limit }
          )
        searchResults.maintenance = maintenanceResults.data || []
      } catch (error) {
        console.error('Error searching maintenance:', error)
      }
    }

    // Búsqueda en inspecciones
    if (entity === 'all' || entity === 'inspections') {
      try {
        const inspectionResults =
          await ElevatorInspectionService.searchInspections(tenantId, query, {
            limit,
          })
        searchResults.inspections = inspectionResults.data || []
      } catch (error) {
        console.error('Error searching inspections:', error)
      }
    }

    // Búsqueda en técnicos
    if (entity === 'all' || entity === 'technicians') {
      try {
        const technicianResults =
          await ElevatorTechnicianService.searchTechnicians(tenantId, query, {
            limit,
          })
        searchResults.technicians = technicianResults.data || []
      } catch (error) {
        console.error('Error searching technicians:', error)
      }
    }

    // Calcular total de resultados
    searchResults.total =
      searchResults.elevators.length +
      searchResults.clients.length +
      searchResults.maintenance.length +
      searchResults.inspections.length +
      searchResults.technicians.length

    return NextResponse.json({
      success: true,
      data: searchResults,
    })
  } catch (error) {
    console.error('Error in global search:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error en la búsqueda global',
      },
      { status: 500 }
    )
  }
}
