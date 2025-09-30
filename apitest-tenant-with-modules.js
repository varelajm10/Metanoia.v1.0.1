// apitest-tenant-with-modules.js

async function testCreateTenantWithModules() {
  const url = 'http://localhost:3000/api/admin/tenants'; 
  
  // Datos con módulos habilitados
  const tenantData = {
    name: `Test Corp ${Date.now()}`,
    slug: `test-corp-${Date.now()}`,
    email: `testuser${Date.now()}@example.com`,
    phone: '+1234567890',
    address: '123 Test Street',
    city: 'Test City',
    country: 'Test Country',
    timezone: 'America/New_York',
    currency: 'USD',
    contactName: 'Test User',
    contactEmail: `testuser${Date.now()}@example.com`,
    contactPhone: '+1234567890',
    isActive: true,
    subscriptionPlan: 'BASIC',
    subscriptionStartDate: new Date().toISOString(),
    subscriptionEndDate: '',
    enabledModules: ['inventory', 'sales'], // Usar los IDs correctos de los módulos
    maxUsers: 5,
    maxServers: 10,
    maxStorageGB: 100,
    notes: 'Test tenant created via API with modules',
    customDomain: ''
  };

  console.log(`▶️  Intentando crear tenant CON módulos...`);
  console.log(`▶️  Módulos a habilitar: ${tenantData.enabledModules.join(', ')}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });

    console.log(`\n✅ RESPUESTA RECIBIDA`);
    console.log(`   - Status: ${response.status} ${response.statusText}`);

    const responseBody = await response.text();
    console.log('   - Cuerpo (Body):', responseBody);

    if (response.status === 201) {
      const jsonResponse = JSON.parse(responseBody);
      console.log('🎉 ¡TENANT CREADO EXITOSAMENTE CON MÓDULOS!');
      console.log('   - ID:', jsonResponse.data.id);
      console.log('   - Nombre:', jsonResponse.data.name);
      console.log('   - Módulos habilitados:', jsonResponse.data.enabledModules);
    }

  } catch (error) {
    console.error('\n❌ ERROR EN LA PETICIÓN:', error.message);
  }
}

testCreateTenantWithModules();
