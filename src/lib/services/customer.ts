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

// Crear un nuevo cliente
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

// Obtener cliente por ID
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

// Obtener todos los clientes con filtros y paginación
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

// Actualizar cliente
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

// Eliminar cliente (soft delete)
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

// Activar/desactivar cliente
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

// Buscar clientes por nombre o email (para autocompletado)
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
