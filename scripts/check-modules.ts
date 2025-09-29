import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkModules() {
  try {
    console.log('🔍 Verificando módulos en la base de datos...')

    const modules = await prisma.module.findMany()

    if (modules.length === 0) {
      console.log('❌ No hay módulos en la base de datos')
      console.log('💡 Necesitas ejecutar el seed de módulos primero')
      return
    }

    console.log(`✅ Se encontraron ${modules.length} módulos:`)
    modules.forEach(module => {
      console.log(
        `   • ${module.name} - ${module.displayName} (${module.category})`
      )
    })

    // Verificar tenants
    const tenants = await prisma.tenant.findMany()
    console.log(`\n🏢 Se encontraron ${tenants.length} tenants:`)
    tenants.forEach(tenant => {
      console.log(
        `   • ${tenant.name} (${tenant.slug}) - ${tenant.subscriptionPlan}`
      )
    })
  } catch (error) {
    console.error('❌ Error verificando módulos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkModules()
