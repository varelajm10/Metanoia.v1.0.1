import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Esquema de validación para actualización de productos
const updateProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo').optional(),
  cost: z.number().positive('El costo debe ser positivo').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
  minStock: z.number().int().min(0, 'El stock mínimo no puede ser negativo').optional(),
  maxStock: z.number().int().positive('El stock máximo debe ser positivo').optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  weight: z.number().positive('El peso debe ser positivo').optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  isActive: z.boolean().optional(),
  isDigital: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/inventory/products/[id] - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        tenantId,
      },
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

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/inventory/products/[id] - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const validatedData = updateProductSchema.parse(body)

    // Verificar si el producto existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        tenantId,
      },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el SKU ya existe (si se está cambiando)
    if (validatedData.sku && validatedData.sku !== existingProduct.sku) {
      const skuExists = await prisma.product.findFirst({
        where: {
          sku: validatedData.sku,
          tenantId,
          id: { not: params.id },
        },
      })

      if (skuExists) {
        return NextResponse.json(
          { error: 'El SKU ya existe' },
          { status: 400 }
        )
      }
    }

    // Verificar si el código de barras ya existe (si se está cambiando)
    if (validatedData.barcode && validatedData.barcode !== existingProduct.barcode) {
      const barcodeExists = await prisma.product.findFirst({
        where: {
          barcode: validatedData.barcode,
          tenantId,
          id: { not: params.id },
        },
      })

      if (barcodeExists) {
        return NextResponse.json(
          { error: 'El código de barras ya existe' },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        productImages: true,
        productVariants: true,
        inventoryAlerts: {
          where: { isActive: true },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/inventory/products/[id] - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    // Verificar si el producto existe
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        tenantId,
      },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el producto tiene órdenes asociadas
    const hasOrders = await prisma.orderItem.findFirst({
      where: { productId: params.id },
    })

    if (hasOrders) {
      return NextResponse.json(
        { error: 'No se puede eliminar el producto porque tiene órdenes asociadas' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Producto eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
