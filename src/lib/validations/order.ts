import { z } from 'zod'

// Esquema para OrderItem (línea de pedido)
export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'ID del producto es requerido'),
  quantity: z.coerce.number().int().min(1, 'La cantidad debe ser al menos 1'),
  unitPrice: z.coerce
    .number()
    .min(0, 'El precio unitario debe ser mayor o igual a 0')
    .multipleOf(0.01),
  discount: z.coerce
    .number()
    .min(0, 'El descuento debe ser mayor o igual a 0')
    .max(100, 'El descuento no puede ser mayor a 100%')
    .default(0),
  notes: z.string().optional().or(z.literal('')),
})

// Esquema para crear una orden
export const CreateOrderSchema = z.object({
  customerId: z.string().min(1, 'ID del cliente es requerido'),
  orderNumber: z.string().optional(), // Se genera automáticamente si no se proporciona
  items: z
    .array(OrderItemSchema)
    .min(1, 'La orden debe tener al menos un producto'),
  subtotal: z.coerce
    .number()
    .min(0, 'El subtotal debe ser mayor o igual a 0')
    .multipleOf(0.01),
  taxRate: z.coerce
    .number()
    .min(0, 'La tasa de impuesto debe ser mayor o igual a 0')
    .max(100, 'La tasa de impuesto no puede ser mayor a 100%')
    .default(16),
  taxAmount: z.coerce
    .number()
    .min(0, 'El monto de impuesto debe ser mayor o igual a 0')
    .multipleOf(0.01),
  discountAmount: z.coerce
    .number()
    .min(0, 'El descuento debe ser mayor o igual a 0')
    .multipleOf(0.01)
    .default(0),
  total: z.coerce
    .number()
    .min(0, 'El total debe ser mayor o igual a 0')
    .multipleOf(0.01),
  status: z
    .enum([
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ])
    .default('PENDING'),
  paymentMethod: z
    .enum(['CASH', 'CARD', 'TRANSFER', 'CHECK', 'CREDIT'])
    .optional(),
  paymentStatus: z
    .enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED'])
    .default('PENDING'),
  shippingAddress: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  notes: z.string().optional().or(z.literal('')),
  expectedDeliveryDate: z.coerce.date().optional(),
})

// Esquema para actualizar una orden
export const UpdateOrderSchema = CreateOrderSchema.partial().omit({
  items: true,
})

// Esquema para actualizar el estado de una orden
export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
  notes: z.string().optional().or(z.literal('')),
})

// Esquema para actualizar el estado de pago
export const UpdatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED']),
  paymentMethod: z
    .enum(['CASH', 'CARD', 'TRANSFER', 'CHECK', 'CREDIT'])
    .optional(),
  notes: z.string().optional().or(z.literal('')),
})

// Esquema para parámetros de consulta (filtros y paginación)
export const OrderQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z
    .enum([
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ])
    .optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED']).optional(),
  customerId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z
    .enum(['orderNumber', 'total', 'status', 'createdAt', 'updatedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Esquema para respuesta de OrderItem
export const OrderItemResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  discount: z.number(),
  total: z.number(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: z
    .object({
      id: z.string(),
      name: z.string(),
      sku: z.string().nullable(),
      price: z.number(),
    })
    .optional(),
})

// Esquema para respuesta de Order
export const OrderResponseSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerId: z.string(),
  subtotal: z.number(),
  taxRate: z.number(),
  taxAmount: z.number(),
  discountAmount: z.number(),
  total: z.number(),
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ]),
  paymentMethod: z
    .enum(['CASH', 'CARD', 'TRANSFER', 'CHECK', 'CREDIT'])
    .nullable(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'PARTIAL', 'REFUNDED']),
  shippingAddress: z
    .object({
      street: z.string().nullable(),
      city: z.string().nullable(),
      state: z.string().nullable(),
      zipCode: z.string().nullable(),
      country: z.string().nullable(),
    })
    .nullable(),
  notes: z.string().nullable(),
  expectedDeliveryDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tenantId: z.string(),
  items: z.array(OrderItemResponseSchema).optional(),
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
export const PaginatedOrdersSchema = z.object({
  data: z.array(OrderResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
})

// Esquema para estadísticas de órdenes
export const OrderStatsSchema = z.object({
  totalOrders: z.number(),
  totalRevenue: z.number(),
  averageOrderValue: z.number(),
  ordersByStatus: z.array(
    z.object({
      status: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  ordersByPaymentStatus: z.array(
    z.object({
      paymentStatus: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  topCustomers: z.array(
    z.object({
      customerId: z.string(),
      customerName: z.string(),
      orderCount: z.number(),
      totalSpent: z.number(),
    })
  ),
  topProducts: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      quantitySold: z.number(),
      revenue: z.number(),
    })
  ),
})

// Tipos TypeScript derivados de los esquemas
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>
export type UpdatePaymentStatusInput = z.infer<typeof UpdatePaymentStatusSchema>
export type OrderQuery = z.infer<typeof OrderQuerySchema>
export type OrderResponse = z.infer<typeof OrderResponseSchema>
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>
export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>
export type OrderStats = z.infer<typeof OrderStatsSchema>
export type OrderItemInput = z.infer<typeof OrderItemSchema>
