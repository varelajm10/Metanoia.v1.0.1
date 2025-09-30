// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Empezando el proceso de seeding...')

  // 1. Limpiar la base de datos de registros antiguos
  // La eliminación se hace en orden inverso a la creación para evitar errores de constraints
  console.log('🧹 Borrando datos antiguos de usuarios y tenants...')
  await prisma.user.deleteMany({})
  await prisma.tenant.deleteMany({})
  console.log('✅ Datos antiguos eliminados.')

  // 2. Crear un Tenant especial para el SUPER_ADMIN
  console.log('🏢 Creando Tenant para SUPER_ADMIN...')
  const superAdminTenant = await prisma.tenant.create({
    data: {
      name: 'Metanoia Admin',
      slug: 'metanoia-admin',
      domain: 'admin.metanoia.click',
      isActive: true,
      email: 'mentanoiaclick@gmail.com',
      phone: '+1-555-0000',
      address: 'Admin Headquarters',
      city: 'Admin City',
      country: 'Global',
      timezone: 'UTC',
      currency: 'USD',
      contactName: 'Super Admin',
      contactEmail: 'mentanoiaclick@gmail.com',
      contactPhone: '+1-555-0000',
      subscriptionPlan: 'ENTERPRISE',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      maxUsers: 999,
      maxServers: 999,
      maxStorageGB: 9999,
      settings: {
        currency: 'USD',
        timezone: 'UTC',
        features: ['super-admin', 'tenant-management'],
      },
    },
  })
  console.log(`✅ Tenant de SUPER_ADMIN creado: "${superAdminTenant.name}"`)

  // 3. Crear el usuario SUPER_ADMIN
  console.log('👤 Creando usuario SUPER_ADMIN...')
  const superAdminEmail = 'mentanoiaclick@gmail.com'
  const superAdminPassword = 'Tool2225-'

  const hashedPassword = await bcrypt.hash(superAdminPassword, 10)

  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      isActive: true,
      tenantId: superAdminTenant.id,
    },
  })
  console.log(`✅ SUPER_ADMIN creado con email: ${superAdmin.email}`)

  // 4. Crear un Tenant de prueba
  console.log('🏢 Creando un Tenant de prueba...')
  const testTenant = await prisma.tenant.create({
    data: {
      name: 'Empresa de Prueba',
      slug: 'empresa-de-prueba',
      domain: 'empresa-de-prueba.metanoia.click',
      isActive: true,
      email: 'contacto@empresa-de-prueba.com',
      phone: '+1-555-1234',
      address: '123 Calle de Prueba',
      city: 'Ciudad de Prueba',
      country: 'México',
      timezone: 'America/Mexico_City',
      currency: 'MXN',
      contactName: 'Contacto de Prueba',
      contactEmail: 'contacto@empresa-de-prueba.com',
      contactPhone: '+1-555-1234',
      subscriptionPlan: 'BASIC',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      maxUsers: 10,
      maxServers: 5,
      maxStorageGB: 100,
      settings: {
        currency: 'MXN',
        timezone: 'America/Mexico_City',
        features: ['crm', 'inventory'],
      },
    }
  })
  console.log(`✅ Tenant de prueba creado: "${testTenant.name}"`)

  console.log('🎉 Seeding completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })