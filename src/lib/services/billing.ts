import { PrismaClient } from '@prisma/client'
import {
  PaymentMethod,
  Payment,
  CreditNote,
  DebitNote,
  InvoiceTemplate,
  TaxConfiguration,
  PaymentMethodFilters,
  PaymentFilters,
  CreditNoteFilters,
  DebitNoteFilters,
  TemplateFilters,
  TaxConfigFilters,
} from '@/lib/validations/billing'

const prisma = new PrismaClient()

export class BillingService {
  // ========================================
  // MÉTODOS DE PAGO
  // ========================================

  static async getPaymentMethods(
    tenantId: string,
    filters: PaymentMethodFilters = {},
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

    const [paymentMethods, total] = await Promise.all([
      prisma.paymentMethod.findMany({
        where,
        include: {
          _count: {
            select: {
              payments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.paymentMethod.count({ where }),
    ])

    return {
      paymentMethods,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }
  }

  static async createPaymentMethod(data: PaymentMethod, tenantId: string) {
    // Verificar nombre único
    const existingMethod = await prisma.paymentMethod.findFirst({
      where: { name: data.name, tenantId },
    })

    if (existingMethod) {
      throw new Error('Ya existe un método de pago con ese nombre')
    }

    return prisma.paymentMethod.create({
      data: { ...data, tenantId },
      include: {
        _count: {
          select: {
            payments: true,
          },
        },
      },
    })
  }

  // ========================================
  // PAGOS
  // ========================================

  static async getPayments(
    tenantId: string,
    filters: PaymentFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { reference: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
        {
          invoice: {
            invoiceNumber: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ]
    }

    if (filters.invoiceId) {
      where.invoiceId = filters.invoiceId
    }

    if (filters.paymentMethodId) {
      where.paymentMethodId = filters.paymentMethodId
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

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              total: true,
              status: true,
            },
          },
          paymentMethod: {
            select: {
              id: true,
              name: true,
              type: true,
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
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ])

    return { payments, total, page, limit, pages: Math.ceil(total / limit) }
  }

  static async createPayment(data: Payment, tenantId: string, userId: string) {
    // Verificar que la factura existe
    const invoice = await prisma.invoice.findFirst({
      where: { id: data.invoiceId, tenantId },
    })

    if (!invoice) {
      throw new Error('Factura no encontrada')
    }

    // Verificar que el método de pago existe
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id: data.paymentMethodId, tenantId, isActive: true },
    })

    if (!paymentMethod) {
      throw new Error('Método de pago no encontrado o inactivo')
    }

    // Verificar que el pago no exceda el monto pendiente
    const totalPaid = await prisma.payment.aggregate({
      where: { invoiceId: data.invoiceId },
      _sum: { amount: true },
    })

    const remainingAmount = invoice.total - (totalPaid._sum.amount || 0)

    if (data.amount > remainingAmount) {
      throw new Error('El pago excede el monto pendiente de la factura')
    }

    return prisma.payment.create({
      data: {
        ...data,
        date: new Date(data.date),
        tenantId,
        userId,
      },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
            status: true,
          },
        },
        paymentMethod: {
          select: {
            id: true,
            name: true,
            type: true,
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
      },
    })
  }

  // ========================================
  // NOTAS DE CRÉDITO
  // ========================================

  static async getCreditNotes(
    tenantId: string,
    filters: CreditNoteFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { creditNoteNumber: { contains: filters.search, mode: 'insensitive' } },
        { reason: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.invoiceId) {
      where.invoiceId = filters.invoiceId
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

    const [creditNotes, total] = await Promise.all([
      prisma.creditNote.findMany({
        where,
        include: {
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
              total: true,
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
          creditNoteItems: {
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
      prisma.creditNote.count({ where }),
    ])

    return { creditNotes, total, page, limit, pages: Math.ceil(total / limit) }
  }

  static async createCreditNote(
    data: CreditNote,
    tenantId: string,
    userId: string
  ) {
    // Verificar que la factura existe
    const invoice = await prisma.invoice.findFirst({
      where: { id: data.invoiceId, tenantId },
    })

    if (!invoice) {
      throw new Error('Factura no encontrada')
    }

    // Generar número de nota de crédito
    const creditNoteCount = await prisma.creditNote.count({
      where: { tenantId },
    })
    const creditNoteNumber = `CN-${String(creditNoteCount + 1).padStart(6, '0')}`

    // Calcular totales
    const subtotal = data.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice
    }, 0)

    const total = subtotal

    return prisma.creditNote.create({
      data: {
        creditNoteNumber,
        invoiceId: data.invoiceId,
        reason: data.reason,
        date: new Date(data.date),
        notes: data.notes,
        subtotal,
        total,
        tenantId,
        userId,
        creditNoteItems: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            reason: item.reason,
          })),
        },
      },
      include: {
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            total: true,
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
        creditNoteItems: {
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
    })
  }

  // ========================================
  // NOTAS DE DÉBITO
  // ========================================

  static async getDebitNotes(
    tenantId: string,
    filters: DebitNoteFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { debitNoteNumber: { contains: filters.search, mode: 'insensitive' } },
        { reason: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.customerId) {
      where.customerId = filters.customerId
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

    const [debitNotes, total] = await Promise.all([
      prisma.debitNote.findMany({
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
          debitNoteItems: {
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
      prisma.debitNote.count({ where }),
    ])

    return { debitNotes, total, page, limit, pages: Math.ceil(total / limit) }
  }

  static async createDebitNote(
    data: DebitNote,
    tenantId: string,
    userId: string
  ) {
    // Verificar que el cliente existe
    const customer = await prisma.customer.findFirst({
      where: { id: data.customerId, tenantId },
    })

    if (!customer) {
      throw new Error('Cliente no encontrado')
    }

    // Generar número de nota de débito
    const debitNoteCount = await prisma.debitNote.count({
      where: { tenantId },
    })
    const debitNoteNumber = `DN-${String(debitNoteCount + 1).padStart(6, '0')}`

    // Calcular totales
    const subtotal = data.items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice
    }, 0)

    const total = subtotal

    return prisma.debitNote.create({
      data: {
        debitNoteNumber,
        customerId: data.customerId,
        reason: data.reason,
        date: new Date(data.date),
        notes: data.notes,
        subtotal,
        total,
        tenantId,
        userId,
        debitNoteItems: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            reason: item.reason,
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
        debitNoteItems: {
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
    })
  }

  // ========================================
  // PLANTILLAS DE FACTURA
  // ========================================

  static async getInvoiceTemplates(
    tenantId: string,
    filters: TemplateFilters = {},
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

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.isDefault !== undefined) {
      where.isDefault = filters.isDefault
    }

    const [templates, total] = await Promise.all([
      prisma.invoiceTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoiceTemplate.count({ where }),
    ])

    return { templates, total, page, limit, pages: Math.ceil(total / limit) }
  }

  static async createInvoiceTemplate(data: InvoiceTemplate, tenantId: string) {
    // Verificar nombre único
    const existingTemplate = await prisma.invoiceTemplate.findFirst({
      where: { name: data.name, tenantId },
    })

    if (existingTemplate) {
      throw new Error('Ya existe una plantilla con ese nombre')
    }

    // Si se marca como predeterminada, desmarcar las otras
    if (data.isDefault) {
      await prisma.invoiceTemplate.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      })
    }

    return prisma.invoiceTemplate.create({
      data: { ...data, tenantId },
    })
  }

  // ========================================
  // CONFIGURACIÓN DE IMPUESTOS
  // ========================================

  static async getTaxConfigurations(
    tenantId: string,
    filters: TaxConfigFilters = {},
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

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.isDefault !== undefined) {
      where.isDefault = filters.isDefault
    }

    const [configurations, total] = await Promise.all([
      prisma.taxConfiguration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.taxConfiguration.count({ where }),
    ])

    return {
      configurations,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }
  }

  static async createTaxConfiguration(
    data: TaxConfiguration,
    tenantId: string
  ) {
    // Verificar nombre único
    const existingConfig = await prisma.taxConfiguration.findFirst({
      where: { name: data.name, tenantId },
    })

    if (existingConfig) {
      throw new Error('Ya existe una configuración de impuesto con ese nombre')
    }

    // Si se marca como predeterminada, desmarcar las otras
    if (data.isDefault) {
      await prisma.taxConfiguration.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      })
    }

    return prisma.taxConfiguration.create({
      data: { ...data, tenantId },
    })
  }

