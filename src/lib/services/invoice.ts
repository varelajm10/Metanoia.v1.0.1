import { PrismaClient, Invoice, InvoiceStatus } from '@prisma/client'
import {
  CreateInvoiceInput,
  UpdateInvoiceInput,
  UpdateInvoiceStatusInput,
  RecordPaymentInput,
  InvoiceQuery,
} from '@/lib/validations/invoice'

const prisma = new PrismaClient()

export interface InvoiceWithRelations extends Invoice {
  customer?: {
    id: string
    name: string
    email: string | null
    phone: string | null
  }
}

// Generar número de factura único
async function generateInvoiceNumber(tenantId: string): Promise<string> {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  const prefix = `INV-${year}${month}${day}`

  // Obtener el último número de factura del día
  const lastInvoice = await prisma.invoice.findFirst({
    where: {
      tenantId,
      invoiceNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      invoiceNumber: 'desc',
    },
  })

  let sequence = 1
  if (lastInvoice) {
    const lastSequence =
      parseInt(lastInvoice.invoiceNumber.split('-')[1].slice(8)) || 0
    sequence = lastSequence + 1
  }

  return `${prefix}-${String(sequence).padStart(4, '0')}`
}

// Crear una nueva factura
export async function createInvoice(
  data: CreateInvoiceInput,
  tenantId: string
): Promise<InvoiceWithRelations> {
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

  // Generar número de factura si no se proporciona
  const invoiceNumber =
    data.invoiceNumber || (await generateInvoiceNumber(tenantId))

  // Crear la factura
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      customerId: data.customerId,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      dueDate: data.dueDate,
      notes: data.notes,
      status: data.status,
      tenantId,
    } as any,
  })

  // Obtener la factura completa con relaciones
  return getInvoiceById(invoice.id, tenantId) as Promise<InvoiceWithRelations>
}

// Obtener factura por ID
export async function getInvoiceById(
  id: string,
  tenantId: string
): Promise<InvoiceWithRelations | null> {
  return prisma.invoice.findFirst({
    where: {
      id,
      tenantId,
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
  })
}

// Obtener todas las facturas con filtros y paginación
export async function getInvoices(
  query: InvoiceQuery,
  tenantId: string
): Promise<{
  invoices: InvoiceWithRelations[]
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
    customerId,
    dateFrom,
    dateTo,
    overdue,
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
      { invoiceNumber: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (status) {
    where.status = status
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

  // Filtrar facturas vencidas
  if (overdue) {
    where.AND = [{ status: { in: ['SENT'] } }, { dueDate: { lt: new Date() } }]
  }

  // Obtener total de registros
  const total = await prisma.invoice.count({ where })

  // Obtener facturas con paginación
  const invoices = await prisma.invoice.findMany({
    where,
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
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  })

  const totalPages = Math.ceil(total / limit)

  return {
    invoices,
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

// Actualizar factura
export async function updateInvoice(
  id: string,
  data: UpdateInvoiceInput,
  tenantId: string
): Promise<Invoice> {
  // Verificar que la factura existe y pertenece al tenant
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingInvoice) {
    throw new Error('Factura no encontrada')
  }

  // Verificar que no esté en estado final
  if (
    existingInvoice.status === 'PAID' ||
    existingInvoice.status === 'CANCELLED'
  ) {
    throw new Error('No se puede modificar una factura pagada o cancelada')
  }

  return prisma.invoice.update({
    where: { id },
    data,
  })
}

// Actualizar estado de la factura
export async function updateInvoiceStatus(
  id: string,
  statusUpdate: UpdateInvoiceStatusInput,
  tenantId: string
): Promise<Invoice> {
  // Verificar que la factura existe y pertenece al tenant
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingInvoice) {
    throw new Error('Factura no encontrada')
  }

  // Validar transiciones de estado
  const validTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
    DRAFT: ['SENT', 'CANCELLED'],
    SENT: ['PAID', 'OVERDUE', 'CANCELLED'],
    PAID: [], // Estado final
    OVERDUE: ['PAID', 'CANCELLED'],
    CANCELLED: [], // Estado final
  }

  if (!validTransitions[existingInvoice.status].includes(statusUpdate.status)) {
    throw new Error(
      `No se puede cambiar el estado de ${existingInvoice.status} a ${statusUpdate.status}`
    )
  }

  // Si se marca como pagada, establecer fecha de pago
  const updateData: any = {
    status: statusUpdate.status,
    notes: statusUpdate.notes,
  }

  if (statusUpdate.status === 'PAID' && existingInvoice.status !== 'PAID') {
    updateData.paidDate = new Date()
  }

  return prisma.invoice.update({
    where: { id },
    data: updateData,
  })
}

// Registrar pago de factura
export async function recordPayment(
  id: string,
  paymentData: RecordPaymentInput,
  tenantId: string
): Promise<Invoice> {
  // Verificar que la factura existe y pertenece al tenant
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingInvoice) {
    throw new Error('Factura no encontrada')
  }

  // Verificar que no esté cancelada
  if (existingInvoice.status === 'CANCELLED') {
    throw new Error('No se puede registrar pago en una factura cancelada')
  }

  // Verificar que el monto no exceda el total
  if (paymentData.amount > Number(existingInvoice.total)) {
    throw new Error('El monto del pago no puede exceder el total de la factura')
  }

  // Marcar como pagada si el monto es igual al total
  const newStatus =
    paymentData.amount >= Number(existingInvoice.total)
      ? 'PAID'
      : existingInvoice.status

  return prisma.invoice.update({
    where: { id },
    data: {
      status: newStatus,
      paidDate:
        newStatus === 'PAID'
          ? paymentData.paymentDate
          : existingInvoice.paidDate,
      notes: paymentData.notes
        ? `${existingInvoice.notes || ''}\nPago registrado: ${paymentData.notes}`.trim()
        : existingInvoice.notes,
    },
  })
}

// Cancelar factura
export async function cancelInvoice(
  id: string,
  tenantId: string,
  reason?: string
): Promise<Invoice> {
  // Verificar que la factura existe y pertenece al tenant
  const existingInvoice = await prisma.invoice.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingInvoice) {
    throw new Error('Factura no encontrada')
  }

  // Verificar que no esté en estado final
  if (
    existingInvoice.status === 'PAID' ||
    existingInvoice.status === 'CANCELLED'
  ) {
    throw new Error('No se puede cancelar una factura pagada o ya cancelada')
  }

  return prisma.invoice.update({
    where: { id },
    data: {
      status: 'CANCELLED',
      notes: reason
        ? `${existingInvoice.notes || ''}\nCancelada: ${reason}`.trim()
        : existingInvoice.notes,
    },
  })
}

