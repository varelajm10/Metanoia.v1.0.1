import { PrismaClient } from '@prisma/client'
import {
  CreateOpportunityInput,
  UpdateOpportunityInput,
} from '@/lib/validations/crm'

const prisma = new PrismaClient()

export class OpportunityService {
  static async createOpportunity(
    data: CreateOpportunityInput,
    tenantId: string
  ) {
    return await prisma.opportunity.create({
      data: {
        ...data,
        tenantId,
        closeDate: data.closeDate ? new Date(data.closeDate) : null,
      },
      include: {
        lead: true,
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        deals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  static async getOpportunities(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      stage?: string
      assignedTo?: string
      leadId?: string
    } = {}
  ) {
    const { page = 1, limit = 20, search, stage, assignedTo, leadId } = options
    const skip = (page - 1) * limit

    const where: any = { tenantId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        {
          lead: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { company: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ]
    }

    if (stage) {
      where.stage = stage
    }

    if (assignedTo) {
      where.assignedTo = assignedTo
    }

    if (leadId) {
      where.leadId = leadId
    }

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take: limit,
        include: {
          lead: true,
          communications: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
          deals: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.opportunity.count({ where }),
    ])

    return {
      opportunities,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async getOpportunityById(id: string, tenantId: string) {
    return await prisma.opportunity.findFirst({
      where: { id, tenantId },
      include: {
        lead: true,
        communications: {
          orderBy: { createdAt: 'desc' },
        },
        deals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  static async updateOpportunity(
    id: string,
    data: UpdateOpportunityInput,
    tenantId: string
  ) {
    return await prisma.opportunity.update({
      where: { id, tenantId },
      data: {
        ...data,
        closeDate: data.closeDate ? new Date(data.closeDate) : undefined,
      },
      include: {
        lead: true,
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        deals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  static async deleteOpportunity(id: string, tenantId: string) {
    return await prisma.opportunity.delete({
      where: { id, tenantId },
    })
  }

  static async getOpportunityStats(tenantId: string) {
    const [
      totalOpportunities,
      prospectingOpportunities,
      qualificationOpportunities,
      proposalOpportunities,
      negotiationOpportunities,
      closedWonOpportunities,
      closedLostOpportunities,
      opportunitiesByStage,
      totalValue,
      weightedValue,
    ] = await Promise.all([
      prisma.opportunity.count({ where: { tenantId } }),
      prisma.opportunity.count({ where: { tenantId, stage: 'PROSPECTING' } }),
      prisma.opportunity.count({ where: { tenantId, stage: 'QUALIFICATION' } }),
      prisma.opportunity.count({ where: { tenantId, stage: 'PROPOSAL' } }),
      prisma.opportunity.count({ where: { tenantId, stage: 'NEGOTIATION' } }),
      prisma.opportunity.count({ where: { tenantId, stage: 'CLOSED_WON' } }),
      prisma.opportunity.count({ where: { tenantId, stage: 'CLOSED_LOST' } }),
      prisma.opportunity.groupBy({
        by: ['stage'],
        where: { tenantId },
        _count: { stage: true },
        _sum: { value: true },
        orderBy: { _count: { stage: 'desc' } },
      }),
      prisma.opportunity.aggregate({
        where: { tenantId },
        _sum: { value: true },
        _avg: { value: true },
      }),
      // Calcular valor ponderado (valor * probabilidad / 100)
      prisma.opportunity.findMany({
        where: { tenantId },
        select: { value: true, probability: true },
      }),
    ])

    // Calcular valor ponderado
    const weightedValueSum = opportunitiesByStage.reduce((sum, opp) => {
      const stageWeight =
        {
          PROSPECTING: 10,
          QUALIFICATION: 25,
          PROPOSAL: 50,
          NEGOTIATION: 75,
          CLOSED_WON: 100,
          CLOSED_LOST: 0,
        }[opp.stage] || 0

      return sum + (Number(opp._sum.value || 0) * stageWeight) / 100
    }, 0)

    // Calcular tasa de cierre
    const closeRate =
      totalOpportunities > 0
        ? Math.round((closedWonOpportunities / totalOpportunities) * 100)
        : 0

    return {
      totalOpportunities,
      prospectingOpportunities,
      qualificationOpportunities,
      proposalOpportunities,
      negotiationOpportunities,
      closedWonOpportunities,
      closedLostOpportunities,
      opportunitiesByStage,
      totalValue: totalValue._sum.value || 0,
      averageValue: totalValue._avg.value || 0,
      weightedValue: weightedValueSum,
      closeRate,
    }
  }

  static async moveOpportunityToStage(
    id: string,
    stage: string,
    tenantId: string
  ) {
    // Actualizar probabilidad basada en la etapa
    const stageProbabilities: { [key: string]: number } = {
      PROSPECTING: 10,
      QUALIFICATION: 25,
      PROPOSAL: 50,
      NEGOTIATION: 75,
      CLOSED_WON: 100,
      CLOSED_LOST: 0,
    }

    const probability = stageProbabilities[stage] || 10

    return await prisma.opportunity.update({
      where: { id, tenantId },
      data: {
        stage: stage as any,
        probability,
        ...(stage === 'CLOSED_WON' || stage === 'CLOSED_LOST'
          ? { closeDate: new Date() }
          : {}),
      },
      include: {
        lead: true,
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        deals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }
}
