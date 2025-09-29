import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

async function testCreateSession() {
  try {
    console.log('🔍 Probando la función createSession...')

    const JWT_SECRET = (process.env.JWT_SECRET || 'dev-secret-key') as string

    // Buscar el usuario
    const user = await prisma.user.findFirst({
      where: { email: 'admin@metanoia.click' },
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }

    console.log(`✅ Usuario encontrado: ${user.email}`)

    // Probar generar refresh token
    console.log('\n🔑 Probando generación de refresh token...')
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        tokenVersion: 1,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    console.log('✅ Refresh token generado')

    // Probar crear sesión en la base de datos
    console.log('\n💾 Probando creación de sesión en BD...')
    try {
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        },
      })
      console.log('✅ Sesión creada exitosamente:', session.id)

      // Limpiar la sesión de prueba
      await prisma.session.delete({
        where: { id: session.id },
      })
      console.log('✅ Sesión de prueba eliminada')
    } catch (sessionError) {
      console.log('❌ Error creando sesión:', sessionError)
    }

    // Probar generar access token
    console.log('\n🎫 Probando generación de access token...')
    try {
      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        JWT_SECRET,
        { expiresIn: '15m' }
      )
      console.log('✅ Access token generado')
    } catch (tokenError) {
      console.log('❌ Error generando access token:', tokenError)
    }
  } catch (error) {
    console.error('❌ Error en test de createSession:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
testCreateSession()
  .then(() => {
    console.log('\n✅ Test de createSession completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el test:', error)
    process.exit(1)
  })
