import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function updateUserPassword() {
  console.log('🔧 Actualizando contraseña del usuario de prueba...')
  
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'admin@metanoia.com' }
    })
    
    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }
    
    console.log('✅ Usuario encontrado:', user.email)
    
    // Crear nueva contraseña hash con bcryptjs
    const newHashedPassword = await bcryptjs.hash('admin123', 12)
    
    // Actualizar la contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHashedPassword }
    })
    
    console.log('✅ Contraseña actualizada con bcryptjs')
    
    // Verificar que funciona
    const isValid = await bcryptjs.compare('admin123', newHashedPassword)
    console.log('✅ Verificación de contraseña:', isValid)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateUserPassword()
