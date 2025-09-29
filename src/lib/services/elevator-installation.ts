import { PrismaClient } from '@prisma/client'
import type { InstallationInput } from '../validations/elevator'

const prisma = new PrismaClient()

export class ElevatorInstallationService {
  static async getInstallations(tenantId: string, options: any = {}) {
    const { page = 1, limit = 20, search, status, clientId } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { projectNumber: { contains: search, mode: 'insensitive' } },
        { projectName: { contains: search, mode: 'insensitive' } },
        { siteAddress: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) where.status = status
    if (clientId) where.clientId = clientId

    const [installations, total] = await Promise.all([
      prisma.installation.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: { select: { id: true, name: true, company: true } },
          elevator: { select: { id: true, serialNumber: true, model: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.installation.count({ where }),
    ])

    return {
      installations,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  static async getInstallationById(id: string, tenantId: string) {
    return prisma.installation.findFirst({
      where: { id, tenantId },
      include: {
        client: true,
        elevator: true,
        workOrders: { orderBy: { createdDate: 'desc' } },
      },
    })
  }

  static async createInstallation(data: InstallationInput, tenantId: string) {
    return prisma.installation.create({
      data: {
        ...data,
        tenantId,
        startDate: new Date(data.startDate),
        plannedEndDate: new Date(data.plannedEndDate),
        actualEndDate: data.actualEndDate
          ? new Date(data.actualEndDate)
          : undefined,
      },
      include: { client: true },
    })
  }

  static async updateInstallation(
    id: string,
    data: Partial<InstallationInput>,
    tenantId: string
  ) {
    const updateData: any = { ...data }
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.plannedEndDate)
      updateData.plannedEndDate = new Date(data.plannedEndDate)
    if (data.actualEndDate)
      updateData.actualEndDate = new Date(data.actualEndDate)

    return prisma.installation.update({
      where: { id, tenantId },
      data: updateData,
      include: { client: true },
    })
  }

  static async deleteInstallation(id: string, tenantId: string) {
    return prisma.installation.delete({ where: { id, tenantId } })
  }

  static async getInstallationStats(tenantId: string) {
    const [total, planned, inProgress, completed, onHold] = await Promise.all([
      prisma.installation.count({ where: { tenantId } }),
      prisma.installation.count({ where: { tenantId, status: 'PLANNED' } }),
      prisma.installation.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      prisma.installation.count({ where: { tenantId, status: 'COMPLETED' } }),
      prisma.installation.count({ where: { tenantId, status: 'ON_HOLD' } }),
    ])

    return { total, planned, inProgress, completed, onHold }
  }
}