// Obtener estadísticas de facturas
export async function getInvoiceStats(tenantId: string) {
  const [
    totalInvoices,
    totalRevenue,
    totalOutstanding,
    invoicesByStatus,
    overdueInvoices,
    overdueAmount,
    topCustomers,
  ] = await Promise.all([
    // Total de facturas
    prisma.invoice.count({
      where: { tenantId },
    }),

    // Revenue total (facturas pagadas)
    prisma.invoice.aggregate({
      where: { tenantId, status: 'PAID' },
      _sum: { total: true },
    }),

    // Total pendiente (facturas enviadas y vencidas)
    prisma.invoice.aggregate({
      where: {
        tenantId,
        status: { in: ['SENT', 'OVERDUE'] },
      },
      _sum: { total: true },
    }),

    // Facturas por estado
    prisma.invoice.groupBy({
      by: ['status'],
      where: { tenantId },
      _count: { id: true },
    }),

    // Facturas vencidas
    prisma.invoice.count({
      where: {
        tenantId,
        status: 'OVERDUE',
      },
    }),

    // Monto de facturas vencidas
    prisma.invoice.aggregate({
      where: {
        tenantId,
        status: 'OVERDUE',
      },
      _sum: { total: true },
    }),

    // Top clientes por facturación
    prisma.invoice.groupBy({
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
  ])

  // Calcular promedio de valor de factura
  const averageInvoiceValue =
    totalInvoices > 0 ? Number(totalRevenue._sum.total || 0) / totalInvoices : 0

  // Obtener nombres de clientes
  const customerIds = topCustomers.map(c => c.customerId)
  const customers = await prisma.customer.findMany({
    where: { id: { in: customerIds } },
    select: { id: true, name: true },
  })

  const customerMap = new Map(customers.map(c => [c.id, c.name]))

  return {
    totalInvoices,
    totalRevenue: totalRevenue._sum.total || 0,
    totalOutstanding: totalOutstanding._sum.total || 0,
    averageInvoiceValue,
    invoicesByStatus: invoicesByStatus.map(item => ({
      status: item.status,
      count: item._count.id,
      percentage:
        totalInvoices > 0 ? (item._count.id / totalInvoices) * 100 : 0,
    })),
    overdueInvoices,
    overdueAmount: overdueAmount._sum.total || 0,
    topCustomers: topCustomers.map(item => ({
      customerId: item.customerId,
      customerName: customerMap.get(item.customerId) || 'Cliente desconocido',
      invoiceCount: item._count.id,
      totalAmount: item._sum.total || 0,
    })),
  }
}

// Buscar facturas por número o cliente
export async function searchInvoices(
  query: string,
  tenantId: string,
  limit: number = 10
): Promise<Invoice[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  return prisma.invoice.findMany({
    where: {
      tenantId,
      OR: [
        { invoiceNumber: { contains: query, mode: 'insensitive' } },
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

// Obtener facturas vencidas
export async function getOverdueInvoices(
  tenantId: string,
  limit: number = 50
): Promise<Invoice[]> {
  return prisma.invoice.findMany({
    where: {
      tenantId,
      status: { in: ['SENT'] },
      dueDate: { lt: new Date() },
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
      dueDate: 'asc',
    },
    take: limit,
  })
}
