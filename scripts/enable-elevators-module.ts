import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enableElevatorsModule() {
  try {
    console.log('🚀 Habilitando módulo de Ascensores...')

    // 1. Crear el módulo en la base de datos
    const elevatorModule = await prisma.module.upsert({
      where: { key: 'elevators' },
      update: {
        name: 'Gestión de Ascensores',
        displayName: 'Gestión de Ascensores',
        description:
          'Módulo especializado para gestión de ascensores, mantenimiento e inspecciones',
        version: '1.0.0',
        category: 'BUSINESS',
        isActive: true,
        isCore: false,
        icon: 'Building2',
        color: '#8B5CF6',
        order: 9,
        config: {
          enableMaintenanceScheduling: true,
          enableInspectionTracking: true,
          enableDigitalSignatures: true,
          enablePhotoUpload: true,
          enableQRCodeGeneration: true,
          enableGPSLocation: false,
          enableRealTimeNotifications: true,
          enableMaintenanceContracts: true,
          enableSparePartsInventory: true,
          enableWorkOrderManagement: true,
        },
      },
      create: {
        key: 'elevators',
        name: 'Gestión de Ascensores',
        displayName: 'Gestión de Ascensores',
        description:
          'Módulo especializado para gestión de ascensores, mantenimiento e inspecciones',
        version: '1.0.0',
        category: 'BUSINESS',
        isActive: true,
        isCore: false,
        icon: 'Building2',
        color: '#8B5CF6',
        order: 9,
        config: {
          enableMaintenanceScheduling: true,
          enableInspectionTracking: true,
          enableDigitalSignatures: true,
          enablePhotoUpload: true,
          enableQRCodeGeneration: true,
          enableGPSLocation: false,
          enableRealTimeNotifications: true,
          enableMaintenanceContracts: true,
          enableSparePartsInventory: true,
          enableWorkOrderManagement: true,
        },
      },
    })

    console.log(
      '✅ Módulo de Ascensores creado/actualizado:',
      elevatorModule.name
    )

    // 2. Habilitar el módulo para todos los tenants existentes
    const tenants = await prisma.tenant.findMany()
    console.log(`📋 Encontrados ${tenants.length} tenants`)

    for (const tenant of tenants) {
      // Verificar si el módulo ya está habilitado para este tenant
      const existingTenantModule = await prisma.tenantModule.findFirst({
        where: {
          tenantId: tenant.id,
          moduleId: elevatorModule.id,
        },
      })

      if (!existingTenantModule) {
        // Habilitar el módulo para el tenant
        await prisma.tenantModule.create({
          data: {
            tenantId: tenant.id,
            moduleId: elevatorModule.id,
            isEnabled: true,
            config: {
              enableMaintenanceScheduling: true,
              enableInspectionTracking: true,
              enableDigitalSignatures: true,
              enablePhotoUpload: true,
              enableQRCodeGeneration: true,
              enableGPSLocation: false,
              enableRealTimeNotifications: true,
              enableMaintenanceContracts: true,
              enableSparePartsInventory: true,
              enableWorkOrderManagement: true,
            },
          },
        })

        console.log(`✅ Módulo habilitado para tenant: ${tenant.name}`)
      } else {
        console.log(`ℹ️  Módulo ya habilitado para tenant: ${tenant.name}`)
      }
    }

    // 3. Verificar que el módulo esté disponible
    const availableModules = await prisma.module.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })

    console.log('\n📊 Módulos disponibles:')
    availableModules.forEach((module, index) => {
      console.log(
        `${index + 1}. ${module.name} (${module.key}) - ${module.isActive ? '✅ Activo' : '❌ Inactivo'}`
      )
    })

    console.log('\n🎉 ¡Módulo de Ascensores habilitado exitosamente!')
    console.log(
      '📝 El módulo ahora aparecerá en la lista de módulos activos del dashboard.'
    )
  } catch (error) {
    console.error('❌ Error habilitando módulo de Ascensores:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
enableElevatorsModule()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error ejecutando script:', error)
    process.exit(1)
  })
