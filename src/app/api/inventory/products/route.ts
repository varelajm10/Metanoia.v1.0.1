import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Esquema de validación para productos
const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo'),
  cost: z.number().positive('El costo debe ser positivo').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').default(0),
  minStock: z.number().int().min(0, 'El stock mínimo no puede ser negativo').default(0),
  maxStock: z.number().int().positive('El stock máximo debe ser positivo').optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  weight: z.number().positive('El peso debe ser positivo').optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  isActive: z.boolean().default(true),
  isDigital: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

// GET /api/inventory/products - Obtener productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const brand = searchParams.get('brand') || ''
    const isActive = searchParams.get('isActive')
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const where: any = {
      tenantId,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (brand) {
      where.brand = brand
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
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
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/products - Crear producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const validatedData = productSchema.parse(body)

    // Verificar si el SKU ya existe
    if (validatedData.sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          sku: validatedData.sku,
          tenantId,
        },
      })

      if (existingProduct) {
        return NextResponse.json(
          { error: 'El SKU ya existe' },
          { status: 400 }
        )
      }
    }

    // Verificar si el código de barras ya existe
    if (validatedData.barcode) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          barcode: validatedData.barcode,
          tenantId,
        },
      })

      if (existingProduct) {
        return NextResponse.json(
          { error: 'El código de barras ya existe' },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        tenantId,
      },
      include: {
        productImages: true,
        productVariants: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
