import { z } from 'zod'

// Esquema para crear una factura
export const CreateInvoiceSchema = z.object({
  customerId: z.string().min(1, 'ID del cliente es requerido'),
  invoiceNumber: z.string().optional(), // Se genera automáticamente si no se proporciona
  subtotal: z.coerce
    .number()
    .min(0, 'El subtotal debe ser mayor o igual a 0')
    .multipleOf(0.01),
  tax: z.coerce
    .number()
    .min(0, 'El impuesto debe ser mayor o igual a 0')
    .multipleOf(0.01)
    .default(0),
  total: z.coerce
    .number()
    .min(0, 'El total debe ser mayor o igual a 0')
    .multipleOf(0.01),
  dueDate: z.coerce.date().optional(),
  notes: z.string().optional().or(z.literal('')),
  status: z
    .enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'])
    .default('DRAFT'),
})

// Esquema para actualizar una factura
export const UpdateInvoiceSchema = CreateInvoiceSchema.partial()

// Esquema para actualizar el estado de una factura
export const UpdateInvoiceStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']),
  notes: z.string().optional().or(z.literal('')),
})

// Esquema para registrar pago
export const RecordPaymentSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.01, 'El monto debe ser mayor a 0')
    .multipleOf(0.01),
  paymentDate: z.coerce.date().default(() => new Date()),
  paymentMethod: z
    .enum(['CASH', 'CARD', 'TRANSFER', 'CHECK', 'CREDIT'])
    .optional(),
  notes: z.string().optional().or(z.literal('')),
})

// Esquema para parámetros de consulta (filtros y paginación)
export const InvoiceQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']).optional(),
  customerId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  overdue: z.coerce.boolean().optional(), // Facturas vencidas
  sortBy: z
    .enum([
      'invoiceNumber',
      'total',
      'status',
      'dueDate',
      'createdAt',
      'updatedAt',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Esquema para respuesta de Invoice
export const InvoiceResponseSchema = z.object({
  id: z.string(),
  invoiceNumber: z.string(),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']),
  subtotal: z.number(),
  tax: z.number(),
  total: z.number(),
  dueDate: z.date().nullable(),
  paidDate: z.date().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tenantId: z.string(),
  customerId: z.string(),
  customer: z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string().nullable(),
      phone: z.string().nullable(),
    })
    .optional(),
})

// Esquema para respuesta paginada
export const PaginatedInvoicesSchema = z.object({
  data: z.array(InvoiceResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
})

// Esquema para estadísticas de facturas
export const InvoiceStatsSchema = z.object({
  totalInvoices: z.number(),
  totalRevenue: z.number(),
  totalOutstanding: z.number(),
  averageInvoiceValue: z.number(),
  invoicesByStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  overdueInvoices: z.number(),
  overdueAmount: z.number(),
  topCustomers: z.array(
    z.object({
      customerId: z.string(),
      customerName: z.string(),
      invoiceCount: z.number(),
      totalAmount: z.number(),
    })
  ),
})

// Tipos TypeScript derivados de los esquemas
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>
export type UpdateInvoiceStatusInput = z.infer<typeof UpdateInvoiceStatusSchema>
export type RecordPaymentInput = z.infer<typeof RecordPaymentSchema>
export type InvoiceQuery = z.infer<typeof InvoiceQuerySchema>
export type InvoiceResponse = z.infer<typeof InvoiceResponseSchema>
export type PaginatedInvoices = z.infer<typeof PaginatedInvoicesSchema>
export type InvoiceStats = z.infer<typeof InvoiceStatsSchema>
