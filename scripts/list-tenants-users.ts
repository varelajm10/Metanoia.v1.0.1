import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listTenantsAndUsers() {
  try {
    console.log('📋 Lista de Tenants y Usuarios')
    console.log('==============================\n')

    // Obtener todos los tenants con sus usuarios
    const tenants = await prisma.tenant.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        tenantModules: {
          where: { isEnabled: true },
          include: {
            module: {
              select: {
                name: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (tenants.length === 0) {
      console.log('❌ No hay tenants creados')
      return
    }

    console.log(`📊 Resumen General:`)
    console.log(`   • Total de tenants: ${tenants.length}`)
    console.log(`   • Tenants activos: ${tenants.filter(t => t.isActive).length}`)
    console.log(`   • Total de usuarios: ${tenants.reduce((sum, t) => sum + t.users.length, 0)}`)
    console.log('')

    tenants.forEach((tenant, index) => {
      console.log(`${index + 1}. 🏢 ${tenant.name}`)
      console.log(`   📧 Slug: ${tenant.slug}`)
      console.log(`   🌐 Dominio: ${tenant.domain || 'No configurado'}`)
      console.log(`   📧 Email: ${tenant.email}`)
      console.log(`   📞 Teléfono: ${tenant.phone}`)
      console.log(`   📍 Dirección: ${tenant.address}, ${tenant.city}, ${tenant.country}`)
      console.log(`   💰 Plan: ${tenant.subscriptionPlan}`)
      console.log(`   👥 Máx. usuarios: ${tenant.maxUsers}`)
      console.log(`   🖥️  Máx. servidores: ${tenant.maxServers}`)
      console.log(`   💾 Máx. almacenamiento: ${tenant.maxStorageGB} GB`)
      console.log(`   ⏰ Zona horaria: ${tenant.timezone}`)
      console.log(`   💱 Moneda: ${tenant.currency}`)
      console.log(`   📅 Creado: ${tenant.createdAt.toLocaleDateString()}`)
      console.log(`   📅 Plan hasta: ${tenant.subscriptionEndDate?.toLocaleDateString() || 'No definido'}`)
      console.log(`   ✅ Estado: ${tenant.isActive ? 'Activo' : 'Inactivo'}`)

      // Mostrar módulos habilitados
      if (tenant.tenantModules.length > 0) {
        console.log(`   📋 Módulos habilitados (${tenant.tenantModules.length}):`)
        tenant.tenantModules.forEach((tm) => {
          console.log(`      • ${tm.module.displayName}`)
        })
      } else {
        console.log(`   ⚠️  Sin módulos habilitados`)
      }

      // Mostrar usuarios
      if (tenant.users.length > 0) {
        console.log(`   👥 Usuarios (${tenant.users.length}):`)
        tenant.users.forEach((user, userIndex) => {
          const status = user.isActive ? '✅' : '❌'
          const roleIcon = user.role === 'SUPER_ADMIN' ? '👑' : 
                          user.role === 'ADMIN' ? '👑' : 
                          user.role === 'MANAGER' ? '👨‍💼' : '👤'
          
          console.log(`      ${userIndex + 1}. ${status} ${roleIcon} ${user.email}`)
          console.log(`         Nombre: ${user.firstName} ${user.lastName}`)
          console.log(`         Rol: ${user.role}`)
          console.log(`         Estado: ${user.isActive ? 'Activo' : 'Inactivo'}`)
          console.log(`         Creado: ${user.createdAt.toLocaleDateString()}`)
        })
      } else {
        console.log(`   ⚠️  Sin usuarios creados`)
      }

      console.log('')
    })

    // Mostrar resumen por roles
    console.log('📊 Resumen por Roles:')
    console.log('====================')
    
    const roleStats = tenants.reduce((stats, tenant) => {
      tenant.users.forEach(user => {
        stats[user.role] = (stats[user.role] || 0) + 1
      })
      return stats
    }, {} as Record<string, number>)

    Object.entries(roleStats).forEach(([role, count]) => {
      const icon = role === 'SUPER_ADMIN' ? '👑' : 
                  role === 'ADMIN' ? '👑' : 
                  role === 'MANAGER' ? '👨‍💼' : '👤'
      console.log(`   ${icon} ${role}: ${count} usuarios`)
    })

    if (Object.keys(roleStats).length === 0) {
      console.log('   ⚠️  No hay usuarios creados en ningún tenant')
    }

    console.log('')

    // Mostrar comandos útiles
    console.log('🚀 Comandos Útiles:')
    console.log('==================')
    console.log('   • Crear usuario interactivo:')
    console.log('     npx ts-node scripts/create-tenant-user.ts')
    console.log('')
    console.log('   • Crear usuarios rápidos para todos los tenants:')
    console.log('     npx ts-node scripts/create-tenant-user.ts quick')
    console.log('')
    console.log('   • Ver credenciales sugeridas:')
    console.log('     npx ts-node scripts/generate-user-credentials.ts')
    console.log('')
    console.log('   • Ver credenciales de un tenant específico:')
    console.log('     npx ts-node scripts/generate-user-credentials.ts <tenant-slug>')
    console.log('')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)

async function main() {
  await listTenantsAndUsers()
}
