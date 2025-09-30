import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/inventory/alerts - Obtener alertas de inventario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || ''
    const isActive = searchParams.get('isActive')
    const productId = searchParams.get('productId') || ''
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

    if (type) {
      where.type = type
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    if (productId) {
      where.productId = productId
    }

    const [alerts, total] = await Promise.all([
      prisma.inventoryAlert.findMany({
        where,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              stock: true,
              minStock: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.inventoryAlert.count({ where }),
    ])

    return NextResponse.json({
      alerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching inventory alerts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/alerts - Marcar alerta como resuelta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { alertId } = body
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    if (!alertId) {
      return NextResponse.json(
        { error: 'ID de alerta requerido' },
        { status: 400 }
      )
    }

    const alert = await prisma.inventoryAlert.findFirst({
      where: {
        id: alertId,
        tenantId,
        isActive: true,
      },
    })

    if (!alert) {
      return NextResponse.json(
        { error: 'Alerta no encontrada' },
        { status: 404 }
      )
    }

    const updatedAlert = await prisma.inventoryAlert.update({
      where: { id: alertId },
      data: {
        isActive: false,
        resolvedAt: new Date(),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            stock: true,
            minStock: true,
          },
        },
      },
    })

    return NextResponse.json(updatedAlert)
  } catch (error) {
    console.error('Error resolving alert:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
