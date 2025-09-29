import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createArielUser() {
  try {
    console.log('🚀 Creando usuario administrador para Ariel S.A....')

    // Buscar el tenant Ariel
    const arielTenant = await prisma.tenant.findUnique({
      where: { slug: 'ariel' },
    })

    if (!arielTenant) {
      console.log('❌ Cliente Ariel no encontrado')
      console.log(
        '💡 Ejecuta primero: npx ts-node scripts/enable-ariel-modules.ts'
      )
      return
    }

    console.log(`✅ Cliente Ariel encontrado: ${arielTenant.name}`)
    console.log(`   • ID: ${arielTenant.id}`)
    console.log(`   • Slug: ${arielTenant.slug}`)
    console.log(`   • Plan: ${arielTenant.subscriptionPlan}`)

    // Verificar si ya existe un usuario para Ariel
    const existingUser = await prisma.user.findFirst({
      where: {
        tenantId: arielTenant.id,
        email: 'admin@ariel.com',
      },
    })

    if (existingUser) {
      console.log('⚠️  El usuario admin@ariel.com ya existe para Ariel')
      console.log(`   • ID: ${existingUser.id}`)
      console.log(
        `   • Nombre: ${existingUser.firstName} ${existingUser.lastName}`
      )
      console.log(`   • Email: ${existingUser.email}`)
      console.log(`   • Rol: ${existingUser.role}`)
      console.log(`   • Activo: ${existingUser.isActive ? 'Sí' : 'No'}`)

      console.log('\n🔐 Credenciales existentes:')
      console.log(`   • Email: admin@ariel.com`)
      console.log(`   • Contraseña: [Ya configurada]`)
      console.log(`   • Rol: ${existingUser.role}`)

      return existingUser
    }

    // Crear el hash de la contraseña
    const password = 'ariel123' // Contraseña por defecto
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('🔐 Creando usuario administrador...')

    // Crear el usuario administrador de Ariel
    const arielUser = await prisma.user.create({
      data: {
        email: 'admin@ariel.com',
        password: hashedPassword,
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'ADMIN',
        isActive: true,
        tenantId: arielTenant.id,
      },
    })

    console.log('✅ Usuario administrador de Ariel creado exitosamente')
    console.log(`   • ID: ${arielUser.id}`)
    console.log(`   • Nombre: ${arielUser.firstName} ${arielUser.lastName}`)
    console.log(`   • Email: ${arielUser.email}`)
    console.log(`   • Rol: ${arielUser.role}`)
    console.log(`   • Activo: ${arielUser.isActive ? 'Sí' : 'No'}`)

    // Crear también un usuario estándar para pruebas
    const standardPassword = 'usuario123'
    const hashedStandardPassword = await bcrypt.hash(standardPassword, 12)

    const standardUser = await prisma.user.create({
      data: {
        email: 'usuario@ariel.com',
        password: hashedStandardPassword,
        firstName: 'María',
        lastName: 'García',
        role: 'USER',
        isActive: true,
        tenantId: arielTenant.id,
      },
    })

    console.log('✅ Usuario estándar de Ariel creado exitosamente')
    console.log(`   • ID: ${standardUser.id}`)
    console.log(
      `   • Nombre: ${standardUser.firstName} ${standardUser.lastName}`
    )
    console.log(`   • Email: ${standardUser.email}`)
    console.log(`   • Rol: ${standardUser.role}`)

    // Verificar módulos habilitados
    const enabledModules = await prisma.tenantModule.findMany({
      where: {
        tenantId: arielTenant.id,
        isEnabled: true,
      },
      include: {
        module: true,
      },
    })

    console.log('\n📋 Módulos habilitados para Ariel:')
    enabledModules.forEach(tm => {
      console.log(`   ✅ ${tm.module.displayName} - ${tm.module.category}`)
    })

    // Resumen final
    console.log('\n🎉 ¡Usuarios de Ariel S.A. creados exitosamente!')
    console.log('🔐 Credenciales de acceso:')
    console.log('\n👑 ADMINISTRADOR:')
    console.log(`   • Email: admin@ariel.com`)
    console.log(`   • Contraseña: ariel123`)
    console.log(`   • Rol: ADMIN (acceso completo a módulos habilitados)`)

    console.log('\n👤 USUARIO ESTÁNDAR:')
    console.log(`   • Email: usuario@ariel.com`)
    console.log(`   • Contraseña: usuario123`)
    console.log(`   • Rol: USER (acceso limitado)`)

    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Login: http://localhost:3000/login`)
    console.log(`   • Dashboard: http://localhost:3000/dashboard`)
    console.log(
      `   • Administración: http://localhost:3000/dashboard/admin/tenants`
    )

    console.log('\n📝 Próximos pasos:')
    console.log('   1. Ir a http://localhost:3000/login')
    console.log(
      '   2. Usar las credenciales del administrador (admin@ariel.com / ariel123)'
    )
    console.log('   3. Verificar que solo aparezcan los módulos habilitados:')
    console.log('      - ✅ Gestión de Clientes')
    console.log('      - ✅ Gestión de Servidores')
    console.log('   4. Probar la funcionalidad de ambos módulos')

    console.log('\n🏢 Información del Tenant:')
    console.log(`   • Nombre: ${arielTenant.name}`)
    console.log(
      `   • Contacto: ${arielTenant.contactName} (${arielTenant.contactEmail})`
    )
    console.log(`   • Ubicación: ${arielTenant.city}, ${arielTenant.country}`)
    console.log(`   • Plan: ${arielTenant.subscriptionPlan}`)
    console.log(
      `   • Límites: ${arielTenant.maxUsers} usuarios, ${arielTenant.maxServers} servidores`
    )

    return { arielUser, standardUser }
  } catch (error) {
    console.error('❌ Error creando usuarios de Ariel:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
createArielUser()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
