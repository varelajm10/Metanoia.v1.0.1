import { z } from 'zod'
import { 
  ProductCreateInputSchema, 
  ProductUpdateInputSchema,
  CustomerCreateInputSchema,
  CustomerUpdateInputSchema,
  ProductSchema,
  CustomerSchema
} from '../../../lib/zod'

// ========================================
// EJEMPLOS DE USO DE ESQUEMAS AUTOGENERADOS
// ========================================

// 1. ESQUEMAS BÁSICOS - Usando directamente los esquemas autogenerados
export const BasicProductCreateSchema = ProductCreateInputSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true
})

export const BasicProductUpdateSchema = ProductUpdateInputSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true
})

export const BasicCustomerCreateSchema = CustomerCreateInputSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true
})

export const BasicCustomerUpdateSchema = CustomerUpdateInputSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true
})

// 2. ESQUEMAS CON VALIDACIONES PERSONALIZADAS
export const EnhancedProductCreateSchema = BasicProductCreateSchema.extend({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Nombre demasiado largo'),
  sku: z.string().min(1, 'SKU requerido').max(100, 'SKU demasiado largo'),
  price: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0').multipleOf(0.01),
  cost: z.coerce.number().min(0, 'El costo debe ser mayor o igual a 0').multipleOf(0.01).optional(),
  stock: z.coerce.number().int().min(0, 'El stock debe ser mayor o igual a 0').default(0),
  minStock: z.coerce.number().int().min(0, 'El stock mínimo debe ser mayor o igual a 0').default(0),
  maxStock: z.coerce.number().int().min(0, 'El stock máximo debe ser mayor o igual a 0').optional(),
  weight: z.coerce.number().min(0, 'El peso debe ser mayor o igual a 0').optional(),
  dimensions: z.object({
    length: z.coerce.number().min(0, 'La longitud debe ser mayor o igual a 0').optional(),
    width: z.coerce.number().min(0, 'El ancho debe ser mayor o igual a 0').optional(),
    height: z.coerce.number().min(0, 'La altura debe ser mayor o igual a 0').optional(),
    unit: z.enum(['cm', 'in', 'm']).default('cm'),
  }).optional(),
})

export const EnhancedCustomerCreateSchema = BasicCustomerCreateSchema.extend({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Nombre demasiado largo'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
})

// 3. ESQUEMAS DE RESPUESTA - Usando los esquemas base autogenerados
export const ProductResponseSchema = ProductSchema
export const CustomerResponseSchema = CustomerSchema

// 4. ESQUEMAS DE CONSULTA - Combinando esquemas autogenerados con lógica de negocio
export const ProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  isDigital: z.coerce.boolean().optional(),
  lowStock: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'sku', 'price', 'stock', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const CustomerQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// 5. ESQUEMAS DE RESPUESTA PAGINADA
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

export const PaginatedCustomersSchema = z.object({
  data: z.array(CustomerResponseSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
})

// 6. ESQUEMAS ESPECIALIZADOS - Usando pick() para seleccionar campos específicos
export const ProductSummarySchema = ProductSchema.pick({
  id: true,
  name: true,
  sku: true,
  price: true,
  stock: true,
  isActive: true,
})

export const CustomerSummarySchema = CustomerSchema.pick({
  id: true,
  name: true,
  email: true,
  phone: true,
  isActive: true,
})

// 7. ESQUEMAS DE ESTADÍSTICAS
export const ProductStatsSchema = z.object({
  totalProducts: z.number(),
  totalStock: z.number(),
  totalValue: z.number(),
  lowStockProducts: z.number(),
  outOfStockProducts: z.number(),
  categories: z.array(z.object({
    name: z.string(),
    count: z.number(),
    totalStock: z.number(),
  })),
})

// 8. TIPOS DERIVADOS
export type BasicProductCreateInput = z.infer<typeof BasicProductCreateSchema>
export type BasicProductUpdateInput = z.infer<typeof BasicProductUpdateSchema>
export type BasicCustomerCreateInput = z.infer<typeof BasicCustomerCreateSchema>
export type BasicCustomerUpdateInput = z.infer<typeof BasicCustomerUpdateSchema>

export type EnhancedProductCreateInput = z.infer<typeof EnhancedProductCreateSchema>
export type EnhancedCustomerCreateInput = z.infer<typeof EnhancedCustomerCreateSchema>

export type ProductResponse = z.infer<typeof ProductResponseSchema>
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>

export type ProductQuery = z.infer<typeof ProductQuerySchema>
export type CustomerQuery = z.infer<typeof CustomerQuerySchema>

export type PaginatedProducts = z.infer<typeof PaginatedProductsSchema>
export type PaginatedCustomers = z.infer<typeof PaginatedCustomersSchema>

export type ProductSummary = z.infer<typeof ProductSummarySchema>
export type CustomerSummary = z.infer<typeof CustomerSummarySchema>

export type ProductStats = z.infer<typeof ProductStatsSchema>

// ========================================
// VENTAJAS DE USAR ESQUEMAS AUTOGENERADOS
// ========================================

/*
1. SINCRONIZACIÓN AUTOMÁTICA: Los esquemas siempre están sincronizados con la base de datos
2. TIPADO FUERTE: TypeScript infiere automáticamente los tipos correctos
3. MANTENIMIENTO REDUCIDO: No necesitas mantener manualmente los esquemas
4. CONSISTENCIA: Garantiza que los esquemas coincidan exactamente con el modelo de Prisma
5. REFACTORING SEGURO: Los cambios en el schema de Prisma se reflejan automáticamente
6. VALIDACIÓN COMPLETA: Incluye todas las validaciones de Prisma (cuid, email, etc.)
7. FLEXIBILIDAD: Puedes extender, omitir o modificar los esquemas según tus necesidades
8. REUTILIZACIÓN: Los mismos esquemas se pueden usar en diferentes contextos
*/
