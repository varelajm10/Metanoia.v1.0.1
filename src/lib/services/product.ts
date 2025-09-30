import { PrismaClient, Product } from '@prisma/client'
import {
  CreateProductInput,
  UpdateProductInput,
  UpdateStockInput,
  ProductQuery,
} from '@/lib/validations/product'

const prisma = new PrismaClient()

export interface ProductWithRelations extends Product {
  _count?: {
    orderItems: number
  }
}

/**
 * Crea un nuevo producto en el sistema
 * @param data - Datos del producto a crear
 * @param tenantId - ID del tenant al que pertenece el producto
 * @returns Promise<Product> - Producto creado
 * @throws Error si el SKU ya existe en el tenant o si maxStock <= minStock
 */
export async function createProduct(
  data: CreateProductInput,
  tenantId: string
): Promise<Product> {
  try {
    // Verificar que el SKU no exista en el tenant
    const existingProduct = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        tenantId,
      },
    })

    if (existingProduct) {
      throw new Error('Ya existe un producto con este SKU en el tenant')
    }

    // Validar que maxStock sea mayor que minStock si ambos están definidos
    if (data.maxStock && data.minStock && data.maxStock <= data.minStock) {
      throw new Error('El stock máximo debe ser mayor que el stock mínimo')
    }

    return prisma.product.create({
      data: {
        ...data,
        tenantId,
      },
    })
  } catch (error) {
    console.error('Error en createProduct:', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      data: {
        sku: data.sku,
        name: data.name,
        tenantId,
      },
    })
    throw error
  }
}

/**
 * Obtiene un producto por su ID
 * @param id - ID del producto
 * @param tenantId - ID del tenant
 * @returns Promise<ProductWithRelations | null> - Producto encontrado o null si no existe
 */
export async function getProductById(
  id: string,
  tenantId: string
): Promise<ProductWithRelations | null> {
  return prisma.product.findFirst({
    where: {
      id,
      tenantId,
    },
    include: {
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
  })
}

/**
 * Obtiene un producto por su SKU
 * @param sku - SKU del producto
 * @param tenantId - ID del tenant
 * @returns Promise<Product | null> - Producto encontrado o null si no existe
 */
export async function getProductBySku(
  sku: string,
  tenantId: string
): Promise<Product | null> {
  return prisma.product.findFirst({
    where: {
      sku,
      tenantId,
    },
  })
}

/**
 * Obtiene todos los productos con filtros y paginación
 * @param query - Parámetros de consulta y filtros
 * @param tenantId - ID del tenant
 * @returns Promise con lista de productos y información de paginación
 */
export async function getProducts(
  query: ProductQuery,
  tenantId: string
): Promise<{
  products: ProductWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}> {
  const {
    page,
    limit,
    search,
    category,
    brand,
    isActive,
    isDigital,
    lowStock,
    sortBy,
    sortOrder,
  } = query
  const skip = (page - 1) * limit

  // Construir filtros
  const where: any = {
    tenantId,
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { contains: category, mode: 'insensitive' }
  }

  if (brand) {
    where.brand = { contains: brand, mode: 'insensitive' }
  }

  if (isActive !== undefined) {
    where.isActive = isActive
  }

  if (isDigital !== undefined) {
    where.isDigital = isDigital
  }

  if (lowStock) {
    where.AND = [
      { stock: { lte: prisma.product.fields.minStock } },
      { minStock: { gt: 0 } },
    ]
  }

  // Obtener total de registros
  const total = await prisma.product.count({ where })

  // Obtener productos con paginación
  const products = await prisma.product.findMany({
    where,
    include: {
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    skip,
    take: limit,
  })

  const totalPages = Math.ceil(total / limit)

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

/**
 * Actualiza un producto existente
 * @param id - ID del producto a actualizar
 * @param data - Datos a actualizar
 * @param tenantId - ID del tenant
 * @returns Promise<Product> - Producto actualizado
 * @throws Error si el producto no existe o el SKU ya existe en otro producto
 */
export async function updateProduct(
  id: string,
  data: UpdateProductInput,
  tenantId: string
): Promise<Product> {
  // Verificar que el producto existe y pertenece al tenant
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingProduct) {
    throw new Error('Producto no encontrado')
  }

  // Verificar que el SKU no exista en otro producto del mismo tenant
  if (data.sku) {
    const skuExists = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        tenantId,
        id: { not: id },
      },
    })

    if (skuExists) {
      throw new Error('Ya existe otro producto con este SKU en el tenant')
    }
  }

  // Validar stock máximo y mínimo
  if (data.maxStock && data.minStock && data.maxStock <= data.minStock) {
    throw new Error('El stock máximo debe ser mayor que el stock mínimo')
  }

  return prisma.product.update({
    where: { id },
    data,
  })
}

