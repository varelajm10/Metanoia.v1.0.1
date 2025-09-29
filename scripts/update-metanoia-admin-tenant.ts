import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updateMetanoiaAdminTenant() {
  try {
    console.log(
      '🚀 Actualizando tenant del usuario administrador de Metanoia...'
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

    // Buscar el usuario administrador de Metanoia
    const metanoiaAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@metanoia.click',
      },
    })

    if (!metanoiaAdmin) {
      console.log('❌ Usuario administrador de Metanoia no encontrado')
      return
    }

    console.log(`✅ Usuario administrador encontrado: ${metanoiaAdmin.email}`)
    console.log(`   • Tenant actual: ${metanoiaAdmin.tenantId}`)

    // Actualizar el tenant del usuario administrador
    const updatedAdmin = await prisma.user.update({
      where: { id: metanoiaAdmin.id },
      data: {
        tenantId: arielTenant.id,
      },
    })

    console.log(
      '\n✅ Usuario administrador de Metanoia actualizado exitosamente!'
    )
    console.log('📋 Nuevos datos:')
    console.log(`   • Email: ${updatedAdmin.email}`)
    console.log(`   • Contraseña: metanoia123`)
    console.log(`   • Role: ${updatedAdmin.role}`)
    console.log(`   • Tenant: ${arielTenant.name} (${arielTenant.slug})`)

    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Login: http://localhost:3000/login`)
    console.log(`   • Dashboard Admin: http://localhost:3000/dashboard/admin`)
    console.log(`   • Dashboard Cliente: http://localhost:3000/dashboard`)

    console.log('\n📝 Nota importante:')
    console.log(
      '   Ahora el usuario admin de Metanoia tiene acceso al tenant de Ariel S.A.'
    )
    console.log(
      '   Esto le permitirá gestionar los módulos y configuraciones de Ariel'
    )
    console.log('   desde el dashboard de administración.')
  } catch (error) {
    console.error('❌ Error actualizando usuario admin de Metanoia:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
updateMetanoiaAdminTenant()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
