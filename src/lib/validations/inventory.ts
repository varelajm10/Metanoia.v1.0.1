import { z } from 'zod'

// Esquemas de validación para el módulo de inventario

// Producto
export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo'),
  cost: z.number().positive('El costo debe ser positivo').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').default(0),
  minStock: z
    .number()
    .int()
    .min(0, 'El stock mínimo no puede ser negativo')
    .default(0),
  maxStock: z
    .number()
    .int()
    .positive('El stock máximo debe ser positivo')
    .optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  weight: z.number().positive('El peso debe ser positivo').optional(),
  dimensions: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
  isActive: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

export const updateProductSchema = productSchema.partial()

// Proveedor
export const supplierSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    })
    .optional(),
  contactName: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z
    .number()
    .int()
    .min(0, 'Los términos de pago no pueden ser negativos')
    .optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
})

export const updateSupplierSchema = supplierSchema.partial()

// Orden de compra
export const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'El proveedor es requerido'),
  expectedDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'El producto es requerido'),
        quantity: z.number().int().positive('La cantidad debe ser positiva'),
        unitPrice: z.number().positive('El precio unitario debe ser positivo'),
        discount: z
          .number()
          .min(0)
          .max(100, 'El descuento debe estar entre 0 y 100')
          .default(0),
        notes: z.string().optional(),
      })
    )
    .min(1, 'Debe incluir al menos un producto'),
})

export const updatePurchaseOrderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'RECEIVED', 'CANCELLED']).optional(),
  expectedDate: z.string().datetime().optional(),
  receivedDate: z.string().datetime().optional(),
  notes: z.string().optional(),
})

// Movimiento de stock
export const stockMovementSchema = z.object({
  productId: z.string().min(1, 'El producto es requerido'),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER'], {
    errorMap: () => ({ message: 'Tipo de movimiento inválido' }),
  }),
  quantity: z.number().int().positive('La cantidad debe ser positiva'),
  reason: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

// Imagen de producto
export const productImageSchema = z.object({
  url: z.string().url('URL inválida'),
  alt: z.string().optional(),
  isPrimary: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
})

// Variante de producto
export const productVariantSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  value: z.string().min(1, 'El valor es requerido'),
  sku: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').default(0),
  isActive: z.boolean().default(true),
})

// Relación proveedor-producto
export const supplierProductSchema = z.object({
  supplierId: z.string().min(1, 'El proveedor es requerido'),
  productId: z.string().min(1, 'El producto es requerido'),
  supplierSku: z.string().optional(),
  cost: z.number().positive('El costo debe ser positivo'),
  minOrder: z
    .number()
    .int()
    .positive('La orden mínima debe ser positiva')
    .optional(),
  leadTime: z
    .number()
    .int()
    .min(0, 'El tiempo de entrega no puede ser negativo')
    .optional(),
  isActive: z.boolean().default(true),
})

// Filtros para productos
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  isActive: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minStock: z.number().int().min(0).optional(),
  maxStock: z.number().int().min(0).optional(),
})

// Filtros para proveedores
export const supplierFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  paymentTerms: z.number().int().min(0).optional(),
})

// Filtros para órdenes de compra
export const purchaseOrderFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'RECEIVED', 'CANCELLED']).optional(),
  supplierId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para movimientos de stock
export const stockMovementFiltersSchema = z.object({
  productId: z.string().optional(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para alertas
export const alertFiltersSchema = z.object({
  type: z
    .enum(['LOW_STOCK', 'OUT_OF_STOCK', 'OVERSTOCK', 'EXPIRING', 'EXPIRED'])
    .optional(),
  isActive: z.boolean().optional(),
  productId: z.string().optional(),
})

// Tipos TypeScript
export type Product = z.infer<typeof productSchema>
export type UpdateProduct = z.infer<typeof updateProductSchema>
export type Supplier = z.infer<typeof supplierSchema>
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>
export type PurchaseOrder = z.infer<typeof purchaseOrderSchema>
export type UpdatePurchaseOrder = z.infer<typeof updatePurchaseOrderSchema>
export type StockMovement = z.infer<typeof stockMovementSchema>
export type ProductImage = z.infer<typeof productImageSchema>
export type ProductVariant = z.infer<typeof productVariantSchema>
export type SupplierProduct = z.infer<typeof supplierProductSchema>
export type ProductFilters = z.infer<typeof productFiltersSchema>
export type SupplierFilters = z.infer<typeof supplierFiltersSchema>
export type PurchaseOrderFilters = z.infer<typeof purchaseOrderFiltersSchema>
export type StockMovementFilters = z.infer<typeof stockMovementFiltersSchema>
export type AlertFilters = z.infer<typeof alertFiltersSchema>