/**
 * Elimina un producto del sistema - OPERACIÓN ATÓMICA
 * @param id - ID del producto a eliminar
 * @param tenantId - ID del tenant
 * @returns Promise<Product> - Producto eliminado
 * @throws Error si el producto no existe o tiene órdenes asociadas
 */
export async function deleteProduct(
  id: string,
  tenantId: string
): Promise<Product> {
  // Ejecutar todas las operaciones en una transacción atómica
  return await prisma.$transaction(async (tx) => {
    // Verificar que el producto existe y pertenece al tenant
    const existingProduct = await tx.product.findFirst({
      where: {
        id,
        tenantId,
      },
    })

    if (!existingProduct) {
      throw new Error('Producto no encontrado')
    }

    // Verificar que no tenga órdenes asociadas
    const orderItemsCount = await tx.orderItem.count({
      where: {
        productId: id,
      },
    })

    if (orderItemsCount > 0) {
      throw new Error(
        'No se puede eliminar el producto porque tiene órdenes asociadas'
      )
    }

    // Eliminar físicamente el producto
    return await tx.product.delete({
      where: { id },
    })
  })
}

/**
 * Activa o desactiva un producto
 * @param id - ID del producto
 * @param tenantId - ID del tenant
 * @param isActive - Estado de activación
 * @returns Promise<Product> - Producto actualizado
 * @throws Error si el producto no existe
 */
export async function toggleProductStatus(
  id: string,
  tenantId: string,
  isActive: boolean
): Promise<Product> {
  // Verificar que el producto existe y pertenece al tenant
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingProduct) {
    throw new Error('Producto no encontrado')
  }

  return prisma.product.update({
    where: { id },
    data: { isActive },
  })
}

/**
 * Actualiza el stock de un producto
 * @param id - ID del producto
 * @param stockUpdate - Datos de actualización de stock
 * @param tenantId - ID del tenant
 * @returns Promise<Product> - Producto actualizado
 * @throws Error si el producto no existe o no hay suficiente stock
 */
export async function updateProductStock(
  id: string,
  stockUpdate: UpdateStockInput,
  tenantId: string
): Promise<Product> {
  // Verificar que el producto existe y pertenece al tenant
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      tenantId,
    },
  })

  if (!existingProduct) {
    throw new Error('Producto no encontrado')
  }

  const { quantity, type, reason, notes } = stockUpdate
  let newStock = existingProduct.stock

  // Calcular nuevo stock basado en el tipo de movimiento
  switch (type) {
    case 'in':
      newStock += quantity
      break
    case 'out':
      newStock -= quantity
      if (newStock < 0) {
        throw new Error('No hay suficiente stock para esta operación')
      }
      break
    case 'adjustment':
      newStock = quantity
      break
  }

  // Actualizar el producto
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { stock: newStock },
  })

  // await createStockMovement(id, stockUpdate, existingProduct.stock, newStock, tenantId)

  return updatedProduct
}

