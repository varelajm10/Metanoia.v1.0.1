import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/orders/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/orders/[id]/route'
import { PATCH as UPDATE_STATUS } from '@/app/api/orders/[id]/status/route'
import { PATCH as UPDATE_PAYMENT } from '@/app/api/orders/[id]/payment/route'
import { GET as SEARCH } from '@/app/api/orders/search/route'
import { GET as GET_STATS } from '@/app/api/orders/stats/route'

// Mock de Prisma
jest.mock('@/lib/services/order', () => ({
  getOrders: jest.fn(),
  createOrder: jest.fn(),
  getOrderById: jest.fn(),
  updateOrder: jest.fn(),
  cancelOrder: jest.fn(),
  updateOrderStatus: jest.fn(),
  updatePaymentStatus: jest.fn(),
  searchOrders: jest.fn(),
  getOrderStats: jest.fn(),
}))

// Mock de middleware de autenticación
jest.mock('@/lib/middleware/auth', () => ({
  requirePermission: jest.fn(),
  getTenantId: jest.fn(),
}))

import {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  searchOrders,
  getOrderStats,
} from '@/lib/services/order'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'

const mockGetOrders = getOrders as jest.MockedFunction<typeof getOrders>
const mockCreateOrder = createOrder as jest.MockedFunction<typeof createOrder>
const mockGetOrderById = getOrderById as jest.MockedFunction<
  typeof getOrderById
>
const mockUpdateOrder = updateOrder as jest.MockedFunction<typeof updateOrder>
const mockCancelOrder = cancelOrder as jest.MockedFunction<typeof cancelOrder>
const mockUpdateOrderStatus = updateOrderStatus as jest.MockedFunction<
  typeof updateOrderStatus
>
const mockUpdatePaymentStatus = updatePaymentStatus as jest.MockedFunction<
  typeof updatePaymentStatus
>
const mockSearchOrders = searchOrders as jest.MockedFunction<
  typeof searchOrders
>
const mockGetOrderStats = getOrderStats as jest.MockedFunction<
  typeof getOrderStats
>
const mockRequirePermission = requirePermission as jest.MockedFunction<
  typeof requirePermission
>
const mockGetTenantId = getTenantId as jest.MockedFunction<typeof getTenantId>

