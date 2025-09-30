#!/usr/bin/env ts-node

/**
 * Script para probar el endpoint de health check
 * Uso: npx ts-node scripts/test-health-endpoint.ts
 */

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000'

async function testHealthEndpoint() {
  console.log('🔍 Probando endpoint de health check...')
  console.log(`📍 URL: ${BASE_URL}/api/health`)
  console.log('─'.repeat(50))
  
  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    console.log(`📊 Status Code: ${response.status}`)
    console.log(`📋 Response Headers:`, Object.fromEntries(response.headers.entries()))
    console.log('─'.repeat(50))
    console.log('📄 Response Body:')
    console.log(JSON.stringify(data, null, 2))
    console.log('─'.repeat(50))
    
    if (response.status === 200) {
      console.log('✅ Health check exitoso - Todos los servicios están funcionando')
    } else if (response.status === 503) {
      console.log('⚠️  Health check con problemas - Algunos servicios no están disponibles')
    } else {
      console.log(`❌ Health check falló con código ${response.status}`)
    }
    
  } catch (error) {
    console.error('❌ Error al probar el endpoint:', error)
    console.log('💡 Asegúrate de que el servidor esté ejecutándose en http://localhost:3000')
  }
}

// Ejecutar la prueba
testHealthEndpoint()
  .then(() => {
    console.log('🏁 Prueba completada')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error en la prueba:', error)
    process.exit(1)
  })
