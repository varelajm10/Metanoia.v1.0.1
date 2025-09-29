import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createMetanoiaAdmin() {
  try {
    console.log('🚀 Creando usuario administrador de Metanoia...')

    // Buscar o crear el tenant de Metanoia
    let metanoiaTenant = await prisma.tenant.findUnique({
      where: { slug: 'metanoia-demo' },
    })

    if (!metanoiaTenant) {
      console.log('❌ Tenant Metanoia no encontrado')
      return
    }

    console.log(`✅ Tenant Metanoia encontrado: ${metanoiaTenant.name}`)

    // Verificar si ya existe el usuario admin de Metanoia
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@metanoia.click',
        tenantId: metanoiaTenant.id,
      },
    })

    if (existingAdmin) {
      console.log('✅ Usuario admin de Metanoia ya existe')
      console.log(`   • Email: ${existingAdmin.email}`)
      console.log(`   • Role: ${existingAdmin.role}`)
      console.log(`   • Activo: ${existingAdmin.isActive}`)
      return
    }

    // Crear usuario administrador de Metanoia
    const hashedPassword = await bcrypt.hash('metanoia123', 12)

    const metanoiaAdmin = await prisma.user.create({
      data: {
        email: 'admin@metanoia.click',
        password: hashedPassword,
        firstName: 'Administrador',
        lastName: 'Metanoia',
        role: 'ADMIN',
        isActive: true,
        tenantId: metanoiaTenant.id,
      },
    })

    console.log('\n✅ Usuario administrador de Metanoia creado exitosamente!')
    console.log('📋 Credenciales de acceso:')
    console.log(`   • Email: ${metanoiaAdmin.email}`)
    console.log(`   • Contraseña: metanoia123`)
    console.log(`   • Role: ${metanoiaAdmin.role}`)
    console.log(`   • Tenant: ${metanoiaTenant.name}`)

    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Login: http://localhost:3000/login`)
    console.log(`   • Dashboard Admin: http://localhost:3000/dashboard/admin`)

    console.log('\n📝 Próximos pasos:')
    console.log('   1. Ir a http://localhost:3000/login')
    console.log(
      '   2. Usar las credenciales: admin@metanoia.click / metanoia123'
    )
    console.log('   3. Serás redirigido al dashboard de administración')
  } catch (error) {
    console.error('❌ Error creando usuario admin de Metanoia:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
createMetanoiaAdmin()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
