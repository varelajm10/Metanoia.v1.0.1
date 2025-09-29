import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function debugLogin() {
  try {
    console.log('🔍 Debug del proceso de login...')

    const email = 'admin@metanoia.click'
    const password = 'metanoia123'

    console.log(`\n📧 Buscando usuario con email: ${email}`)

    // Paso 1: Buscar usuario
    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        tenant: true,
      },
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }

    console.log('✅ Usuario encontrado:')
    console.log(`   • ID: ${user.id}`)
    console.log(`   • Email: ${user.email}`)
    console.log(`   • Nombre: ${user.firstName} ${user.lastName}`)
    console.log(`   • Role: ${user.role}`)
    console.log(`   • Activo: ${user.isActive}`)
    console.log(`   • Tenant ID: ${user.tenantId}`)
    console.log(`   • Tenant Name: ${user.tenant?.name}`)

    // Paso 2: Verificar si está activo
    if (!user.isActive) {
      console.log('❌ Usuario inactivo')
      return
    }

    console.log('✅ Usuario está activo')

    // Paso 3: Verificar contraseña
    console.log(`\n🔐 Verificando contraseña...`)
    console.log(`   • Contraseña recibida: ${password}`)
    console.log(`   • Hash almacenado: ${user.password.substring(0, 20)}...`)

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta')
      console.log('\n🔧 Vamos a crear un nuevo hash...')

      const newHash = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash },
      })

      console.log('✅ Nuevo hash creado y guardado')

      // Verificar nuevamente
      const isValidPassword2 = await bcrypt.compare(password, newHash)
      console.log(
        `✅ Verificación con nuevo hash: ${isValidPassword2 ? 'CORRECTA' : 'INCORRECTA'}`
      )

      return
    }

    console.log('✅ Contraseña correcta')

    // Paso 4: Simular respuesta de autenticación exitosa
    console.log('\n🎉 AUTENTICACIÓN EXITOSA!')
    console.log('\n📋 Datos que deberían devolverse:')
    console.log(`   • User ID: ${user.id}`)
    console.log(`   • Email: ${user.email}`)
    console.log(`   • Role: ${user.role}`)
    console.log(`   • Tenant ID: ${user.tenantId}`)

    console.log('\n🔗 Para probar en el navegador:')
    console.log('   1. Ir a: http://localhost:3000/login')
    console.log('   2. Email: admin@metanoia.click')
    console.log('   3. Contraseña: metanoia123')
  } catch (error) {
    console.error('❌ Error en debug de login:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
debugLogin()
  .then(() => {
    console.log('\n✅ Debug completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el debug:', error)
    process.exit(1)
  })
