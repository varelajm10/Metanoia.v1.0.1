import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testApiLogin() {
  try {
    console.log('🔍 Probando la API de login directamente...')

    const email = 'admin@metanoia.click'
    const password = 'metanoia123'

    // Simular el proceso completo de la API
    console.log(`\n📧 Paso 1: Buscando usuario con email: ${email}`)

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
    console.log(`   • Tenant: ${user.tenant?.name}`)

    console.log(`\n🔐 Paso 2: Verificando si está activo...`)
    if (!user.isActive) {
      console.log('❌ Usuario inactivo - esto causaría 401')
      return
    }
    console.log('✅ Usuario está activo')

    console.log(`\n🔑 Paso 3: Verificando contraseña...`)
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta - esto causaría 401')
      console.log('🔧 Vamos a crear un nuevo hash...')

      const newHash = await bcrypt.hash(password, 12)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: newHash },
      })

      console.log('✅ Nuevo hash creado')

      // Verificar nuevamente
      const isValidPassword2 = await bcrypt.compare(password, newHash)
      console.log(
        `✅ Verificación con nuevo hash: ${isValidPassword2 ? 'CORRECTA' : 'INCORRECTA'}`
      )

      return
    }

    console.log('✅ Contraseña correcta')

    // Simular la respuesta que debería devolver la API
    console.log(`\n🎉 SIMULACIÓN DE RESPUESTA EXITOSA:`)
    const mockResponse = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        tenant: user.tenant,
      },
    }

    console.log('📋 Datos del usuario que deberían devolverse:')
    console.log(JSON.stringify(mockResponse, null, 2))

    // Verificar si hay algún problema con las variables de entorno
    console.log(`\n🔧 Verificando configuración:`)
    console.log(
      `   • JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ No configurado'}`
    )
    console.log(`   • NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`)

    // Verificar si hay algún problema con la base de datos
    console.log(`\n🗄️ Verificando conexión a la base de datos:`)
    try {
      const dbTest = await prisma.user.count()
      console.log(`   • Usuarios en BD: ${dbTest}`)
      console.log('✅ Conexión a BD funcionando')
    } catch (dbError) {
      console.log('❌ Error de conexión a BD:', dbError)
    }
  } catch (error) {
    console.error('❌ Error en test de API login:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
testApiLogin()
  .then(() => {
    console.log('\n✅ Test de API completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el test:', error)
    process.exit(1)
  })
