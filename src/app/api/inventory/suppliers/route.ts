import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

// Esquema de validación para proveedores
const supplierSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }).optional(),
  contactName: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.number().int().min(0, 'Los términos de pago no pueden ser negativos').optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
})

// GET /api/inventory/suppliers - Obtener proveedores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
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
        { email: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { taxId: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
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
      prisma.supplier.count({ where }),
    ])

    return NextResponse.json({
      suppliers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/inventory/suppliers - Crear proveedor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = request.headers.get('x-tenant-id')

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID requerido' }, { status: 400 })
    }

    const validatedData = supplierSchema.parse(body)

    // Verificar si el proveedor ya existe
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        name: validatedData.name,
        tenantId,
      },
    })

    if (existingSupplier) {
      return NextResponse.json(
        { error: 'Ya existe un proveedor con ese nombre' },
        { status: 400 }
      )
    }

    const supplier = await prisma.supplier.create({
      data: {
        ...validatedData,
        tenantId,
      },
      include: {
        _count: {
          select: {
            purchaseOrders: true,
            products: true,
          },
        },
      },
    })

    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating supplier:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
