import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enableHRCRMModules() {
  try {
    console.log('🚀 Habilitando módulos de RRHH y CRM para Ariel...')

    // Buscar el tenant Ariel
    const arielTenant = await prisma.tenant.findUnique({
      where: { slug: 'ariel' },
    })

    if (!arielTenant) {
      console.log('❌ Cliente Ariel no encontrado')
      return
    }

    console.log(`✅ Cliente Ariel encontrado: ${arielTenant.name}`)

    // Buscar los módulos HR y CRM
    const hrModule = await prisma.module.findUnique({
      where: { name: 'HR' },
    })

    const crmModule = await prisma.module.findUnique({
      where: { name: 'CRM' },
    })

    if (!hrModule) {
      console.log('❌ Módulo HR no encontrado')
      return
    }

    if (!crmModule) {
      console.log('❌ Módulo CRM no encontrado')
      return
    }

    console.log(`✅ Módulos encontrados:`)
    console.log(`   • HR: ${hrModule.displayName}`)
    console.log(`   • CRM: ${crmModule.displayName}`)

    // Habilitar módulo HR
    const hrTenantModule = await prisma.tenantModule.upsert({
      where: {
        tenantId_moduleId: {
          tenantId: arielTenant.id,
          moduleId: hrModule.id,
        },
      },
      update: {
        isEnabled: true,
        enabledAt: new Date(),
        reason: 'Habilitado manualmente',
      },
      create: {
        tenantId: arielTenant.id,
        moduleId: hrModule.id,
        isEnabled: true,
        enabledAt: new Date(),
        reason: 'Habilitado manualmente',
      },
    })

    // Habilitar módulo CRM
    const crmTenantModule = await prisma.tenantModule.upsert({
      where: {
        tenantId_moduleId: {
          tenantId: arielTenant.id,
          moduleId: crmModule.id,
        },
      },
      update: {
        isEnabled: true,
        enabledAt: new Date(),
        reason: 'Habilitado manualmente',
      },
      create: {
        tenantId: arielTenant.id,
        moduleId: crmModule.id,
        isEnabled: true,
        enabledAt: new Date(),
        reason: 'Habilitado manualmente',
      },
    })

    console.log('\n✅ Módulos habilitados exitosamente!')
    console.log(
      `   • HR: ${hrTenantModule.isEnabled ? '✅ Habilitado' : '❌ Deshabilitado'}`
    )
    console.log(
      `   • CRM: ${crmTenantModule.isEnabled ? '✅ Habilitado' : '❌ Deshabilitado'}`
    )

    // Verificar módulos habilitados
    const enabledModules = await prisma.tenantModule.findMany({
      where: {
        tenantId: arielTenant.id,
        isEnabled: true,
      },
      include: {
        module: true,
      },
    })

    console.log('\n📋 Módulos habilitados para Ariel:')
    enabledModules.forEach(tm => {
      console.log(`   • ${tm.module.displayName} (${tm.module.category})`)
    })

    console.log('\n🎉 ¡Módulos RRHH y CRM habilitados exitosamente!')
    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Login: http://localhost:3000/login`)
    console.log(`   • Dashboard: http://localhost:3000/dashboard`)
    console.log(`   • RRHH: http://localhost:3000/dashboard/hr`)
    console.log(`   • CRM: http://localhost:3000/dashboard/crm`)

    console.log('\n📝 Próximos pasos:')
    console.log('   1. Ir a http://localhost:3000/login')
    console.log('   2. Usar las credenciales: admin@ariel.com / ariel123')
    console.log(
      '   3. Verificar que los módulos RRHH y CRM aparezcan en el dashboard'
    )
    console.log('   4. Probar las funcionalidades de cada módulo')
  } catch (error) {
    console.error('❌ Error habilitando módulos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
enableHRCRMModules()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
