import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔍 Probando login con las credenciales...')

    // Buscar el usuario
    const user = await prisma.user.findFirst({
      where: {
        email: 'admin@metanoia.click',
      },
      include: {
        tenant: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }

    console.log('✅ Usuario encontrado:')
    console.log(`   • Email: ${user.email}`)
    console.log(`   • Nombre: ${user.firstName} ${user.lastName}`)
    console.log(`   • Role: ${user.role}`)
    console.log(`   • Activo: ${user.isActive}`)
    console.log(`   • Tenant: ${user.tenant?.name}`)

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare('metanoia123', user.password)
    console.log(
      `\n🔐 Verificación de contraseña: ${passwordMatch ? '✅ CORRECTA' : '❌ INCORRECTA'}`
    )

    if (passwordMatch) {
      console.log('\n✅ Las credenciales son válidas!')
      console.log('\n🔗 Para hacer login:')
      console.log('   1. Ir a: http://localhost:3000/login')
      console.log('   2. Email: admin@metanoia.click')
      console.log('   3. Contraseña: metanoia123')
      console.log(
        '   4. Debería redirigir a: http://localhost:3000/dashboard/admin'
      )
    } else {
      console.log('\n❌ La contraseña no coincide')
      console.log('   Vamos a crear una nueva contraseña...')

      const newHashedPassword = await bcrypt.hash('metanoia123', 12)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHashedPassword },
      })

      console.log('✅ Contraseña actualizada correctamente')
    }
  } catch (error) {
    console.error('❌ Error probando login:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
testLogin()
  .then(() => {
    console.log('\n✅ Script completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
