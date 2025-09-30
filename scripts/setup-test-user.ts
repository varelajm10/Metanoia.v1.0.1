import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupTestUser() {
  console.log('🔧 Configurando usuario de prueba para tests E2E...')

  try {
    // Buscar cualquier tenant existente para usar
    let testTenant = await prisma.tenant.findFirst({
      where: { isActive: true }
    })

    if (!testTenant) {
      console.log('⚠️ No se encontraron tenants activos. Creando tenant básico...')
      // Crear tenant básico con campos mínimos requeridos
      testTenant = await prisma.tenant.create({
        data: {
          name: 'Test Tenant E2E',
          slug: 'test-e2e',
          email: 'admin@test-e2e.com',
          contactName: 'Admin Test',
          contactEmail: 'admin@test-e2e.com',
          isActive: true,
          subscriptionStartDate: new Date(),
          settings: {
            modules: ['customers', 'products', 'orders', 'inventory'],
            features: ['analytics', 'reports', 'api']
          }
        }
      })
      console.log('✅ Tenant de prueba creado:', testTenant.name)
    } else {
      console.log('ℹ️ Usando tenant existente:', testTenant.name)
    }

    // Verificar si ya existe el usuario de prueba
    let testUser = await prisma.user.findFirst({
      where: { email: 'admin@metanoia.com' }
    })

    if (!testUser) {
      // Crear usuario de prueba
      const bcrypt = require('bcrypt')
      const hashedPassword = await bcrypt.hash('admin123', 10)

      testUser = await prisma.user.create({
        data: {
          email: 'admin@metanoia.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Test',
          role: 'ADMIN',
          isActive: true,
          tenantId: testTenant.id
        }
      })
      console.log('✅ Usuario de prueba creado:', testUser.email)
    } else {
      console.log('ℹ️ Usuario de prueba ya existe:', testUser.email)
    }

    // Crear algunos datos de prueba básicos
    await createTestData(testTenant.id)

    console.log('🎉 Configuración de usuario de prueba completada exitosamente')
    console.log('📋 Credenciales de prueba:')
    console.log('   Email: admin@metanoia.com')
    console.log('   Contraseña: admin123')

  } catch (error) {
    console.error('❌ Error configurando usuario de prueba:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

async function createTestData(tenantId: string) {
  console.log('📊 Creando datos de prueba básicos...')

  try {
    // Crear algunos clientes de prueba
    const existingCustomers = await prisma.customer.count({
      where: { tenantId }
    })

    if (existingCustomers === 0) {
      await prisma.customer.createMany({
        data: [
          {
            name: 'Cliente Demo 1',
            email: 'cliente1@demo.com',
            phone: '+1234567890',
            company: 'Empresa Demo 1',
            address: 'Calle Demo 123',
            status: 'ACTIVE',
            tenantId
          },
          {
            name: 'Cliente Demo 2',
            email: 'cliente2@demo.com',
            phone: '+0987654321',
            company: 'Empresa Demo 2',
            address: 'Avenida Demo 456',
            status: 'ACTIVE',
            tenantId
          }
        ]
      })
      console.log('✅ Clientes de prueba creados')
    }

    // Crear algunos productos de prueba
    const existingProducts = await prisma.product.count({
      where: { tenantId }
    })

    if (existingProducts === 0) {
      await prisma.product.createMany({
        data: [
          {
            name: 'Producto Demo 1',
            description: 'Descripción del producto demo 1',
            price: 99.99,
            stock: 100,
            sku: 'DEMO-001',
            category: 'Categoría Demo',
            status: 'ACTIVE',
            tenantId
          },
          {
            name: 'Producto Demo 2',
            description: 'Descripción del producto demo 2',
            price: 149.99,
            stock: 50,
            sku: 'DEMO-002',
            category: 'Categoría Demo',
            status: 'ACTIVE',
            tenantId
          }
        ]
      })
      console.log('✅ Productos de prueba creados')
    }

  } catch (error) {
    console.error('⚠️ Error creando datos de prueba:', error)
    // No salir del proceso, es opcional
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupTestUser()
}

export { setupTestUser }
