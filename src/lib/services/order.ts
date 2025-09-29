import {
  PrismaClient,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from '@prisma/client'
import {
  CreateOrderInput,
  UpdateOrderInput,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
  OrderQuery,
} from '@/lib/validations/order'

const prisma = new PrismaClient()

export interface OrderWithRelations extends Order {
  orderItems?: OrderItem[]
  customer?: {
    id: string
    name: string
    email: string | null
    phone: string | null
  }
  _count?: {
    orderItems: number
  }
}

// Generar número de orden único
async function generateOrderNumber(tenantId: string): Promise<string> {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const prefix = `ORD-${year}${month}${day}`

  // Obtener el último número de orden del día
  const lastOrder = await prisma.order.findFirst({
    where: {
      tenantId,
      orderNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      orderNumber: 'desc',
    },
  })

  let sequence = 1
  if (lastOrder) {
    const lastSequence =
      parseInt(lastOrder.orderNumber.split('-')[1].slice(8)) || 0
    sequence = lastSequence + 1
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`
}

// Validar stock disponible
async function validateStock(
  items: any[],
  tenantId: string
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = []

  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
        tenantId,
        isActive: true,
      },
    })

    if (!product) {
      errors.push(`Producto con ID ${item.productId} no encontrado o inactivo`)
      continue
    }

    if (product.stock < item.quantity) {
      errors.push(
        `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Crear una nueva orden
export async function createOrder(
  data: CreateOrderInput,
  tenantId: string,
  userId: string
): Promise<OrderWithRelations> {
  // Validar que el cliente existe
  const customer = await prisma.customer.findFirst({
    where: {
      id: data.customerId,
      tenantId,
      isActive: true,
    },
  })

  if (!customer) {
    throw new Error('Cliente no encontrado o inactivo')
  }

  // Validar stock disponible
  const stockValidation = await validateStock(data.items, tenantId)
  if (!stockValidation.valid) {
    throw new Error(`Errores de stock: ${stockValidation.errors.join(', ')}`)
  }

  // Generar número de orden si no se proporciona
  const orderNumber = data.orderNumber || (await generateOrderNumber(tenantId))

  // Crear la orden y los items en una transacción
  const result = await prisma.$transaction(async tx => {
    // Crear la orden
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        userId: userId,
        subtotal: data.subtotal,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        discountAmount: data.discountAmount,
        total: data.total,
        status: data.status,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentStatus,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        expectedDeliveryDate: data.expectedDeliveryDate,
        tenantId,
      },
    })

    // Crear los items de la orden
    const orderItems = await Promise.all(
      data.items.map(async item => {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            total: item.quantity * item.unitPrice * (1 - item.discount / 100),
            notes: item.notes,
          },
        })

        // Reducir stock del producto
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })

        return orderItem
      })
    )

    return { order, items: orderItems }
  })

  // Obtener la orden completa con relaciones
  return getOrderById(result.order.id, tenantId) as Promise<OrderWithRelations>
}

// Obtener orden por ID
export async function getOrderById(
  id: string,
  tenantId: string
): Promise<OrderWithRelations | null> {
  return prisma.order.findFirst({
    where: {
      id,
      tenantId,
    },
    include: {
      orderItems: {
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
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
  })
}

// Obtener todas las órdenes con filtros y paginación
export async function getOrders(
  query: OrderQuery,
  tenantId: string
): Promise<{
  orders: OrderWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  const {
    page,
    limit,
    search,
    status,
    paymentStatus,
    customerId,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  } = query
  const skip = (page - 1) * limit

  // Construir filtros
  const where: any = {
    tenantId,
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (status) {
    where.status = status
  }

  if (paymentStatus) {
    where.paymentStatus = paymentStatus
  }

  if (customerId) {
    where.customerId = customerId
  }

  if (dateFrom || dateTo) {
    where.createdAt = {}
    if (dateFrom) {
      where.createdAt.gte = dateFrom
    }
    if (dateTo) {
      where.createdAt.lte = dateTo
    }
  }

  // Obtener total de registros
  const total = await prisma.order.count({ where })

  // Obtener órdenes con paginación
  const orders = await prisma.order.findMany({
    where,
    include: {
      orderItems: {
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
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  })

  const totalPages = Math.ceil(total / limit)

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

// Actualizar orden
export async function updateOrder(
  id: string,
  data: UpdateOrderInput,
  tenantId: string
): Promise<Order> {
  // Verificar que la orden existe y pertenece al tenant
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingOrder) {
    throw new Error('Orden no encontrada')
  }

  // Verificar que no esté en estado final
  if (
    existingOrder.status === 'DELIVERED' ||
    existingOrder.status === 'CANCELLED'
  ) {
    throw new Error('No se puede modificar una orden entregada o cancelada')
  }

  return prisma.order.update({
    where: { id },
    data,
  })
}

// Actualizar estado de la orden
export async function updateOrderStatus(
  id: string,
  statusUpdate: UpdateOrderStatusInput,
  tenantId: string
): Promise<Order> {
  // Verificar que la orden existe y pertenece al tenant
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingOrder) {
    throw new Error('Orden no encontrada')
  }

  // Validar transiciones de estado
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED', 'CANCELLED'],
    SHIPPED: ['DELIVERED'],
    DELIVERED: [], // Estado final
    CANCELLED: [], // Estado final
  }

  if (!validTransitions[existingOrder.status].includes(statusUpdate.status)) {
    throw new Error(
      `No se puede cambiar el estado de ${existingOrder.status} a ${statusUpdate.status}`
    )
  }

  // Si se cancela la orden, restaurar stock
  if (
    statusUpdate.status === 'CANCELLED' &&
    existingOrder.status !== 'CANCELLED'
  ) {
    await restoreStockFromOrder(id, tenantId)
  }

  return prisma.order.update({
    where: { id },
    data: {
      status: statusUpdate.status,
      notes: statusUpdate.notes,
    },
  })
}

// Actualizar estado de pago
export async function updatePaymentStatus(
  id: string,
  paymentUpdate: UpdatePaymentStatusInput,
  tenantId: string
): Promise<Order> {
  // Verificar que la orden existe y pertenece al tenant
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingOrder) {
    throw new Error('Orden no encontrada')
  }

  return prisma.order.update({
    where: { id },
    data: {
      paymentStatus: paymentUpdate.paymentStatus,
      paymentMethod: paymentUpdate.paymentMethod,
      notes: paymentUpdate.notes,
    },
  })
}

// Cancelar orden
export async function cancelOrder(
  id: string,
  tenantId: string,
  reason?: string
): Promise<Order> {
  // Verificar que la orden existe y pertenece al tenant
  const existingOrder = await prisma.order.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingOrder) {
    throw new Error('Orden no encontrada')
  }

  // Verificar que no esté en estado final
  if (
    existingOrder.status === 'DELIVERED' ||
    existingOrder.status === 'CANCELLED'
  ) {
    throw new Error('No se puede cancelar una orden entregada o ya cancelada')
  }

  // Restaurar stock y cancelar orden en una transacción
  const result = await prisma.$transaction(async tx => {
    // Restaurar stock
    await restoreStockFromOrder(id, tenantId, tx)

    // Cancelar orden
    const order = await tx.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason
          ? `${existingOrder.notes || ''}\nCancelada: ${reason}`.trim()
          : existingOrder.notes,
      },
    })

    return order
  })

  return result
}

