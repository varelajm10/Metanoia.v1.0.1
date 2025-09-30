import { PrismaClient } from '@prisma/client'
import {
  Product,
  Supplier,
  PurchaseOrder,
  StockMovement,
  ProductFilters,
  SupplierFilters,
  PurchaseOrderFilters,
  StockMovementFilters,
} from '@/lib/validations/inventory'

// Instancia por defecto para compatibilidad hacia atrás
const defaultPrisma = new PrismaClient()

export class InventoryService {
  constructor(private prisma: PrismaClient = defaultPrisma) {}

  // ========================================
  // MÉTODOS ESTÁTICOS PARA COMPATIBILIDAD HACIA ATRÁS
  // ========================================

  /**
   * Obtiene productos con filtros y paginación (método estático)
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda para productos
   * @param page - Número de página para paginación
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de productos y metadatos de paginación
   */
  static async getProducts(
    tenantId: string,
    filters: ProductFilters = {},
    page = 1,
    limit = 10
  ) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.getProducts(tenantId, filters, page, limit)
  }

  /**
   * Obtiene un producto por su ID (método estático)
   * @param id - ID del producto
   * @param tenantId - ID del tenant
   * @returns Promise con el producto encontrado o null si no existe
   */
  static async getProductById(id: string, tenantId: string) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.getProductById(id, tenantId)
  }

  /**
   * Crea un nuevo producto (método estático)
   * @param data - Datos del producto a crear
   * @param tenantId - ID del tenant
   * @returns Promise con el producto creado
   * @throws Error si el SKU ya existe o hay errores de validación
   */
  static async createProduct(data: Product, tenantId: string) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.createProduct(data, tenantId)
  }

  static async updateProduct(
    id: string,
    data: Partial<Product>,
    tenantId: string
  ) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.updateProduct(id, data, tenantId)
  }

  static async deleteProduct(id: string, tenantId: string) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.deleteProduct(id, tenantId)
  }

  static async getSuppliers(
    tenantId: string,
    filters: SupplierFilters = {},
    page = 1,
    limit = 10
  ) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.getSuppliers(tenantId, filters, page, limit)
  }

  static async getSupplierById(id: string, tenantId: string) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.getSupplierById(id, tenantId)
  }

  static async createSupplier(data: Supplier, tenantId: string) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.createSupplier(data, tenantId)
  }

  static async updateSupplier(
    id: string,
    data: Partial<Supplier>,
    tenantId: string
  ) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.updateSupplier(id, data, tenantId)
  }

  static async deleteSupplier(id: string, tenantId: string) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.deleteSupplier(id, tenantId)
  }

  /**
   * Crea un movimiento de stock (método estático)
   * @param data - Datos del movimiento de stock
   * @param tenantId - ID del tenant
   * @param userId - ID del usuario que realiza el movimiento
   * @returns Promise con el movimiento de stock creado
   * @throws Error si no hay suficiente stock o hay errores de validación
   */
  static async createStockMovement(
    data: StockMovement,
    tenantId: string,
    userId: string
  ) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.createStockMovement(data, tenantId, userId)
  }

  static async getStockMovements(
    tenantId: string,
    filters: StockMovementFilters = {},
    page = 1,
    limit = 10
  ) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.getStockMovements(tenantId, filters, page, limit)
  }

  /**
   * Obtiene estadísticas del dashboard de inventario (método estático)
   * @param tenantId - ID del tenant
   * @returns Promise con estadísticas completas del inventario
   */
  static async getDashboardStats(tenantId: string) {
    const service = new InventoryService(
      new (require('@prisma/client').PrismaClient)()
    )
    return service.getDashboardStats(tenantId)
  }

  // ========================================
  // MÉTODOS DE INSTANCIA
  // ========================================

  /**
   * Obtiene productos con filtros avanzados y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda (nombre, SKU, categoría, marca, stock, precio)
   * @param page - Número de página para paginación
   * @param limit - Límite de resultados por página
   * @returns Promise con lista paginada de productos y metadatos
   */
  async getProducts(
    tenantId: string,
    filters: ProductFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { barcode: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.category) {
      where.category = filters.category
    }

    if (filters.brand) {
      where.brand = filters.brand
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.minPrice !== undefined) {
      where.price = { ...where.price, gte: filters.minPrice }
    }

    if (filters.maxPrice !== undefined) {
      where.price = { ...where.price, lte: filters.maxPrice }
    }

    if (filters.minStock !== undefined) {
      where.stock = { ...where.stock, gte: filters.minStock }
    }

    if (filters.maxStock !== undefined) {
      where.stock = { ...where.stock, lte: filters.maxStock }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          productImages: true,
          productVariants: true,
          inventoryAlerts: {
            where: { isActive: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ])

    return { products, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async getProductById(id: string, tenantId: string) {
    return this.prisma.product.findFirst({
      where: { id, tenantId },
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
  }

  async createProduct(data: Product, tenantId: string) {
    // Verificar SKU único
    if (data.sku) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { sku: data.sku, tenantId },
      })
      if (existingProduct) {
        throw new Error('El SKU ya existe')
      }
    }

    // Verificar código de barras único
    if (data.barcode) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { barcode: data.barcode, tenantId },
      })
      if (existingProduct) {
        throw new Error('El código de barras ya existe')
      }
    }

    return this.prisma.product.create({
      data: { ...data, tenantId },
      include: {
        productImages: true,
        productVariants: true,
      },
    })
  }

  async updateProduct(id: string, data: Partial<Product>, tenantId: string) {
    const existingProduct = await this.prisma.product.findFirst({
      where: { id, tenantId },
    })

    if (!existingProduct) {
      throw new Error('Producto no encontrado')
    }

    // Verificar SKU único si se está cambiando
    if (data.sku && data.sku !== existingProduct.sku) {
      const skuExists = await this.prisma.product.findFirst({
        where: { sku: data.sku, tenantId, id: { not: id } },
      })
      if (skuExists) {
        throw new Error('El SKU ya existe')
      }
    }

    // Verificar código de barras único si se está cambiando
    if (data.barcode && data.barcode !== existingProduct.barcode) {
      const barcodeExists = await this.prisma.product.findFirst({
        where: { barcode: data.barcode, tenantId, id: { not: id } },
      })
      if (barcodeExists) {
        throw new Error('El código de barras ya existe')
      }
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        productImages: true,
        productVariants: true,
      },
    })
  }

  async deleteProduct(id: string, tenantId: string) {
    const existingProduct = await this.prisma.product.findFirst({
      where: { id, tenantId },
    })

    if (!existingProduct) {
      throw new Error('Producto no encontrado')
    }

    // Verificar si tiene órdenes asociadas
    const hasOrders = await this.prisma.orderItem.findFirst({
      where: { productId: id },
    })

    if (hasOrders) {
      throw new Error(
        'No se puede eliminar el producto porque tiene órdenes asociadas'
      )
    }

    return this.prisma.product.delete({ where: { id } })
  }

  // ========================================
  // PROVEEDORES
  // ========================================

  async getSuppliers(
    tenantId: string,
    filters: SupplierFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { contactName: { contains: filters.search, mode: 'insensitive' } },
        { taxId: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.paymentTerms !== undefined) {
      where.paymentTerms = filters.paymentTerms
    }

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.supplier.count({ where }),
    ])

    return { suppliers, total, page, limit, pages: Math.ceil(total / limit) }
  }

  async getSupplierById(id: string, tenantId: string) {
    return this.prisma.supplier.findFirst({
      where: { id, tenantId },
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
  }

  async createSupplier(data: Supplier, tenantId: string) {
    // Verificar nombre único
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: { name: data.name, tenantId },
    })

    if (existingSupplier) {
      throw new Error('Ya existe un proveedor con ese nombre')
    }

    return this.prisma.supplier.create({
      data: { ...data, tenantId },
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            products: true,
          },
        },
      },
    })
  }

  async updateSupplier(id: string, data: Partial<Supplier>, tenantId: string) {
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: { id, tenantId },
    })

    if (!existingSupplier) {
      throw new Error('Proveedor no encontrado')
    }

    // Verificar nombre único si se está cambiando
    if (data.name && data.name !== existingSupplier.name) {
      const nameExists = await this.prisma.supplier.findFirst({
        where: { name: data.name, tenantId, id: { not: id } },
      })
      if (nameExists) {
        throw new Error('Ya existe un proveedor con ese nombre')
      }
    }

    return this.prisma.supplier.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            products: true,
          },
        },
      },
    })
  }

  async deleteSupplier(id: string, tenantId: string) {
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: { id, tenantId },
    })

    if (!existingSupplier) {
      throw new Error('Proveedor no encontrado')
    }

    // Verificar si tiene órdenes de compra asociadas
    const hasPurchaseOrders = await this.prisma.purchaseOrder.findFirst({
      where: { supplierId: id },
    })

    if (hasPurchaseOrders) {
      throw new Error(
        'No se puede eliminar el proveedor porque tiene órdenes de compra asociadas'
      )
    }

    return this.prisma.supplier.delete({ where: { id } })
  }

  // ========================================
  // MOVIMIENTOS DE STOCK
  // ========================================

  async createStockMovement(
    data: StockMovement,
    tenantId: string,
    userId: string
  ) {
    // Verificar que el producto existe
    const product = await this.prisma.product.findFirst({
      where: { id: data.productId, tenantId },
    })

    if (!product) {
      throw new Error('Producto no encontrado')
    }

    // Verificar stock disponible para salidas
    if (data.type === 'OUT' && product.stock < data.quantity) {
      throw new Error('Stock insuficiente')
    }

    // Crear el movimiento de stock
    const stockMovement = await this.prisma.stockMovement.create({
      data: {
        ...data,
        tenantId,
        userId,
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

    // Actualizar el stock del producto
    const newStock =
      data.type === 'IN'
        ? product.stock + data.quantity
        : product.stock - data.quantity

    await this.prisma.product.update({
      where: { id: data.productId },
      data: { stock: newStock },
    })

    // Verificar alertas de stock bajo
    if (newStock <= product.minStock) {
      await this.prisma.inventoryAlert.create({
        data: {
          productId: data.productId,
          type: newStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
          message:
            newStock === 0
              ? `El producto ${product.name} está agotado`
              : `El producto ${product.name} tiene stock bajo (${newStock} unidades)`,
          tenantId,
        },
      })
    }

    return stockMovement
  }

  async getStockMovements(
    tenantId: string,
    filters: StockMovementFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.productId) {
      where.productId = filters.productId
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {}
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate)
      }
    }

    const [stockMovements, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.stockMovement.count({ where }),
    ])

    return {
      stockMovements,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }
  }

  // ========================================
  // DASHBOARD
  // ========================================

  async getDashboardStats(tenantId: string) {
    const [
      totalProducts,
      activeProducts,
      totalSuppliers,
      activeSuppliers,
      totalPurchaseOrders,
      pendingPurchaseOrders,
      totalStockMovements,
      lowStockProducts,
      outOfStockProducts,
      activeAlerts,
    ] = await Promise.all([
      this.prisma.product.count({ where: { tenantId } }),
      this.prisma.product.count({ where: { tenantId, isActive: true } }),
      this.prisma.supplier.count({ where: { tenantId } }),
      this.prisma.supplier.count({ where: { tenantId, isActive: true } }),
      this.prisma.purchaseOrder.count({ where: { tenantId } }),
      this.prisma.purchaseOrder.count({
        where: { tenantId, status: 'PENDING' },
      }),
      this.prisma.stockMovement.count({ where: { tenantId } }),
      this.prisma.product.count({
        where: {
          tenantId,
          isActive: true,
          stock: { lte: this.prisma.product.fields.minStock },
        },
      }),
      this.prisma.product.count({
        where: {
          tenantId,
          isActive: true,
          stock: 0,
        },
      }),
      this.prisma.inventoryAlert.count({
        where: {
          tenantId,
          isActive: true,
        },
      }),
    ])

    return {
      totalProducts,
      activeProducts,
      totalSuppliers,
      activeSuppliers,
      totalPurchaseOrders,
      pendingPurchaseOrders,
      totalStockMovements,
      lowStockProducts,
      outOfStockProducts,
      activeAlerts,
    }
  }
}
