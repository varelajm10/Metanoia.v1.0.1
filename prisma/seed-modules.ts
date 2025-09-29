// ========================================
// SCRIPT PARA POBLAR MÓDULOS EN LA BASE DE DATOS
// ========================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Definir módulos directamente aquí para evitar problemas de importación
const modules = [
  {
    id: 'hr',
    name: 'HR',
    displayName: 'Recursos Humanos',
    description:
      'Módulo completo de gestión de recursos humanos, nómina y talento',
    version: '1.0.0',
    category: 'BUSINESS' as any,
    isCore: false,
    icon: 'Users',
    color: '#EC4899',
    order: 8,
    config: {
      defaultSettings: {
        enablePayrollManagement: true,
        enableVacationTracking: true,
        enablePerformanceReviews: true,
        enableTimeTracking: false,
        enableEmployeeSelfService: true,
        enableAttendanceTracking: false,
      },
      customizableFields: [],
      workflows: [],
      integrations: [],
    },
    features: [
      {
        id: 'employee_management',
        name: 'Gestión de Empleados',
        description: 'Registro y gestión completa de empleados',
        isEnabled: true,
        config: {},
      },
      {
        id: 'payroll_management',
        name: 'Gestión de Nómina',
        description: 'Cálculo y gestión de nómina y salarios',
        isEnabled: true,
        config: {},
      },
      {
        id: 'vacation_management',
        name: 'Gestión de Vacaciones',
        description: 'Solicitud y aprobación de vacaciones',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
    ],
  },
]

async function seedModules() {
  console.log('🌱 Iniciando seed de módulos...')

  try {
    console.log(`📦 Encontrados ${modules.length} módulos para poblar`)

    // Poblar cada módulo en la base de datos
    for (const module of modules) {
      console.log(`📝 Poblando módulo: ${module.displayName} (${module.id})`)

      await prisma.module.upsert({
        where: { id: module.id },
        update: {
          name: module.name,
          displayName: module.displayName,
          description: module.description,
          version: module.version,
          category: module.category,
          isCore: module.isCore,
          icon: module.icon,
          color: module.color,
          order: module.order,
          config: JSON.parse(
            JSON.stringify({
              ...module.config,
            })
          ),
          features: JSON.parse(JSON.stringify(module.features)),
          permissions: JSON.parse(JSON.stringify(module.permissions)),
        },
        create: {
          id: module.id,
          name: module.name,
          displayName: module.displayName,
          description: module.description,
          version: module.version,
          key:
            (module as any).key ||
            module.name.toLowerCase().replace(/\s+/g, '-'),
          category: module.category as any,
          isCore: module.isCore,
          icon: module.icon,
          color: module.color,
          order: module.order,
          config: JSON.parse(
            JSON.stringify({
              ...module.config,
            })
          ),
          features: JSON.parse(JSON.stringify(module.features)),
          permissions: JSON.parse(JSON.stringify(module.permissions)),
        },
      })
    }

    console.log('✅ Módulos poblados exitosamente')

    // Obtener el tenant por defecto
    const defaultTenant = await prisma.tenant.findFirst()
    if (!defaultTenant) {
      console.log('⚠️ No se encontró tenant por defecto')
      return
    }

    console.log(`🏢 Activando módulos core para tenant: ${defaultTenant.name}`)

    // Activar módulos core por defecto
    const coreModules = modules.filter(m => m.isCore)
    for (const module of coreModules) {
      console.log(`🔧 Activando módulo core: ${module.displayName}`)

      await prisma.tenantModule.upsert({
        where: {
          tenantId_moduleId: {
            tenantId: defaultTenant.id,
            moduleId: module.id,
          },
        },
        update: {
          isActive: true,
          isEnabled: true,
          config: module.config.defaultSettings,
        },
        create: {
          tenantId: defaultTenant.id,
          moduleId: module.id,
          isActive: true,
          isEnabled: true,
          config: module.config.defaultSettings,
        },
      })
    }

    console.log('✅ Módulos core activados exitosamente')
  } catch (error) {
    console.error('❌ Error poblando módulos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seed
seedModules()
  .then(() => {
    console.log('🎉 Seed de módulos completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('💥 Error en seed de módulos:', error)
    process.exit(1)
  })
