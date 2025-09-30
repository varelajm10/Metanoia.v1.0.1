// src/lib/services/invoice.test.ts

// Mock del módulo de base de datos usando el mock existente
jest.mock('@/lib/db', () => ({
  prisma: {
    invoice: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    customer: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))

// Importar las funciones después del mock
import {
  createInvoice,
  getInvoiceById,
  updateInvoiceStatus,
  recordPayment,
  getInvoices,
  updateInvoice,
  cancelInvoice,
  getInvoiceStats,
  searchInvoices,
  getOverdueInvoices,
} from './invoice'
import { prisma } from '@/lib/db'

describe('InvoiceService', () => {
  const mockTenantId = 'tenant-test-123'
  const mockCustomerId = 'customer-test-123'

  const mockCustomer = {
    id: mockCustomerId,
    name: 'Cliente Test',
    email: 'cliente@test.com',
    phone: '+52 55 1234 5678',
    isActive: true,
    tenantId: mockTenantId,
  }

  const mockInvoice = {
    id: 'invoice-123',
    invoiceNumber: 'INV-20250101-0001',
    customerId: mockCustomerId,
    subtotal: 1000.0,
    tax: 160.0,
    total: 1160.0,
    dueDate: new Date('2025-02-01T00:00:00.000Z'),
    paidDate: null,
    notes: 'Factura de prueba',
    status: 'DRAFT',
    tenantId: mockTenantId,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    customer: mockCustomer,
  }

  const mockInvoiceWithRelations = {
    ...mockInvoice,
    customer: {
      id: mockCustomerId,
      name: 'Cliente Test',
      email: 'cliente@test.com',
      phone: '+52 55 1234 5678',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ========================================
  // TESTS PARA CREAR FACTURA
  // ========================================

  describe('createInvoice', () => {
    const invoiceData = {
      customerId: mockCustomerId,
      subtotal: 1000.0,
      tax: 160.0,
      total: 1160.0,
      dueDate: new Date('2025-02-01T00:00:00.000Z'),
      notes: 'Factura de prueba',
      status: 'DRAFT' as const,
    }

    it('debe crear factura exitosamente', async () => {
      // Arrange
      prisma.customer.findFirst.mockResolvedValue(mockCustomer)
      prisma.invoice.findFirst
        .mockResolvedValueOnce(null) // No hay facturas previas para generar número
        .mockResolvedValueOnce(mockInvoiceWithRelations) // Retorna la factura completa con relaciones
      prisma.invoice.create.mockResolvedValue(mockInvoice)

      // Act
      const result = await createInvoice(invoiceData, mockTenantId)

      // Assert
      expect(result).toEqual(mockInvoiceWithRelations)
      expect(prisma.customer.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockCustomerId,
          tenantId: mockTenantId,
          isActive: true,
        },
      })
      expect(prisma.invoice.create).toHaveBeenCalledWith({
        data: {
          invoiceNumber: expect.stringMatching(/^INV-\d{8}-\d{4}$/),
          customerId: mockCustomerId,
          subtotal: 1000.0,
          tax: 160.0,
          total: 1160.0,
          dueDate: invoiceData.dueDate,
          notes: 'Factura de prueba',
          status: 'DRAFT',
          tenantId: mockTenantId,
        },
      })
    })

    it('debe lanzar error cuando el cliente no existe', async () => {
      // Arrange
      prisma.customer.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        createInvoice(invoiceData, mockTenantId)
      ).rejects.toThrow('Cliente no encontrado o inactivo')

      expect(prisma.invoice.create).not.toHaveBeenCalled()
    })

    it('debe lanzar error cuando el cliente está inactivo', async () => {
      // Arrange
      // El mock debe devolver null porque la consulta filtra por isActive: true
      prisma.customer.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        createInvoice(invoiceData, mockTenantId)
      ).rejects.toThrow('Cliente no encontrado o inactivo')

      expect(prisma.invoice.create).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA OBTENER FACTURA POR ID
  // ========================================

  describe('getInvoiceById', () => {
    it('debe obtener factura por ID exitosamente', async () => {
      // Arrange
      prisma.invoice.findFirst.mockResolvedValue(mockInvoiceWithRelations)

      // Act
      const result = await getInvoiceById('invoice-123', mockTenantId)

      // Assert
      expect(result).toEqual(mockInvoiceWithRelations)
      expect(prisma.invoice.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'invoice-123',
          tenantId: mockTenantId,
        },
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
    })

    it('debe retornar null cuando la factura no existe', async () => {
      // Arrange
      prisma.invoice.findFirst.mockResolvedValue(null)

      // Act
      const result = await getInvoiceById('invoice-not-found', mockTenantId)

      // Assert
      expect(result).toBeNull()
    })
  })

  // ========================================
  // TESTS PARA ACTUALIZAR ESTADO DE FACTURA
  // ========================================

  describe('updateInvoiceStatus', () => {
    const statusUpdate = {
      status: 'SENT' as const,
      notes: 'Factura enviada al cliente',
    }

    it('debe actualizar estado de factura exitosamente', async () => {
      // Arrange
      const existingInvoice = { ...mockInvoice, status: 'DRAFT' }
      const updatedInvoice = { ...mockInvoice, status: 'SENT' }
      
      prisma.invoice.findFirst.mockResolvedValue(existingInvoice)
      prisma.invoice.update.mockResolvedValue(updatedInvoice)

      // Act
      const result = await updateInvoiceStatus('invoice-123', statusUpdate, mockTenantId)

      // Assert
      expect(result).toEqual(updatedInvoice)
      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: {
          status: 'SENT',
          notes: 'Factura enviada al cliente',
        },
      })
    })

    it('debe lanzar error cuando la factura no existe', async () => {
      // Arrange
      prisma.invoice.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        updateInvoiceStatus('invoice-not-found', statusUpdate, mockTenantId)
      ).rejects.toThrow('Factura no encontrada')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })

    it('debe lanzar error cuando la transición de estado no es válida', async () => {
      // Arrange
      const existingInvoice = { ...mockInvoice, status: 'DRAFT' }
      const invalidStatusUpdate = {
        status: 'PAID' as const,
        notes: 'Intento de pago directo',
      }
      
      prisma.invoice.findFirst.mockResolvedValue(existingInvoice)

      // Act & Assert
      await expect(
        updateInvoiceStatus('invoice-123', invalidStatusUpdate, mockTenantId)
      ).rejects.toThrow('No se puede cambiar el estado de DRAFT a PAID')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA REGISTRAR PAGO
  // ========================================

  describe('recordPayment', () => {
    const paymentData = {
      amount: 1160.0,
      paymentDate: new Date('2025-01-15T00:00:00.000Z'),
      notes: 'Pago completo registrado',
    }

    it('debe registrar pago exitosamente', async () => {
      // Arrange
      const existingInvoice = { ...mockInvoice, status: 'SENT' }
      const paidInvoice = { 
        ...mockInvoice, 
        status: 'PAID',
        paidDate: paymentData.paymentDate
      }
      
      prisma.invoice.findFirst.mockResolvedValue(existingInvoice)
      prisma.invoice.update.mockResolvedValue(paidInvoice)

      // Act
      const result = await recordPayment('invoice-123', paymentData, mockTenantId)

      // Assert
      expect(result).toEqual(paidInvoice)
      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: {
          status: 'PAID',
          paidDate: paymentData.paymentDate,
          notes: expect.stringContaining('Pago registrado: Pago completo registrado'),
        },
      })
    })

    it('debe lanzar error cuando la factura no existe', async () => {
      // Arrange
      prisma.invoice.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        recordPayment('invoice-not-found', paymentData, mockTenantId)
      ).rejects.toThrow('Factura no encontrada')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })

    it('debe lanzar error cuando la factura está cancelada', async () => {
      // Arrange
      const cancelledInvoice = { ...mockInvoice, status: 'CANCELLED' }
      prisma.invoice.findFirst.mockResolvedValue(cancelledInvoice)

      // Act & Assert
      await expect(
        recordPayment('invoice-123', paymentData, mockTenantId)
      ).rejects.toThrow('No se puede registrar pago en una factura cancelada')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })

    it('debe lanzar error cuando el monto excede el total', async () => {
      // Arrange
      const existingInvoice = { ...mockInvoice, status: 'SENT' }
      const excessivePayment = {
        ...paymentData,
        amount: 2000.0, // Mayor que el total de 1160.0
      }
      
      prisma.invoice.findFirst.mockResolvedValue(existingInvoice)

      // Act & Assert
      await expect(
        recordPayment('invoice-123', excessivePayment, mockTenantId)
      ).rejects.toThrow('El monto del pago no puede exceder el total de la factura')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA OBTENER FACTURAS CON FILTROS
  // ========================================

  describe('getInvoices', () => {
    const mockInvoices = [mockInvoiceWithRelations]
    const mockPagination = {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    }

    it('debe obtener facturas con paginación exitosamente', async () => {
      // Arrange
      const query = {
        page: 1,
        limit: 10,
        search: '',
        status: undefined,
        customerId: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        overdue: false,
        sortBy: 'createdAt',
        sortOrder: 'desc' as const,
      }

      prisma.invoice.count.mockResolvedValue(1)
      prisma.invoice.findMany.mockResolvedValue(mockInvoices)

      // Act
      const result = await getInvoices(query, mockTenantId)

      // Assert
      expect(result.invoices).toEqual(mockInvoices)
      expect(result.pagination).toEqual(mockPagination)
      expect(prisma.invoice.count).toHaveBeenCalledWith({
        where: { tenantId: mockTenantId },
      })
    })
  })

  // ========================================
  // TESTS PARA ACTUALIZAR FACTURA
  // ========================================

  describe('updateInvoice', () => {
    const updateData = {
      subtotal: 1200.0,
      tax: 192.0,
      total: 1392.0,
      notes: 'Factura actualizada',
    }

    it('debe actualizar factura exitosamente', async () => {
      // Arrange
      const existingInvoice = { ...mockInvoice, status: 'DRAFT' }
      const updatedInvoice = { ...mockInvoice, ...updateData }
      
      prisma.invoice.findFirst.mockResolvedValue(existingInvoice)
      prisma.invoice.update.mockResolvedValue(updatedInvoice)

      // Act
      const result = await updateInvoice('invoice-123', updateData, mockTenantId)

      // Assert
      expect(result).toEqual(updatedInvoice)
      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: updateData,
      })
    })

    it('debe lanzar error cuando la factura no existe', async () => {
      // Arrange
      prisma.invoice.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        updateInvoice('invoice-not-found', updateData, mockTenantId)
      ).rejects.toThrow('Factura no encontrada')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })

    it('debe lanzar error cuando la factura está pagada', async () => {
      // Arrange
      const paidInvoice = { ...mockInvoice, status: 'PAID' }
      prisma.invoice.findFirst.mockResolvedValue(paidInvoice)

      // Act & Assert
      await expect(
        updateInvoice('invoice-123', updateData, mockTenantId)
      ).rejects.toThrow('No se puede modificar una factura pagada o cancelada')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA CANCELAR FACTURA
  // ========================================

  describe('cancelInvoice', () => {
    it('debe cancelar factura exitosamente', async () => {
      // Arrange
      const existingInvoice = { ...mockInvoice, status: 'DRAFT' }
      const cancelledInvoice = { 
        ...mockInvoice, 
        status: 'CANCELLED',
        notes: 'Factura de prueba\nCancelada: Cliente canceló el servicio'
      }
      
      prisma.invoice.findFirst.mockResolvedValue(existingInvoice)
      prisma.invoice.update.mockResolvedValue(cancelledInvoice)

      // Act
      const result = await cancelInvoice('invoice-123', mockTenantId, 'Cliente canceló el servicio')

      // Assert
      expect(result).toEqual(cancelledInvoice)
      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: 'invoice-123' },
        data: {
          status: 'CANCELLED',
          notes: 'Factura de prueba\nCancelada: Cliente canceló el servicio',
        },
      })
    })

    it('debe lanzar error cuando la factura no existe', async () => {
      // Arrange
      prisma.invoice.findFirst.mockResolvedValue(null)

      // Act & Assert
      await expect(
        cancelInvoice('invoice-not-found', mockTenantId, 'Razón de cancelación')
      ).rejects.toThrow('Factura no encontrada')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })

    it('debe lanzar error cuando la factura ya está pagada', async () => {
      // Arrange
      const paidInvoice = { ...mockInvoice, status: 'PAID' }
      prisma.invoice.findFirst.mockResolvedValue(paidInvoice)

      // Act & Assert
      await expect(
        cancelInvoice('invoice-123', mockTenantId, 'Razón de cancelación')
      ).rejects.toThrow('No se puede cancelar una factura pagada o ya cancelada')

      expect(prisma.invoice.update).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA BUSCAR FACTURAS
  // ========================================

  describe('searchInvoices', () => {
    it('debe buscar facturas exitosamente', async () => {
      // Arrange
      const searchQuery = 'INV-2025'
      const mockSearchResults = [mockInvoiceWithRelations]
      
      prisma.invoice.findMany.mockResolvedValue(mockSearchResults)

      // Act
      const result = await searchInvoices(searchQuery, mockTenantId, 10)

      // Assert
      expect(result).toEqual(mockSearchResults)
      expect(prisma.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: mockTenantId,
          OR: [
            { invoiceNumber: { contains: searchQuery, mode: 'insensitive' } },
            { customer: { name: { contains: searchQuery, mode: 'insensitive' } } },
          ],
        },
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
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      })
    })

    it('debe retornar array vacío cuando la consulta es muy corta', async () => {
      // Arrange
      const shortQuery = 'A'

      // Act
      const result = await searchInvoices(shortQuery, mockTenantId, 10)

      // Assert
      expect(result).toEqual([])
      expect(prisma.invoice.findMany).not.toHaveBeenCalled()
    })
  })

  // ========================================
  // TESTS PARA FACTURAS VENCIDAS
  // ========================================

  describe('getOverdueInvoices', () => {
    it('debe obtener facturas vencidas exitosamente', async () => {
      // Arrange
      const overdueInvoice = {
        ...mockInvoiceWithRelations,
        status: 'SENT',
        dueDate: new Date('2024-12-01T00:00:00.000Z'), // Fecha pasada
      }
      const mockOverdueInvoices = [overdueInvoice]
      
      prisma.invoice.findMany.mockResolvedValue(mockOverdueInvoices)

      // Act
      const result = await getOverdueInvoices(mockTenantId, 50)

      // Assert
      expect(result).toEqual(mockOverdueInvoices)
      expect(prisma.invoice.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: mockTenantId,
          status: { in: ['SENT'] },
          dueDate: { lt: expect.any(Date) },
        },
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
        orderBy: {
          dueDate: 'asc',
        },
        take: 50,
      })
    })
  })
})