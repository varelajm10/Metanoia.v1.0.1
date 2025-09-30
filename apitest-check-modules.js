// apitest-check-modules.js

async function checkModules() {
  console.log('🔍 Verificando módulos en la base de datos...');
  
  // Intentar hacer una consulta directa a la base de datos
  // Esto requeriría acceso directo a Prisma, pero podemos intentar
  // hacer una llamada a una API que liste los módulos disponibles
  
  try {
    // Intentar obtener módulos desde una API (si existe)
    const response = await fetch('http://localhost:3000/api/admin/modules', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const modules = await response.json();
      console.log('✅ Módulos encontrados:', modules);
    } else {
      console.log('❌ No se pudo obtener módulos desde la API');
      console.log('   Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error al verificar módulos:', error.message);
    console.log('   Esto sugiere que los módulos no están inicializados en la base de datos');
  }
}

checkModules();
