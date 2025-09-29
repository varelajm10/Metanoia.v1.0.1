import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/products/route'
import { GET as GET_BY_ID, PUT, DELETE } from '@/app/api/products/[id]/route'
import { PATCH as TOGGLE } from '@/app/api/products/[id]/toggle/route'
import { PATCH as UPDATE_STOCK } from '@/app/api/products/[id]/stock/route'
import { GET as SEARCH } from '@/app/api/products/search/route'
import { GET as GET_CATEGORIES } from '@/app/api/products/categories/route'
import { GET as GET_BRANDS } from '@/app/api/products/brands/route'
import { GET as GET_LOW_STOCK } from '@/app/api/products/low-stock/route'
import { GET as GET_STATS } from '@/app/api/products/stats/route'

// Mock de Prisma
jest.mock('@/lib/services/product', () => ({
  getProducts: jest.fn(),
  createProduct: jest.fn(),
  getProductById: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
  toggleProductStatus: jest.fn(),
  updateProductStock: jest.fn(),
  searchProducts: jest.fn(),
  getProductCategories: jest.fn(),
  getProductBrands: jest.fn(),
  getLowStockProducts: jest.fn(),
  getStockStats: jest.fn(),
}))

// Mock de middleware de autenticación
jest.mock('@/lib/middleware/auth', () => ({
  requirePermission: jest.fn(),
  getTenantId: jest.fn(),
}))

import {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateProductStock,
  searchProducts,
  getProductCategories,
  getProductBrands,
  getLowStockProducts,
  getStockStats,
} from '@/lib/services/product'
import { requirePermission, getTenantId } from '@/lib/middleware/auth'

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>
const mockCreateProduct = createProduct as jest.MockedFunction<
  typeof createProduct
>
const mockGetProductById = getProductById as jest.MockedFunction<
  typeof getProductById
>
const mockUpdateProduct = updateProduct as jest.MockedFunction<
  typeof updateProduct
>
const mockDeleteProduct = deleteProduct as jest.MockedFunction<
  typeof deleteProduct
>
const mockToggleProductStatus = toggleProductStatus as jest.MockedFunction<
  typeof toggleProductStatus
>
const mockUpdateProductStock = updateProductStock as jest.MockedFunction<
  typeof updateProductStock
>
const mockSearchProducts = searchProducts as jest.MockedFunction<
  typeof searchProducts
>
const mockGetProductCategories = getProductCategories as jest.MockedFunction<
  typeof getProductCategories
>
const mockGetProductBrands = getProductBrands as jest.MockedFunction<
  typeof getProductBrands
>
const mockGetLowStockProducts = getLowStockProducts as jest.MockedFunction<
  typeof getLowStockProducts
>
const mockGetStockStats = getStockStats as jest.MockedFunction<
  typeof getStockStats
>
const mockRequirePermission = requirePermission as jest.MockedFunction<
  typeof requirePermission
>
const mockGetTenantId = getTenantId as jest.MockedFunction<typeof getTenantId>

