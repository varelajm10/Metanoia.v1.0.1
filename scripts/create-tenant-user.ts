import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import readline from 'readline'

const prisma = new PrismaClient()

interface CreateUserInput {
  tenantSlug: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

async function createTenantUser(input: CreateUserInput) {
  try {
    console.log(`🚀 Creando usuario para el tenant: ${input.tenantSlug}`)

    // Buscar el tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: input.tenantSlug },
    })

    if (!tenant) {
      console.log(`❌ Tenant '${input.tenantSlug}' no encontrado`)
      console.log('💡 Asegúrate de que el tenant existe antes de crear usuarios')
      return
    }

    console.log(`✅ Tenant encontrado: ${tenant.name}`)
    console.log(`   • ID: ${tenant.id}`)
    console.log(`   • Slug: ${tenant.slug}`)
    console.log(`   • Plan: ${tenant.subscriptionPlan}`)

    // Verificar si ya existe un usuario con ese email
    const existingUser = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        email: input.email,
      },
    })

    if (existingUser) {
      console.log(`⚠️  El usuario ${input.email} ya existe para ${tenant.name}`)
      console.log(`   • ID: ${existingUser.id}`)
      console.log(`   • Nombre: ${existingUser.firstName} ${existingUser.lastName}`)
      console.log(`   • Email: ${existingUser.email}`)
      console.log(`   • Rol: ${existingUser.role}`)
      console.log(`   • Activo: ${existingUser.isActive ? 'Sí' : 'No'}`)

      console.log('\n🔐 Credenciales existentes:')
      console.log(`   • Email: ${input.email}`)
      console.log(`   • Contraseña: [Ya configurada]`)
      console.log(`   • Rol: ${existingUser.role}`)
      return
    }

    // Crear el hash de la contraseña
    const hashedPassword = await bcrypt.hash(input.password, 12)

    console.log('🔐 Creando usuario...')

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        isActive: true,
        tenantId: tenant.id,
      },
    })

    console.log('✅ Usuario creado exitosamente')
    console.log(`   • ID: ${newUser.id}`)
    console.log(`   • Nombre: ${newUser.firstName} ${newUser.lastName}`)
    console.log(`   • Email: ${newUser.email}`)
    console.log(`   • Rol: ${newUser.role}`)
    console.log(`   • Activo: ${newUser.isActive ? 'Sí' : 'No'}`)

    console.log('\n🔐 Credenciales de acceso:')
    console.log(`   • Email: ${input.email}`)
    console.log(`   • Contraseña: ${input.password}`)
    console.log(`   • Rol: ${input.role}`)
    console.log(`   • Tenant: ${tenant.name} (${tenant.slug})`)

    console.log('\n🌐 URL de acceso:')
    console.log(`   • Dashboard: http://localhost:3000/login`)
    console.log(`   • O usar el dominio personalizado si está configurado`)

    // Verificar módulos habilitados
    const enabledModules = await prisma.tenantModule.findMany({
      where: {
        tenantId: tenant.id,
        isEnabled: true,
      },
      include: {
        module: true,
      },
    })

    if (enabledModules.length > 0) {
      console.log('\n📋 Módulos habilitados para este tenant:')
      enabledModules.forEach((tenantModule) => {
        console.log(`   • ${tenantModule.module.displayName}`)
      })
    } else {
      console.log('\n⚠️  No hay módulos habilitados para este tenant')
      console.log('💡 Considera habilitar módulos básicos como CRM e Inventario')
    }

  } catch (error) {
    console.error('❌ Error al crear usuario:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Función para crear usuarios de forma interactiva
async function createUserInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve)
    })
  }

  try {
    console.log('🎯 Creación de Usuario para Tenant')
    console.log('=====================================\n')

    // Listar tenants disponibles
    const tenants = await prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
      },
    })

    if (tenants.length === 0) {
      console.log('❌ No hay tenants disponibles')
      console.log('💡 Crea un tenant primero usando el script correspondiente')
      return
    }

    console.log('📋 Tenants disponibles:')
    tenants.forEach((tenant, index) => {
      console.log(`   ${index + 1}. ${tenant.name} (${tenant.slug}) - ${tenant.isActive ? 'Activo' : 'Inactivo'}`)
    })

    const tenantChoice = await question('\nSelecciona el número del tenant: ')
    const tenantIndex = parseInt(tenantChoice) - 1

    if (tenantIndex < 0 || tenantIndex >= tenants.length) {
      console.log('❌ Selección inválida')
      return
    }

    const selectedTenant = tenants[tenantIndex]
    console.log(`\n✅ Tenant seleccionado: ${selectedTenant.name}`)

    // Recopilar información del usuario
    const email = await question('📧 Email del usuario: ')
    const password = await question('🔐 Contraseña: ')
    const firstName = await question('👤 Nombre: ')
    const lastName = await question('👤 Apellido: ')

    console.log('\n📋 Roles disponibles:')
    console.log('   1. SUPER_ADMIN - Super Administrador (acceso completo)')
    console.log('   2. ADMIN - Administrador (gestión completa del tenant)')
    console.log('   3. MANAGER - Gerente (gestión de módulos específicos)')
    console.log('   4. USER - Usuario (acceso básico)')

    const roleChoice = await question('\nSelecciona el número del rol (1-4): ')
    const roles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'] as UserRole[]
    const roleIndex = parseInt(roleChoice) - 1

    if (roleIndex < 0 || roleIndex >= roles.length) {
      console.log('❌ Selección de rol inválida')
      return
    }

    const selectedRole = roles[roleIndex]

    // Confirmar creación
    console.log('\n📝 Resumen:')
    console.log(`   • Tenant: ${selectedTenant.name}`)
    console.log(`   • Email: ${email}`)
    console.log(`   • Nombre: ${firstName} ${lastName}`)
    console.log(`   • Rol: ${selectedRole}`)

    const confirm = await question('\n¿Crear este usuario? (s/n): ')

    if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'si' || confirm.toLowerCase() === 'yes') {
      await createTenantUser({
        tenantSlug: selectedTenant.slug,
        email,
        password,
        firstName,
        lastName,
        role: selectedRole,
      })
    } else {
      console.log('❌ Creación cancelada')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    rl.close()
    await prisma.$disconnect()
  }
}

