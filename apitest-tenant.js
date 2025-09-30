// apitest-tenant.js

async function testCreateTenant() {
  // OJO: La URL podría ser /api/superadmin/tenants según nuestro código anterior. Verifica la correcta.
  const url = 'http://localhost:3000/api/admin/tenants'; 
  const tenantData = {
    companyName: `Test Corp ${Date.now()}`,
    adminFirstName: 'Test',
    adminLastName: 'User',
    adminEmail: `testuser${Date.now()}@example.com`,
  };

  console.log(`▶️  Intentando hacer POST a: ${url}`);
  console.log(`▶️  Con los datos: ${JSON.stringify(tenantData, null, 2)}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // IMPORTANTE: Si tu API ya requiere autenticación para crear tenants,
        // necesitarás añadir un token de Super-Admin válido aquí.
        // 'Authorization': 'Bearer TU_TOKEN_DE_SUPER_ADMIN_PARA_TESTS'
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
      console.log('   - Cuerpo (Body) parseado como JSON:', JSON.parse(responseBody));
    } catch (e) {
      console.warn('   - Advertencia: El cuerpo de la respuesta no es un JSON válido.');
    }

  } catch (error) {
    console.error('\n❌ ERROR EN LA PETICIÓN:', error.message);
  }
}

testCreateTenant();
