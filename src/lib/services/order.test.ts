// src/lib/services/order.test.ts

// Mock del módulo de base de datos
jest.mock('@/lib/db', () => ({
  prisma: {
    order: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    orderItem: {
      findMany: jest.fn(),
      create: jest.fn(),
      groupBy: jest.fn(),
    },
    customer: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    product: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  },
}))

// Importar las funciones después del mock
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
  searchOrders,
} from './order'
import { prisma } from '@/lib/db'

describe('OrderService - Optimizaciones N+1', () => {
  const mockTenantId = 'tenant-test-123'
  const mockUserId = 'user-test-123'
  const mockCustomerId = 'customer-test-123'

  const mockCustomer = {
    id: mockCustomerId,
    name: 'Cliente Test',
    email: 'cliente@test.com',
    phone: '+52 55 1234 5678',
    isActive: true,
    tenantId: mockTenantId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockProducts = [
    {
      id: 'product-1',
      name: 'Producto 1',
      stock: 100,
      price: 50.0,
    },
    {
      id: 'product-2',
      name: 'Producto 2',
      stock: 50,
      price: 75.0,
    },
    {
      id: 'product-3',
      name: 'Producto 3',
      stock: 25,
      price: 100.0,
    },
  ]

  const mockOrderItems = [
    {
      id: 'item-1',
      productId: 'product-1',
      quantity: 5,
      unitPrice: 50.0,
      total: 250.0,
    },
    {
      id: 'item-2',
      productId: 'product-2',
      quantity: 3,
      unitPrice: 75.0,
      total: 225.0,
    },
  ]

  const mockOrder = {
    id: 'order-123',
    orderNumber: 'ORD-20250101-0001',
    customerId: mockCustomerId,
    userId: mockUserId,
    subtotal: 475.0,
    taxRate: 16.0,
    taxAmount: 76.0,
    discountAmount: 0.0,
    total: 551.0,
    status: 'PENDING',
    paymentMethod: 'CASH',
    paymentStatus: 'PENDING',
    tenantId: mockTenantId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ========================================
  // TESTS PARA OPTIMIZACIÓN DE VALIDACIÓN DE STOCK
  // ========================================

  describe('createOrder - Optimización validateStock', () => {
    const orderData = {
      customerId: mockCustomerId,
      items: [
        { productId: 'product-1', quantity: 5, unitPrice: 50.0, discount: 0, notes: '' },
        { productId: 'product-2', quantity: 3, unitPrice: 75.0, discount: 0, notes: '' },
      ],
      subtotal: 475.0,
      taxRate: 16.0,
      taxAmount: 76.0,
      discountAmount: 0.0,
      total: 551.0,
      status: 'PENDING' as const,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING' as const,
    }

    it('debe validar stock con UNA SOLA consulta (optimización N+1)', async () => {
      // Arrange
      prisma.customer.findFirst.mockResolvedValue(mockCustomer)
      // OPTIMIZADO: Una sola consulta para todos los productos
      prisma.product.findMany.mockResolvedValue(mockProducts.slice(0, 2))
      prisma.order.findFirst.mockResolvedValue(null) // No hay órdenes previas
      prisma.order.create.mockResolvedValue(mockOrder)
      prisma.orderItem.create.mockResolvedValue(mockOrderItems[0])
      prisma.product.update.mockResolvedValue({})
      prisma.$transaction.mockImplementation(async (callback) => callback(prisma))
      prisma.order.findFirst.mockResolvedValueOnce({
        ...mockOrder,
        orderItems: mockOrderItems,
        customer: mockCustomer,
      })

      // Act
      await createOrder(orderData, mockTenantId, mockUserId)

      // Assert - Verificar que solo se hace UNA consulta para obtener productos
      expect(prisma.product.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['product-1', 'product-2'] },
          tenantId: mockTenantId,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          stock: true,
        },
      })

      // Verificar que NO se hacen consultas individuales (findFirst) para cada producto
      expect(prisma.product.findFirst).not.toHaveBeenCalled()
    })

    it('debe detectar errores de stock insuficiente con consulta optimizada', async () => {
      // Arrange
      const insufficientStockProducts = [
        { ...mockProducts[0], stock: 2 }, // Solo 2 disponibles, se necesitan 5
        { ...mockProducts[1], stock: 1 }, // Solo 1 disponible, se necesitan 3
      ]

      prisma.customer.findFirst.mockResolvedValue(mockCustomer)
      prisma.product.findMany.mockResolvedValue(insufficientStockProducts)

      // Act & Assert
      await expect(
        createOrder(orderData, mockTenantId, mockUserId)
      ).rejects.toThrow('Errores de stock')

      // Verificar que se hizo solo UNA consulta optimizada
      expect(prisma.product.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.product.findFirst).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA OPTIMIZACIÓN DE ESTADÍSTICAS
  // ========================================

  describe('getOrderStats - Optimización de consultas paralelas', () => {
    it('debe obtener estadísticas con consultas optimizadas en paralelo', async () => {
      // Arrange
      const mockStatsData = {
        totalOrders: 100,
        totalRevenue: { _sum: { total: 50000 } },
        ordersByStatus: [
          { status: 'PENDING', _count: { id: 20 } },
          { status: 'CONFIRMED', _count: { id: 30 } },
        ],
        ordersByPaymentStatus: [
          { paymentStatus: 'PENDING', _count: { id: 40 } },
          { paymentStatus: 'PAID', _count: { id: 60 } },
        ],
        topCustomers: [
          { customerId: 'customer-1', _count: { id: 10 }, _sum: { total: 5000 } },
          { customerId: 'customer-2', _count: { id: 8 }, _sum: { total: 4000 } },
        ],
        topProducts: [
          { productId: 'product-1', _count: { id: 50 }, _sum: { total: 25000 } },
          { productId: 'product-2', _count: { id: 30 }, _sum: { total: 15000 } },
        ],
      }

      // Mock de todas las consultas principales
      prisma.order.count.mockResolvedValue(mockStatsData.totalOrders)
      prisma.order.aggregate.mockResolvedValue(mockStatsData.totalRevenue)
      prisma.order.groupBy
        .mockResolvedValueOnce(mockStatsData.ordersByStatus)
        .mockResolvedValueOnce(mockStatsData.ordersByPaymentStatus)
        .mockResolvedValueOnce(mockStatsData.topCustomers)
      prisma.orderItem.groupBy.mockResolvedValue(mockStatsData.topProducts)

      // OPTIMIZADO: Consultas paralelas para clientes y productos
      const mockCustomers = [
        { id: 'customer-1', name: 'Cliente 1' },
        { id: 'customer-2', name: 'Cliente 2' },
      ]
      const mockProducts = [
        { id: 'product-1', name: 'Producto 1' },
        { id: 'product-2', name: 'Producto 2' },
      ]

      prisma.customer.findMany.mockResolvedValue(mockCustomers)
      prisma.product.findMany.mockResolvedValue(mockProducts)

      // Act
      const result = await getOrderStats(mockTenantId)

      // Assert
      expect(result.totalOrders).toBe(100)
      expect(result.totalRevenue).toBe(50000)

      // Verificar que las consultas para clientes y productos se ejecutaron en paralelo
      expect(prisma.customer.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.product.findMany).toHaveBeenCalledTimes(1)

      // Verificar que se usaron los IDs correctos
      expect(prisma.customer.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['customer-1', 'customer-2'] } },
        select: { id: true, name: true },
      })

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['product-1', 'product-2'] } },
        select: { id: true, name: true },
      })

      // Verificar que los nombres se mapearon correctamente
      expect(result.topCustomers[0].customerName).toBe('Cliente 1')
      expect(result.topProducts[0].productName).toBe('Producto 1')
    })
  })

  // ========================================
  // TESTS PARA OPTIMIZACIÓN DE RESTAURACIÓN DE STOCK
  // ========================================

  describe('cancelOrder - Optimización restoreStockFromOrder', () => {
    it('debe restaurar stock con updates en paralelo (optimización N+1)', async () => {
      // Arrange
      const mockOrderItems = [
        { productId: 'product-1', quantity: 5 },
        { productId: 'product-2', quantity: 3 },
        { productId: 'product-1', quantity: 2 }, // Mismo producto, diferente cantidad
      ]

      prisma.order.findFirst.mockResolvedValue({
        ...mockOrder,
        status: 'PENDING', // Estado que permite cancelación
      })

      prisma.orderItem.findMany.mockResolvedValue(mockOrderItems)
      prisma.product.update.mockResolvedValue({})
      prisma.order.update.mockResolvedValue({ ...mockOrder, status: 'CANCELLED' })
      prisma.$transaction.mockImplementation(async (callback) => callback(prisma))

      // Act
      await cancelOrder('order-123', mockTenantId, 'Cancelación de prueba')

      // Assert - Verificar que se agruparon las cantidades por producto
      expect(prisma.orderItem.findMany).toHaveBeenCalledWith({
        where: { orderId: 'order-123' },
        select: {
          productId: true,
          quantity: true,
        },
      })

      // Verificar que se hicieron updates en paralelo (no en bucle secuencial)
      // product-1: 5 + 2 = 7, product-2: 3
      expect(prisma.product.update).toHaveBeenCalledTimes(2)

      // Verificar que se incrementó el stock correctamente
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-1' },
        data: { stock: { increment: 7 } },
      })

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 'product-2' },
        data: { stock: { increment: 3 } },
      })
    })

    it('debe manejar orden sin items sin hacer updates innecesarios', async () => {
      // Arrange
      prisma.order.findFirst.mockResolvedValue({
        ...mockOrder,
        status: 'PENDING',
      })

      prisma.orderItem.findMany.mockResolvedValue([]) // Sin items
      prisma.order.update.mockResolvedValue({ ...mockOrder, status: 'CANCELLED' })
      prisma.$transaction.mockImplementation(async (callback) => callback(prisma))

      // Act
      await cancelOrder('order-123', mockTenantId)

      // Assert
      expect(prisma.product.update).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA OBTENER ÓRDENES CON RELACIONES
  // ========================================

  describe('getOrders - Optimización de includes', () => {
    it('debe obtener órdenes con todas las relaciones en una sola consulta', async () => {
      // Arrange
      const mockOrdersWithRelations = [
        {
          ...mockOrder,
          orderItems: mockOrderItems,
          customer: mockCustomer,
          _count: { orderItems: 2 },
        },
      ]

      prisma.order.count.mockResolvedValue(1)
      prisma.order.findMany.mockResolvedValue(mockOrdersWithRelations)

      // Act
      const result = await getOrders({ page: 1, limit: 10 }, mockTenantId)

      // Assert
      expect(result.orders).toHaveLength(1)
      expect(result.orders[0].orderItems).toBeDefined()
      expect(result.orders[0].customer).toBeDefined()
      expect(result.orders[0]._count).toBeDefined()

      // Verificar que se usó include para traer todas las relaciones de una vez
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                  },
                },
              },
            },
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            _count: {
              select: {
                orderItems: true,
              },
            },
          },
        })
      )
    })
  })

  // ========================================
  // TESTS PARA BÚSQUEDA DE ÓRDENES
  // ========================================

  describe('searchOrders - Optimización de búsqueda', () => {
    it('debe buscar órdenes con relaciones incluidas de una vez', async () => {
      // Arrange
      const mockSearchResults = [
        {
          ...mockOrder,
          customer: mockCustomer,
        },
      ]

      prisma.order.findMany.mockResolvedValue(mockSearchResults)

      // Act
      const result = await searchOrders('ORD-2025', mockTenantId, 10)

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].customer).toBeDefined()

      // Verificar que se usó include para traer la relación customer
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        })
      )
    })
  })
})
