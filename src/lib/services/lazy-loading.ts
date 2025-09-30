import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Servicio de lazy loading para relaciones pesadas
 * Evita cargar datos innecesarios hasta que se requieran
 */
export class LazyLoadingService {
  /**
   * Cargar órdenes de un cliente solo cuando se necesiten
   */
  static async getCustomerOrders(
    customerId: string, 
    tenantId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit
    
    return prisma.order.findMany({
      where: {
        customerId,
        tenantId,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })
  }

  /**
   * Cargar facturas de un cliente solo cuando se necesiten
   */
  static async getCustomerInvoices(
    customerId: string,
    tenantId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit
    
    return prisma.invoice.findMany({
      where: {
        customerId,
        tenantId,
      },
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        total: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })
  }

  /**
   * Obtener solo el conteo de órdenes sin cargar los datos
   */
  static async getCustomerOrdersCount(customerId: string, tenantId: string) {
    return prisma.order.count({
      where: {
        customerId,
        tenantId,
      },
    })
  }

  /**
   * Obtener solo el conteo de facturas sin cargar los datos
   */
  static async getCustomerInvoicesCount(customerId: string, tenantId: string) {
    return prisma.invoice.count({
      where: {
        customerId,
        tenantId,
      },
    })
  }

  /**
   * Cargar estadísticas básicas de un cliente
   */
  static async getCustomerBasicStats(customerId: string, tenantId: string) {
    const [ordersCount, invoicesCount, totalOrdersValue, totalInvoicesValue] = await Promise.all([
      this.getCustomerOrdersCount(customerId, tenantId),
      this.getCustomerInvoicesCount(customerId, tenantId),
      prisma.order.aggregate({
        where: { customerId, tenantId },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: { customerId, tenantId },
        _sum: { total: true },
      }),
    ])

    return {
      ordersCount,
      invoicesCount,
      totalOrdersValue: totalOrdersValue._sum.total || 0,
      totalInvoicesValue: totalInvoicesValue._sum.total || 0,
    }
  }

  /**
   * Cargar datos de cliente con lazy loading
   */
  static async getCustomerWithLazyRelations(customerId: string, tenantId: string) {
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!customer) {
      return null
    }

    // Cargar estadísticas básicas
    const stats = await this.getCustomerBasicStats(customerId, tenantId)

    return {
      ...customer,
      _count: {
        orders: stats.ordersCount,
        invoices: stats.invoicesCount,
      },
      _stats: stats,
    }
  }

  /**
   * Cargar lista de clientes con lazy loading
   */
  static async getCustomersWithLazyRelations(
    tenantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean
  ) {
    const skip = (page - 1) * limit
    
    const where: any = { tenantId }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ])

    // Cargar conteos de manera eficiente
    const customersWithCounts = await Promise.all(
      customers.map(async (customer) => {
        const [ordersCount, invoicesCount] = await Promise.all([
          this.getCustomerOrdersCount(customer.id, tenantId),
          this.getCustomerInvoicesCount(customer.id, tenantId),
        ])

        return {
          ...customer,
          _count: {
            orders: ordersCount,
            invoices: invoicesCount,
          },
        }
      })
    )

    return {
      customers: customersWithCounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    }
  }
}