  // ========================================
  // DASHBOARD
  // ========================================

  static async getDashboardStats(tenantId: string) {
    const [
      totalPaymentMethods,
      activePaymentMethods,
      totalPayments,
      totalCreditNotes,
      approvedCreditNotes,
      totalDebitNotes,
      approvedDebitNotes,
      totalTemplates,
      activeTemplates,
      totalTaxConfigs,
      activeTaxConfigs,
    ] = await Promise.all([
      prisma.paymentMethod.count({ where: { tenantId } }),
      prisma.paymentMethod.count({ where: { tenantId, isActive: true } }),
      prisma.payment.count({ where: { tenantId } }),
      prisma.creditNote.count({ where: { tenantId } }),
      prisma.creditNote.count({ where: { tenantId, status: 'APPROVED' } }),
      prisma.debitNote.count({ where: { tenantId } }),
      prisma.debitNote.count({ where: { tenantId, status: 'APPROVED' } }),
      prisma.invoiceTemplate.count({ where: { tenantId } }),
      prisma.invoiceTemplate.count({ where: { tenantId, isActive: true } }),
      prisma.taxConfiguration.count({ where: { tenantId } }),
      prisma.taxConfiguration.count({ where: { tenantId, isActive: true } }),
    ])

    return {
      totalPaymentMethods,
      activePaymentMethods,
      totalPayments,
      totalCreditNotes,
      approvedCreditNotes,
      totalDebitNotes,
      approvedDebitNotes,
      totalTemplates,
      activeTemplates,
      totalTaxConfigs,
      activeTaxConfigs,
    }
  }
}
