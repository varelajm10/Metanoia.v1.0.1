// apitest.js

async function testLogin() {
  const url = 'http://localhost:3000/api/auth/login';
  const credentials = {
    email: 'mentanoiaclick@gmail.com', // Usa el email del super-admin
    password: 'Tool2225-',             // Usa la contraseña correcta
  };

  console.log(`▶️  Intentando hacer POST a: ${url}`);
  console.log(`▶️  Con los datos: ${JSON.stringify({ email: credentials.email, password: '***' })}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log(`\n✅ RESPUESTA RECIBIDA`);
    console.log(`   - Status: ${response.status} ${response.statusText}`);

    const responseData = await response.json();
    console.log('   - Cuerpo (Body):', responseData);

  } catch (error) {
    console.error('\n❌ ERROR EN LA PETICIÓN:', error.message);
    console.error('   - Causa probable: El servidor no está corriendo, hay un problema de red, o un middleware está bloqueando la petición antes de que llegue al endpoint.');
  }
}

testLogin();
