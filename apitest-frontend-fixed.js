// apitest-frontend-fixed.js

async function testFrontendFixed() {
  console.log('🎭 Probando el frontend corregido...');
  
  // Simular exactamente lo que hace el CreateTenantDialog corregido
  const formData = {
    companyName: `Empresa Test ${Date.now()}`,
    adminFirstName: 'Admin',
    adminLastName: 'Test',
    adminEmail: `admin.test.${Date.now()}@example.com`,
  };

  console.log('📝 Datos del formulario:', formData);

  // Transformar los datos como lo hace el componente corregido
  const payload = {
    name: formData.companyName,
    slug: formData.companyName.toLowerCase().replace(/\s+/g, '-').slice(0, 50),
    email: formData.adminEmail,
    contactName: `${formData.adminFirstName} ${formData.adminLastName}`,
    contactEmail: formData.adminEmail,
    timezone: 'UTC',
    currency: 'USD',
    subscriptionStartDate: new Date().toISOString(),
  };

  console.log('🔄 Payload transformado:', payload);
  console.log('🔄 Enviando a /api/superadmin/tenants...');

  try {
    const response = await fetch('http://localhost:3000/api/superadmin/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`📡 Respuesta del servidor:`);
    console.log(`   - Status: ${response.status}`);
    console.log(`   - OK: ${response.ok}`);

    const responseText = await response.text();
    console.log(`   - Body:`, responseText);

    if (response.ok) {
      const jsonResponse = JSON.parse(responseText);
      console.log('✅ API responde correctamente');
      console.log('   - Success:', jsonResponse.success);
      console.log('   - Tenant ID:', jsonResponse.data?.id);
      console.log('   - Nombre:', jsonResponse.data?.name);
      console.log('🎉 El frontend debería cerrar el modal ahora');
    } else {
      console.log('❌ API devuelve error HTTP');
      console.log('   - Status:', response.status);
      console.log('   - Body:', responseText);
    }

  } catch (error) {
    console.error('💥 Error en la prueba:', error.message);
  }
}

testFrontendFixed();
