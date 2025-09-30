import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createVarelaUsers() {
  try {
    console.log('🚀 Creando usuarios para el tenant "Juan Manuel" (varela)...')

    // Buscar el tenant varela
    const tenant = await prisma.tenant.findUnique({
      where: { slug: 'varela' },
    })

    if (!tenant) {
      console.log('❌ Tenant "varela" no encontrado')
      return
    }

    console.log(`✅ Tenant encontrado: ${tenant.name}`)
    console.log(`   • ID: ${tenant.id}`)
    console.log(`   • Slug: ${tenant.slug}`)
    console.log(`   • Plan: ${tenant.subscriptionPlan}`)

    // Crear usuario administrador
    const adminPassword = 'admin123'
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 12)

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@varela.com',
        password: hashedAdminPassword,
        firstName: 'Admin',
        lastName: 'Juan Manuel',
        role: 'ADMIN',
        isActive: true,
        tenantId: tenant.id,
      },
    })

    console.log('✅ Usuario administrador creado exitosamente')
    console.log(`   • ID: ${adminUser.id}`)
    console.log(`   • Email: ${adminUser.email}`)
    console.log(`   • Nombre: ${adminUser.firstName} ${adminUser.lastName}`)
    console.log(`   • Rol: ${adminUser.role}`)

    // Crear usuario estándar
    const userPassword = 'usuario123'
    const hashedUserPassword = await bcrypt.hash(userPassword, 12)

    const standardUser = await prisma.user.create({
      data: {
        email: 'usuario@varela.com',
        password: hashedUserPassword,
        firstName: 'Usuario',
        lastName: 'Juan Manuel',
        role: 'USER',
        isActive: true,
        tenantId: tenant.id,
      },
    })

    console.log('✅ Usuario estándar creado exitosamente')
    console.log(`   • ID: ${standardUser.id}`)
    console.log(`   • Email: ${standardUser.email}`)
    console.log(`   • Nombre: ${standardUser.firstName} ${standardUser.lastName}`)
    console.log(`   • Rol: ${standardUser.role}`)

    console.log('\n🔐 CREDENCIALES DE ACCESO:')
    console.log('=========================')
    console.log('👑 ADMINISTRADOR:')
    console.log(`   • Email: admin@varela.com`)
    console.log(`   • Contraseña: admin123`)
    console.log(`   • Rol: ADMIN`)
    console.log('')
    console.log('👤 USUARIO ESTÁNDAR:')
    console.log(`   • Email: usuario@varela.com`)
    console.log(`   • Contraseña: usuario123`)
    console.log(`   • Rol: USER`)
    console.log('')
    console.log('🌐 URL DE ACCESO:')
    console.log(`   • Dashboard: http://localhost:3000/login`)
    console.log('')
    console.log('📋 MÓDULOS DISPONIBLES:')
    console.log(`   • Gestión de Clientes`)
    console.log(`   • Gestión de Servidores`)
    console.log(`   • Recursos Humanos`)

  } catch (error) {
    console.error('❌ Error al crear usuarios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createVarelaUsers().catch(console.error)
