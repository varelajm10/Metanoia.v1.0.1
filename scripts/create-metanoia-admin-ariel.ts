import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createMetanoiaAdminAriel() {
  try {
    console.log(
      '🚀 Creando usuario administrador de Metanoia con acceso a Ariel S.A....'
    )

    // Buscar el tenant de Ariel S.A.
    const arielTenant = await prisma.tenant.findUnique({
      where: { slug: 'ariel' },
    })

    if (!arielTenant) {
      console.log('❌ Tenant "Ariel S.A." no encontrado')
      return
    }

    console.log(`✅ Tenant "Ariel S.A." encontrado: ${arielTenant.name}`)

    // Verificar si ya existe el usuario admin de Metanoia
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@metanoia.click',
      },
    })

    if (existingAdmin) {
      console.log('✅ Usuario admin de Metanoia ya existe')
      console.log(`   • Email: ${existingAdmin.email}`)
      console.log(`   • Role: ${existingAdmin.role}`)
      console.log(`   • Tenant: ${existingAdmin.tenantId}`)
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
        tenantId: arielTenant.id,
      },
    })

    console.log('\n✅ Usuario administrador de Metanoia creado exitosamente!')
    console.log('📋 Credenciales de acceso:')
    console.log(`   • Email: ${metanoiaAdmin.email}`)
    console.log(`   • Contraseña: metanoia123`)
    console.log(`   • Role: ${metanoiaAdmin.role}`)
    console.log(`   • Tenant: ${arielTenant.name} (${arielTenant.slug})`)

    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Login: http://localhost:3000/login`)
    console.log(`   • Dashboard Admin: http://localhost:3000/dashboard/admin`)
    console.log(`   • Dashboard Cliente: http://localhost:3000/dashboard`)

    console.log('\n📝 Funcionalidades disponibles:')
    console.log('   • Acceso al dashboard de administración de Metanoia')
    console.log('   • Gestión de módulos de Ariel S.A.')
    console.log('   • Estadísticas y reportes del negocio')
    console.log('   • Creación de nuevos clientes (tenants)')

    console.log('\n🎯 Próximos pasos:')
    console.log('   1. Ir a http://localhost:3000/login')
    console.log(
      '   2. Usar las credenciales: admin@metanoia.click / metanoia123'
    )
    console.log('   3. Serás redirigido al dashboard de administración')
    console.log('   4. Desde ahí podrás gestionar los módulos de Ariel S.A.')
  } catch (error) {
    console.error('❌ Error creando usuario admin de Metanoia:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
createMetanoiaAdminAriel()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
