import { PrismaClient, Prisma } from '@prisma/client'
import { CreateLeadInput, UpdateLeadInput } from '@/lib/validations/crm'

const prisma = new PrismaClient()

export class LeadService {
  /**
   * Crea un nuevo lead en el sistema
   * @param data - Datos del lead a crear
   * @param tenantId - ID del tenant
   * @returns Promise con el lead creado y sus relaciones
   */
  static async createLead(data: CreateLeadInput, tenantId: string) {
    return await prisma.lead.create({
      data: {
        ...data,
        tenantId,
        lastContact: data.lastContact ? new Date(data.lastContact) : null,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
      },
      include: {
        opportunities: {
          orderBy: { createdAt: 'desc' },
        },
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })
  }

  /**
   * Obtiene leads con filtros y paginación
   * @param tenantId - ID del tenant
   * @param options - Opciones de filtrado y paginación
   * @returns Promise con lista de leads y información de paginación
   */
  static async getLeads(
    tenantId: string,
    options: {
      page?: number
      limit?: number
      search?: string
      status?: string
      source?: string
      priority?: string
      assignedTo?: string
    } = {}
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      source,
      priority,
      assignedTo,
    } = options
    const skip = (page - 1) * limit

    const where: Prisma.LeadWhereInput = { tenantId }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (source) {
      where.source = source
    }

    if (priority) {
      where.priority = priority
    }

    if (assignedTo) {
      where.assignedTo = assignedTo
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        include: {
          opportunities: {
            orderBy: { createdAt: 'desc' },
          },
          communications: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ])

    return {
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * Obtiene un lead por su ID
   * @param id - ID del lead
   * @param tenantId - ID del tenant
   * @returns Promise con el lead y sus relaciones
   */
  static async getLeadById(id: string, tenantId: string) {
    return await prisma.lead.findFirst({
      where: { id, tenantId },
      include: {
        opportunities: {
          orderBy: { createdAt: 'desc' },
        },
        communications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  /**
   * Actualiza un lead existente
   * @param id - ID del lead a actualizar
   * @param data - Datos a actualizar
   * @param tenantId - ID del tenant
   * @returns Promise con el lead actualizado
   */
  static async updateLead(id: string, data: UpdateLeadInput, tenantId: string) {
    return await prisma.lead.update({
      where: { id, tenantId },
      data: {
        ...data,
        lastContact: data.lastContact ? new Date(data.lastContact) : undefined,
        nextFollowUp: data.nextFollowUp
          ? new Date(data.nextFollowUp)
          : undefined,
      },
      include: {
        opportunities: {
          orderBy: { createdAt: 'desc' },
        },
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })
  }

  /**
   * Elimina un lead del sistema
   * @param id - ID del lead a eliminar
   * @param tenantId - ID del tenant
   * @returns Promise con el lead eliminado
   */
  static async deleteLead(id: string, tenantId: string) {
    return await prisma.lead.delete({
      where: { id, tenantId },
    })
  }

  /**
   * Obtiene estadísticas de leads
   * @param tenantId - ID del tenant
   * @returns Promise con estadísticas completas de leads
   */
  static async getLeadStats(tenantId: string) {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      closedWonLeads,
      closedLostLeads,
      highPriorityLeads,
      leadsBySource,
      leadsByStatus,
      recentLeads,
    ] = await Promise.all([
      prisma.lead.count({ where: { tenantId } }),
      prisma.lead.count({ where: { tenantId, status: 'NEW' } }),
      prisma.lead.count({ where: { tenantId, status: 'CONTACTED' } }),
      prisma.lead.count({ where: { tenantId, status: 'QUALIFIED' } }),
      prisma.lead.count({ where: { tenantId, status: 'CLOSED_WON' } }),
      prisma.lead.count({ where: { tenantId, status: 'CLOSED_LOST' } }),
      prisma.lead.count({ where: { tenantId, priority: 'HIGH' } }),
      prisma.lead.groupBy({
        by: ['source'],
        where: { tenantId },
        _count: { source: true },
        orderBy: { _count: { source: 'desc' } },
      }),
      prisma.lead.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { status: true },
        orderBy: { _count: { status: 'desc' } },
      }),
      prisma.lead.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          opportunities: {
            select: { id: true, name: true, value: true, stage: true },
          },
        },
      }),
    ])

    // Calcular conversión
    const conversionRate =
      totalLeads > 0 ? Math.round((closedWonLeads / totalLeads) * 100) : 0

    // Calcular valor promedio de oportunidades
    const opportunitiesValue = await prisma.opportunity.aggregate({
      where: { tenantId },
      _avg: { value: true },
      _sum: { value: true },
    })

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      closedWonLeads,
      closedLostLeads,
      highPriorityLeads,
      conversionRate,
      leadsBySource,
      leadsByStatus,
      recentLeads,
      averageOpportunityValue: opportunitiesValue._avg.value || 0,
      totalOpportunityValue: opportunitiesValue._sum.value || 0,
    }
  }

  /**
   * Actualiza el score de un lead basado en varios factores
   * @param id - ID del lead
   * @param tenantId - ID del tenant
   * @returns Promise con el lead actualizado
   * @throws Error si el lead no existe
   */
  static async updateLeadScore(id: string, tenantId: string) {
    const lead = await prisma.lead.findFirst({
      where: { id, tenantId },
    })

    if (!lead) {
      throw new Error('Lead not found')
    }

    // Calcular score basado en varios factores
    let score = 0

    // Score por información completa
    if (lead.firstName && lead.lastName) score += 10
    if (lead.email) score += 15
    if (lead.phone) score += 10
    if (lead.company) score += 15
    if (lead.jobTitle) score += 10
    if (lead.industry) score += 5

    // Score por fuente
    const sourceScores: { [key: string]: number } = {
      REFERRAL: 25,
      PARTNER: 20,
      WEBSITE: 15,
      EVENT: 15,
      SOCIAL_MEDIA: 10,
      EMAIL_MARKETING: 10,
      COLD_CALL: 5,
      ADVERTISEMENT: 5,
      OTHER: 0,
    }
    score += sourceScores[lead.source] || 0

    // Score por status
    const statusScores: { [key: string]: number } = {
      QUALIFIED: 20,
      PROPOSAL_SENT: 25,
      NEGOTIATING: 30,
      CONTACTED: 10,
      NEW: 0,
      CLOSED_WON: 50,
      CLOSED_LOST: 0,
      NURTURING: 5,
    }
    score += statusScores[lead.status] || 0

    // Score por prioridad
    const priorityScores: { [key: string]: number } = {
      URGENT: 15,
      HIGH: 10,
      MEDIUM: 5,
      LOW: 0,
    }
    score += priorityScores[lead.priority] || 0

    // Actualizar score
    return await prisma.lead.update({
      where: { id, tenantId },
      data: { score: Math.min(score, 100) },
    })
  }
}
