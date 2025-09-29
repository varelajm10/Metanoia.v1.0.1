import { NextRequest } from 'next/server'
import {
  GET as GET_CUSTOMERS,
  POST as POST_CUSTOMERS,
} from '@/app/api/customers/route'
import {
  GET as GET_PRODUCTS,
  POST as POST_PRODUCTS,
} from '@/app/api/products/route'
import { GET as GET_ORDERS, POST as POST_ORDERS } from '@/app/api/orders/route'
import {
  GET as GET_INVOICES,
  POST as POST_INVOICES,
} from '@/app/api/invoices/route'

// Mock de servicios
jest.mock('@/lib/services/customer')
jest.mock('@/lib/services/product')
jest.mock('@/lib/services/order')
jest.mock('@/lib/services/invoice')
jest.mock('@/lib/middleware/auth')

import {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '@/lib/services/customer'
import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/lib/services/product'
import {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  cancelOrder,
} from '@/lib/services/order'
import {
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  cancelInvoice,
} from '@/lib/services/invoice'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'

const mockRequirePermission = requirePermission as jest.MockedFunction<
  typeof requirePermission
>
const mockGetTenantId = getTenantId as jest.MockedFunction<typeof getTenantId>

describe('API Integration Tests', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'ADMIN',
    tenantId: 'tenant-123',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequirePermission.mockResolvedValue({ error: null, user: mockUser })
    mockGetTenantId.mockReturnValue('tenant-123')
  })

  describe('API Endpoints Health Check', () => {
    it('debería responder correctamente a todas las APIs principales', async () => {
      // Mock de respuestas exitosas
      const mockCustomers = [
        {
          id: 'customer-123',
          name: 'Cliente Test',
          email: 'cliente@test.com',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tenantId: 'tenant-123',
        },
      ]

      const mockProducts = [
        {
          id: 'product-123',
          name: 'Producto Test',
          sku: 'TEST-001',
          price: 99.99,
          stock: 100,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          tenantId: 'tenant-123',
        },
      ]

      const mockOrders = [
        {
          id: 'order-123',
          orderNumber: 'ORD-001',
          status: 'PENDING',
          total: 1160.0,
          createdAt: new Date(),
          updatedAt: new Date(),
          tenantId: 'tenant-123',
          customerId: 'customer-123',
          userId: 'user-123',
        },
      ]

      const mockInvoices = [
        {
          id: 'invoice-123',
          invoiceNumber: 'INV-001',
          status: 'SENT',
          total: 1160.0,
          createdAt: new Date(),
          updatedAt: new Date(),
          tenantId: 'tenant-123',
          customerId: 'customer-123',
        },
      ]

      // Mock de servicios
      ;(getCustomers as jest.Mock).mockResolvedValue({
        customers: mockCustomers,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })
      ;(getProducts as jest.Mock).mockResolvedValue({
        products: mockProducts,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })
      ;(getOrders as jest.Mock).mockResolvedValue({
        orders: mockOrders,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })
      ;(getInvoices as jest.Mock).mockResolvedValue({
        invoices: mockInvoices,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })

      // Test Customers API
      const customersRequest = new NextRequest(
        'http://localhost:3000/api/customers'
      )
      const customersResponse = await GET_CUSTOMERS(customersRequest)
      const customersData = await customersResponse.json()

      expect(customersResponse.status).toBe(200)
      expect(customersData.success).toBe(true)
      expect(customersData.data).toHaveLength(1)

      // Test Products API
      const productsRequest = new NextRequest(
        'http://localhost:3000/api/products'
      )
      const productsResponse = await GET_PRODUCTS(productsRequest)
      const productsData = await productsResponse.json()

      expect(productsResponse.status).toBe(200)
      expect(productsData.success).toBe(true)
      expect(productsData.data).toHaveLength(1)

      // Test Orders API
      const ordersRequest = new NextRequest('http://localhost:3000/api/orders')
      const ordersResponse = await GET_ORDERS(ordersRequest)
      const ordersData = await ordersResponse.json()

      expect(ordersResponse.status).toBe(200)
      expect(ordersData.success).toBe(true)
      expect(ordersData.data).toHaveLength(1)

      // Test Invoices API
      const invoicesRequest = new NextRequest(
        'http://localhost:3000/api/invoices'
      )
      const invoicesResponse = await GET_INVOICES(invoicesRequest)
      const invoicesData = await invoicesResponse.json()

      expect(invoicesResponse.status).toBe(200)
      expect(invoicesData.success).toBe(true)
      expect(invoicesData.data).toHaveLength(1)
    })

    it('debería manejar errores de autenticación consistentemente', async () => {
      // Mock de error de autenticación
      mockRequirePermission.mockResolvedValue({
        error: {
          status: 401,
          json: () => Promise.resolve({ error: 'No autorizado' }),
        },
        user: null,
      })

      const request = new NextRequest('http://localhost:3000/api/customers')
      const response = await GET_CUSTOMERS(request)

      expect(response.status).toBe(401)
    })

    it('debería manejar errores de permisos consistentemente', async () => {
      // Mock de error de permisos
      mockRequirePermission.mockResolvedValue({
        error: {
          status: 403,
          json: () => Promise.resolve({ error: 'Permisos insuficientes' }),
        },
        user: null,
      })

      const request = new NextRequest('http://localhost:3000/api/customers')
      const response = await GET_CUSTOMERS(request)

      expect(response.status).toBe(403)
    })
  })

  describe('API Response Format Consistency', () => {
    it('debería mantener formato consistente en todas las respuestas exitosas', async () => {
      // Mock de respuestas exitosas
      const mockData = [{ id: 'test-123', name: 'Test' }]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      ;(getCustomers as jest.Mock).mockResolvedValue({
        customers: mockData,
        pagination: mockPagination,
      })
      ;(getProducts as jest.Mock).mockResolvedValue({
        products: mockData,
        pagination: mockPagination,
      })
      ;(getOrders as jest.Mock).mockResolvedValue({
        orders: mockData,
        pagination: mockPagination,
      })
      ;(getInvoices as jest.Mock).mockResolvedValue({
        invoices: mockData,
        pagination: mockPagination,
      })

      const apis = [
        { name: 'customers', handler: GET_CUSTOMERS },
        { name: 'products', handler: GET_PRODUCTS },
        { name: 'orders', handler: GET_ORDERS },
        { name: 'invoices', handler: GET_INVOICES },
      ]

      for (const api of apis) {
        const request = new NextRequest(`http://localhost:3000/api/${api.name}`)
        const response = await api.handler(request)
        const data = await response.json()

        // Verificar formato consistente
        expect(data).toHaveProperty('success', true)
        expect(data).toHaveProperty('data')
        expect(data).toHaveProperty('pagination')
        expect(data.pagination).toHaveProperty('page')
        expect(data.pagination).toHaveProperty('limit')
        expect(data.pagination).toHaveProperty('total')
        expect(data.pagination).toHaveProperty('totalPages')
        expect(data.pagination).toHaveProperty('hasNext')
        expect(data.pagination).toHaveProperty('hasPrev')
      }
    })

    it('debería mantener formato consistente en todas las respuestas de error', async () => {
      // Mock de error del servidor
      ;(getCustomers as jest.Mock).mockRejectedValue(
        new Error('Error del servidor')
      )

      const request = new NextRequest('http://localhost:3000/api/customers')
      const response = await GET_CUSTOMERS(request)
      const data = await response.json()

      // Verificar formato de error consistente
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('message')
      expect(response.status).toBe(500)
    })
  })

  describe('API Validation Consistency', () => {
    it('debería validar parámetros de query consistentemente', async () => {
      const invalidRequest = new NextRequest(
        'http://localhost:3000/api/customers?page=invalid'
      )
      const response = await GET_CUSTOMERS(invalidRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Parámetros de consulta inválidos')
      expect(data).toHaveProperty('details')
    })

    it('debería validar datos del cuerpo consistentemente', async () => {
      const invalidData = { name: '' } // nombre vacío
      const request = new NextRequest('http://localhost:3000/api/customers', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST_CUSTOMERS(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data).toHaveProperty('error', 'Datos inválidos')
      expect(data).toHaveProperty('details')
    })
  })

  describe('API Multi-tenancy', () => {
    it('debería aislar datos por tenant correctamente', async () => {
      const tenant1User = { ...mockUser, tenantId: 'tenant-1' }
      const tenant2User = { ...mockUser, tenantId: 'tenant-2' }

      // Mock para tenant 1
      mockRequirePermission.mockResolvedValueOnce({
        error: null,
        user: tenant1User,
      })
      mockGetTenantId.mockReturnValueOnce('tenant-1')
      ;(getCustomers as jest.Mock).mockResolvedValueOnce({
        customers: [{ id: 'customer-1', tenantId: 'tenant-1' }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })

      const request1 = new NextRequest('http://localhost:3000/api/customers')
      const response1 = await GET_CUSTOMERS(request1)
      const data1 = await response1.json()

      expect(data1.data[0].tenantId).toBe('tenant-1')

      // Mock para tenant 2
      mockRequirePermission.mockResolvedValueOnce({
        error: null,
        user: tenant2User,
      })
      mockGetTenantId.mockReturnValueOnce('tenant-2')
      ;(getCustomers as jest.Mock).mockResolvedValueOnce({
        customers: [{ id: 'customer-2', tenantId: 'tenant-2' }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      })

      const request2 = new NextRequest('http://localhost:3000/api/customers')
      const response2 = await GET_CUSTOMERS(request2)
      const data2 = await response2.json()

      expect(data2.data[0].tenantId).toBe('tenant-2')
    })
  })

  describe('API Performance', () => {
    it('debería responder dentro de un tiempo razonable', async () => {
      const startTime = Date.now()

      ;(getCustomers as jest.Mock).mockResolvedValue({
        customers: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      })

      const request = new NextRequest('http://localhost:3000/api/customers')
      const response = await GET_CUSTOMERS(request)

      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(1000) // Menos de 1 segundo
    })
  })
})
