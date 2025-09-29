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

// Crear un nuevo producto
export async function createProduct(
  data: CreateProductInput,
  tenantId: string
): Promise<Product> {
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
}

// Obtener producto por ID
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

// Obtener producto por SKU
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

// Obtener todos los productos con filtros y paginación
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

// Actualizar producto
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

// Eliminar producto
export async function deleteProduct(
  id: string,
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

  // Verificar que no tenga órdenes asociadas
  const orderItemsCount = await prisma.orderItem.count({
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
  return prisma.product.delete({
    where: { id },
  })
}

// Activar/desactivar producto
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

// Actualizar stock de producto
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

  // TODO: Aquí podrías crear un registro de movimiento de stock
  // await createStockMovement(id, stockUpdate, existingProduct.stock, newStock, tenantId)

  return updatedProduct
}

// Obtener productos con stock bajo
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

// Obtener estadísticas de stock
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

// Buscar productos por nombre o SKU (para autocompletado)
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

// Obtener categorías únicas
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

// Obtener marcas únicas
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
