// tests/e2e/global.setup.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function globalSetup() {
  console.log('--- Iniciando Global Setup para tests E2E ---');
  try {
    await prisma.$connect();
    console.log('🧹 Limpiando la base de datos de prueba...');
    // Borramos en orden para evitar conflictos de foreign key
    await prisma.user.deleteMany({});
    await prisma.tenant.deleteMany({});
    console.log('✅ Base de datos limpia.');

    console.log('🏢 Creando tenant para SUPER_ADMIN...');
    const superAdminTenant = await prisma.tenant.create({
      data: {
        name: 'Super Admin Tenant',
        slug: 'super-admin-tenant',
        email: 'admin@metanoia.click',
        phone: '+1234567890',
        address: 'Test Address',
        city: 'Test City',
        country: 'Test Country',
        timezone: 'UTC',
        currency: 'USD',
        contactName: 'Super Admin',
        contactEmail: 'admin@metanoia.click',
        contactPhone: '+1234567890',
        subscriptionPlan: 'ENTERPRISE',
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
      },
    });
    console.log('✅ Tenant para SUPER_ADMIN creado exitosamente.');

    console.log('👤 Creando usuario SUPER_ADMIN de prueba...');
    const hashedPassword = await bcrypt.hash('Tool2225-', 10);

    await prisma.user.create({
      data: {
        email: 'mentanoiaclick@gmail.com',
        firstName: 'Super',
        lastName: 'Admin-Test',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        tenantId: superAdminTenant.id,
      },
    });
    console.log('✅ Usuario SUPER_ADMIN creado exitosamente.');

  } catch (error) {
    console.error('❌ Error durante el Global Setup:', error);
    process.exit(1); // Detiene los tests si el setup falla
  } finally {
    await prisma.$disconnect();
    console.log('--- Global Setup finalizado ---');
  }
}

export default globalSetup;