describe('API Products', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'ADMIN',
    tenantId: 'tenant-123',
  }

  const mockProduct = {
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

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequirePermission.mockResolvedValue({ error: null, user: mockUser })
    mockGetTenantId.mockReturnValue('tenant-123')
  })

  describe('GET /api/products', () => {
    it('debería listar productos exitosamente', async () => {
      const mockProducts = [mockProduct]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetProducts.mockResolvedValue({
        products: mockProducts,
        pagination: mockPagination,
      })

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProducts)
      expect(data.pagination).toEqual(mockPagination)
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
        }),
        'tenant-123'
      )
    })

    it('debería filtrar productos por categoría', async () => {
      const mockProducts = [mockProduct]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetProducts.mockResolvedValue({
        products: mockProducts,
        pagination: mockPagination,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/products?category=Electrónicos'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'Electrónicos',
        }),
        'tenant-123'
      )
    })

    it('debería filtrar productos con stock bajo', async () => {
      const mockProducts = [mockProduct]
      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      mockGetProducts.mockResolvedValue({
        products: mockProducts,
        pagination: mockPagination,
      })

      const request = new NextRequest(
        'http://localhost:3000/api/products?lowStock=true'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockGetProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          lowStock: true,
        }),
        'tenant-123'
      )
    })
  })

  describe('POST /api/products', () => {
    it('debería crear producto exitosamente', async () => {
      const productData = {
        name: 'Nuevo Producto',
        description: 'Descripción del nuevo producto',
        sku: 'NEW-001',
        price: 149.99,
        cost: 75.0,
        stock: 50,
        minStock: 5,
        maxStock: 200,
        category: 'Hogar',
        brand: 'HomeBrand',
        isActive: true,
        isDigital: false,
        tags: ['hogar', 'decoración'],
      }

      mockCreateProduct.mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProduct)
      expect(data.message).toBe('Producto creado exitosamente')
      expect(mockCreateProduct).toHaveBeenCalledWith(productData, 'tenant-123')
    })

    it('debería manejar errores de validación', async () => {
      const invalidData = {
        // name faltante
        sku: 'INVALID-001',
        price: -10, // precio negativo
      }

      const request = new NextRequest('http://localhost:3000/api/products', {
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

    it('debería manejar conflictos de SKU duplicado', async () => {
      const productData = {
        name: 'Producto Test',
        sku: 'TEST-001',
        price: 99.99,
      }

      mockCreateProduct.mockRejectedValue(
        new Error('Ya existe un producto con este SKU en el tenant')
      )

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'Ya existe un producto con este SKU en el tenant'
      )
    })

    it('debería manejar error de stock máximo menor que mínimo', async () => {
      const productData = {
        name: 'Producto Test',
        sku: 'TEST-001',
        price: 99.99,
        minStock: 100,
        maxStock: 50, // menor que minStock
      }

      mockCreateProduct.mockRejectedValue(
        new Error('El stock máximo debe ser mayor que el stock mínimo')
      )

      const request = new NextRequest('http://localhost:3000/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: { 'Content-Type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'El stock máximo debe ser mayor que el stock mínimo'
      )
    })
  })

  describe('GET /api/products/[id]', () => {
    it('debería obtener producto por ID exitosamente', async () => {
      mockGetProductById.mockResolvedValue(mockProduct)

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123'
      )
      const response = await GET_BY_ID(request, {
        params: { id: 'product-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProduct)
      expect(mockGetProductById).toHaveBeenCalledWith(
        'product-123',
        'tenant-123'
      )
    })

    it('debería manejar producto no encontrado', async () => {
      mockGetProductById.mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123'
      )
      const response = await GET_BY_ID(request, {
        params: { id: 'product-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Producto no encontrado')
    })
  })

  describe('PUT /api/products/[id]', () => {
    it('debería actualizar producto exitosamente', async () => {
      const updateData = {
        name: 'Producto Actualizado',
        price: 129.99,
        stock: 75,
      }

      const updatedProduct = { ...mockProduct, ...updateData }
      mockUpdateProduct.mockResolvedValue(updatedProduct)

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await PUT(request, { params: { id: 'product-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedProduct)
      expect(data.message).toBe('Producto actualizado exitosamente')
      expect(mockUpdateProduct).toHaveBeenCalledWith(
        'product-123',
        updateData,
        'tenant-123'
      )
    })
  })

  describe('DELETE /api/products/[id]', () => {
    it('debería eliminar producto exitosamente', async () => {
      mockDeleteProduct.mockResolvedValue(mockProduct)

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params: { id: 'product-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockProduct)
      expect(data.message).toBe('Producto eliminado exitosamente')
      expect(mockDeleteProduct).toHaveBeenCalledWith(
        'product-123',
        'tenant-123'
      )
    })

    it('debería manejar error al eliminar producto con órdenes asociadas', async () => {
      mockDeleteProduct.mockRejectedValue(
        new Error(
          'No se puede eliminar el producto porque tiene órdenes asociadas'
        )
      )

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params: { id: 'product-123' } })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe(
        'No se puede eliminar el producto porque tiene órdenes asociadas'
      )
    })
  })

  describe('PATCH /api/products/[id]/toggle', () => {
    it('debería activar/desactivar producto exitosamente', async () => {
      const toggleData = { isActive: false }
      const updatedProduct = { ...mockProduct, isActive: false }
      mockToggleProductStatus.mockResolvedValue(updatedProduct)

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123/toggle',
        {
          method: 'PATCH',
          body: JSON.stringify(toggleData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await TOGGLE(request, { params: { id: 'product-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedProduct)
      expect(data.message).toBe('Producto desactivado exitosamente')
      expect(mockToggleProductStatus).toHaveBeenCalledWith(
        'product-123',
        'tenant-123',
        false
      )
    })
  })

  describe('PATCH /api/products/[id]/stock', () => {
    it('debería actualizar stock exitosamente', async () => {
      const stockData = {
        quantity: 25,
        reason: 'Reabastecimiento de inventario',
        type: 'in',
        notes: 'Llegada de mercancía del proveedor',
      }

      const updatedProduct = { ...mockProduct, stock: 125 }
      mockUpdateProductStock.mockResolvedValue(updatedProduct)

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123/stock',
        {
          method: 'PATCH',
          body: JSON.stringify(stockData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await UPDATE_STOCK(request, {
        params: { id: 'product-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(updatedProduct)
      expect(data.message).toBe('Stock actualizado exitosamente')
      expect(mockUpdateProductStock).toHaveBeenCalledWith(
        'product-123',
        stockData,
        'tenant-123'
      )
    })

    it('debería manejar error de stock insuficiente', async () => {
      const stockData = {
        quantity: 150, // más que el stock disponible (100)
        reason: 'Venta',
        type: 'out',
        notes: 'Venta al cliente',
      }

      mockUpdateProductStock.mockRejectedValue(
        new Error('No hay suficiente stock para esta operación')
      )

      const request = new NextRequest(
        'http://localhost:3000/api/products/product-123/stock',
        {
          method: 'PATCH',
          body: JSON.stringify(stockData),
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const response = await UPDATE_STOCK(request, {
        params: { id: 'product-123' },
      })
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Error de validación')
      expect(data.message).toBe('No hay suficiente stock para esta operación')
    })
  })

  describe('GET /api/products/search', () => {
    it('debería buscar productos exitosamente', async () => {
      const searchResults = [mockProduct]
      mockSearchProducts.mockResolvedValue(searchResults)

      const request = new NextRequest(
        'http://localhost:3000/api/products/search?q=test'
      )
      const response = await SEARCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(searchResults)
      expect(data.query).toBe('test')
      expect(data.count).toBe(1)
      expect(mockSearchProducts).toHaveBeenCalledWith('test', 'tenant-123', 10)
    })
  })

  describe('GET /api/products/categories', () => {
    it('debería obtener categorías exitosamente', async () => {
      const categories = ['Electrónicos', 'Hogar', 'Ropa', 'Deportes']
      mockGetProductCategories.mockResolvedValue(categories)

      const request = new NextRequest(
        'http://localhost:3000/api/products/categories'
      )
      const response = await GET_CATEGORIES(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(categories)
      expect(data.count).toBe(4)
      expect(mockGetProductCategories).toHaveBeenCalledWith('tenant-123')
    })
  })

  describe('GET /api/products/brands', () => {
    it('debería obtener marcas exitosamente', async () => {
      const brands = ['TechCorp', 'HomeBrand', 'FashionCo', 'SportsPro']
      mockGetProductBrands.mockResolvedValue(brands)

      const request = new NextRequest(
        'http://localhost:3000/api/products/brands'
      )
      const response = await GET_BRANDS(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(brands)
      expect(data.count).toBe(4)
      expect(mockGetProductBrands).toHaveBeenCalledWith('tenant-123')
    })
  })

  describe('GET /api/products/low-stock', () => {
    it('debería obtener productos con stock bajo exitosamente', async () => {
      const lowStockProducts = [mockProduct]
      mockGetLowStockProducts.mockResolvedValue(lowStockProducts)

      const request = new NextRequest(
        'http://localhost:3000/api/products/low-stock'
      )
      const response = await GET_LOW_STOCK(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(lowStockProducts)
      expect(data.count).toBe(1)
      expect(mockGetLowStockProducts).toHaveBeenCalledWith('tenant-123', 50)
    })
  })

  describe('GET /api/products/stats', () => {
    it('debería obtener estadísticas de inventario exitosamente', async () => {
      const stats = {
        totalProducts: 150,
        totalStock: 5000,
        totalValue: 125000.0,
        lowStockProducts: 12,
        outOfStockProducts: 3,
        categories: [
          {
            name: 'Electrónicos',
            count: 45,
            totalStock: 1500,
          },
        ],
      }

      mockGetStockStats.mockResolvedValue(stats)

      const request = new NextRequest(
        'http://localhost:3000/api/products/stats'
      )
      const response = await GET_STATS(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(stats)
      expect(mockGetStockStats).toHaveBeenCalledWith('tenant-123')
    })
  })
})
