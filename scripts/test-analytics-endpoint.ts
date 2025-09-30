#!/usr/bin/env ts-node

/**
 * Script para probar el endpoint de analytics del Super Admin
 */

async function testAnalyticsEndpoint() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  console.log('🧪 Probando endpoint de analytics...')
  console.log(`📍 URL: ${baseUrl}/api/superadmin/analytics`)
  
  try {
    const response = await fetch(`${baseUrl}/api/superadmin/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    console.log(`📊 Status: ${response.status}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Respuesta exitosa:')
      console.log(JSON.stringify(data, null, 2))
      
      if (data.success && data.data) {
        console.log('\n📈 Métricas encontradas:')
        console.log(`💰 MRR: $${data.data.mrr?.current?.toLocaleString() || 'N/A'}`)
        console.log(`📉 Churn Rate: ${data.data.churn?.rate || 'N/A'}%`)
        console.log(`🏢 Clientes Activos: ${data.data.customers?.active || 'N/A'}`)
        console.log(`👥 Total Usuarios: ${data.data.users?.total || 'N/A'}`)
        console.log(`📊 Módulos Populares: ${data.data.modules?.length || 0} módulos`)
      }
    } else {
      const errorData = await response.text()
      console.log('❌ Error en la respuesta:')
      console.log(errorData)
    }
  } catch (error) {
    console.error('💥 Error al hacer la petición:', error)
  }
}

// Ejecutar el test
testAnalyticsEndpoint()
  .then(() => {
    console.log('\n🎉 Test completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
