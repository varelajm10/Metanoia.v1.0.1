import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Esquema de validación para órdenes de compra
const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'El proveedor es requerido'),
  expectedDate: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'El producto es requerido'),
        quantity: z.number().int().positive('La cantidad debe ser positiva'),
        unitPrice: z.number().positive('El precio unitario debe ser positivo'),
        discount: z
          .number()
          .min(0)
          .max(100, 'El descuento debe estar entre 0 y 100')
          .default(0),
        notes: z.string().optional(),
      })
    )
    .min(1, 'Debe incluir al menos un producto'),
})

// GET /api/inventory/purchase-orders - Obtener órdenes de compra
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const supplierId = searchParams.get('supplierId') || ''
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

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { supplier: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    const [purchaseOrders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where,
        include: {
          supplier: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          purchaseOrderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.purchaseOrder.count({ where }),
    ])

    return NextResponse.json({
      purchaseOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching purchase orders:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/purchase-orders - Crear orden de compra
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

    const validatedData = purchaseOrderSchema.parse(body)

    // Verificar que el proveedor existe
    const supplier = await prisma.supplier.findFirst({
      where: {
        id: validatedData.supplierId,
        tenantId,
        isActive: true,
      },
    })

    if (!supplier) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado o inactivo' },
        { status: 404 }
      )
    }

    // Verificar que todos los productos existen
    const productIds = validatedData.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        tenantId,
        isActive: true,
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Uno o más productos no encontrados o inactivos' },
        { status: 404 }
      )
    }

    // Generar número de orden
    const orderCount = await prisma.purchaseOrder.count({
      where: { tenantId },
    })
    const orderNumber = `PO-${String(orderCount + 1).padStart(6, '0')}`

    // Calcular totales
    let subtotal = 0
    const items = validatedData.items.map(item => {
      const discountAmount =
        (item.unitPrice * item.quantity * item.discount) / 100
      const total = item.unitPrice * item.quantity - discountAmount
      subtotal += total

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        total,
        notes: item.notes,
      }
    })

    const taxRate = 16 // IVA por defecto
    const taxAmount = (subtotal * taxRate) / 100
    const total = subtotal + taxAmount

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId: validatedData.supplierId,
        subtotal,
        taxRate,
        taxAmount,
        total,
        expectedDate: validatedData.expectedDate
          ? new Date(validatedData.expectedDate)
          : null,
        notes: validatedData.notes,
        tenantId,
        userId,
        purchaseOrderItems: {
          create: items,
        },
      },
      include: {
        supplier: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        purchaseOrderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(purchaseOrder, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating purchase order:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
