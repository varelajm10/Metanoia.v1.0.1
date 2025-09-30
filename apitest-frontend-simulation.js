// apitest-frontend-simulation.js

async function testFrontendSimulation() {
  console.log('🎭 Simulando el comportamiento del frontend...');
  
  // Simular exactamente lo que hace el CreateTenantDialog
  const tenantData = {
    companyName: `Empresa Test ${Date.now()}`,
    adminFirstName: 'Admin',
    adminLastName: 'Test',
    adminEmail: `admin.test.${Date.now()}@example.com`,
  };

  console.log('📝 Datos del formulario:', tenantData);
  console.log('🔄 Enviando a /api/admin/tenants...');

  try {
    const response = await fetch('http://localhost:3000/api/admin/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tenantData),
    });

    console.log(`📡 Respuesta del servidor:`);
    console.log(`   - Status: ${response.status}`);
    console.log(`   - OK: ${response.ok}`);
    console.log(`   - Headers:`, Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log(`   - Body (texto):`, responseText);

    if (response.ok) {
      const jsonResponse = JSON.parse(responseText);
      console.log('✅ API responde correctamente');
      console.log('   - Success:', jsonResponse.success);
      console.log('   - Data:', jsonResponse.data);
      
      if (jsonResponse.success) {
        console.log('🎉 El frontend debería cerrar el modal ahora');
        console.log('   - Tenant ID:', jsonResponse.data?.id);
        console.log('   - Nombre:', jsonResponse.data?.name);
      } else {
        console.log('❌ API devuelve success: false');
        console.log('   - Error:', jsonResponse.error);
      }
    } else {
      console.log('❌ API devuelve error HTTP');
      console.log('   - Status:', response.status);
      console.log('   - Body:', responseText);
    }

  } catch (error) {
    console.error('💥 Error en la simulación:', error.message);
  }
}

testFrontendSimulation();