// Restaurar stock de una orden
async function restoreStockFromOrder(
  orderId: string,
  tenantId: string,
  tx?: any
): Promise<void> {
  const prismaClient = tx || prisma

  const orderItems = await prismaClient.orderItem.findMany({
    where: {
      orderId,
    },
  })

  for (const item of orderItems) {
    await prismaClient.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    })
  }
}

// Obtener estadísticas de órdenes
export async function getOrderStats(tenantId: string) {
  const [
    totalOrders,
    totalRevenue,
    ordersByStatus,
    ordersByPaymentStatus,
    topCustomers,
    topProducts,
  ] = await Promise.all([
    // Total de órdenes
    prisma.order.count({
      where: { tenantId },
    }),

    // Revenue total
    prisma.order.aggregate({
      where: { tenantId },
      _sum: { total: true },
    }),

    // Órdenes por estado
    prisma.order.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { id: true },
    }),

    // Órdenes por estado de pago
    prisma.order.groupBy({
      by: ['paymentStatus'],
      where: { tenantId },
      _count: { id: true },
    }),

    // Top clientes
    prisma.order.groupBy({
      by: ['customerId'],
      where: { tenantId },
      _count: { id: true },
      _sum: { total: true },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    }),

    // Top productos
    prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { tenantId },
      },
      _count: { id: true },
      _sum: { total: true },
      orderBy: {
        _sum: {
          total: 'desc',
        },
      },
      take: 10,
    }),
  ])

  // Calcular promedio de valor de orden
  const averageOrderValue =
    totalOrders > 0 ? Number(totalRevenue._sum.total || 0) / totalOrders : 0

  // Obtener nombres de clientes y productos
  const customerIds = topCustomers.map(c => c.customerId)
  const productIds = topProducts.map(p => p.productId)

  const [customers, products] = await Promise.all([
    prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: { id: true, name: true },
    }),
    prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    }),
  ])

  const customerMap = new Map(customers.map(c => [c.id, c.name]))
  const productMap = new Map(products.map(p => [p.id, p.name]))

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    averageOrderValue,
    ordersByStatus: ordersByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
      percentage: totalOrders > 0 ? (item._count.id / totalOrders) * 100 : 0,
    })),
    ordersByPaymentStatus: ordersByPaymentStatus.map(item => ({
      paymentStatus: item.paymentStatus,
      count: item._count.id,
      percentage: totalOrders > 0 ? (item._count.id / totalOrders) * 100 : 0,
    })),
    topCustomers: topCustomers.map(item => ({
      customerId: item.customerId,
      customerName: customerMap.get(item.customerId) || 'Cliente desconocido',
      orderCount: item._count.id,
      totalSpent: item._sum.total || 0,
    })),
    topProducts: topProducts.map(item => ({
      productId: item.productId,
      productName: productMap.get(item.productId) || 'Producto desconocido',
      quantitySold: item._count.id,
      revenue: item._sum.total || 0,
    })),
  }
}

// Buscar órdenes por número o cliente
export async function searchOrders(
  query: string,
  tenantId: string,
  limit: number = 10
): Promise<Order[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  return prisma.order.findMany({
    where: {
      tenantId,
      OR: [
        { orderNumber: { contains: query, mode: 'insensitive' } },
        { customer: { name: { contains: query, mode: 'insensitive' } } },
      ],
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  })
}
