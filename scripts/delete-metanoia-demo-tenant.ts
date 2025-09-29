import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteMetanoiaDemoTenant() {
  try {
    console.log('🚀 Eliminando tenant "Metanoia Demo"...')

    // Buscar el tenant Metanoia Demo
    const metanoiaDemo = await prisma.tenant.findUnique({
      where: { slug: 'metanoia-demo' },
      include: {
        users: true,
        tenantModules: true,
        customers: true,
        servers: true,
        products: true,
        orders: true,
        invoices: true,
      },
    })

    if (!metanoiaDemo) {
      console.log('❌ Tenant "Metanoia Demo" no encontrado')
      return
    }

    console.log(`✅ Tenant "Metanoia Demo" encontrado: ${metanoiaDemo.name}`)
    console.log(`📊 Datos asociados:`)
    console.log(`   • Usuarios: ${metanoiaDemo.users.length}`)
    console.log(
      `   • Módulos habilitados: ${metanoiaDemo.tenantModules.length}`
    )
    console.log(`   • Clientes: ${metanoiaDemo.customers.length}`)
    console.log(`   • Servidores: ${metanoiaDemo.servers.length}`)
    console.log(`   • Productos: ${metanoiaDemo.products.length}`)
    console.log(`   • Órdenes: ${metanoiaDemo.orders.length}`)
    console.log(`   • Facturas: ${metanoiaDemo.invoices.length}`)

    // Confirmar eliminación
    console.log(
      '\n⚠️  ATENCIÓN: Se eliminarán TODOS los datos del tenant "Metanoia Demo"'
    )
    console.log(
      '   Esto incluye usuarios, módulos, clientes, servidores, productos, órdenes y facturas.'
    )
    console.log('   El tenant "Ariel S.A." NO será afectado.')

    // Eliminar el tenant (esto eliminará automáticamente todos los datos relacionados por CASCADE)
    await prisma.tenant.delete({
      where: { id: metanoiaDemo.id },
    })

    console.log('\n✅ Tenant "Metanoia Demo" eliminado exitosamente!')
    console.log('📋 Resumen:')
    console.log(`   • Tenant eliminado: ${metanoiaDemo.name}`)
    console.log(`   • Usuarios eliminados: ${metanoiaDemo.users.length}`)
    console.log(`   • Módulos eliminados: ${metanoiaDemo.tenantModules.length}`)
    console.log(`   • Clientes eliminados: ${metanoiaDemo.customers.length}`)
    console.log(`   • Servidores eliminados: ${metanoiaDemo.servers.length}`)
    console.log(`   • Productos eliminados: ${metanoiaDemo.products.length}`)
    console.log(`   • Órdenes eliminadas: ${metanoiaDemo.orders.length}`)
    console.log(`   • Facturas eliminadas: ${metanoiaDemo.invoices.length}`)

    // Verificar que Ariel S.A. sigue existiendo
    const arielTenant = await prisma.tenant.findUnique({
      where: { slug: 'ariel-sa' },
      include: {
        users: true,
        tenantModules: true,
        customers: true,
        servers: true,
      },
    })

    if (arielTenant) {
      console.log('\n✅ Tenant "Ariel S.A." verificado y sigue activo:')
      console.log(`   • Nombre: ${arielTenant.name}`)
      console.log(`   • Usuarios: ${arielTenant.users.length}`)
      console.log(
        `   • Módulos habilitados: ${arielTenant.tenantModules.length}`
      )
      console.log(`   • Clientes: ${arielTenant.customers.length}`)
      console.log(`   • Servidores: ${arielTenant.servers.length}`)
    } else {
      console.log('\n❌ ERROR: Tenant "Ariel S.A." no encontrado!')
    }

    // Listar todos los tenants restantes
    const remainingTenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,
      },
    })

    console.log('\n📋 Tenants restantes en el sistema:')
    remainingTenants.forEach((tenant, index) => {
      console.log(
        `   ${index + 1}. ${tenant.name} (${tenant.slug}) - ${tenant.isActive ? 'Activo' : 'Inactivo'}`
      )
    })
  } catch (error) {
    console.error('❌ Error eliminando tenant Metanoia Demo:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
deleteMetanoiaDemoTenant()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
