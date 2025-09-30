import { PrismaClient, Customer } from '@prisma/client'
import {
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerQuery,
} from '@/lib/validations/customer'

const prisma = new PrismaClient()

export interface CustomerWithRelations extends Customer {
  _count?: {
    orders: number
    invoices: number
  }
}

export interface PaginationOptions {
  page: number
  limit: number
  total: number
}

/**
 * Crea un nuevo cliente en el sistema
 * @param data - Datos del cliente a crear
 * @param tenantId - ID del tenant al que pertenece el cliente
 * @returns Promise<Customer> - Cliente creado
 * @throws Error si el email ya existe en el tenant
 */
export async function createCustomer(
  data: CreateCustomerInput,
  tenantId: string
): Promise<Customer> {
  // Verificar que el email no exista en el tenant
  if (data.email && data.email.trim() !== '') {
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        email: data.email,
        tenantId,
      },
    })

    if (existingCustomer) {
      throw new Error('Ya existe un cliente con este email en el tenant')
    }
  }

  return prisma.customer.create({
    data: {
      ...data,
      tenantId,
    },
  })
}

/**
 * Obtiene un cliente por su ID
 * @param id - ID del cliente
 * @param tenantId - ID del tenant
 * @returns Promise<CustomerWithRelations | null> - Cliente encontrado o null si no existe
 */
export async function getCustomerById(
  id: string,
  tenantId: string
): Promise<CustomerWithRelations | null> {
  return prisma.customer.findFirst({
    where: {
      id,
      tenantId,
    },
    include: {
      _count: {
        select: {
          orders: true,
          invoices: true,
        },
      },
    },
  })
}

/**
 * Obtiene todos los clientes con filtros y paginación
 * @param query - Parámetros de consulta y filtros
 * @param tenantId - ID del tenant
 * @returns Promise con lista de clientes y información de paginación
 */
