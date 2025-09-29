import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteArielExampleData() {
  try {
    console.log('🚀 Eliminando datos de ejemplo del tenant Ariel...')

    // Buscar el tenant Ariel
    const arielTenant = await prisma.tenant.findUnique({
      where: { slug: 'ariel' },
    })

    if (!arielTenant) {
      console.log('❌ Cliente Ariel no encontrado')
      return
    }

    console.log(`✅ Cliente Ariel encontrado: ${arielTenant.name}`)
    console.log(`   • ID: ${arielTenant.id}`)
    console.log(`   • Slug: ${arielTenant.slug}`)

    // Contar datos existentes antes de eliminar
    const customersCount = await prisma.customer.count({
      where: { tenantId: arielTenant.id },
    })

    const serverClientsCount = await prisma.serverClient.count({
      where: { tenantId: arielTenant.id },
    })

    const serversCount = await prisma.server.count({
      where: { tenantId: arielTenant.id },
    })

    console.log('\n📊 Datos existentes en Ariel:')
    console.log(`   • Clientes: ${customersCount}`)
    console.log(`   • Clientes de servidor: ${serverClientsCount}`)
    console.log(`   • Servidores: ${serversCount}`)

    if (
      customersCount === 0 &&
      serverClientsCount === 0 &&
      serversCount === 0
    ) {
      console.log('✅ No hay datos de ejemplo para eliminar')
      return
    }

    // Eliminar servidores primero (por las foreign keys)
    if (serversCount > 0) {
      console.log('\n🗑️  Eliminando servidores...')
      const deletedServers = await prisma.server.deleteMany({
        where: { tenantId: arielTenant.id },
      })
      console.log(`✅ ${deletedServers.count} servidores eliminados`)
    }

    // Eliminar clientes de servidor
    if (serverClientsCount > 0) {
      console.log('\n🗑️  Eliminando clientes de servidor...')
      const deletedServerClients = await prisma.serverClient.deleteMany({
        where: { tenantId: arielTenant.id },
      })
      console.log(
        `✅ ${deletedServerClients.count} clientes de servidor eliminados`
      )
    }

    // Eliminar clientes
    if (customersCount > 0) {
      console.log('\n🗑️  Eliminando clientes...')
      const deletedCustomers = await prisma.customer.deleteMany({
        where: { tenantId: arielTenant.id },
      })
      console.log(`✅ ${deletedCustomers.count} clientes eliminados`)
    }

    // Verificar eliminación
    const remainingCustomers = await prisma.customer.count({
      where: { tenantId: arielTenant.id },
    })

    const remainingServerClients = await prisma.serverClient.count({
      where: { tenantId: arielTenant.id },
    })

    const remainingServers = await prisma.server.count({
      where: { tenantId: arielTenant.id },
    })

    console.log('\n📊 Datos restantes en Ariel:')
    console.log(`   • Clientes: ${remainingCustomers}`)
    console.log(`   • Clientes de servidor: ${remainingServerClients}`)
    console.log(`   • Servidores: ${remainingServers}`)

    // Verificar usuarios (no los eliminamos)
    const usersCount = await prisma.user.count({
      where: { tenantId: arielTenant.id },
    })

    console.log(`   • Usuarios: ${usersCount} (conservados)`)

    // Verificar módulos habilitados (no los tocamos)
    const enabledModules = await prisma.tenantModule.findMany({
      where: {
        tenantId: arielTenant.id,
        isEnabled: true,
      },
      include: {
        module: true,
      },
    })

    console.log('\n✅ Módulos habilitados (conservados):')
    enabledModules.forEach(tm => {
      console.log(`   • ${tm.module.displayName} - ${tm.module.category}`)
    })

    // Resumen final
    console.log('\n🎉 ¡Datos de ejemplo eliminados exitosamente!')
    console.log('📋 Resumen:')
    console.log(`   • Tenant: ${arielTenant.name} (${arielTenant.slug})`)
    console.log(`   • Usuarios: ${usersCount} (conservados)`)
    console.log(
      `   • Módulos: ${enabledModules.length} habilitados (conservados)`
    )
    console.log(`   • Datos de ejemplo: ✅ Eliminados`)

    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Login: http://localhost:3000/login`)
    console.log(`   • Dashboard: http://localhost:3000/dashboard`)

    console.log('\n📝 Próximos pasos:')
    console.log('   1. Ir a http://localhost:3000/login')
    console.log('   2. Usar las credenciales: admin@ariel.com / ariel123')
    console.log('   3. Verificar que los módulos estén vacíos')
    console.log('   4. Crear nuevos datos desde cero si es necesario')
  } catch (error) {
    console.error('❌ Error eliminando datos de ejemplo:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
deleteArielExampleData()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
