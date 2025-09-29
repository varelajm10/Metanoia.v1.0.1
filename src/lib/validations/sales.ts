import { z } from 'zod'

// Esquemas de validación para el módulo de ventas

// Cotización
export const quoteSchema = z.object({
  customerId: z.string().min(1, 'El cliente es requerido'),
  validUntil: z.string().datetime('Fecha de vencimiento inválida'),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'El producto es requerido'),
    quantity: z.number().int().positive('La cantidad debe ser positiva'),
    unitPrice: z.number().positive('El precio unitario debe ser positivo'),
    discount: z.number().min(0).max(100, 'El descuento debe estar entre 0 y 100').default(0),
    notes: z.string().optional(),
  })).min(1, 'Debe incluir al menos un producto'),
})

export const updateQuoteSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED']).optional(),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
})

// Vendedor
export const salespersonSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  commission: z.number().min(0).max(100, 'La comisión debe estar entre 0 y 100').default(0),
  isActive: z.boolean().default(true),
})

export const updateSalespersonSchema = salespersonSchema.partial()

// Venta
export const saleSchema = z.object({
  customerId: z.string().min(1, 'El cliente es requerido'),
  salespersonId: z.string().min(1, 'El vendedor es requerido'),
  date: z.string().datetime('Fecha inválida'),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'El producto es requerido'),
    quantity: z.number().int().positive('La cantidad debe ser positiva'),
    unitPrice: z.number().positive('El precio unitario debe ser positivo'),
    discount: z.number().min(0).max(100, 'El descuento debe estar entre 0 y 100').default(0),
    notes: z.string().optional(),
  })).min(1, 'Debe incluir al menos un producto'),
})

export const updateSaleSchema = z.object({
  date: z.string().datetime().optional(),
  notes: z.string().optional(),
})

// Comisión
export const commissionSchema = z.object({
  salespersonId: z.string().min(1, 'El vendedor es requerido'),
  saleId: z.string().min(1, 'La venta es requerida'),
  amount: z.number().positive('El monto debe ser positivo'),
  rate: z.number().min(0).max(100, 'La tasa debe estar entre 0 y 100'),
  notes: z.string().optional(),
})

export const updateCommissionSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'PAID', 'CANCELLED']).optional(),
  amount: z.number().positive().optional(),
  rate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
})

// Descuento
export const discountSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['FIXED', 'PERCENTAGE', 'FREE_SHIPPING'], {
    errorMap: () => ({ message: 'Tipo de descuento inválido' }),
  }),
  value: z.number().positive('El valor debe ser positivo'),
  percentage: z.number().min(0).max(100, 'El porcentaje debe estar entre 0 y 100').optional(),
  minAmount: z.number().positive('El monto mínimo debe ser positivo').optional(),
  maxAmount: z.number().positive('El monto máximo debe ser positivo').optional(),
  startDate: z.string().datetime('Fecha de inicio inválida'),
  endDate: z.string().datetime('Fecha de fin inválida').optional(),
  isActive: z.boolean().default(true),
  usageLimit: z.number().int().positive('El límite de uso debe ser positivo').optional(),
  description: z.string().optional(),
})

export const updateDiscountSchema = discountSchema.partial()

// Filtros para cotizaciones
export const quoteFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED']).optional(),
  customerId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para vendedores
export const salespersonFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  minCommission: z.number().min(0).optional(),
  maxCommission: z.number().min(0).optional(),
})

// Filtros para ventas
export const saleFiltersSchema = z.object({
  search: z.string().optional(),
  customerId: z.string().optional(),
  salespersonId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para comisiones
export const commissionFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'PAID', 'CANCELLED']).optional(),
  salespersonId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para descuentos
export const discountFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['FIXED', 'PERCENTAGE', 'FREE_SHIPPING']).optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Tipos TypeScript
export type Quote = z.infer<typeof quoteSchema>
export type UpdateQuote = z.infer<typeof updateQuoteSchema>
export type Salesperson = z.infer<typeof salespersonSchema>
export type UpdateSalesperson = z.infer<typeof updateSalespersonSchema>
export type Sale = z.infer<typeof saleSchema>
export type UpdateSale = z.infer<typeof updateSaleSchema>
export type Commission = z.infer<typeof commissionSchema>
export type UpdateCommission = z.infer<typeof updateCommissionSchema>
export type Discount = z.infer<typeof discountSchema>
export type UpdateDiscount = z.infer<typeof updateDiscountSchema>
export type QuoteFilters = z.infer<typeof quoteFiltersSchema>
export type SalespersonFilters = z.infer<typeof salespersonFiltersSchema>
export type SaleFilters = z.infer<typeof saleFiltersSchema>
export type CommissionFilters = z.infer<typeof commissionFiltersSchema>
export type DiscountFilters = z.infer<typeof discountFiltersSchema>
