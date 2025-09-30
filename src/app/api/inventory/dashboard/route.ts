import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/inventory/dashboard - Obtener estadísticas del dashboard de inventario
export async function GET(request: NextRequest) {
  try {
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant ID requerido' },
        { status: 400 }
      )
    }

    // Estadísticas generales
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
      prisma.product.count({ where: { tenantId } }),
      prisma.product.count({ where: { tenantId, isActive: true } }),
      prisma.supplier.count({ where: { tenantId } }),
      prisma.supplier.count({ where: { tenantId, isActive: true } }),
      prisma.purchaseOrder.count({ where: { tenantId } }),
      prisma.purchaseOrder.count({ where: { tenantId, status: 'PENDING' } }),
      prisma.stockMovement.count({ where: { tenantId } }),
      prisma.product.count({
        where: {
          tenantId,
          isActive: true,
          stock: { lte: prisma.product.fields.minStock },
        },
      }),
      prisma.product.count({
        where: {
          tenantId,
          isActive: true,
          stock: 0,
        },
      }),
      prisma.inventoryAlert.count({
        where: {
          tenantId,
          isActive: true,
        },
      }),
    ])

    // Productos con stock bajo
    const lowStockProductsList = await prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
        stock: { lte: prisma.product.fields.minStock },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        minStock: true,
        category: true,
      },
      orderBy: { stock: 'asc' },
      take: 10,
    })

    // Productos agotados
    const outOfStockProductsList = await prisma.product.findMany({
      where: {
        tenantId,
        isActive: true,
        stock: 0,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
      },
      take: 10,
    })

    // Alertas activas
    const activeAlertsList = await prisma.inventoryAlert.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Movimientos de stock recientes
    const recentStockMovements = await prisma.stockMovement.findMany({
      where: {
        tenantId,
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
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Órdenes de compra recientes
    const recentPurchaseOrders = await prisma.purchaseOrder.findMany({
      where: {
        tenantId,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Estadísticas por categoría
    const productsByCategory = await prisma.product.groupBy({
      by: ['category'],
      where: {
        tenantId,
        isActive: true,
        category: { not: null },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Valor total del inventario
    const inventoryValue = await prisma.product.aggregate({
      where: {
        tenantId,
        isActive: true,
      },
      _sum: {
        cost: true,
      },
    })

    const totalInventoryValue = inventoryValue._sum.cost || 0

    return NextResponse.json({
      stats: {
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
        totalInventoryValue,
      },
      lowStockProducts: lowStockProductsList,
      outOfStockProducts: outOfStockProductsList,
      activeAlerts: activeAlertsList,
      recentStockMovements,
      recentPurchaseOrders,
      productsByCategory,
    })
  } catch (error) {
    console.error('Error fetching inventory dashboard:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
