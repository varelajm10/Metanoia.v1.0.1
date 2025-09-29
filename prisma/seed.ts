import {
  PrismaClient,
  UserRole,
  OrderStatus,
  InvoiceStatus,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear tenant principal
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'metanoia-demo' },
    update: {},
    create: {
      name: 'Metanoia Demo',
      slug: 'metanoia-demo',
      domain: 'demo.metanoia.click',
      isActive: true,
      email: 'demo@metanoia.click',
      phone: '+1-555-0123',
      address: '123 Demo Street',
      city: 'Demo City',
      country: 'USA',
      timezone: 'UTC',
      currency: 'USD',
      contactName: 'Demo Contact',
      contactEmail: 'demo@metanoia.click',
      contactPhone: '+1-555-0123',
      subscriptionPlan: 'BASIC',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      maxUsers: 10,
      maxServers: 5,
      maxStorageGB: 100,
      settings: {
        currency: 'USD',
        timezone: 'America/Mexico_City',
        features: ['crm', 'inventory', 'accounting'],
      },
    },
  })

  console.log('✅ Tenant creado:', tenant.name)

  // Crear usuario super administrador
  const superAdminPassword = await bcrypt.hash('admin1234', 12)

  const superAdminUser = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'metanoia@gmail.com',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'metanoia@gmail.com',
      password: superAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      tenantId: tenant.id,
    },
  })

  console.log('✅ Usuario super administrador creado:', superAdminUser.email)

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const adminUser = await prisma.user.upsert({
    where: {
      email_tenantId: {
        email: 'admin@metanoia.click',
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
      email: 'admin@metanoia.click',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Sistema',
      role: UserRole.ADMIN,
      isActive: true,
      tenantId: tenant.id,
    },
  })

  console.log('✅ Usuario administrador creado:', adminUser.email)

  // Crear cliente de ejemplo
  const customer = await prisma.customer.create({
    data: {
      name: 'Cliente Demo',
      email: 'cliente@demo.com',
      phone: '+52 55 1234 5678',
      address: {
        street: 'Av. Reforma 123',
        city: 'Ciudad de México',
        state: 'CDMX',
        zipCode: '06000',
        country: 'México',
      },
      isActive: true,
      tenantId: tenant.id,
    },
  })

  console.log('✅ Cliente creado:', customer.name)

  // Crear productos de ejemplo
  const products = [
    {
      name: 'Producto A',
      description: 'Descripción del producto A',
      sku: 'PROD-A-001',
      price: 100.0,
      cost: 60.0,
      stock: 50,
    },
    {
      name: 'Producto B',
      description: 'Descripción del producto B',
      sku: 'PROD-B-002',
      price: 150.0,
      cost: 90.0,
      stock: 30,
    },
    {
      name: 'Producto C',
      description: 'Descripción del producto C',
      sku: 'PROD-C-003',
      price: 200.0,
      cost: 120.0,
      stock: 20,
    },
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: {
        sku_tenantId: {
          sku: productData.sku,
          tenantId: tenant.id,
        },
      },
      update: {
        ...productData,
        tenantId: tenant.id,
      },
      create: {
        ...productData,
        tenantId: tenant.id,
      },
    })
    createdProducts.push(product)
    console.log('✅ Producto creado/actualizado:', product.name)
  }

  // Crear orden de ejemplo
  const order = await prisma.order.upsert({
    where: {
      orderNumber_tenantId: {
        orderNumber: 'ORD-001',
        tenantId: tenant.id,
      },
    },
    update: {
      status: OrderStatus.PENDING,
      subtotal: 350.0,
      taxRate: 16.0,
      taxAmount: 56.0,
      discountAmount: 0.0,
      total: 406.0,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      notes: 'Orden de ejemplo para demostración',
      tenantId: tenant.id,
      customerId: customer.id,
      userId: adminUser.id,
    },
    create: {
      orderNumber: 'ORD-001',
      status: OrderStatus.PENDING,
      subtotal: 350.0,
      taxRate: 16.0,
      taxAmount: 56.0,
      discountAmount: 0.0,
      total: 406.0,
      paymentMethod: 'CASH',
      paymentStatus: 'PENDING',
      notes: 'Orden de ejemplo para demostración',
      tenantId: tenant.id,
      customerId: customer.id,
      userId: adminUser.id,
    },
  })

  console.log('✅ Orden creada:', order.orderNumber)

  // Crear items de la orden
  const orderItems = [
    {
      quantity: 2,
      unitPrice: 100.0,
      discount: 0.0,
      total: 200.0,
      productId: createdProducts[0].id,
    },
    {
      quantity: 1,
      unitPrice: 150.0,
      discount: 0.0,
      total: 150.0,
      productId: createdProducts[1].id,
    },
  ]

  for (const itemData of orderItems) {
    await prisma.orderItem.create({
      data: {
        ...itemData,
        orderId: order.id,
      },
    })
  }

  console.log('✅ Items de orden creados')

  // Crear factura de ejemplo
  const invoice = await prisma.invoice.upsert({
    where: {
      invoiceNumber_tenantId: {
        invoiceNumber: 'INV-001',
        tenantId: tenant.id,
      },
    },
    update: {
      status: InvoiceStatus.DRAFT,
      subtotal: 350.0,
      tax: 56.0,
      total: 406.0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      notes: 'Factura de ejemplo para demostración',
      tenantId: tenant.id,
      customerId: customer.id,
      userId: adminUser.id,
      orderId: order.id,
    },
    create: {
      invoiceNumber: 'INV-001',
      status: InvoiceStatus.DRAFT,
      subtotal: 350.0,
      tax: 56.0,
      total: 406.0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      notes: 'Factura de ejemplo para demostración',
      tenantId: tenant.id,
      customerId: customer.id,
      userId: adminUser.id,
      orderId: order.id,
    },
  })

  console.log('✅ Factura creada:', invoice.invoiceNumber)

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch(e => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
