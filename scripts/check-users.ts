import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
  try {
    console.log('🔍 Verificando usuarios en el sistema...')

    const users = await prisma.user.findMany({
      include: {
        tenant: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    if (users.length === 0) {
      console.log('❌ No hay usuarios en el sistema')
      return
    }

    console.log(`\n✅ Encontrados ${users.length} usuarios:`)
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuario:`)
      console.log(`   • Email: ${user.email}`)
      console.log(`   • Nombre: ${user.firstName} ${user.lastName}`)
      console.log(`   • Role: ${user.role}`)
      console.log(`   • Activo: ${user.isActive ? 'Sí' : 'No'}`)
      console.log(`   • Tenant: ${user.tenant?.name} (${user.tenant?.slug})`)
    })

    // Verificar si existe el usuario que está intentando usar
    const metanoiaUser = users.find(u => u.email === 'metanoia@gmail.com')
    if (!metanoiaUser) {
      console.log('\n❌ No existe usuario con email "metanoia@gmail.com"')
      console.log('\n📋 Usuarios disponibles para login:')
      users.forEach(user => {
        console.log(`   • ${user.email}`)
      })
    } else {
      console.log('\n✅ Usuario "metanoia@gmail.com" encontrado')
      console.log(`   • Activo: ${metanoiaUser.isActive ? 'Sí' : 'No'}`)
      console.log(`   • Role: ${metanoiaUser.role}`)
    }
  } catch (error) {
    console.error('❌ Error verificando usuarios:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
checkUsers()
  .then(() => {
    console.log('\n✅ Script completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
