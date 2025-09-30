// apitest-modules.js

async function testModules() {
  const url = 'http://localhost:3000/api/admin/tenants'; 
  
  // Datos mínimos para crear tenant sin módulos
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
    enabledModules: [], // Sin módulos para evitar el error
    maxUsers: 5,
    maxServers: 10,
    maxStorageGB: 100,
    notes: 'Test tenant created via API',
    customDomain: ''
  };

  console.log(`▶️  Intentando crear tenant SIN módulos...`);

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
      console.log('🎉 ¡TENANT CREADO EXITOSAMENTE SIN MÓDULOS!');
    }

  } catch (error) {
    console.error('\n❌ ERROR EN LA PETICIÓN:', error.message);
  }
}

testModules();
