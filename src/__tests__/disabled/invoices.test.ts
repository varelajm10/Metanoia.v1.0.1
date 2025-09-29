import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/invoices/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/invoices/[id]/route'
import { PATCH as UPDATE_STATUS } from '@/app/api/invoices/[id]/status/route'
import { PATCH as RECORD_PAYMENT } from '@/app/api/invoices/[id]/payment/route'
import { GET as SEARCH } from '@/app/api/invoices/search/route'
import { GET as GET_STATS } from '@/app/api/invoices/stats/route'
import { GET as GET_OVERDUE } from '@/app/api/invoices/overdue/route'

// Mock de Prisma
jest.mock('@/lib/services/invoice', () => ({
  getInvoices: jest.fn(),
  createInvoice: jest.fn(),
  getInvoiceById: jest.fn(),
  updateInvoice: jest.fn(),
  cancelInvoice: jest.fn(),
  updateInvoiceStatus: jest.fn(),
  recordPayment: jest.fn(),
  searchInvoices: jest.fn(),
  getInvoiceStats: jest.fn(),
  getOverdueInvoices: jest.fn(),
}))

// Mock de middleware de autenticación
jest.mock('@/lib/middleware/auth', () => ({
  requirePermission: jest.fn(),
  getTenantId: jest.fn(),
}))

import {
  getInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  cancelInvoice,
  updateInvoiceStatus,
  recordPayment,
  searchInvoices,
  getInvoiceStats,
  getOverdueInvoices,
} from '@/lib/services/invoice'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'

const mockGetInvoices = getInvoices as jest.MockedFunction<typeof getInvoices>
const mockCreateInvoice = createInvoice as jest.MockedFunction<
  typeof createInvoice
>
const mockGetInvoiceById = getInvoiceById as jest.MockedFunction<
  typeof getInvoiceById
>
const mockUpdateInvoice = updateInvoice as jest.MockedFunction<
  typeof updateInvoice
>
const mockCancelInvoice = cancelInvoice as jest.MockedFunction<
  typeof cancelInvoice
>
const mockUpdateInvoiceStatus = updateInvoiceStatus as jest.MockedFunction<
  typeof updateInvoiceStatus
>
const mockRecordPayment = recordPayment as jest.MockedFunction<
  typeof recordPayment
>
const mockSearchInvoices = searchInvoices as jest.MockedFunction<
  typeof searchInvoices
>
const mockGetInvoiceStats = getInvoiceStats as jest.MockedFunction<
  typeof getInvoiceStats
>
const mockGetOverdueInvoices = getOverdueInvoices as jest.MockedFunction<
  typeof getOverdueInvoices
>
const mockRequirePermission = requirePermission as jest.MockedFunction<
  typeof requirePermission
>
const mockGetTenantId = getTenantId as jest.MockedFunction<typeof getTenantId>

