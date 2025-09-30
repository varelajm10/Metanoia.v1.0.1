import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Esquema de validación para movimientos de stock
const stockMovementSchema = z.object({
  productId: z.string().min(1, 'El producto es requerido'),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER'], {
    errorMap: () => ({ message: 'Tipo de movimiento inválido' }),
  }),
  quantity: z.number().int().positive('La cantidad debe ser positiva'),
  reason: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

// GET /api/inventory/stock-movements - Obtener movimientos de stock
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const productId = searchParams.get('productId') || ''
    const type = searchParams.get('type') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    const where: any = {
      tenantId,
    }

    if (productId) {
      where.productId = productId
    }

    if (type) {
      where.type = type
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    const [stockMovements, total] = await Promise.all([
      prisma.stockMovement.findMany({
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
      prisma.stockMovement.count({ where }),
    ])

    return NextResponse.json({
      stockMovements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/stock-movements - Crear movimiento de stock
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')
    const userId = request.headers.get('x-user-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID requerido' }, { status: 400 })
    }

    const validatedData = stockMovementSchema.parse(body)

    // Verificar que el producto existe
    const product = await prisma.product.findFirst({
      where: {
        id: validatedData.productId,
        tenantId,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Verificar stock disponible para salidas
    if (
      validatedData.type === 'OUT' &&
      product.stock < validatedData.quantity
    ) {
      return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 })
    }

    // Crear el movimiento de stock
    const stockMovement = await prisma.stockMovement.create({
      data: {
        ...validatedData,
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
      validatedData.type === 'IN'
        ? product.stock + validatedData.quantity
        : product.stock - validatedData.quantity

    await prisma.product.update({
      where: { id: validatedData.productId },
      data: { stock: newStock },
    })

    // Verificar alertas de stock bajo
    if (newStock <= product.minStock) {
      await prisma.inventoryAlert.create({
        data: {
          productId: validatedData.productId,
          type: newStock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
          message:
            newStock === 0
              ? `El producto ${product.name} está agotado`
              : `El producto ${product.name} tiene stock bajo (${newStock} unidades)`,
          tenantId,
        },
      })
    }

    return NextResponse.json(stockMovement, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating stock movement:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
