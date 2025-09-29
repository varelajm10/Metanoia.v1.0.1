import { PrismaClient } from '@prisma/client'
import type { InspectionInput } from '../validations/elevator'

const prisma = new PrismaClient()

export class ElevatorInspectionService {
  static async getInspections(tenantId: string, options: any = {}) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      inspectionType,
      elevatorId,
    } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { inspectionNumber: { contains: search, mode: 'insensitive' } },
        { inspector: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) where.status = status
    if (inspectionType) where.inspectionType = inspectionType
    if (elevatorId) where.elevatorId = elevatorId

    const [inspections, total] = await Promise.all([
      prisma.inspection.findMany({
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
            },
          },
        },
        orderBy: { scheduledDate: 'desc' },
      }),
      prisma.inspection.count({ where }),
    ])

    return {
      inspections,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  static async getInspectionById(id: string, tenantId: string) {
    return prisma.inspection.findFirst({
      where: { id, tenantId },
      include: {
        elevator: {
          include: {
            client: true,
          },
        },
      },
    })
  }

  static async createInspection(data: InspectionInput, tenantId: string) {
    return prisma.inspection.create({
      data: {
        ...data,
        tenantId,
        scheduledDate: new Date(data.scheduledDate),
        inspectionDate: data.inspectionDate
          ? new Date(data.inspectionDate)
          : undefined,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      },
      include: { elevator: true },
    })
  }

  static async updateInspection(
    id: string,
    data: Partial<InspectionInput>,
    tenantId: string
  ) {
    const updateData: any = { ...data }
    if (data.scheduledDate)
      updateData.scheduledDate = new Date(data.scheduledDate)
    if (data.inspectionDate)
      updateData.inspectionDate = new Date(data.inspectionDate)
    if (data.expiryDate) updateData.expiryDate = new Date(data.expiryDate)

    return prisma.inspection.update({
      where: { id, tenantId },
      data: updateData,
      include: { elevator: true },
    })
  }

  static async deleteInspection(id: string, tenantId: string) {
    return prisma.inspection.delete({ where: { id, tenantId } })
  }

  static async getInspectionStats(tenantId: string) {
    const [total, scheduled, completed, failed, upcoming] = await Promise.all([
      prisma.inspection.count({ where: { tenantId } }),
      prisma.inspection.count({ where: { tenantId, status: 'SCHEDULED' } }),
      prisma.inspection.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.inspection.count({ where: { tenantId, result: 'FAILED' } }),
      prisma.inspection.count({
        where: {
          tenantId,
          status: 'SCHEDULED',
          scheduledDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    return { total, scheduled, completed, failed, upcoming }
  }
}
