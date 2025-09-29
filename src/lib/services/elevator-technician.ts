import { PrismaClient } from '@prisma/client'
import type {
  ElevatorTechnicianInput,
  ElevatorSparePartInput,
  WorkOrderInput,
} from '../validations/elevator'

const prisma = new PrismaClient()

// ========================================
// TÉCNICOS
// ========================================

export class ElevatorTechnicianService {
  static async getTechnicians(tenantId: string, options: any = {}) {
    const { page = 1, limit = 20, search, status, skillLevel } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { employeeNumber: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) where.status = status
    if (skillLevel) where.skillLevel = skillLevel

    const [technicians, total] = await Promise.all([
      prisma.elevatorTechnician.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
      prisma.elevatorTechnician.count({ where }),
    ])

    return {
      technicians,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  static async getTechnicianById(id: string, tenantId: string) {
    return prisma.elevatorTechnician.findFirst({
      where: { id, tenantId },
    })
  }

  static async createTechnician(
    data: ElevatorTechnicianInput,
    tenantId: string
  ) {
    return prisma.elevatorTechnician.create({
      data: {
        ...data,
        tenantId,
      },
    })
  }

  static async updateTechnician(
    id: string,
    data: Partial<ElevatorTechnicianInput>,
    tenantId: string
  ) {
    return prisma.elevatorTechnician.update({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteTechnician(id: string, tenantId: string) {
    return prisma.elevatorTechnician.delete({ where: { id, tenantId } })
  }

  static async getTechnicianStats(tenantId: string) {
    const [total, active, available] = await Promise.all([
      prisma.elevatorTechnician.count({ where: { tenantId } }),
      prisma.elevatorTechnician.count({
        where: { tenantId, status: 'ACTIVE' },
      }),
      prisma.elevatorTechnician.count({
        where: { tenantId, status: 'ACTIVE', availability: true },
      }),
    ])

    return { total, active, available }
  }
}

// ========================================
// REPUESTOS
// ========================================

export class ElevatorSparePartService {
  static async getSpareParts(tenantId: string, options: any = {}) {
    const { page = 1, limit = 20, search, category } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { partNumber: { contains: search, mode: 'insensitive' } },
        { partName: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) where.category = { contains: category, mode: 'insensitive' }

    const [spareParts, total] = await Promise.all([
      prisma.elevatorSparePart.findMany({
        where,
        skip,
        take: limit,
        orderBy: { partName: 'asc' },
      }),
      prisma.elevatorSparePart.count({ where }),
    ])

    return {
      spareParts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  static async getSparePartById(id: string, tenantId: string) {
    return prisma.elevatorSparePart.findFirst({
      where: { id, tenantId },
    })
  }

  static async createSparePart(data: ElevatorSparePartInput, tenantId: string) {
    return prisma.elevatorSparePart.create({
      data: {
        ...data,
        tenantId,
      },
    })
  }

  static async updateSparePart(
    id: string,
    data: Partial<ElevatorSparePartInput>,
    tenantId: string
  ) {
    return prisma.elevatorSparePart.update({
      where: { id, tenantId },
      data,
    })
  }

  static async deleteSparePart(id: string, tenantId: string) {
    return prisma.elevatorSparePart.delete({ where: { id, tenantId } })
  }

  static async getSparePartStats(tenantId: string) {
    const [total, lowStock, outOfStock] = await Promise.all([
      prisma.elevatorSparePart.count({ where: { tenantId } }),
      prisma.elevatorSparePart.count({
        where: {
          tenantId,
          currentStock: {
            lte: prisma.elevatorSparePart.fields.minStock,
          },
        },
      }),
      prisma.elevatorSparePart.count({ where: { tenantId, currentStock: 0 } }),
    ])

    return { total, lowStock, outOfStock }
  }
}

// ========================================
// ÓRDENES DE TRABAJO
// ========================================

export class WorkOrderService {
  static async getWorkOrders(tenantId: string, options: any = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      orderType,
      elevatorId,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { workOrderNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) where.status = status
    if (orderType) where.orderType = orderType
    if (elevatorId) where.elevatorId = elevatorId

    const [workOrders, total] = await Promise.all([
      prisma.workOrder.findMany({
        where,
        skip,
        take: limit,
        include: {
          elevator: {
            select: {
              id: true,
              serialNumber: true,
              model: true,
              buildingName: true,
            },
          },
          installation: {
            select: {
              id: true,
              projectNumber: true,
              projectName: true,
            },
          },
        },
        orderBy: { createdDate: 'desc' },
      }),
      prisma.workOrder.count({ where }),
    ])

    return {
      workOrders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  static async getWorkOrderById(id: string, tenantId: string) {
    return prisma.workOrder.findFirst({
      where: { id, tenantId },
      include: {
        elevator: {
          include: {
            client: true,
          },
        },
        installation: true,
        technicians: true,
      },
    })
  }

  static async createWorkOrder(data: WorkOrderInput, tenantId: string) {
    const workOrderData: any = {
      ...data,
      tenantId,
    }

    if (data.scheduledDate)
      workOrderData.scheduledDate = new Date(data.scheduledDate)
    if (data.startDate) workOrderData.startDate = new Date(data.startDate)
    if (data.completedDate)
      workOrderData.completedDate = new Date(data.completedDate)
    if (data.dueDate) workOrderData.dueDate = new Date(data.dueDate)

    return prisma.workOrder.create({
      data: workOrderData,
      include: {
        elevator: true,
        installation: true,
      },
    })
  }

  static async updateWorkOrder(
    id: string,
    data: Partial<WorkOrderInput>,
    tenantId: string
  ) {
    const updateData: any = { ...data }

    if (data.scheduledDate)
      updateData.scheduledDate = new Date(data.scheduledDate)
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.completedDate)
      updateData.completedDate = new Date(data.completedDate)
    if (data.dueDate) updateData.dueDate = new Date(data.dueDate)

    return prisma.workOrder.update({
      where: { id, tenantId },
      data: updateData,
      include: {
        elevator: true,
        installation: true,
      },
    })
  }

  static async deleteWorkOrder(id: string, tenantId: string) {
    return prisma.workOrder.delete({ where: { id, tenantId } })
  }

  static async getWorkOrderStats(tenantId: string) {
    const [total, open, inProgress, completed, urgent] = await Promise.all([
      prisma.workOrder.count({ where: { tenantId } }),
      prisma.workOrder.count({ where: { tenantId, status: 'OPEN' } }),
      prisma.workOrder.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      prisma.workOrder.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.workOrder.count({
        where: {
          tenantId,
          priority: 'URGENT',
          status: {
            notIn: ['COMPLETED', 'CANCELLED', 'CLOSED'],
          },
        },
      }),
    ])

    return { total, open, inProgress, completed, urgent }
  }
}
