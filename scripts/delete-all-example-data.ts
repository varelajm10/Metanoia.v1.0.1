import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAllExampleData() {
  try {
    console.log(
      '🚀 Eliminando TODOS los datos de ejemplo de todos los tenants...'
    )

    // Obtener todos los tenants
    const tenants = await prisma.tenant.findMany()

    console.log(`📊 Encontrados ${tenants.length} tenants:`)
    tenants.forEach(tenant => {
      console.log(`   • ${tenant.name} (${tenant.slug})`)
    })

    let totalDeleted = 0

    for (const tenant of tenants) {
      console.log(`\n🏢 Procesando tenant: ${tenant.name} (${tenant.slug})`)

      // Contar datos existentes
      const customersCount = await prisma.customer.count({
        where: { tenantId: tenant.id },
      })

      const serverClientsCount = await prisma.serverClient.count({
        where: { tenantId: tenant.id },
      })

      const serversCount = await prisma.server.count({
        where: { tenantId: tenant.id },
      })

      console.log(`   📊 Datos existentes:`)
      console.log(`      • Clientes: ${customersCount}`)
      console.log(`      • Clientes de servidor: ${serverClientsCount}`)
      console.log(`      • Servidores: ${serversCount}`)

      if (
        customersCount === 0 &&
        serverClientsCount === 0 &&
        serversCount === 0
      ) {
        console.log(`   ✅ No hay datos para eliminar`)
        continue
      }

      // Eliminar servidores primero (por las foreign keys)
      if (serversCount > 0) {
        const deletedServers = await prisma.server.deleteMany({
          where: { tenantId: tenant.id },
        })
        console.log(`   🗑️  ${deletedServers.count} servidores eliminados`)
        totalDeleted += deletedServers.count
      }

      // Eliminar clientes de servidor
      if (serverClientsCount > 0) {
        const deletedServerClients = await prisma.serverClient.deleteMany({
          where: { tenantId: tenant.id },
        })
        console.log(
          `   🗑️  ${deletedServerClients.count} clientes de servidor eliminados`
        )
        totalDeleted += deletedServerClients.count
      }

      // Eliminar clientes
      if (customersCount > 0) {
        const deletedCustomers = await prisma.customer.deleteMany({
          where: { tenantId: tenant.id },
        })
        console.log(`   🗑️  ${deletedCustomers.count} clientes eliminados`)
        totalDeleted += deletedCustomers.count
      }
    }

    // Verificar eliminación total
    const remainingCustomers = await prisma.customer.count()
    const remainingServerClients = await prisma.serverClient.count()
    const remainingServers = await prisma.server.count()

    console.log('\n📊 Verificación final:')
    console.log(`   • Clientes restantes: ${remainingCustomers}`)
    console.log(
      `   • Clientes de servidor restantes: ${remainingServerClients}`
    )
    console.log(`   • Servidores restantes: ${remainingServers}`)

    // Verificar usuarios (no los eliminamos)
    const usersCount = await prisma.user.count()
    console.log(`   • Usuarios: ${usersCount} (conservados)`)

    // Resumen final
    console.log('\n🎉 ¡Limpieza completa exitosa!')
    console.log('📋 Resumen:')
    console.log(`   • Total de registros eliminados: ${totalDeleted}`)
    console.log(`   • Tenants procesados: ${tenants.length}`)
    console.log(`   • Usuarios conservados: ${usersCount}`)
    console.log(`   • Sistema limpio y listo para datos reales`)

    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Login: http://localhost:3000/login`)
    console.log(`   • Dashboard: http://localhost:3000/dashboard`)

    console.log('\n📝 Próximos pasos:')
    console.log('   1. Ir a http://localhost:3000/login')
    console.log(
      '   2. Usar las credenciales de Ariel: admin@ariel.com / ariel123'
    )
    console.log('   3. Verificar que los módulos estén completamente vacíos')
    console.log('   4. Crear datos reales desde cero')
  } catch (error) {
    console.error('❌ Error eliminando datos de ejemplo:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
deleteAllExampleData()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
