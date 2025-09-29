import { z } from 'zod'

// Esquema para crear un producto
export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre es demasiado largo'),
  description: z.string().optional().or(z.literal('')),
  sku: z
    .string()
    .min(1, 'El SKU es requerido')
    .max(100, 'El SKU es demasiado largo'),
  price: z.coerce
    .number()
    .min(0, 'El precio debe ser mayor o igual a 0')
    .multipleOf(0.01),
  cost: z.coerce
    .number()
    .min(0, 'El costo debe ser mayor o igual a 0')
    .multipleOf(0.01)
    .optional(),
  stock: z.coerce
    .number()
    .int()
    .min(0, 'El stock debe ser mayor o igual a 0')
    .default(0),
  minStock: z.coerce
    .number()
    .int()
    .min(0, 'El stock mínimo debe ser mayor o igual a 0')
    .default(0),
  maxStock: z.coerce
    .number()
    .int()
    .min(0, 'El stock máximo debe ser mayor o igual a 0')
    .optional(),
  category: z.string().optional().or(z.literal('')),
  brand: z.string().optional().or(z.literal('')),
  weight: z.coerce
    .number()
    .min(0, 'El peso debe ser mayor o igual a 0')
    .optional(),
  dimensions: z
    .object({
      length: z.coerce
        .number()
        .min(0, 'La longitud debe ser mayor o igual a 0')
        .optional(),
      width: z.coerce
        .number()
        .min(0, 'El ancho debe ser mayor o igual a 0')
        .optional(),
      height: z.coerce
        .number()
        .min(0, 'La altura debe ser mayor o igual a 0')
        .optional(),
      unit: z.enum(['cm', 'in', 'm']).default('cm'),
    })
    .optional(),
  isActive: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

// Esquema para actualizar un producto
export const UpdateProductSchema = CreateProductSchema.partial()

// Esquema para actualización de stock
export const UpdateStockSchema = z.object({
  quantity: z.coerce.number().int('La cantidad debe ser un número entero'),
  reason: z
    .string()
    .min(1, 'La razón es requerida')
    .max(255, 'La razón es demasiado larga'),
  type: z.enum(['in', 'out', 'adjustment']),
  notes: z.string().optional().or(z.literal('')),
})

// Esquema para parámetros de consulta (filtros y paginación)
export const ProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  isDigital: z.coerce.boolean().optional(),
  lowStock: z.coerce.boolean().optional(), // Productos con stock bajo
  sortBy: z
    .enum(['name', 'sku', 'price', 'stock', 'createdAt', 'updatedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Esquema para respuesta de producto
export const ProductResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  sku: z.string(),
  price: z.number(),
  cost: z.number().nullable(),
  stock: z.number(),
  minStock: z.number(),
  maxStock: z.number().nullable(),
  category: z.string().nullable(),
  brand: z.string().nullable(),
  weight: z.number().nullable(),
  dimensions: z
    .object({
      length: z.number().nullable(),
      width: z.number().nullable(),
      height: z.number().nullable(),
      unit: z.string(),
    })
    .nullable(),
  isActive: z.boolean(),
  isDigital: z.boolean(),
  tags: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
  tenantId: z.string(),
})

// Esquema para respuesta paginada
export const PaginatedProductsSchema = z.object({
  data: z.array(ProductResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
})

// Esquema para estadísticas de stock
export const StockStatsSchema = z.object({
  totalProducts: z.number(),
  totalStock: z.number(),
  totalValue: z.number(),
  lowStockProducts: z.number(),
  outOfStockProducts: z.number(),
  categories: z.array(
    z.object({
      name: z.string(),
      count: z.number(),
      totalStock: z.number(),
    })
  ),
})

// Tipos TypeScript derivados de los esquemas
export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
export type UpdateStockInput = z.infer<typeof UpdateStockSchema>
export type ProductQuery = z.infer<typeof ProductQuerySchema>
export type ProductResponse = z.infer<typeof ProductResponseSchema>
export type PaginatedProducts = z.infer<typeof PaginatedProductsSchema>
export type StockStats = z.infer<typeof StockStatsSchema>
