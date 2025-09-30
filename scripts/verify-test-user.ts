import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function verifyTestUser() {
  console.log('🔍 Verificando usuario de prueba...')
  
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'admin@metanoia.com' },
      include: { tenant: true }
    })
    
    if (!user) {
      console.log('❌ Usuario no encontrado')
      return
    }
    
    console.log('✅ Usuario encontrado:')
    console.log('  - ID:', user.id)
    console.log('  - Email:', user.email)
    console.log('  - Nombre:', user.firstName, user.lastName)
    console.log('  - Rol:', user.role)
    console.log('  - Activo:', user.isActive)
    console.log('  - Tenant:', user.tenant?.name)
    
    // Verificar contraseña
    const passwordMatch = await bcrypt.compare('admin123', user.password)
    console.log('  - Contraseña correcta:', passwordMatch)
    
    if (!passwordMatch) {
      console.log('🔧 Actualizando contraseña...')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      console.log('✅ Contraseña actualizada')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyTestUser()