/**
 * Obtiene productos con stock bajo
 * @param tenantId - ID del tenant
 * @param limit - Límite de resultados (por defecto 50)
 * @returns Promise<Product[]> - Lista de productos con stock bajo
 */
export async function getLowStockProducts(
  tenantId: string,
  limit: number = 50
): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      tenantId,
      isActive: true,
      AND: [
        { stock: { lte: prisma.product.fields.minStock } },
        { minStock: { gt: 0 } },
      ],
    },
    orderBy: {
      stock: 'asc',
    },
    take: limit,
  })
}

/**
 * Obtiene estadísticas de stock del inventario
 * @param tenantId - ID del tenant
 * @returns Promise con estadísticas detalladas del stock
 */
export async function getStockStats(tenantId: string) {
  const [
    totalProducts,
    totalStock,
    lowStockProducts,
    outOfStockProducts,
    productsWithCost,
  ] = await Promise.all([
    prisma.product.count({
      where: { tenantId, isActive: true },
    }),
    prisma.product.aggregate({
      where: { tenantId, isActive: true },
      _sum: { stock: true },
    }),
    prisma.product.count({
      where: {
        tenantId,
        isActive: true,
        AND: [
          { stock: { lte: prisma.product.fields.minStock } },
          { minStock: { gt: 0 } },
        ],
      },
    }),
    prisma.product.count({
      where: { tenantId, isActive: true, stock: 0 },
    }),
    prisma.product.findMany({
      where: { tenantId, isActive: true, cost: { not: null } },
      select: { stock: true, cost: true },
    }),
  ])

  // Calcular valor total del inventario
  const totalValue = productsWithCost.reduce((sum, product) => {
    return sum + product.stock * Number(product.cost || 0)
  }, 0)

  // Obtener estadísticas por categoría
  const categories = await prisma.product.groupBy({
    by: ['category'],
    where: { tenantId, isActive: true, category: { not: null } },
    _count: { id: true },
    _sum: { stock: true },
  })

  return {
    totalProducts,
    totalStock: totalStock._sum.stock || 0,
    totalValue,
    lowStockProducts,
    outOfStockProducts,
    categories: categories.map(cat => ({
      name: cat.category || 'Sin categoría',
      count: cat._count.id,
      totalStock: cat._sum.stock || 0,
    })),
  }
}

/**
 * Busca productos por nombre o SKU para autocompletado
 * @param query - Término de búsqueda
 * @param tenantId - ID del tenant
 * @param limit - Límite de resultados (por defecto 10)
 * @returns Promise<Product[]> - Lista de productos encontrados
 */
export async function searchProducts(
  query: string,
  tenantId: string,
  limit: number = 10
): Promise<Product[]> {
  if (!query || query.trim().length < 2) {
    return []
  }

  return prisma.product.findMany({
    where: {
      tenantId,
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      name: 'asc',
    },
    take: limit,
  })
}

/**
 * Obtiene todas las categorías únicas de productos
 * @param tenantId - ID del tenant
 * @returns Promise<string[]> - Lista de categorías únicas
 */
export async function getProductCategories(
  tenantId: string
): Promise<string[]> {
  const categories = await prisma.product.findMany({
    where: {
      tenantId,
      isActive: true,
      category: { not: null },
    },
    select: { category: true },
    distinct: ['category'],
  })

  return categories
    .map(c => c.category)
    .filter((category): category is string => category !== null)
    .sort()
}

/**
 * Obtiene todas las marcas únicas de productos
 * @param tenantId - ID del tenant
 * @returns Promise<string[]> - Lista de marcas únicas
 */
export async function getProductBrands(tenantId: string): Promise<string[]> {
  const brands = await prisma.product.findMany({
    where: {
      tenantId,
      isActive: true,
      brand: { not: null },
    },
    select: { brand: true },
    distinct: ['brand'],
  })

  return brands
    .map(b => b.brand)
    .filter((brand): brand is string => brand !== null)
    .sort()
}