// Función para crear usuarios rápidos con parámetros por defecto
async function createQuickUsers() {
  try {
    console.log('🚀 Creando usuarios rápidos para todos los tenants...')

    const tenants = await prisma.tenant.findMany({
      where: { isActive: true },
    })

    for (const tenant of tenants) {
      console.log(`\n📋 Procesando tenant: ${tenant.name}`)

      // Crear usuario administrador
      const adminEmail = `admin@${tenant.slug}.com`
      const adminExists = await prisma.user.findFirst({
        where: {
          tenantId: tenant.id,
          email: adminEmail,
        },
      })

      if (!adminExists) {
        await createTenantUser({
          tenantSlug: tenant.slug,
          email: adminEmail,
          password: 'admin123',
          firstName: 'Admin',
          lastName: tenant.name,
          role: 'ADMIN',
        })
      } else {
        console.log(`   ⚠️  Admin ya existe: ${adminEmail}`)
      }

      // Crear usuario estándar
      const userEmail = `usuario@${tenant.slug}.com`
      const userExists = await prisma.user.findFirst({
        where: {
          tenantId: tenant.id,
          email: userEmail,
        },
      })

      if (!userExists) {
        await createTenantUser({
          tenantSlug: tenant.slug,
          email: userEmail,
          password: 'usuario123',
          firstName: 'Usuario',
          lastName: tenant.name,
          role: 'USER',
        })
      } else {
        console.log(`   ⚠️  Usuario ya existe: ${userEmail}`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    // Modo interactivo
    await createUserInteractive()
  } else if (args[0] === 'quick') {
    // Crear usuarios rápidos
    await createQuickUsers()
  } else if (args.length >= 6) {
    // Modo con parámetros
    const [tenantSlug, email, password, firstName, lastName, role] = args
    
    await createTenantUser({
      tenantSlug,
      email,
      password,
      firstName,
      lastName,
      role: role as UserRole,
    })
  } else {
    console.log('🎯 Script de Creación de Usuarios para Tenants')
    console.log('==============================================\n')
    console.log('Uso:')
    console.log('  Modo interactivo:')
    console.log('    npx ts-node scripts/create-tenant-user.ts')
    console.log('')
    console.log('  Crear usuarios rápidos para todos los tenants:')
    console.log('    npx ts-node scripts/create-tenant-user.ts quick')
    console.log('')
    console.log('  Crear usuario específico:')
    console.log('    npx ts-node scripts/create-tenant-user.ts <tenant-slug> <email> <password> <firstName> <lastName> <role>')
    console.log('')
    console.log('Ejemplos:')
    console.log('  npx ts-node scripts/create-tenant-user.ts ariel admin@ariel.com admin123 Juan Pérez ADMIN')
    console.log('  npx ts-node scripts/create-tenant-user.ts empresa-demo usuario@empresa.com user123 María García USER')
  }
}

main().catch(console.error)