export async function getCustomers(
  query: CustomerQuery,
  tenantId: string
): Promise<{
  customers: CustomerWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  const { page, limit, search, isActive, sortBy, sortOrder } = query
  const skip = (page - 1) * limit

  // Construir filtros
  const where: any = {
    tenantId,
  }

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

  // Obtener total de registros
  const total = await prisma.customer.count({ where })

  // Obtener clientes con paginación
  const customers = await prisma.customer.findMany({
    where,
    include: {
      _count: {
        select: {
          orders: true,
          invoices: true,
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
    customers,
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

/**
 * Actualiza un cliente existente
 * @param id - ID del cliente a actualizar
 * @param data - Datos a actualizar
 * @param tenantId - ID del tenant
 * @returns Promise<Customer> - Cliente actualizado
 * @throws Error si el cliente no existe o el email ya existe en otro cliente
 */
export async function updateCustomer(
  id: string,
  data: UpdateCustomerInput,
  tenantId: string
): Promise<Customer> {
  // Verificar que el cliente existe y pertenece al tenant
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingCustomer) {
    throw new Error('Cliente no encontrado')
  }

  // Verificar que el email no exista en otro cliente del mismo tenant
  if (data.email && data.email.trim() !== '') {
    const emailExists = await prisma.customer.findFirst({
      where: {
        email: data.email,
        tenantId,
        id: { not: id },
      },
    })

    if (emailExists) {
      throw new Error('Ya existe otro cliente con este email en el tenant')
    }
  }

  return prisma.customer.update({
    where: { id },
    data,
  })
}

/**
 * Elimina un cliente del sistema
 * @param id - ID del cliente a eliminar
 * @param tenantId - ID del tenant
 * @returns Promise<Customer> - Cliente eliminado
 * @throws Error si el cliente no existe o tiene órdenes/facturas asociadas
 */
export async function deleteCustomer(
  id: string,
  tenantId: string
): Promise<Customer> {
  // Verificar que el cliente existe y pertenece al tenant
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingCustomer) {
    throw new Error('Cliente no encontrado')
  }

  // Verificar que no tenga órdenes o facturas asociadas
  const ordersCount = await prisma.order.count({
    where: {
      customerId: id,
    },
  })

  const invoicesCount = await prisma.invoice.count({
    where: {
      customerId: id,
    },
  })

  if (ordersCount > 0 || invoicesCount > 0) {
    throw new Error(
      'No se puede eliminar el cliente porque tiene órdenes o facturas asociadas'
    )
  }

  // Eliminar físicamente el cliente
  return prisma.customer.delete({
    where: { id },
  })
}

/**
 * Activa o desactiva un cliente
 * @param id - ID del cliente
 * @param tenantId - ID del tenant
 * @param isActive - Estado de activación
 * @returns Promise<Customer> - Cliente actualizado
 * @throws Error si el cliente no existe
 */
export async function toggleCustomerStatus(
  id: string,
  tenantId: string,
  isActive: boolean
): Promise<Customer> {
  // Verificar que el cliente existe y pertenece al tenant
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingCustomer) {
    throw new Error('Cliente no encontrado')
  }

  return prisma.customer.update({
    where: { id },
    data: { isActive },
  })
}

/**
 * Busca clientes por nombre o email para autocompletado
 * @param query - Término de búsqueda
 * @param tenantId - ID del tenant
 * @param limit - Límite de resultados (por defecto 10)
 * @returns Promise<Customer[]> - Lista de clientes encontrados
 */
export async function searchCustomers(
  query: string,
  tenantId: string,
  limit: number = 10
): Promise<Customer[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  return prisma.customer.findMany({
    where: {
      tenantId,
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      name: 'asc',
    },
    take: limit,
  })
}

/**
 * Obtiene estadísticas detalladas de clientes
 * @param tenantId - ID del tenant
 * @returns Promise con estadísticas completas de clientes
 */
export async function getCustomerStats(tenantId: string) {
  const [
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    newThisMonth,
    newThisWeek,
    customersByMonth,
    topCustomersByOrders,
    customersWithOrders,
    customersWithInvoices,
  ] = await Promise.all([
    // Total de clientes
    prisma.customer.count({ where: { tenantId } }),

    // Clientes activos
    prisma.customer.count({ where: { tenantId, isActive: true } }),

    // Clientes inactivos
    prisma.customer.count({ where: { tenantId, isActive: false } }),

    // Nuevos este mes
    prisma.customer.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),

    // Nuevos esta semana
    prisma.customer.count({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),

    // Clientes por mes (últimos 12 meses)
    prisma.customer.groupBy({
      by: ['createdAt'],
      where: {
        tenantId,
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        },
      },
      _count: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),

    // Top clientes por órdenes
    prisma.customer.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { orders: true },
        },
      },
      orderBy: {
        orders: { _count: 'desc' },
      },
      take: 5,
    }),

    // Clientes con órdenes
    prisma.customer.count({
      where: {
        tenantId,
        orders: { some: {} },
      },
    }),

    // Clientes con facturas
    prisma.customer.count({
      where: {
        tenantId,
        invoices: { some: {} },
      },
    }),
  ])

  // Calcular tasa de actividad
  const activityRate =
    totalCustomers > 0
      ? Math.round((activeCustomers / totalCustomers) * 100)
      : 0

  // Calcular tasa de conversión (clientes con órdenes)
  const conversionRate =
    totalCustomers > 0
      ? Math.round((customersWithOrders / totalCustomers) * 100)
      : 0

  // Procesar datos mensuales
  const monthlyData = customersByMonth.map(item => ({
    month: item.createdAt.toISOString().substring(0, 7),
    count: item._count.createdAt,
  }))

  return {
    totalCustomers,
    activeCustomers,
    inactiveCustomers,
    newThisMonth,
    newThisWeek,
    activityRate,
    conversionRate,
    customersWithOrders,
    customersWithInvoices,
    monthlyData,
    topCustomersByOrders: topCustomersByOrders.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      ordersCount: customer._count.orders,
      isActive: customer.isActive,
    })),
  }
}
