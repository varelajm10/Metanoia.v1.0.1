import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enableArielModules() {
  try {
    console.log('🚀 Habilitando módulos para el cliente Ariel...')

    // Buscar el tenant Ariel
    const arielTenant = await prisma.tenant.findUnique({
      where: { slug: 'ariel' },
    })

    if (!arielTenant) {
      console.log('❌ Cliente Ariel no encontrado')
      return
    }

    console.log(
      `✅ Cliente Ariel encontrado: ${arielTenant.name} (${arielTenant.id})`
    )

    // Obtener los módulos necesarios
    const customersModule = await prisma.module.findFirst({
      where: { name: 'Customers' },
    })

    const serversModule = await prisma.module.findFirst({
      where: { name: 'Servers' },
    })

    if (!customersModule) {
      console.log('❌ Módulo de Customers no encontrado')
      return
    }

    if (!serversModule) {
      console.log('❌ Módulo de Servers no encontrado')
      return
    }

    // Verificar si ya existen las relaciones
    const existingCustomersModule = await prisma.tenantModule.findFirst({
      where: {
        tenantId: arielTenant.id,
        moduleId: customersModule.id,
      },
    })

    const existingServersModule = await prisma.tenantModule.findFirst({
      where: {
        tenantId: arielTenant.id,
        moduleId: serversModule.id,
      },
    })

    // Habilitar módulo de customers
    if (existingCustomersModule) {
      await prisma.tenantModule.update({
        where: { id: existingCustomersModule.id },
        data: {
          isActive: true,
          isEnabled: true,
          enabledAt: new Date(),
          reason: 'Habilitado para el cliente Ariel - Gestión de Clientes',
        },
      })
      console.log('✅ Módulo de Gestión de Clientes actualizado')
    } else {
      await prisma.tenantModule.create({
        data: {
          tenantId: arielTenant.id,
          moduleId: customersModule.id,
          isActive: true,
          isEnabled: true,
          enabledAt: new Date(),
          reason: 'Habilitado para el cliente Ariel - Gestión de Clientes',
        },
      })
      console.log('✅ Módulo de Gestión de Clientes habilitado')
    }

    // Habilitar módulo de servers
    if (existingServersModule) {
      await prisma.tenantModule.update({
        where: { id: existingServersModule.id },
        data: {
          isActive: true,
          isEnabled: true,
          enabledAt: new Date(),
          reason: 'Habilitado para el cliente Ariel - Gestión de Servidores',
        },
      })
      console.log('✅ Módulo de Gestión de Servidores actualizado')
    } else {
      await prisma.tenantModule.create({
        data: {
          tenantId: arielTenant.id,
          moduleId: serversModule.id,
          isActive: true,
          isEnabled: true,
          enabledAt: new Date(),
          reason: 'Habilitado para el cliente Ariel - Gestión de Servidores',
        },
      })
      console.log('✅ Módulo de Gestión de Servidores habilitado')
    }

    // Crear algunos datos de ejemplo para el cliente Ariel
    console.log('📊 Creando datos de ejemplo...')

    // Crear algunos clientes de ejemplo
    const existingCustomers = await prisma.customer.count({
      where: { tenantId: arielTenant.id },
    })

    if (existingCustomers === 0) {
      const customers = await Promise.all([
        prisma.customer.create({
          data: {
            tenantId: arielTenant.id,
            name: 'Cliente Demo 1',
            email: 'demo1@cliente.com',
            phone: '+54 11 1111-1111',
            address: {
              street: 'Av. 9 de Julio 1000',
              city: 'Buenos Aires',
              state: 'CABA',
              zipCode: 'C1073ABA',
              country: 'Argentina',
            },
            isActive: true,
          },
        }),
        prisma.customer.create({
          data: {
            tenantId: arielTenant.id,
            name: 'Cliente Demo 2',
            email: 'demo2@cliente.com',
            phone: '+54 11 2222-2222',
            address: {
              street: 'Av. Santa Fe 2000',
              city: 'Buenos Aires',
              state: 'CABA',
              zipCode: 'C1060ABA',
              country: 'Argentina',
            },
            isActive: true,
          },
        }),
      ])

      console.log(`✅ ${customers.length} clientes de ejemplo creados`)
    } else {
      console.log(`✅ Ya existen ${existingCustomers} clientes`)
    }

    // Crear un cliente de servidor de ejemplo
    const existingServerClients = await prisma.serverClient.count({
      where: { tenantId: arielTenant.id },
    })

    if (existingServerClients === 0) {
      const serverClient = await prisma.serverClient.create({
        data: {
          tenantId: arielTenant.id,
          companyName: 'Servidor Demo S.A.',
          contactName: 'María García',
          email: 'maria@servidordemo.com',
          phone: '+54 11 3333-3333',
          address: 'Av. Córdoba 3000',
          city: 'Buenos Aires',
          country: 'Argentina',
          status: 'ACTIVE',
          monthlyFee: 500.0,
          serviceLevel: 'PREMIUM',
          contractStart: new Date(),
          contractEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
          notes: 'Cliente de servidor para demostración',
        },
      })

      console.log('✅ Cliente de servidor de ejemplo creado')

      // Crear algunos servidores de ejemplo
      const servers = await Promise.all([
        prisma.server.create({
          data: {
            tenantId: arielTenant.id,
            clientId: serverClient.id,
            name: 'Servidor Web Principal',
            hostname: 'web-01.ariel.com',
            type: 'WEB_SERVER',
            status: 'ONLINE',
            ipAddress: '192.168.1.100',
            port: 80,
            protocol: 'HTTP',
            location: 'Buenos Aires',
            country: 'Argentina',
            region: 'Buenos Aires',
            city: 'Buenos Aires',
            timezone: 'America/Argentina/Buenos_Aires',
            currency: 'ARS',
            datacenter: 'Datacenter Buenos Aires',
            datacenterCode: 'BA-DC-01',
            rack: 'RACK-01',
            rackPosition: 'A-15',
            provider: 'Ariel Hosting',
            operatingSystem: 'Ubuntu 22.04 LTS',
            cpu: 'Intel Xeon E5-2680 v4',
            ram: '32GB DDR4',
            storage: '500GB SSD',
            bandwidth: '1Gbps',
            sslCertificate: true,
            backupEnabled: true,
            monitoringEnabled: true,
            installationDate: new Date(),
            lastMaintenance: new Date(),
            nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            cost: 150.0,
            costCurrency: 'ARS',
            costPeriod: 'MONTHLY',
            description: 'Servidor web principal para hosting de sitios',
            notes: 'Servidor de alta disponibilidad',
          },
        }),
        prisma.server.create({
          data: {
            tenantId: arielTenant.id,
            clientId: serverClient.id,
            name: 'Servidor de Base de Datos',
            hostname: 'db-01.ariel.com',
            type: 'DATABASE_SERVER',
            status: 'ONLINE',
            ipAddress: '192.168.1.101',
            port: 5432,
            protocol: 'PostgreSQL',
            location: 'Buenos Aires',
            country: 'Argentina',
            region: 'Buenos Aires',
            city: 'Buenos Aires',
            timezone: 'America/Argentina/Buenos_Aires',
            currency: 'ARS',
            datacenter: 'Datacenter Buenos Aires',
            datacenterCode: 'BA-DC-01',
            rack: 'RACK-01',
            rackPosition: 'B-15',
            provider: 'Ariel Hosting',
            operatingSystem: 'Ubuntu 22.04 LTS',
            cpu: 'Intel Xeon E5-2680 v4',
            ram: '64GB DDR4',
            storage: '1TB SSD',
            bandwidth: '1Gbps',
            sslCertificate: false,
            backupEnabled: true,
            monitoringEnabled: true,
            installationDate: new Date(),
            lastMaintenance: new Date(),
            nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            cost: 200.0,
            costCurrency: 'ARS',
            costPeriod: 'MONTHLY',
            description: 'Servidor de base de datos PostgreSQL',
            notes: 'Servidor de base de datos con alta disponibilidad',
          },
        }),
      ])

      console.log(`✅ ${servers.length} servidores de ejemplo creados`)
    } else {
      console.log(`✅ Ya existen ${existingServerClients} clientes de servidor`)
    }

    // Resumen final
    console.log('\n🎉 ¡Módulos habilitados exitosamente para Ariel!')
    console.log('📋 Resumen:')
    console.log(`   • Tenant: ${arielTenant.name} (${arielTenant.slug})`)
    console.log(`   • Plan: ${arielTenant.subscriptionPlan}`)
    console.log(
      `   • Módulos habilitados: Gestión de Clientes, Gestión de Servidores`
    )

    console.log('\n🔗 URLs de acceso:')
    console.log(`   • Dashboard: http://localhost:3000/dashboard`)
    console.log(
      `   • Administración: http://localhost:3000/dashboard/admin/tenants`
    )

    console.log('\n📝 Próximos pasos:')
    console.log('   1. Iniciar el servidor: npm run dev')
    console.log('   2. Acceder al dashboard de administración')
    console.log(
      '   3. Verificar que el cliente Ariel tenga los módulos habilitados'
    )
    console.log('   4. Probar la gestión de módulos')
  } catch (error) {
    console.error('❌ Error habilitando módulos para Ariel:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
enableArielModules()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el script:', error)
    process.exit(1)
  })
