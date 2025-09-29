// Utilidades para tests
import { NextRequest } from 'next/server'

// Tipos para mocks
export interface MockUser {
  id: string
  email: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'USER'
  tenantId: string
}

export interface MockCustomer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  tenantId: string
  _count?: {
    orders: number
    invoices: number
  }
}

export interface MockProduct {
  id: string
  name: string
  description: string | null
  sku: string
  price: number
  cost: number | null
  stock: number
  minStock: number
  maxStock: number | null
  category: string | null
  brand: string | null
  weight: number | null
  dimensions: any
  isActive: boolean
  isDigital: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
  tenantId: string
  _count?: {
    orderItems: number
  }
}

export interface MockOrder {
  id: string
  orderNumber: string
  status: string
  subtotal: number
  taxRate: number
  taxAmount: number
  discountAmount: number
  total: number
  paymentMethod: string | null
  paymentStatus: string
  shippingAddress: any
  notes: string | null
  expectedDeliveryDate: Date | null
  createdAt: Date
  updatedAt: Date
  tenantId: string
  customerId: string
  userId: string
  orderItems?: any[]
  customer?: any
  _count?: {
    orderItems: number
  }
}

export interface MockInvoice {
  id: string
  invoiceNumber: string
  status: string
  subtotal: number
  tax: number
  total: number
  dueDate: Date | null
  paidDate: Date | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
  tenantId: string
  customerId: string
  customer?: any
}

// Datos de prueba por defecto
export const defaultMockUser: MockUser = {
  id: 'user-123',
  email: 'test@example.com',
  role: 'ADMIN',
  tenantId: 'tenant-123',
}

export const defaultMockCustomer: MockCustomer = {
  id: 'customer-123',
  name: 'Cliente Test',
  email: 'cliente@test.com',
  phone: '+52 55 1234 5678',
  address: {
    street: 'Calle Test 123',
    city: 'Ciudad Test',
    state: 'Estado Test',
    zipCode: '12345',
    country: 'México',
  },
  isActive: true,
  createdAt: new Date('2025-09-23T00:00:00.000Z'),
  updatedAt: new Date('2025-09-23T00:00:00.000Z'),
  tenantId: 'tenant-123',
  _count: {
    orders: 5,
    invoices: 3,
  },
}

export const defaultMockProduct: MockProduct = {
  id: 'product-123',
  name: 'Producto Test',
  description: 'Descripción del producto',
  sku: 'TEST-001',
  price: 99.99,
  cost: 50.0,
  stock: 100,
  minStock: 10,
  maxStock: 500,
  category: 'Electrónicos',
  brand: 'TechCorp',
  weight: 1.5,
  dimensions: {
    length: 20,
    width: 15,
    height: 5,
    unit: 'cm',
  },
  isActive: true,
  isDigital: false,
  tags: ['tecnología', 'gadgets'],
  createdAt: new Date('2025-09-23T00:00:00.000Z'),
  updatedAt: new Date('2025-09-23T00:00:00.000Z'),
  tenantId: 'tenant-123',
  _count: {
    orderItems: 15,
  },
}

export const defaultMockOrder: MockOrder = {
  id: 'order-123',
  orderNumber: 'ORD-20250923-0001',
  status: 'PENDING',
  subtotal: 1000.0,
  taxRate: 16,
  taxAmount: 160.0,
  discountAmount: 0,
  total: 1160.0,
  paymentMethod: 'CARD',
  paymentStatus: 'PENDING',
  shippingAddress: {
    street: 'Calle Test 123',
    city: 'Ciudad Test',
    state: 'Estado Test',
    zipCode: '12345',
    country: 'México',
  },
  notes: 'Orden de prueba',
  expectedDeliveryDate: new Date('2025-09-25T00:00:00.000Z'),
  createdAt: new Date('2025-09-23T00:00:00.000Z'),
  updatedAt: new Date('2025-09-23T00:00:00.000Z'),
  tenantId: 'tenant-123',
  customerId: 'customer-123',
  userId: 'user-123',
  orderItems: [
    {
      id: 'item-123',
      quantity: 2,
      unitPrice: 500.0,
      discount: 0,
      total: 1000.0,
      notes: 'Producto test',
      createdAt: new Date('2025-09-23T00:00:00.000Z'),
      updatedAt: new Date('2025-09-23T00:00:00.000Z'),
      orderId: 'order-123',
      productId: 'product-123',
      product: {
        id: 'product-123',
        name: 'Producto Test',
        sku: 'TEST-001',
        price: 500.0,
      },
    },
  ],
  customer: {
    id: 'customer-123',
    name: 'Cliente Test',
    email: 'cliente@test.com',
    phone: '+52 55 1234 5678',
  },
  _count: {
    orderItems: 1,
  },
}

