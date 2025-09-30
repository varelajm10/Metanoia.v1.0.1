import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface UserCredentials {
  tenantName: string
  tenantSlug: string
  email: string
  password: string
  role: string
  firstName: string
  lastName: string
}

async function generateUserCredentials() {
  try {
    console.log('🔐 Generador de Credenciales de Usuarios')
    console.log('=======================================\n')

    // Obtener todos los tenants activos
    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
      include: {
        users: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    })

    if (tenants.length === 0) {
      console.log('❌ No hay tenants activos disponibles')
      return
    }

    console.log(`📋 Encontrados ${tenants.length} tenants activos:\n`)

    tenants.forEach((tenant, index) => {
      console.log(`${index + 1}. ${tenant.name} (${tenant.slug})`)
      console.log(`   • Plan: ${tenant.subscriptionPlan}`)
      console.log(`   • Máx. usuarios: ${tenant.maxUsers}`)
      console.log(`   • Usuarios actuales: ${tenant.users.length}`)

      if (tenant.users.length > 0) {
        console.log('   👥 Usuarios existentes:')
        tenant.users.forEach((user) => {
          const status = user.isActive ? '✅' : '❌'
          console.log(`      ${status} ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`)
        })
      } else {
        console.log('   ⚠️  Sin usuarios creados')
      }
      console.log('')
    })

    // Generar credenciales sugeridas
    console.log('💡 Credenciales Sugeridas para Nuevos Usuarios:')
    console.log('===============================================\n')

    tenants.forEach((tenant) => {
      console.log(`🏢 ${tenant.name} (${tenant.slug}):`)
      
      // Sugerir usuario admin si no existe
      const adminExists = tenant.users.some(user => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
      if (!adminExists) {
        console.log(`   👑 Administrador:`)
        console.log(`      Email: admin@${tenant.slug}.com`)
        console.log(`      Contraseña: admin123`)
        console.log(`      Rol: ADMIN`)
      }

      // Sugerir usuario estándar si no existe
      const userExists = tenant.users.some(user => user.role === 'USER')
      if (!userExists) {
        console.log(`   👤 Usuario estándar:`)
        console.log(`      Email: usuario@${tenant.slug}.com`)
        console.log(`      Contraseña: usuario123`)
        console.log(`      Rol: USER`)
      }

      console.log('')
    })

    // Mostrar comandos para crear usuarios
    console.log('🚀 Comandos para Crear Usuarios:')
    console.log('================================\n')

    tenants.forEach((tenant) => {
      const adminExists = tenant.users.some(user => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
      const userExists = tenant.users.some(user => user.role === 'USER')

      console.log(`📋 Para ${tenant.name} (${tenant.slug}):`)

      if (!adminExists) {
        console.log(`   npx ts-node scripts/create-tenant-user.ts ${tenant.slug} admin@${tenant.slug}.com admin123 Admin ${tenant.name} ADMIN`)
      }

      if (!userExists) {
        console.log(`   npx ts-node scripts/create-tenant-user.ts ${tenant.slug} usuario@${tenant.slug}.com usuario123 Usuario ${tenant.name} USER`)
      }

      if (adminExists && userExists) {
        console.log(`   ✅ Todos los usuarios básicos ya están creados`)
      }

      console.log('')
    })

    // Mostrar URLs de acceso
    console.log('🌐 URLs de Acceso:')
    console.log('==================')
    console.log('   • Dashboard principal: http://localhost:3000/login')
    console.log('   • Super Admin (si existe): http://localhost:3000/super-admin')
    console.log('')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Función para mostrar credenciales de un tenant específico
async function showTenantCredentials(tenantSlug: string) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        users: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
    })

    if (!tenant) {
      console.log(`❌ Tenant '${tenantSlug}' no encontrado`)
      return
    }

    console.log(`🏢 ${tenant.name} (${tenant.slug})`)
    console.log('='.repeat(50))
    console.log(`Plan: ${tenant.subscriptionPlan}`)
    console.log(`Estado: ${tenant.isActive ? 'Activo' : 'Inactivo'}`)
    console.log(`Máx. usuarios: ${tenant.maxUsers}`)
    console.log('')

    if (tenant.users.length === 0) {
      console.log('⚠️  No hay usuarios creados para este tenant')
      console.log('')
      console.log('💡 Credenciales sugeridas:')
      console.log(`   👑 Admin: admin@${tenant.slug}.com / admin123`)
      console.log(`   👤 Usuario: usuario@${tenant.slug}.com / usuario123`)
      console.log('')
      console.log('🚀 Comandos para crear:')
      console.log(`   npx ts-node scripts/create-tenant-user.ts ${tenant.slug} admin@${tenant.slug}.com admin123 Admin ${tenant.name} ADMIN`)
      console.log(`   npx ts-node scripts/create-tenant-user.ts ${tenant.slug} usuario@${tenant.slug}.com usuario123 Usuario ${tenant.name} USER`)
    } else {
      console.log('👥 Usuarios existentes:')
      tenant.users.forEach((user) => {
        const status = user.isActive ? '✅' : '❌'
        console.log(`   ${status} ${user.email}`)
        console.log(`      Nombre: ${user.firstName} ${user.lastName}`)
        console.log(`      Rol: ${user.role}`)
        console.log(`      Estado: ${user.isActive ? 'Activo' : 'Inactivo'}`)
        console.log('')
      })
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // Mostrar todos los tenants y credenciales
    await generateUserCredentials()
  } else if (args.length === 1) {
    // Mostrar credenciales de un tenant específico
    await showTenantCredentials(args[0])
  } else {
    console.log('🔐 Generador de Credenciales de Usuarios')
    console.log('=======================================\n')
    console.log('Uso:')
    console.log('  Ver todos los tenants:')
    console.log('    npx ts-node scripts/generate-user-credentials.ts')
    console.log('')
    console.log('  Ver tenant específico:')
    console.log('    npx ts-node scripts/generate-user-credentials.ts <tenant-slug>')
    console.log('')
    console.log('Ejemplos:')
    console.log('  npx ts-node scripts/generate-user-credentials.ts')
    console.log('  npx ts-node scripts/generate-user-credentials.ts ariel')
    console.log('  npx ts-node scripts/generate-user-credentials.ts empresa-demo')
  }
}

main().catch(console.error)
