// src/lib/services/inventory.test.ts

import { InventoryService } from './inventory'

// Mock del módulo @prisma/client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    product: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      fields: {
        minStock: 'minStock',
        stock: 'stock',
      },
    },
    supplier: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    stockMovement: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    orderItem: {
      findFirst: jest.fn(),
    },
    purchaseOrder: {
      findFirst: jest.fn(),
      count: jest.fn(),
    },
    inventoryAlert: {
      create: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
    $disconnect: jest.fn(),
  })),
}))

describe('InventoryService', () => {
  const mockTenantId = 'tenant-test-123'
  const mockUserId = 'user-test-123'

  const mockProduct = {
    id: 'product-123',
    name: 'Producto Test',
    description: 'Descripción del producto',
    sku: 'SKU-123',
    barcode: '123456789',
    price: 100.0,
    cost: 50.0,
    stock: 10,
    minStock: 5,
    maxStock: 100,
    category: 'Electrónicos',
    brand: 'Marca Test',
    weight: 1.5,
    dimensions: {
      length: 10,
      width: 5,
      height: 2,
    },
    isActive: true,
    isDigital: false,
    tags: ['tag1', 'tag2'],
    tenantId: mockTenantId,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    productImages: [],
    productVariants: [],
    inventoryAlerts: [],
  }

  const mockSupplier = {
    id: 'supplier-123',
    name: 'Proveedor Test',
    email: 'proveedor@test.com',
    phone: '+52 55 1234 5678',
    address: {
      street: 'Calle Test 123',
      city: 'Ciudad Test',
      state: 'Estado Test',
      zipCode: '12345',
      country: 'México',
    },
    contactName: 'Contacto Test',
    taxId: 'TAX123456',
    paymentTerms: 30,
    isActive: true,
    notes: 'Notas del proveedor',
    tenantId: mockTenantId,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    products: [],
    purchaseOrders: [],
    _count: {
      purchaseOrders: 0,
      products: 0,
    },
  }

  const mockStockMovement = {
    id: 'movement-123',
    productId: 'product-123',
    type: 'IN',
    quantity: 10,
    reason: 'Compra',
    reference: 'REF-123',
    notes: 'Notas del movimiento',
    tenantId: mockTenantId,
    userId: mockUserId,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    product: {
      id: 'product-123',
      name: 'Producto Test',
      sku: 'SKU-123',
    },
    user: {
      id: 'user-123',
      firstName: 'Usuario',
      lastName: 'Test',
      email: 'usuario@test.com',
    },
  }

  // Obtener la instancia mockeada de Prisma
  const mockPrisma = new (require('@prisma/client').PrismaClient)()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ========================================
  // TESTS PARA PRODUCTOS
  // ========================================

  describe('Productos', () => {
    describe('getProducts', () => {
      it('debe devolver una lista de productos cuando existen', async () => {
        // Arrange
        const mockProducts = [mockProduct]
        const mockTotal = 1
        const service = new InventoryService(mockPrisma as any)

        mockPrisma.product.findMany.mockResolvedValue(mockProducts)
        mockPrisma.product.count.mockResolvedValue(mockTotal)

        // Act
        const result = await service.getProducts(mockTenantId)

        // Assert
        expect(result.products).toEqual(mockProducts)
        expect(result.total).toBe(mockTotal)
        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.pages).toBe(1)
      })

      it('debe devolver un array vacío cuando no hay productos', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findMany.mockResolvedValue([])
        mockPrisma.product.count.mockResolvedValue(0)

        // Act
        const result = await service.getProducts(mockTenantId)

        // Assert
        expect(result.products).toEqual([])
        expect(result.total).toBe(0)
        expect(result.page).toBe(1)
      })

      it('debe aplicar filtros de búsqueda correctamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const filters = { search: 'test' }
        const mockProducts = [mockProduct]
        const mockTotal = 1

        mockPrisma.product.findMany.mockResolvedValue(mockProducts)
        mockPrisma.product.count.mockResolvedValue(mockTotal)

        // Act
        const result = await service.getProducts(mockTenantId, filters)

        // Assert
        expect(result.products).toEqual(mockProducts)
        expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
          where: {
            tenantId: mockTenantId,
            OR: [
              { name: { contains: 'test', mode: 'insensitive' } },
              { sku: { contains: 'test', mode: 'insensitive' } },
              { barcode: { contains: 'test', mode: 'insensitive' } },
              { description: { contains: 'test', mode: 'insensitive' } },
            ],
          },
          include: {
            productImages: true,
            productVariants: true,
            inventoryAlerts: {
              where: { isActive: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 10,
        })
      })
    })

    describe('getProductById', () => {
      it('debe obtener producto por ID exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const productId = 'product-123'
        const mockProductWithDetails = {
          ...mockProduct,
          stockMovements: [],
          supplierProducts: [],
        }

        mockPrisma.product.findFirst.mockResolvedValue(mockProductWithDetails)

        // Act
        const result = await service.getProductById(productId, mockTenantId)

        // Assert
        expect(result).toEqual(mockProductWithDetails)
        expect(mockPrisma.product.findFirst).toHaveBeenCalledWith({
          where: { id: productId, tenantId: mockTenantId },
          include: {
            productImages: true,
            productVariants: true,
            inventoryAlerts: {
              where: { isActive: true },
            },
            stockMovements: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
            supplierProducts: {
              include: {
                supplier: true,
              },
            },
          },
        })
      })

      it('debe retornar null cuando el producto no existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const productId = 'product-not-found'
        mockPrisma.product.findFirst.mockResolvedValue(null)

        // Act
        const result = await service.getProductById(productId, mockTenantId)

        // Assert
        expect(result).toBeNull()
      })
    })

    describe('createProduct', () => {
      const productData = {
        name: 'Nuevo Producto',
        description: 'Descripción del nuevo producto',
        sku: 'SKU-NEW',
        barcode: '987654321',
        price: 150.0,
        cost: 75.0,
        stock: 20,
        minStock: 10,
        maxStock: 200,
        category: 'Electrónicos',
        brand: 'Nueva Marca',
        weight: 2.0,
        dimensions: {
          length: 15,
          width: 10,
          height: 5,
        },
        isActive: true,
        isDigital: false,
        tags: ['nuevo', 'test'],
      }

      it('debe crear producto exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const createdProduct = {
          ...productData,
          id: 'new-product-123',
          tenantId: mockTenantId,
        }

        mockPrisma.product.findFirst.mockResolvedValue(null) // SKU y barcode no existen
        mockPrisma.product.create.mockResolvedValue(createdProduct)

        // Act
        const result = await service.createProduct(productData, mockTenantId)

        // Assert
        expect(result).toEqual(createdProduct)
        expect(mockPrisma.product.create).toHaveBeenCalledWith({
          data: { ...productData, tenantId: mockTenantId },
          include: {
            productImages: true,
            productVariants: true,
          },
        })
      })

      it('debe lanzar error cuando el SKU ya existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findFirst.mockResolvedValue(mockProduct) // SKU existe

        // Act & Assert
        await expect(
          service.createProduct(productData, mockTenantId)
        ).rejects.toThrow('El SKU ya existe')

        expect(mockPrisma.product.create).not.toHaveBeenCalled()
      })

      it('debe lanzar error cuando el código de barras ya existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findFirst
          .mockResolvedValueOnce(null) // SKU no existe
          .mockResolvedValueOnce(mockProduct) // Barcode existe

        // Act & Assert
        await expect(
          service.createProduct(productData, mockTenantId)
        ).rejects.toThrow('El código de barras ya existe')

        expect(mockPrisma.product.create).not.toHaveBeenCalled()
      })
    })

    describe('updateProduct', () => {
      const updateData = {
        name: 'Producto Actualizado',
        price: 120.0,
      }

      it('debe actualizar producto exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const updatedProduct = { ...mockProduct, ...updateData }

        mockPrisma.product.findFirst.mockResolvedValue(mockProduct) // Producto existe
        mockPrisma.product.update.mockResolvedValue(updatedProduct)

        // Act
        const result = await service.updateProduct(
          'product-123',
          updateData,
          mockTenantId
        )

        // Assert
        expect(result).toEqual(updatedProduct)
        expect(mockPrisma.product.update).toHaveBeenCalledWith({
          where: { id: 'product-123' },
          data: updateData,
          include: {
            productImages: true,
            productVariants: true,
          },
        })
      })

      it('debe lanzar error cuando el producto no existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findFirst.mockResolvedValue(null)

        // Act & Assert
        await expect(
          service.updateProduct('product-not-found', updateData, mockTenantId)
        ).rejects.toThrow('Producto no encontrado')

        expect(mockPrisma.product.update).not.toHaveBeenCalled()
      })
    })

    describe('deleteProduct', () => {
      it('debe eliminar producto exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findFirst.mockResolvedValue(mockProduct) // Producto existe
        mockPrisma.orderItem.findFirst.mockResolvedValue(null) // No tiene órdenes
        mockPrisma.product.delete.mockResolvedValue(mockProduct)

        // Act
        const result = await service.deleteProduct('product-123', mockTenantId)

        // Assert
        expect(result).toEqual(mockProduct)
        expect(mockPrisma.product.delete).toHaveBeenCalledWith({
          where: { id: 'product-123' },
        })
      })

      it('debe lanzar error cuando el producto no existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findFirst.mockResolvedValue(null)

        // Act & Assert
        await expect(
          service.deleteProduct('product-not-found', mockTenantId)
        ).rejects.toThrow('Producto no encontrado')

        expect(mockPrisma.product.delete).not.toHaveBeenCalled()
      })

      it('debe lanzar error cuando el producto tiene órdenes asociadas', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findFirst.mockResolvedValue(mockProduct) // Producto existe
        mockPrisma.orderItem.findFirst.mockResolvedValue({
          id: 'order-item-123',
        }) // Tiene órdenes

        // Act & Assert
        await expect(
          service.deleteProduct('product-123', mockTenantId)
        ).rejects.toThrow(
          'No se puede eliminar el producto porque tiene órdenes asociadas'
        )

        expect(mockPrisma.product.delete).not.toHaveBeenCalled()
      })
    })
  })

  // ========================================
  // TESTS PARA PROVEEDORES
  // ========================================

  describe('Proveedores', () => {
    describe('getSuppliers', () => {
      it('debe listar proveedores exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const mockSuppliers = [mockSupplier]
        const mockTotal = 1

        mockPrisma.supplier.findMany.mockResolvedValue(mockSuppliers)
        mockPrisma.supplier.count.mockResolvedValue(mockTotal)

        // Act
        const result = await service.getSuppliers(mockTenantId)

        // Assert
        expect(result.suppliers).toEqual(mockSuppliers)
        expect(result.total).toBe(mockTotal)
        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.pages).toBe(1)
      })

      it('debe aplicar filtros de búsqueda correctamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const filters = { search: 'test' }
        const mockSuppliers = [mockSupplier]
        const mockTotal = 1

        mockPrisma.supplier.findMany.mockResolvedValue(mockSuppliers)
        mockPrisma.supplier.count.mockResolvedValue(mockTotal)

        // Act
        const result = await service.getSuppliers(mockTenantId, filters)

        // Assert
        expect(result.suppliers).toEqual(mockSuppliers)
        expect(mockPrisma.supplier.findMany).toHaveBeenCalledWith({
          where: {
            tenantId: mockTenantId,
            OR: [
              { name: { contains: 'test', mode: 'insensitive' } },
              { email: { contains: 'test', mode: 'insensitive' } },
              { contactName: { contains: 'test', mode: 'insensitive' } },
              { taxId: { contains: 'test', mode: 'insensitive' } },
            ],
          },
          include: {
            products: {
              include: {
                product: true,
              },
            },
            _count: {
              select: {
                purchaseOrders: true,
                products: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 10,
        })
      })
    })

    describe('getSupplierById', () => {
      it('debe obtener proveedor por ID exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const supplierId = 'supplier-123'
        const mockSupplierWithDetails = {
          ...mockSupplier,
          purchaseOrders: [],
          _count: {
            purchaseOrders: 0,
            products: 0,
          },
        }

        mockPrisma.supplier.findFirst.mockResolvedValue(mockSupplierWithDetails)

        // Act
        const result = await service.getSupplierById(supplierId, mockTenantId)

        // Assert
        expect(result).toEqual(mockSupplierWithDetails)
        expect(mockPrisma.supplier.findFirst).toHaveBeenCalledWith({
          where: { id: supplierId, tenantId: mockTenantId },
          include: {
            products: {
              include: {
                product: true,
              },
            },
            purchaseOrders: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
            _count: {
              select: {
                purchaseOrders: true,
                products: true,
              },
            },
          },
        })
      })

      it('debe retornar null cuando el proveedor no existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const supplierId = 'supplier-not-found'
        mockPrisma.supplier.findFirst.mockResolvedValue(null)

        // Act
        const result = await service.getSupplierById(supplierId, mockTenantId)

        // Assert
        expect(result).toBeNull()
      })
    })

    describe('createSupplier', () => {
      const supplierData = {
        name: 'Nuevo Proveedor',
        email: 'nuevo@proveedor.com',
        phone: '+52 55 9876 5432',
        address: {
          street: 'Nueva Calle 456',
          city: 'Nueva Ciudad',
          state: 'Nuevo Estado',
          zipCode: '54321',
          country: 'México',
        },
        contactName: 'Nuevo Contacto',
        taxId: 'TAX987654',
        paymentTerms: 45,
        isActive: true,
        notes: 'Notas del nuevo proveedor',
      }

      it('debe crear proveedor exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const createdSupplier = {
          ...supplierData,
          id: 'new-supplier-123',
          tenantId: mockTenantId,
        }

        mockPrisma.supplier.findFirst.mockResolvedValue(null) // Nombre no existe
        mockPrisma.supplier.create.mockResolvedValue(createdSupplier)

        // Act
        const result = await service.createSupplier(supplierData, mockTenantId)

        // Assert
        expect(result).toEqual(createdSupplier)
        expect(mockPrisma.supplier.create).toHaveBeenCalledWith({
          data: { ...supplierData, tenantId: mockTenantId },
          include: {
            _count: {
              select: {
                purchaseOrders: true,
                products: true,
              },
            },
          },
        })
      })

      it('debe lanzar error cuando el nombre ya existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.supplier.findFirst.mockResolvedValue(mockSupplier) // Nombre existe

        // Act & Assert
        await expect(
          service.createSupplier(supplierData, mockTenantId)
        ).rejects.toThrow('Ya existe un proveedor con ese nombre')

        expect(mockPrisma.supplier.create).not.toHaveBeenCalled()
      })
    })

    describe('updateSupplier', () => {
      const updateData = {
        name: 'Proveedor Actualizado',
        email: 'actualizado@proveedor.com',
      }

      it('debe actualizar proveedor exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const updatedSupplier = { ...mockSupplier, ...updateData }

        mockPrisma.supplier.findFirst
          .mockResolvedValueOnce(mockSupplier) // Proveedor existe
          .mockResolvedValueOnce(null) // Nombre no existe (para validación)
        mockPrisma.supplier.update.mockResolvedValue(updatedSupplier)

        // Act
        const result = await service.updateSupplier(
          'supplier-123',
          updateData,
          mockTenantId
        )

        // Assert
        expect(result).toEqual(updatedSupplier)
        expect(mockPrisma.supplier.update).toHaveBeenCalledWith({
          where: { id: 'supplier-123' },
          data: updateData,
          include: {
            _count: {
              select: {
                purchaseOrders: true,
                products: true,
              },
            },
          },
        })
      })

      it('debe lanzar error cuando el proveedor no existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.supplier.findFirst.mockResolvedValue(null)

        // Act & Assert
        await expect(
          service.updateSupplier('supplier-not-found', updateData, mockTenantId)
        ).rejects.toThrow('Proveedor no encontrado')

        expect(mockPrisma.supplier.update).not.toHaveBeenCalled()
      })
    })

    describe('deleteSupplier', () => {
      it('debe eliminar proveedor exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.supplier.findFirst.mockResolvedValue(mockSupplier) // Proveedor existe
        mockPrisma.purchaseOrder.findFirst.mockResolvedValue(null) // No tiene órdenes de compra
        mockPrisma.supplier.delete.mockResolvedValue(mockSupplier)

        // Act
        const result = await service.deleteSupplier(
          'supplier-123',
          mockTenantId
        )

        // Assert
        expect(result).toEqual(mockSupplier)
        expect(mockPrisma.supplier.delete).toHaveBeenCalledWith({
          where: { id: 'supplier-123' },
        })
      })

      it('debe lanzar error cuando el proveedor no existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.supplier.findFirst.mockResolvedValue(null)

        // Act & Assert
        await expect(
          service.deleteSupplier('supplier-not-found', mockTenantId)
        ).rejects.toThrow('Proveedor no encontrado')

        expect(mockPrisma.supplier.delete).not.toHaveBeenCalled()
      })

      it('debe lanzar error cuando el proveedor tiene órdenes de compra asociadas', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.supplier.findFirst.mockResolvedValue(mockSupplier) // Proveedor existe
        mockPrisma.purchaseOrder.findFirst.mockResolvedValue({
          id: 'purchase-order-123',
        }) // Tiene órdenes

        // Act & Assert
        await expect(
          service.deleteSupplier('supplier-123', mockTenantId)
        ).rejects.toThrow(
          'No se puede eliminar el proveedor porque tiene órdenes de compra asociadas'
        )

        expect(mockPrisma.supplier.delete).not.toHaveBeenCalled()
      })
    })
  })

  // ========================================
  // TESTS PARA MOVIMIENTOS DE STOCK
  // ========================================

  describe('Movimientos de Stock', () => {
    describe('createStockMovement', () => {
      const stockMovementData = {
        productId: 'product-123',
        type: 'IN' as const,
        quantity: 10,
        reason: 'Compra',
        reference: 'REF-123',
        notes: 'Notas del movimiento',
      }

      it('debe crear movimiento de stock de entrada exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const productWithStock = { ...mockProduct, stock: 20 }
        const createdMovement = { ...mockStockMovement, ...stockMovementData }

        mockPrisma.product.findFirst.mockResolvedValue(productWithStock)
        mockPrisma.stockMovement.create.mockResolvedValue(createdMovement)
        mockPrisma.product.update.mockResolvedValue({
          ...productWithStock,
          stock: 30,
        })

        // Act
        const result = await service.createStockMovement(
          stockMovementData,
          mockTenantId,
          mockUserId
        )

        // Assert
        expect(result).toEqual(createdMovement)
        expect(mockPrisma.stockMovement.create).toHaveBeenCalledWith({
          data: {
            ...stockMovementData,
            tenantId: mockTenantId,
            userId: mockUserId,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        })
        expect(mockPrisma.product.update).toHaveBeenCalledWith({
          where: { id: stockMovementData.productId },
          data: { stock: 30 },
        })
      })

      it('debe crear movimiento de stock de salida exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const stockMovementDataOut = {
          ...stockMovementData,
          type: 'OUT' as const,
        }
        const productWithStock = { ...mockProduct, stock: 20 }
        const createdMovement = {
          ...mockStockMovement,
          ...stockMovementDataOut,
        }

        mockPrisma.product.findFirst.mockResolvedValue(productWithStock)
        mockPrisma.stockMovement.create.mockResolvedValue(createdMovement)
        mockPrisma.product.update.mockResolvedValue({
          ...productWithStock,
          stock: 10,
        })

        // Act
        const result = await service.createStockMovement(
          stockMovementDataOut,
          mockTenantId,
          mockUserId
        )

        // Assert
        expect(result).toEqual(createdMovement)
        expect(mockPrisma.product.update).toHaveBeenCalledWith({
          where: { id: stockMovementDataOut.productId },
          data: { stock: 10 },
        })
      })

      it('debe lanzar error cuando el producto no existe', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        mockPrisma.product.findFirst.mockResolvedValue(null)

        // Act & Assert
        await expect(
          service.createStockMovement(
            stockMovementData,
            mockTenantId,
            mockUserId
          )
        ).rejects.toThrow('Producto no encontrado')

        expect(mockPrisma.stockMovement.create).not.toHaveBeenCalled()
      })

      it('debe lanzar error cuando no hay stock suficiente para salida', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const stockMovementDataOut = {
          ...stockMovementData,
          type: 'OUT' as const,
          quantity: 30,
        }
        const productWithLowStock = { ...mockProduct, stock: 20 }

        mockPrisma.product.findFirst.mockResolvedValue(productWithLowStock)

        // Act & Assert
        await expect(
          service.createStockMovement(
            stockMovementDataOut,
            mockTenantId,
            mockUserId
          )
        ).rejects.toThrow('Stock insuficiente')

        expect(mockPrisma.stockMovement.create).not.toHaveBeenCalled()
      })
    })

    describe('getStockMovements', () => {
      it('debe listar movimientos de stock exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const mockMovements = [mockStockMovement]
        const mockTotal = 1

        mockPrisma.stockMovement.findMany.mockResolvedValue(mockMovements)
        mockPrisma.stockMovement.count.mockResolvedValue(mockTotal)

        // Act
        const result = await service.getStockMovements(mockTenantId)

        // Assert
        expect(result.stockMovements).toEqual(mockMovements)
        expect(result.total).toBe(mockTotal)
        expect(result.page).toBe(1)
        expect(result.limit).toBe(10)
        expect(result.pages).toBe(1)
      })

      it('debe aplicar filtros correctamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const filters = {
          productId: 'product-123',
          type: 'IN' as const,
          startDate: '2025-01-01T00:00:00.000Z',
          endDate: '2025-01-31T23:59:59.999Z',
        }
        const mockMovements = [mockStockMovement]
        const mockTotal = 1

        mockPrisma.stockMovement.findMany.mockResolvedValue(mockMovements)
        mockPrisma.stockMovement.count.mockResolvedValue(mockTotal)

        // Act
        const result = await service.getStockMovements(mockTenantId, filters)

        // Assert
        expect(result.stockMovements).toEqual(mockMovements)
        expect(mockPrisma.stockMovement.findMany).toHaveBeenCalledWith({
          where: {
            tenantId: mockTenantId,
            productId: 'product-123',
            type: 'IN',
            createdAt: {
              gte: new Date('2025-01-01T00:00:00.000Z'),
              lte: new Date('2025-01-31T23:59:59.999Z'),
            },
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: 0,
          take: 10,
        })
      })
    })
  })

  // ========================================
  // TESTS PARA DASHBOARD
  // ========================================

  describe('Dashboard', () => {
    describe('getDashboardStats', () => {
      it('debe obtener estadísticas del dashboard exitosamente', async () => {
        // Arrange
        const service = new InventoryService(mockPrisma as any)
        const mockStats = {
          totalProducts: 100,
          activeProducts: 95,
          totalSuppliers: 25,
          activeSuppliers: 20,
          totalPurchaseOrders: 50,
          pendingPurchaseOrders: 5,
          totalStockMovements: 200,
          lowStockProducts: 10,
          outOfStockProducts: 2,
          activeAlerts: 12,
        }

        mockPrisma.product.count
          .mockResolvedValueOnce(100) // totalProducts
          .mockResolvedValueOnce(95) // activeProducts
        mockPrisma.supplier.count
          .mockResolvedValueOnce(25) // totalSuppliers
          .mockResolvedValueOnce(20) // activeSuppliers
        mockPrisma.purchaseOrder.count
          .mockResolvedValueOnce(50) // totalPurchaseOrders
          .mockResolvedValueOnce(5) // pendingPurchaseOrders
        mockPrisma.stockMovement.count.mockResolvedValue(200) // totalStockMovements
        mockPrisma.product.count
          .mockResolvedValueOnce(10) // lowStockProducts
          .mockResolvedValueOnce(2) // outOfStockProducts
        mockPrisma.inventoryAlert.count.mockResolvedValue(12) // activeAlerts

        // Act
        const result = await service.getDashboardStats(mockTenantId)

        // Assert
        expect(result).toEqual(mockStats)
        expect(mockPrisma.product.count).toHaveBeenCalledTimes(4)
        expect(mockPrisma.supplier.count).toHaveBeenCalledTimes(2)
        expect(mockPrisma.purchaseOrder.count).toHaveBeenCalledTimes(2)
        expect(mockPrisma.stockMovement.count).toHaveBeenCalledTimes(1)
        expect(mockPrisma.inventoryAlert.count).toHaveBeenCalledTimes(1)
      })
    })
  })
})