export const defaultMockInvoice: MockInvoice = {
  id: 'invoice-123',
  invoiceNumber: 'INV-20250923-0001',
  status: 'SENT',
  subtotal: 1000.0,
  tax: 160.0,
  total: 1160.0,
  dueDate: new Date('2025-10-23T00:00:00.000Z'),
  paidDate: null,
  notes: 'Factura por servicios prestados',
  createdAt: new Date('2025-09-23T00:00:00.000Z'),
  updatedAt: new Date('2025-09-23T00:00:00.000Z'),
  tenantId: 'tenant-123',
  customerId: 'customer-123',
  customer: {
    id: 'customer-123',
    name: 'Cliente Test',
    email: 'cliente@test.com',
    phone: '+52 55 1234 5678',
  },
}

// Utilidades para crear requests de prueba
export const createMockRequest = (
  url: string,
  options: {
    method?: string
    body?: any
    headers?: Record<string, string>
  } = {}
): NextRequest => {
  const { method = 'GET', body, headers = {} } = options

  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    requestInit.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  return new NextRequest(url, requestInit)
}

// Utilidades para crear respuestas de paginación
export const createMockPagination = (
  page: number = 1,
  limit: number = 10,
  total: number = 1
) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
})

// Utilidades para crear respuestas de error
export const createMockErrorResponse = (
  status: number,
  error: string,
  message?: string
) => ({
  status,
  json: () =>
    Promise.resolve({
      error,
      message,
    }),
})

// Utilidades para validar respuestas de API
export const expectApiSuccess = (response: any, expectedData?: any) => {
  expect(response.status).toBe(200)
  expect(response.json().success).toBe(true)
  if (expectedData) {
    expect(response.json().data).toEqual(expectedData)
  }
}

export const expectApiError = (
  response: any,
  expectedStatus: number,
  expectedError?: string
) => {
  expect(response.status).toBe(expectedStatus)
  if (expectedError) {
    expect(response.json().error).toBe(expectedError)
  }
}

// Utilidades para crear datos de prueba personalizados
export const createMockCustomer = (
  overrides: Partial<MockCustomer> = {}
): MockCustomer => ({
  ...defaultMockCustomer,
  ...overrides,
})

export const createMockProduct = (
  overrides: Partial<MockProduct> = {}
): MockProduct => ({
  ...defaultMockProduct,
  ...overrides,
})

export const createMockOrder = (
  overrides: Partial<MockOrder> = {}
): MockOrder => ({
  ...defaultMockOrder,
  ...overrides,
})

export const createMockInvoice = (
  overrides: Partial<MockInvoice> = {}
): MockInvoice => ({
  ...defaultMockInvoice,
  ...overrides,
})

// Utilidades para simular errores de base de datos
export const mockDatabaseError = (message: string) => {
  const error = new Error(message)
  error.name = 'PrismaClientKnownRequestError'
  return error
}

// Utilidades para simular errores de validación
export const mockValidationError = (field: string, message: string) => ({
  code: 'invalid_type',
  expected: 'string',
  received: 'undefined',
  path: [field],
  message,
})

// Utilidades para simular errores de permisos
export const mockPermissionError = (
  requiredRole: string,
  currentRole: string
) => ({
  status: 403,
  json: () =>
    Promise.resolve({
      error: 'Permisos insuficientes',
      message: `No tienes permisos para esta acción`,
      requiredRole,
      currentRole,
    }),
})

// Utilidades para simular errores de autenticación
export const mockAuthError = () => ({
  status: 401,
  json: () =>
    Promise.resolve({
      error: 'No autorizado - Token requerido',
    }),
})

// Utilidades para simular errores de recurso no encontrado
export const mockNotFoundError = (resource: string) => ({
  status: 404,
  json: () =>
    Promise.resolve({
      error: `${resource} no encontrado`,
    }),
})

// Utilidades para simular errores de conflicto
export const mockConflictError = (message: string) => ({
  status: 409,
  json: () =>
    Promise.resolve({
      error: 'Error de validación',
      message,
    }),
})

// Utilidades para simular errores del servidor
export const mockServerError = (message: string) => ({
  status: 500,
  json: () =>
    Promise.resolve({
      error: 'Error interno del servidor',
      message,
    }),
})
