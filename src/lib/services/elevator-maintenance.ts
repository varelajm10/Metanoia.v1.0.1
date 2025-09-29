import { PrismaClient } from '@prisma/client'
import type {
  MaintenanceRecordInput,
  MaintenanceContractInput,
} from '../validations/elevator'

const prisma = new PrismaClient()

export class ElevatorMaintenanceService {
  // ========================================
  // REGISTROS DE MANTENIMIENTO
  // ========================================

  // Obtener registros de mantenimiento con filtros y paginación
  static async getMaintenanceRecords(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      maintenanceType?: string
      elevatorId?: string
      priority?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      maintenanceType,
      elevatorId,
      priority,
    } = options

    const skip = (page - 1) * limit

    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { recordNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { findings: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (maintenanceType) {
      where.maintenanceType = maintenanceType
    }

    if (elevatorId) {
      where.elevatorId = elevatorId
    }

    if (priority) {
      where.priority = priority
    }

    const [records, total] = await Promise.all([
      prisma.maintenanceRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          elevator: {
            select: {
              id: true,
              serialNumber: true,
              model: true,
              brand: true,
              buildingName: true,
              buildingAddress: true,
            },
          },
          contract: {
            select: {
              id: true,
              contractNumber: true,
              contractName: true,
            },
          },
        },
        orderBy: {
          scheduledDate: 'desc',
        },
      }),
      prisma.maintenanceRecord.count({ where }),
    ])

    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Obtener un registro de mantenimiento por ID
  static async getMaintenanceRecordById(id: string, tenantId: string) {
    return prisma.maintenanceRecord.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        elevator: {
          include: {
            client: true,
          },
        },
        contract: true,
      },
    })
  }

  // Crear nuevo registro de mantenimiento
  static async createMaintenanceRecord(
    data: MaintenanceRecordInput,
    tenantId: string
  ) {
    const recordData: any = {
      ...data,
      tenantId,
      scheduledDate: new Date(data.scheduledDate),
    }

    if (data.actualDate) {
      recordData.actualDate = new Date(data.actualDate)
    }
    if (data.completedDate) {
      recordData.completedDate = new Date(data.completedDate)
    }

    return prisma.maintenanceRecord.create({
      data: recordData,
      include: {
        elevator: true,
        contract: true,
      },
    })
  }

  // Actualizar registro de mantenimiento
  static async updateMaintenanceRecord(
    id: string,
    data: Partial<MaintenanceRecordInput>,
    tenantId: string
  ) {
    const recordData: any = { ...data }

    if (data.scheduledDate) {
      recordData.scheduledDate = new Date(data.scheduledDate)
    }
    if (data.actualDate) {
      recordData.actualDate = new Date(data.actualDate)
    }
    if (data.completedDate) {
      recordData.completedDate = new Date(data.completedDate)
    }

    return prisma.maintenanceRecord.update({
      where: {
        id,
        tenantId,
      },
      data: recordData,
      include: {
        elevator: true,
        contract: true,
      },
    })
  }

  // Eliminar registro de mantenimiento
  static async deleteMaintenanceRecord(id: string, tenantId: string) {
    return prisma.maintenanceRecord.delete({
      where: {
        id,
        tenantId,
      },
    })
  }

  // Obtener estadísticas de mantenimiento
  static async getMaintenanceStats(tenantId: string) {
    const [total, scheduled, inProgress, completed, overdue, emergency] =
      await Promise.all([
        prisma.maintenanceRecord.count({ where: { tenantId } }),
        prisma.maintenanceRecord.count({
          where: { tenantId, status: 'SCHEDULED' },
        }),
        prisma.maintenanceRecord.count({
          where: { tenantId, status: 'IN_PROGRESS' },
        }),
        prisma.maintenanceRecord.count({
          where: { tenantId, status: 'COMPLETED' },
        }),
        prisma.maintenanceRecord.count({
          where: {
            tenantId,
            status: 'SCHEDULED',
            scheduledDate: {
              lt: new Date(),
            },
          },
        }),
        prisma.maintenanceRecord.count({
          where: {
            tenantId,
            priority: 'EMERGENCY',
            status: {
              notIn: ['COMPLETED', 'CANCELLED'],
            },
          },
        }),
      ])

    return {
      total,
      scheduled,
      inProgress,
      completed,
      overdue,
      emergency,
    }
  }

  // ========================================
  // CONTRATOS DE MANTENIMIENTO
  // ========================================

  // Obtener contratos de mantenimiento con filtros y paginación
  static async getMaintenanceContracts(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      contractType?: string
      clientId?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      contractType,
      clientId,
    } = options

    const skip = (page - 1) * limit

    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { contractNumber: { contains: search, mode: 'insensitive' } },
        { contractName: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (contractType) {
      where.contractType = contractType
    }

    if (clientId) {
      where.clientId = clientId
    }

    const [contracts, total] = await Promise.all([
      prisma.maintenanceContract.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              company: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              maintenanceRecords: true,
            },
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      }),
      prisma.maintenanceContract.count({ where }),
    ])

    return {
      contracts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  // Obtener un contrato de mantenimiento por ID
  static async getMaintenanceContractById(id: string, tenantId: string) {
    return prisma.maintenanceContract.findFirst({
      where: {
        id,
        tenantId,
      },
      include: {
        client: {
          include: {
            elevators: true,
          },
        },
        maintenanceRecords: {
          orderBy: {
            scheduledDate: 'desc',
          },
          take: 20,
        },
      },
    })
  }

  // Crear nuevo contrato de mantenimiento
  static async createMaintenanceContract(
    data: MaintenanceContractInput,
    tenantId: string
  ) {
    const contractData: any = {
      ...data,
      tenantId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    }

    return prisma.maintenanceContract.create({
      data: contractData,
      include: {
        client: true,
      },
    })
  }

  // Actualizar contrato de mantenimiento
  static async updateMaintenanceContract(
    id: string,
    data: Partial<MaintenanceContractInput>,
    tenantId: string
  ) {
    const contractData: any = { ...data }

    if (data.startDate) {
      contractData.startDate = new Date(data.startDate)
    }
    if (data.endDate) {
      contractData.endDate = new Date(data.endDate)
    }

    return prisma.maintenanceContract.update({
      where: {
        id,
        tenantId,
      },
      data: contractData,
      include: {
        client: true,
      },
    })
  }

  // Eliminar contrato de mantenimiento
  static async deleteMaintenanceContract(id: string, tenantId: string) {
    return prisma.maintenanceContract.delete({
      where: {
        id,
        tenantId,
      },
    })
  }

  // Obtener estadísticas de contratos
  static async getContractStats(tenantId: string) {
    const [total, active, expiringSoon, expired] = await Promise.all([
      prisma.maintenanceContract.count({ where: { tenantId } }),
      prisma.maintenanceContract.count({
        where: { tenantId, status: 'ACTIVE' },
      }),
      prisma.maintenanceContract.count({
        where: {
          tenantId,
          status: 'ACTIVE',
          endDate: {
            lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // Próximos 60 días
          },
        },
      }),
      prisma.maintenanceContract.count({
        where: {
          tenantId,
          endDate: {
            lt: new Date(),
          },
        },
      }),
    ])

    return {
      total,
      active,
      expiringSoon,
      expired,
    }
  }
}
