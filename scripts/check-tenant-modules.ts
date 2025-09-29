import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTenantModules() {
  try {
    console.log('🔍 Verificando módulos habilitados por tenant...')

    const tenants = await prisma.tenant.findMany({
      include: {
        tenantModules: {
          include: {
            module: true,
          },
        },
      },
    })

    tenants.forEach(tenant => {
      console.log(
        `\n🏢 ${tenant.name} (${tenant.slug}) - ${tenant.subscriptionPlan}`
      )
      console.log(
        `   📧 ${tenant.contactEmail} | 📱 ${tenant.contactPhone || 'N/A'}`
      )
      console.log(`   🌍 ${tenant.city}, ${tenant.country}`)

      const enabledModules = tenant.tenantModules.filter(tm => tm.isEnabled)
      const disabledModules = tenant.tenantModules.filter(tm => !tm.isEnabled)

      if (enabledModules.length > 0) {
        console.log(`   ✅ Módulos habilitados (${enabledModules.length}):`)
        enabledModules.forEach(tm => {
          console.log(
            `      • ${tm.module.displayName} - ${tm.module.category}`
          )
        })
      }

      if (disabledModules.length > 0) {
        console.log(`   ❌ Módulos deshabilitados (${disabledModules.length}):`)
        disabledModules.forEach(tm => {
          console.log(
            `      • ${tm.module.displayName} - ${tm.module.category}`
          )
        })
      }

      if (tenant.tenantModules.length === 0) {
        console.log(`   ⚠️  No tiene módulos configurados`)
      }
    })
  } catch (error) {
    console.error('❌ Error verificando módulos de tenants:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTenantModules()
