import { z } from 'zod'
import { CustomerCreateInputSchema } from '../../../lib/zod'

// Esquema para la dirección del cliente
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
})

// Esquema para crear un cliente - usando tipos autogenerados con validaciones personalizadas
export const CreateCustomerSchema = CustomerCreateInputSchema.omit({ 
  id: true, 
  tenantId: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre es demasiado largo'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: AddressSchema.optional(),
})

// Esquema para actualizar un cliente
export const UpdateCustomerSchema = CreateCustomerSchema.partial()

// Esquema para parámetros de consulta (filtros y paginación)
export const CustomerQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z
    .enum(['name', 'email', 'createdAt', 'updatedAt'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Esquema para respuesta de cliente
export const CustomerResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: AddressSchema.nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tenantId: z.string(),
})

// Esquema para respuesta paginada
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

// Tipos TypeScript derivados de los esquemas
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>
export type CustomerQuery = z.infer<typeof CustomerQuerySchema>
export type CustomerResponse = z.infer<typeof CustomerResponseSchema>
export type PaginatedCustomers = z.infer<typeof PaginatedCustomersSchema>
export type Address = z.infer<typeof AddressSchema>
