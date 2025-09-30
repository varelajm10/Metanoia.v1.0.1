import { z } from 'zod'

// Esquemas de validación para el módulo de facturación

// Método de pago
export const paymentMethodSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(
    ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CHECK', 'OTHER'],
    {
      errorMap: () => ({ message: 'Tipo de pago inválido' }),
    }
  ),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
  fees: z.number().min(0, 'Las comisiones no pueden ser negativas').default(0),
})

export const updatePaymentMethodSchema = paymentMethodSchema.partial()

// Pago
export const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'La factura es requerida'),
  paymentMethodId: z.string().min(1, 'El método de pago es requerido'),
  amount: z.number().positive('El monto debe ser positivo'),
  date: z.string().datetime('Fecha inválida'),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export const updatePaymentSchema = z.object({
  amount: z.number().positive().optional(),
  date: z.string().datetime().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

// Nota de crédito
export const creditNoteSchema = z.object({
  invoiceId: z.string().min(1, 'La factura es requerida'),
  reason: z.string().min(1, 'La razón es requerida'),
  date: z.string().datetime('Fecha inválida'),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'El producto es requerido'),
        quantity: z.number().int().positive('La cantidad debe ser positiva'),
        unitPrice: z.number().positive('El precio unitario debe ser positivo'),
        reason: z.string().optional(),
      })
    )
    .min(1, 'Debe incluir al menos un producto'),
})

export const updateCreditNoteSchema = z.object({
  status: z.enum(['DRAFT', 'APPROVED', 'CANCELLED']).optional(),
  reason: z.string().min(1).optional(),
  notes: z.string().optional(),
})

// Nota de débito
export const debitNoteSchema = z.object({
  customerId: z.string().min(1, 'El cliente es requerido'),
  reason: z.string().min(1, 'La razón es requerida'),
  date: z.string().datetime('Fecha inválida'),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'El producto es requerido'),
        quantity: z.number().int().positive('La cantidad debe ser positiva'),
        unitPrice: z.number().positive('El precio unitario debe ser positivo'),
        reason: z.string().optional(),
      })
    )
    .min(1, 'Debe incluir al menos un producto'),
})

export const updateDebitNoteSchema = z.object({
  status: z.enum(['DRAFT', 'APPROVED', 'CANCELLED']).optional(),
  reason: z.string().min(1).optional(),
  notes: z.string().optional(),
})

// Plantilla de factura
export const invoiceTemplateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  header: z.string().optional(),
  footer: z.string().optional(),
  logo: z.string().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export const updateInvoiceTemplateSchema = invoiceTemplateSchema.partial()

// Configuración de impuestos
export const taxConfigurationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  rate: z.number().min(0).max(100, 'La tasa debe estar entre 0 y 100'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
})

export const updateTaxConfigurationSchema = taxConfigurationSchema.partial()

// Filtros para métodos de pago
export const paymentMethodFiltersSchema = z.object({
  search: z.string().optional(),
  type: z
    .enum([
      'CASH',
      'CREDIT_CARD',
      'DEBIT_CARD',
      'BANK_TRANSFER',
      'CHECK',
      'OTHER',
    ])
    .optional(),
  isActive: z.boolean().optional(),
})

// Filtros para pagos
export const paymentFiltersSchema = z.object({
  search: z.string().optional(),
  invoiceId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para notas de crédito
export const creditNoteFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'APPROVED', 'CANCELLED']).optional(),
  invoiceId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para notas de débito
export const debitNoteFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'APPROVED', 'CANCELLED']).optional(),
  customerId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para plantillas
export const templateFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
})

// Filtros para configuración de impuestos
export const taxConfigFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
})

// Tipos TypeScript
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type UpdatePaymentMethod = z.infer<typeof updatePaymentMethodSchema>
export type Payment = z.infer<typeof paymentSchema>
export type UpdatePayment = z.infer<typeof updatePaymentSchema>
export type CreditNote = z.infer<typeof creditNoteSchema>
export type UpdateCreditNote = z.infer<typeof updateCreditNoteSchema>
export type DebitNote = z.infer<typeof debitNoteSchema>
export type UpdateDebitNote = z.infer<typeof updateDebitNoteSchema>
export type InvoiceTemplate = z.infer<typeof invoiceTemplateSchema>
export type UpdateInvoiceTemplate = z.infer<typeof updateInvoiceTemplateSchema>
export type TaxConfiguration = z.infer<typeof taxConfigurationSchema>
export type UpdateTaxConfiguration = z.infer<
  typeof updateTaxConfigurationSchema
>
export type PaymentMethodFilters = z.infer<typeof paymentMethodFiltersSchema>
export type PaymentFilters = z.infer<typeof paymentFiltersSchema>
export type CreditNoteFilters = z.infer<typeof creditNoteFiltersSchema>
export type DebitNoteFilters = z.infer<typeof debitNoteFiltersSchema>
export type TemplateFilters = z.infer<typeof templateFiltersSchema>
export type TaxConfigFilters = z.infer<typeof taxConfigFiltersSchema>