describe('API Orders', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'ADMIN',
    tenantId: 'tenant-123',
  }

  const mockOrder = {
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

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequirePermission.mockResolvedValue({ error: null, user: mockUser })
    mockGetTenantId.mockReturnValue('tenant-123')
  })

  describe('GET /api/orders', () => {
    it('debería listar órdenes exitosamente', async () => {
      const mockOrders = [mockOrder]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetOrders.mockResolvedValue({
        orders: mockOrders,
        pagination: mockPagination,
      })

      const request = new NextRequest('http://localhost:3000/api/orders')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockOrders)
      expect(data.pagination).toEqual(mockPagination)
      expect(mockGetOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
        }),
        'tenant-123'
      )
    })

    it('debería filtrar órdenes por estado', async () => {
      const mockOrders = [mockOrder]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetOrders.mockResolvedValue({
        orders: mockOrders,
        pagination: mockPagination,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/orders?status=PENDING'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockGetOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'PENDING',
        }),
        'tenant-123'
      )
    })

    it('debería filtrar órdenes por cliente', async () => {
      const mockOrders = [mockOrder]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetOrders.mockResolvedValue({
        orders: mockOrders,
        pagination: mockPagination,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/orders?customerId=customer-123'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockGetOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 'customer-123',
        }),
        'tenant-123'
      )
    })
  })

  describe('POST /api/orders', () => {
    it('debería crear orden exitosamente', async () => {
      const orderData = {
        customerId: 'customer-123',
        items: [
          {
            productId: 'product-123',
            quantity: 2,
            unitPrice: 500.0,
            discount: 0,
            notes: 'Producto test',
          },
        ],
        subtotal: 1000.0,
        taxRate: 16,
        taxAmount: 160.0,
        discountAmount: 0,
        total: 1160.0,
        status: 'PENDING',
        paymentMethod: 'CARD',
        paymentStatus: 'PENDING',
        notes: 'Orden de prueba',
      }

      mockCreateOrder.mockResolvedValue(mockOrder)

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockOrder)
      expect(data.message).toBe('Orden creada exitosamente')
      expect(mockCreateOrder).toHaveBeenCalledWith(
        orderData,
        'tenant-123',
        'user-123'
      )
    })

    it('debería manejar errores de validación', async () => {
      const invalidData = {
        // customerId faltante
        items: [
          {
            productId: 'product-123',
            quantity: 0, // cantidad inválida
            unitPrice: 500.0,
          },
        ],
        subtotal: 1000.0,
        total: 1160.0,
      }

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Datos inválidos')
      expect(data.details).toBeDefined()
    })

    it('debería manejar error de cliente no encontrado', async () => {
      const orderData = {
        customerId: 'customer-inexistente',
        items: [
          {
            productId: 'product-123',
            quantity: 2,
            unitPrice: 500.0,
          },
        ],
        subtotal: 1000.0,
        total: 1160.0,
      }

      mockCreateOrder.mockRejectedValue(
        new Error('Cliente no encontrado o inactivo')
      )

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe('Cliente no encontrado o inactivo')
    })

    it('debería manejar errores de stock', async () => {
      const orderData = {
        customerId: 'customer-123',
        items: [
          {
            productId: 'product-123',
            quantity: 1000, // cantidad mayor al stock disponible
            unitPrice: 500.0,
          },
        ],
        subtotal: 500000.0,
        total: 580000.0,
      }

      mockCreateOrder.mockRejectedValue(
        new Error(
          'Errores de stock: Stock insuficiente para Producto Test. Disponible: 100, Solicitado: 1000'
        )
      )

      const request = new NextRequest('http://localhost:3000/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de stock')
      expect(data.message).toBe(
        'Errores de stock: Stock insuficiente para Producto Test. Disponible: 100, Solicitado: 1000'
      )
    })
  })

  describe('GET /api/orders/[id]', () => {
    it('debería obtener orden por ID exitosamente', async () => {
      mockGetOrderById.mockResolvedValue(mockOrder)

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123'
      )
      const response = await GET_BY_ID(request, { params: { id: 'order-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockOrder)
      expect(mockGetOrderById).toHaveBeenCalledWith('order-123', 'tenant-123')
    })

    it('debería manejar orden no encontrada', async () => {
      mockGetOrderById.mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123'
      )
      const response = await GET_BY_ID(request, { params: { id: 'order-123' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Orden no encontrada')
    })
  })

  describe('PUT /api/orders/[id]', () => {
    it('debería actualizar orden exitosamente', async () => {
      const updateData = {
        notes: 'Orden actualizada',
        expectedDeliveryDate: '2025-09-26T00:00:00.000Z',
      }

      const updatedOrder = { ...mockOrder, ...updateData }
      mockUpdateOrder.mockResolvedValue(updatedOrder)

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await PUT(request, { params: { id: 'order-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedOrder)
      expect(data.message).toBe('Orden actualizada exitosamente')
      expect(mockUpdateOrder).toHaveBeenCalledWith(
        'order-123',
        updateData,
        'tenant-123'
      )
    })

    it('debería manejar error al actualizar orden entregada', async () => {
      const updateData = { notes: 'Orden actualizada' }
      mockUpdateOrder.mockRejectedValue(
        new Error('No se puede modificar una orden entregada o cancelada')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await PUT(request, { params: { id: 'order-123' } })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'No se puede modificar una orden entregada o cancelada'
      )
    })
  })

  describe('DELETE /api/orders/[id]', () => {
    it('debería cancelar orden exitosamente', async () => {
      const cancelledOrder = { ...mockOrder, status: 'CANCELLED' }
      mockCancelOrder.mockResolvedValue(cancelledOrder)

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123',
        {
          method: 'DELETE',
          body: JSON.stringify({ reason: 'Cliente canceló la orden' }),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await DELETE(request, { params: { id: 'order-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(cancelledOrder)
      expect(data.message).toBe('Orden cancelada exitosamente')
      expect(mockCancelOrder).toHaveBeenCalledWith(
        'order-123',
        'tenant-123',
        'Cliente canceló la orden'
      )
    })

    it('debería manejar error al cancelar orden entregada', async () => {
      mockCancelOrder.mockRejectedValue(
        new Error('No se puede cancelar una orden entregada o ya cancelada')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params: { id: 'order-123' } })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'No se puede cancelar una orden entregada o ya cancelada'
      )
    })
  })

  describe('PATCH /api/orders/[id]/status', () => {
    it('debería actualizar estado de orden exitosamente', async () => {
      const statusData = {
        status: 'CONFIRMED',
        notes: 'Orden confirmada por el cliente',
      }

      const updatedOrder = { ...mockOrder, status: 'CONFIRMED' }
      mockUpdateOrderStatus.mockResolvedValue(updatedOrder)

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123/status',
        {
          method: 'PATCH',
          body: JSON.stringify(statusData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await UPDATE_STATUS(request, {
        params: { id: 'order-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedOrder)
      expect(data.message).toBe('Estado de la orden actualizado a CONFIRMED')
      expect(mockUpdateOrderStatus).toHaveBeenCalledWith(
        'order-123',
        statusData,
        'tenant-123'
      )
    })

    it('debería manejar transición de estado inválida', async () => {
      const statusData = {
        status: 'DELIVERED', // transición inválida desde PENDING
        notes: 'Orden entregada',
      }

      mockUpdateOrderStatus.mockRejectedValue(
        new Error('No se puede cambiar el estado de PENDING a DELIVERED')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123/status',
        {
          method: 'PATCH',
          body: JSON.stringify(statusData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await UPDATE_STATUS(request, {
        params: { id: 'order-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Transición de estado inválida')
      expect(data.message).toBe(
        'No se puede cambiar el estado de PENDING a DELIVERED'
      )
    })
  })

  describe('PATCH /api/orders/[id]/payment', () => {
    it('debería actualizar estado de pago exitosamente', async () => {
      const paymentData = {
        paymentStatus: 'PAID',
        paymentMethod: 'CARD',
        notes: 'Pago procesado exitosamente',
      }

      const updatedOrder = { ...mockOrder, paymentStatus: 'PAID' }
      mockUpdatePaymentStatus.mockResolvedValue(updatedOrder)

      const request = new NextRequest(
        'http://localhost:3000/api/orders/order-123/payment',
        {
          method: 'PATCH',
          body: JSON.stringify(paymentData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await UPDATE_PAYMENT(request, {
        params: { id: 'order-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedOrder)
      expect(data.message).toBe('Estado de pago actualizado a PAID')
      expect(mockUpdatePaymentStatus).toHaveBeenCalledWith(
        'order-123',
        paymentData,
        'tenant-123'
      )
    })
  })

  describe('GET /api/orders/search', () => {
    it('debería buscar órdenes exitosamente', async () => {
      const searchResults = [mockOrder]
      mockSearchOrders.mockResolvedValue(searchResults)

      const request = new NextRequest(
        'http://localhost:3000/api/orders/search?q=ORD-20250923'
      )
      const response = await SEARCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(searchResults)
      expect(data.query).toBe('ORD-20250923')
      expect(data.count).toBe(1)
      expect(mockSearchOrders).toHaveBeenCalledWith(
        'ORD-20250923',
        'tenant-123',
        10
      )
    })
  })

  describe('GET /api/orders/stats', () => {
    it('debería obtener estadísticas de órdenes exitosamente', async () => {
      const stats = {
        totalOrders: 150,
        totalRevenue: 250000.0,
        averageOrderValue: 1666.67,
        ordersByStatus: [
          {
            status: 'PENDING',
            count: 20,
            percentage: 13.33,
          },
          {
            status: 'CONFIRMED',
            count: 30,
            percentage: 20,
          },
        ],
        ordersByPaymentStatus: [
          {
            paymentStatus: 'PAID',
            count: 100,
            percentage: 66.67,
          },
        ],
        topCustomers: [
          {
            customerId: 'customer-123',
            customerName: 'Cliente Test',
            orderCount: 25,
            totalSpent: 50000.0,
          },
        ],
        topProducts: [
          {
            productId: 'product-123',
            productName: 'Producto Test',
            quantitySold: 50,
            revenue: 25000.0,
          },
        ],
      }

      mockGetOrderStats.mockResolvedValue(stats)

      const request = new NextRequest('http://localhost:3000/api/orders/stats')
      const response = await GET_STATS(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(stats)
      expect(mockGetOrderStats).toHaveBeenCalledWith('tenant-123')
    })
  })
})
