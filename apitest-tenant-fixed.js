// apitest-tenant-fixed.js

async function testCreateTenantFixed() {
  const url = 'http://localhost:3000/api/admin/tenants'; 
  
  // Datos en el formato correcto según el esquema de validación
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
    enabledModules: ['customers', 'products'],
    maxUsers: 5,
    maxServers: 10,
    maxStorageGB: 100,
    notes: 'Test tenant created via API',
    customDomain: ''
  };

  console.log(`▶️  Intentando hacer POST a: ${url}`);
  console.log(`▶️  Con los datos: ${JSON.stringify(tenantData, null, 2)}`);

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

    // Intentamos leer el cuerpo de la respuesta, sea cual sea
    const responseBody = await response.text();
    console.log('   - Cuerpo (Body) en formato texto:', responseBody);

    // Intentamos parsear como JSON si es posible
    try {
      const jsonResponse = JSON.parse(responseBody);
      console.log('   - Cuerpo (Body) parseado como JSON:', jsonResponse);
      
      if (jsonResponse.success && jsonResponse.data) {
        console.log('🎉 ¡TENANT CREADO EXITOSAMENTE!');
        console.log('   - ID:', jsonResponse.data.id);
        console.log('   - Nombre:', jsonResponse.data.name);
        console.log('   - Email:', jsonResponse.data.email);
        if (jsonResponse.data.tempPassword) {
          console.log('   - Password temporal:', jsonResponse.data.tempPassword);
        }
      }
    } catch (e) {
      console.warn('   - Advertencia: El cuerpo de la respuesta no es un JSON válido.');
    }

  } catch (error) {
    console.error('\n❌ ERROR EN LA PETICIÓN:', error.message);
  }
}

testCreateTenantFixed();