describe('API Invoices', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'ADMIN',
    tenantId: 'tenant-123',
  }

  const mockInvoice = {
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

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequirePermission.mockResolvedValue({ error: null, user: mockUser })
    mockGetTenantId.mockReturnValue('tenant-123')
  })

  describe('GET /api/invoices', () => {
    it('debería listar facturas exitosamente', async () => {
      const mockInvoices = [mockInvoice]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetInvoices.mockResolvedValue({
        invoices: mockInvoices,
        pagination: mockPagination,
      })

      const request = new NextRequest('http://localhost:3000/api/invoices')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockInvoices)
      expect(data.pagination).toEqual(mockPagination)
      expect(mockGetInvoices).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
        }),
        'tenant-123'
      )
    })

    it('debería filtrar facturas por estado', async () => {
      const mockInvoices = [mockInvoice]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetInvoices.mockResolvedValue({
        invoices: mockInvoices,
        pagination: mockPagination,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/invoices?status=SENT'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockGetInvoices).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'SENT',
        }),
        'tenant-123'
      )
    })

    it('debería filtrar facturas vencidas', async () => {
      const mockInvoices = [mockInvoice]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetInvoices.mockResolvedValue({
        invoices: mockInvoices,
        pagination: mockPagination,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/invoices?overdue=true'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockGetInvoices).toHaveBeenCalledWith(
        expect.objectContaining({
          overdue: true,
        }),
        'tenant-123'
      )
    })
  })

  describe('POST /api/invoices', () => {
    it('debería crear factura exitosamente', async () => {
      const invoiceData = {
        customerId: 'customer-123',
        subtotal: 1000.0,
        tax: 160.0,
        total: 1160.0,
        dueDate: '2025-10-23T00:00:00.000Z',
        notes: 'Factura por servicios prestados',
        status: 'DRAFT',
      }

      mockCreateInvoice.mockResolvedValue(mockInvoice)

      const request = new NextRequest('http://localhost:3000/api/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockInvoice)
      expect(data.message).toBe('Factura creada exitosamente')
      expect(mockCreateInvoice).toHaveBeenCalledWith(invoiceData, 'tenant-123')
    })

    it('debería manejar errores de validación', async () => {
      const invalidData = {
        // customerId faltante
        subtotal: -100, // subtotal negativo
        total: 1160.0,
      }

      const request = new NextRequest('http://localhost:3000/api/invoices', {
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
      const invoiceData = {
        customerId: 'customer-inexistente',
        subtotal: 1000.0,
        total: 1160.0,
      }

      mockCreateInvoice.mockRejectedValue(
        new Error('Cliente no encontrado o inactivo')
      )

      const request = new NextRequest('http://localhost:3000/api/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe('Cliente no encontrado o inactivo')
    })
  })

  describe('GET /api/invoices/[id]', () => {
    it('debería obtener factura por ID exitosamente', async () => {
      mockGetInvoiceById.mockResolvedValue(mockInvoice)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123'
      )
      const response = await GET_BY_ID(request, {
        params: { id: 'invoice-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockInvoice)
      expect(mockGetInvoiceById).toHaveBeenCalledWith(
        'invoice-123',
        'tenant-123'
      )
    })

    it('debería manejar factura no encontrada', async () => {
      mockGetInvoiceById.mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123'
      )
      const response = await GET_BY_ID(request, {
        params: { id: 'invoice-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Factura no encontrada')
    })
  })

  describe('PUT /api/invoices/[id]', () => {
    it('debería actualizar factura exitosamente', async () => {
      const updateData = {
        subtotal: 1200.0,
        tax: 192.0,
        total: 1392.0,
        notes: 'Factura actualizada con nuevos servicios',
      }

      const updatedInvoice = { ...mockInvoice, ...updateData }
      mockUpdateInvoice.mockResolvedValue(updatedInvoice)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await PUT(request, { params: { id: 'invoice-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedInvoice)
      expect(data.message).toBe('Factura actualizada exitosamente')
      expect(mockUpdateInvoice).toHaveBeenCalledWith(
        'invoice-123',
        updateData,
        'tenant-123'
      )
    })

    it('debería manejar error al actualizar factura pagada', async () => {
      const updateData = { notes: 'Factura actualizada' }
      mockUpdateInvoice.mockRejectedValue(
        new Error('No se puede modificar una factura pagada o cancelada')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await PUT(request, { params: { id: 'invoice-123' } })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'No se puede modificar una factura pagada o cancelada'
      )
    })
  })

  describe('DELETE /api/invoices/[id]', () => {
    it('debería cancelar factura exitosamente', async () => {
      const cancelledInvoice = { ...mockInvoice, status: 'CANCELLED' }
      mockCancelInvoice.mockResolvedValue(cancelledInvoice)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123',
        {
          method: 'DELETE',
          body: JSON.stringify({ reason: 'Cliente canceló el servicio' }),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await DELETE(request, { params: { id: 'invoice-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(cancelledInvoice)
      expect(data.message).toBe('Factura cancelada exitosamente')
      expect(mockCancelInvoice).toHaveBeenCalledWith(
        'invoice-123',
        'tenant-123',
        'Cliente canceló el servicio'
      )
    })

    it('debería manejar error al cancelar factura pagada', async () => {
      mockCancelInvoice.mockRejectedValue(
        new Error('No se puede cancelar una factura pagada o ya cancelada')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params: { id: 'invoice-123' } })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'No se puede cancelar una factura pagada o ya cancelada'
      )
    })
  })

  describe('PATCH /api/invoices/[id]/status', () => {
    it('debería actualizar estado de factura exitosamente', async () => {
      const statusData = {
        status: 'SENT',
        notes: 'Factura enviada al cliente',
      }

      const updatedInvoice = { ...mockInvoice, status: 'SENT' }
      mockUpdateInvoiceStatus.mockResolvedValue(updatedInvoice)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123/status',
        {
          method: 'PATCH',
          body: JSON.stringify(statusData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await UPDATE_STATUS(request, {
        params: { id: 'invoice-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedInvoice)
      expect(data.message).toBe('Estado de la factura actualizado a SENT')
      expect(mockUpdateInvoiceStatus).toHaveBeenCalledWith(
        'invoice-123',
        statusData,
        'tenant-123'
      )
    })

    it('debería manejar transición de estado inválida', async () => {
      const statusData = {
        status: 'PAID', // transición inválida desde DRAFT
        notes: 'Factura pagada',
      }

      mockUpdateInvoiceStatus.mockRejectedValue(
        new Error('No se puede cambiar el estado de DRAFT a PAID')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123/status',
        {
          method: 'PATCH',
          body: JSON.stringify(statusData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await UPDATE_STATUS(request, {
        params: { id: 'invoice-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Transición de estado inválida')
      expect(data.message).toBe('No se puede cambiar el estado de DRAFT a PAID')
    })
  })

  describe('PATCH /api/invoices/[id]/payment', () => {
    it('debería registrar pago exitosamente', async () => {
      const paymentData = {
        amount: 1160.0,
        paymentDate: '2025-09-23T00:00:00.000Z',
        paymentMethod: 'CARD',
        notes: 'Pago procesado exitosamente',
      }

      const paidInvoice = {
        ...mockInvoice,
        status: 'PAID',
        paidDate: new Date('2025-09-23T00:00:00.000Z'),
      }
      mockRecordPayment.mockResolvedValue(paidInvoice)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123/payment',
        {
          method: 'PATCH',
          body: JSON.stringify(paymentData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await RECORD_PAYMENT(request, {
        params: { id: 'invoice-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(paidInvoice)
      expect(data.message).toBe('Pago registrado exitosamente')
      expect(mockRecordPayment).toHaveBeenCalledWith(
        'invoice-123',
        paymentData,
        'tenant-123'
      )
    })

    it('debería manejar error de monto excedido', async () => {
      const paymentData = {
        amount: 2000.0, // mayor que el total de la factura (1160.00)
        paymentDate: '2025-09-23T00:00:00.000Z',
        paymentMethod: 'CARD',
        notes: 'Pago excedido',
      }

      mockRecordPayment.mockRejectedValue(
        new Error('El monto del pago no puede exceder el total de la factura')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123/payment',
        {
          method: 'PATCH',
          body: JSON.stringify(paymentData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await RECORD_PAYMENT(request, {
        params: { id: 'invoice-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'El monto del pago no puede exceder el total de la factura'
      )
    })

    it('debería manejar error al registrar pago en factura cancelada', async () => {
      const paymentData = {
        amount: 1160.0,
        paymentDate: '2025-09-23T00:00:00.000Z',
        paymentMethod: 'CARD',
        notes: 'Pago en factura cancelada',
      }

      mockRecordPayment.mockRejectedValue(
        new Error('No se puede registrar pago en una factura cancelada')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/invoice-123/payment',
        {
          method: 'PATCH',
          body: JSON.stringify(paymentData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await RECORD_PAYMENT(request, {
        params: { id: 'invoice-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'No se puede registrar pago en una factura cancelada'
      )
    })
  })

  describe('GET /api/invoices/search', () => {
    it('debería buscar facturas exitosamente', async () => {
      const searchResults = [mockInvoice]
      mockSearchInvoices.mockResolvedValue(searchResults)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/search?q=INV-20250923'
      )
      const response = await SEARCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(searchResults)
      expect(data.query).toBe('INV-20250923')
      expect(data.count).toBe(1)
      expect(mockSearchInvoices).toHaveBeenCalledWith(
        'INV-20250923',
        'tenant-123',
        10
      )
    })
  })

  describe('GET /api/invoices/stats', () => {
    it('debería obtener estadísticas de facturas exitosamente', async () => {
      const stats = {
        totalInvoices: 150,
        totalRevenue: 250000.0,
        totalOutstanding: 45000.0,
        averageInvoiceValue: 1666.67,
        invoicesByStatus: [
          {
            status: 'PAID',
            count: 120,
            percentage: 80,
          },
          {
            status: 'SENT',
            count: 20,
            percentage: 13.33,
          },
        ],
        overdueInvoices: 10,
        overdueAmount: 15000.0,
        topCustomers: [
          {
            customerId: 'customer-123',
            customerName: 'Cliente Test',
            invoiceCount: 25,
            totalAmount: 50000.0,
          },
        ],
      }

      mockGetInvoiceStats.mockResolvedValue(stats)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/stats'
      )
      const response = await GET_STATS(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(stats)
      expect(mockGetInvoiceStats).toHaveBeenCalledWith('tenant-123')
    })
  })

  describe('GET /api/invoices/overdue', () => {
    it('debería obtener facturas vencidas exitosamente', async () => {
      const overdueInvoices = [mockInvoice]
      mockGetOverdueInvoices.mockResolvedValue(overdueInvoices)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/overdue'
      )
      const response = await GET_OVERDUE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(overdueInvoices)
      expect(data.count).toBe(1)
      expect(mockGetOverdueInvoices).toHaveBeenCalledWith('tenant-123', 50)
    })

    it('debería manejar límite personalizado', async () => {
      const overdueInvoices = [mockInvoice]
      mockGetOverdueInvoices.mockResolvedValue(overdueInvoices)

      const request = new NextRequest(
        'http://localhost:3000/api/invoices/overdue?limit=25'
      )
      const response = await GET_OVERDUE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockGetOverdueInvoices).toHaveBeenCalledWith('tenant-123', 25)
    })
  })
})
