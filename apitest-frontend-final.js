// apitest-frontend-final.js

async function testFrontendFinal() {
  console.log('🎭 Probando el frontend final corregido...');
  
  // Simular exactamente lo que hace el CreateTenantDialog corregido
  const formData = {
    companyName: `Empresa Test ${Date.now()}`,
    adminFirstName: 'Admin',
    adminLastName: 'Test',
    adminEmail: `admin.test.${Date.now()}@example.com`,
  };

  console.log('📝 Datos del formulario:', formData);
  console.log('🔄 Enviando a /api/superadmin/tenants...');

  try {
    const response = await fetch('http://localhost:3000/api/superadmin/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // Enviamos los datos del formulario directamente
    });

    console.log(`📡 Respuesta del servidor:`);
    console.log(`   - Status: ${response.status}`);
    console.log(`   - OK: ${response.ok}`);

    const responseText = await response.text();
    console.log(`   - Body:`, responseText);

    if (response.ok) {
      const jsonResponse = JSON.parse(responseText);
      console.log('✅ API responde correctamente');
      console.log('   - Tenant ID:', jsonResponse.id);
      console.log('   - Nombre:', jsonResponse.name);
      console.log('   - Slug:', jsonResponse.slug);
      if (jsonResponse.tempPassword) {
        console.log('   - Password temporal:', jsonResponse.tempPassword);
      }
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

testFrontendFinal();
