/**
 * Script de prueba para el endpoint de creación de tenants
 * 
 * Uso:
 * npx ts-node scripts/test-create-tenant-api.ts
 */

import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function testCreateTenant() {
  console.log('🧪 Probando creación de tenant...\n')

  const testData = {
    companyName: 'Tech Solutions S.A.',
    adminFirstName: 'María',
    adminLastName: 'González',
    adminEmail: 'maria.gonzalez@techsolutions.com',
  }

  console.log('📤 Enviando datos:')
  console.log(JSON.stringify(testData, null, 2))
  console.log()

  try {
    const response = await axios.post(
      `${API_URL}/api/superadmin/tenants`,
      testData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('✅ Tenant creado exitosamente!')
    console.log('📊 Respuesta del servidor:')
    console.log(JSON.stringify(response.data, null, 2))
    console.log()

    if (response.data.data?.tempPassword) {
      console.log('🔐 CREDENCIALES DE ACCESO:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log(`Email:      ${response.data.data.adminEmail}`)
      console.log(`Contraseña: ${response.data.data.tempPassword}`)
      console.log(`URL Login:  ${API_URL}/login`)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log()
      console.log('⚠️  IMPORTANTE: Guarda esta contraseña, no se mostrará de nuevo.')
    }

    console.log('🎉 Prueba completada con éxito!')
    
  } catch (error: any) {
    console.error('❌ Error al crear tenant:')
    
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Mensaje:', error.response.data.message)
      
      if (error.response.data.errors) {
        console.error('Errores de validación:')
        console.error(JSON.stringify(error.response.data.errors, null, 2))
      }
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor')
      console.error('¿Está el servidor corriendo en', API_URL, '?')
    } else {
      console.error('Error:', error.message)
    }
    
    process.exit(1)
  }
}

// Ejecutar la prueba
testCreateTenant()
  .then(() => {
    console.log('\n✨ Script finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error)
    process.exit(1)
  })
