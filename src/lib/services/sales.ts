import { PrismaClient } from '@prisma/client'
import {
  Quote,
  Salesperson,
  Sale,
  Commission,
  Discount,
  QuoteFilters,
  SalespersonFilters,
  SaleFilters,
  CommissionFilters,
  DiscountFilters,
} from '@/lib/validations/sales'

const prisma = new PrismaClient()

export class SalesService {
  // ========================================
  // COTIZACIONES
  // ========================================

  /**
   * Obtiene cotizaciones con filtros y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de cotizaciones y información de paginación
   */
  static async getQuotes(
    tenantId: string,
    filters: QuoteFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { quoteNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
        {
          customer: {
            firstName: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          customer: {
            lastName: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ]
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.customerId) {
      where.customerId = filters.customerId
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate)
      }
    }

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          quoteItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quote.count({ where }),
    ])

    return { quotes, total, page, limit, pages: Math.ceil(total / limit) }
  }

  /**
   * Obtiene una cotización por su ID
   * @param id - ID de la cotización
   * @param tenantId - ID del tenant
   * @returns Promise con la cotización y sus relaciones
   */
  static async getQuoteById(id: string, tenantId: string) {
    return prisma.quote.findFirst({
      where: { id, tenantId },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        quoteItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Crea una nueva cotización
   * @param data - Datos de la cotización a crear
   * @param tenantId - ID del tenant
   * @param userId - ID del usuario que crea la cotización
   * @returns Promise con la cotización creada
   */
  static async createQuote(data: Quote, tenantId: string, userId: string) {
    // Generar número de cotización
    const quoteCount = await prisma.quote.count({
      where: { tenantId },
    })
    const quoteNumber = `Q-${String(quoteCount + 1).padStart(6, '0')}`

    // Calcular totales
    const subtotal = data.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice
      const discountAmount = (itemTotal * item.discount) / 100
      return sum + (itemTotal - discountAmount)
    }, 0)

    const total = subtotal

    return prisma.quote.create({
      data: {
        quoteNumber,
        customerId: data.customerId,
        validUntil: new Date(data.validUntil),
        notes: data.notes,
        terms: data.terms,
        subtotal,
        total,
        tenantId,
        userId,
        quoteItems: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            notes: item.notes,
          })),
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        quoteItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Actualiza una cotización existente
   * @param id - ID de la cotización a actualizar
   * @param data - Datos a actualizar
   * @param tenantId - ID del tenant
   * @returns Promise con la cotización actualizada
   * @throws Error si la cotización no existe
   */
  static async updateQuote(id: string, data: Partial<Quote>, tenantId: string) {
    const existingQuote = await prisma.quote.findFirst({
      where: { id, tenantId },
    })

    if (!existingQuote) {
      throw new Error('Cotización no encontrada')
    }

    return prisma.quote.update({
      where: { id },
      data: {
        ...data,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        quoteItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
              },
            },
          },
        },
      },
    })
  }

  // ========================================
  // VENDEDORES
  // ========================================

  /**
   * Obtiene vendedores con filtros y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de vendedores y información de paginación
   */
  static async getSalespeople(
    tenantId: string,
    filters: SalespersonFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.minCommission !== undefined) {
      where.commission = { gte: filters.minCommission }
    }

    if (filters.maxCommission !== undefined) {
      where.commission = { ...where.commission, lte: filters.maxCommission }
    }

    const [salespeople, total] = await Promise.all([
      prisma.salesperson.findMany({
        where,
        include: {
          _count: {
            select: {
              sales: true,
              commissions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.salesperson.count({ where }),
    ])

    return { salespeople, total, page, limit, pages: Math.ceil(total / limit) }
  }

  /**
   * Crea un nuevo vendedor
   * @param data - Datos del vendedor a crear
   * @param tenantId - ID del tenant
   * @returns Promise con el vendedor creado
   * @throws Error si el email ya existe
   */
  static async createSalesperson(data: Salesperson, tenantId: string) {
    // Verificar email único
    const existingSalesperson = await prisma.salesperson.findFirst({
      where: { email: data.email, tenantId },
    })

    if (existingSalesperson) {
      throw new Error('Ya existe un vendedor con ese email')
    }

    return prisma.salesperson.create({
      data: { ...data, tenantId },
      include: {
        _count: {
          select: {
            sales: true,
            commissions: true,
          },
        },
      },
    })
  }

  // ========================================
  // VENTAS
  // ========================================

  /**
   * Obtiene ventas con filtros y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de ventas y información de paginación
   */
  static async getSales(
    tenantId: string,
    filters: SaleFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { saleNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
        {
          customer: {
            firstName: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          customer: {
            lastName: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ]
    }

    if (filters.customerId) {
      where.customerId = filters.customerId
    }

    if (filters.salespersonId) {
      where.salespersonId = filters.salespersonId
    }

    if (filters.startDate || filters.endDate) {
      where.date = {}
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate)
      }
    }

    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          salesperson: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          saleItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sale.count({ where }),
    ])

    return { sales, total, page, limit, pages: Math.ceil(total / limit) }
  }

  /**
   * Crea una nueva venta
   * @param data - Datos de la venta a crear
   * @param tenantId - ID del tenant
   * @param userId - ID del usuario que crea la venta
   * @returns Promise con la venta creada
   */
  static async createSale(data: Sale, tenantId: string, userId: string) {
    // Generar número de venta
    const saleCount = await prisma.sale.count({
      where: { tenantId },
    })
    const saleNumber = `S-${String(saleCount + 1).padStart(6, '0')}`

    // Calcular totales
    const subtotal = data.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unitPrice
      const discountAmount = (itemTotal * item.discount) / 100
      return sum + (itemTotal - discountAmount)
    }, 0)

    const total = subtotal

    return prisma.sale.create({
      data: {
        saleNumber,
        customerId: data.customerId,
        salespersonId: data.salespersonId,
        date: new Date(data.date),
        notes: data.notes,
        subtotal,
        total,
        tenantId,
        userId,
        saleItems: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            notes: item.notes,
          })),
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        salesperson: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        saleItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                price: true,
              },
            },
          },
        },
      },
    })
  }

  // ========================================
  // COMISIONES
  // ========================================

  /**
   * Obtiene comisiones con filtros y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de comisiones y información de paginación
   */
  static async getCommissions(
    tenantId: string,
    filters: CommissionFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { notes: { contains: filters.search, mode: 'insensitive' } },
        {
          salesperson: {
            name: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ]
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.salespersonId) {
      where.salespersonId = filters.salespersonId
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate)
      }
    }

    const [commissions, total] = await Promise.all([
      prisma.commission.findMany({
        where,
        include: {
          salesperson: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          sale: {
            select: {
              id: true,
              saleNumber: true,
              total: true,
              date: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.commission.count({ where }),
    ])

    return { commissions, total, page, limit, pages: Math.ceil(total / limit) }
  }

  // ========================================
  // DESCUENTOS
  // ========================================

  /**
   * Obtiene descuentos con filtros y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de descuentos y información de paginación
   */
  static async getDiscounts(
    tenantId: string,
    filters: DiscountFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.startDate || filters.endDate) {
      where.startDate = {}
      if (filters.startDate) {
        where.startDate.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.endDate = { lte: new Date(filters.endDate) }
      }
    }

    const [discounts, total] = await Promise.all([
      prisma.discount.findMany({
        where,
        include: {
          _count: {
            select: {
              discountUsages: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.discount.count({ where }),
    ])

    return { discounts, total, page, limit, pages: Math.ceil(total / limit) }
  }

  /**
   * Crea un nuevo descuento
   * @param data - Datos del descuento a crear
   * @param tenantId - ID del tenant
   * @returns Promise con el descuento creado
   * @throws Error si el nombre ya existe
   */
  static async createDiscount(data: Discount, tenantId: string) {
    // Verificar nombre único
    const existingDiscount = await prisma.discount.findFirst({
      where: { name: data.name, tenantId },
    })

    if (existingDiscount) {
      throw new Error('Ya existe un descuento con ese nombre')
    }

    return prisma.discount.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        tenantId,
      },
      include: {
        _count: {
          select: {
            discountUsages: true,
          },
        },
      },
    })
  }

  // ========================================
  // DASHBOARD
  // ========================================

  /**
   * Obtiene estadísticas del dashboard de ventas
   * @param tenantId - ID del tenant
   * @returns Promise con estadísticas completas del módulo de ventas
   */
  static async getDashboardStats(tenantId: string) {
    const [
      totalQuotes,
      activeQuotes,
      totalSales,
      totalSalespeople,
      activeSalespeople,
      totalCommissions,
      pendingCommissions,
      totalDiscounts,
      activeDiscounts,
    ] = await Promise.all([
      prisma.quote.count({ where: { tenantId } }),
      prisma.quote.count({
        where: { tenantId, status: { in: ['DRAFT', 'SENT'] } },
      }),
      prisma.sale.count({ where: { tenantId } }),
      prisma.salesperson.count({ where: { tenantId } }),
      prisma.salesperson.count({ where: { tenantId, isActive: true } }),
      prisma.commission.count({ where: { tenantId } }),
      prisma.commission.count({ where: { tenantId, status: 'PENDING' } }),
      prisma.discount.count({ where: { tenantId } }),
      prisma.discount.count({ where: { tenantId, isActive: true } }),
    ])

    return {
      totalQuotes,
      activeQuotes,
      totalSales,
      totalSalespeople,
      activeSalespeople,
      totalCommissions,
      pendingCommissions,
      totalDiscounts,
      activeDiscounts,
    }
  }
}
