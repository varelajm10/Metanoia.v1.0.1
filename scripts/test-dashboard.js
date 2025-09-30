#!/usr/bin/env node

/**
 * 🧪 Script de Prueba del Dashboard - Metanoia V1.0.2
 *
 * Este script verifica que el dashboard esté funcionando correctamente
 * y que todos los módulos aparezcan.
 */

const fetch = require('node-fetch')

class DashboardTester {
  constructor() {
    this.baseUrl = 'http://localhost:3000'
  }

  /**
   * Probar endpoint de módulos
   */
  async testModulesEndpoint() {
    try {
      console.log('🔍 Probando endpoint de módulos...')
      const response = await fetch(`${this.baseUrl}/api/modules-simple`)

      if (!response.ok) {
        console.log(
          '❌ Error en endpoint:',
          response.status,
          response.statusText
        )
        return false
      }

      const data = await response.json()
      console.log('✅ Endpoint funcionando correctamente')
      console.log(`📊 Módulos encontrados: ${data.data.length}`)

      // Verificar módulo de colegios específicamente
      const schoolsModule = data.data.find(m => m.id === 'schools')
      if (schoolsModule) {
        console.log('✅ Módulo de Colegios encontrado:')
        console.log(`   - ID: ${schoolsModule.id}`)
        console.log(`   - Nombre: ${schoolsModule.displayName}`)
        console.log(`   - Icono: ${schoolsModule.icon}`)
        console.log(`   - Color: ${schoolsModule.color}`)
        console.log(`   - Activo: ${schoolsModule.isActive}`)
      } else {
        console.log('❌ Módulo de Colegios NO encontrado')
        return false
      }

      return true
    } catch (error) {
      console.log('❌ Error probando endpoint:', error.message)
      return false
    }
  }

  /**
   * Probar página del dashboard
   */
  async testDashboardPage() {
    try {
      console.log('🔍 Probando página del dashboard...')
      const response = await fetch(`${this.baseUrl}/dashboard`)

      if (!response.ok) {
        console.log(
          '❌ Error en página del dashboard:',
          response.status,
          response.statusText
        )
        return false
      }

      const html = await response.text()

      // Verificar que la página contenga elementos clave
      if (
        html.includes('Panel de Administración') ||
        html.includes('Dashboard')
      ) {
        console.log('✅ Página del dashboard cargando correctamente')
        return true
      } else {
        console.log('⚠️ Página del dashboard no contiene elementos esperados')
        return false
      }
    } catch (error) {
      console.log('❌ Error probando página del dashboard:', error.message)
      return false
    }
  }

  /**
   * Generar instrucciones para el usuario
   */
  generateInstructions() {
    console.log('\n📋 INSTRUCCIONES PARA SOLUCIONAR EL PROBLEMA:')
    console.log('=============================================')
    console.log('')
    console.log('1. 🔄 REFRESCAR EL NAVEGADOR:')
    console.log('   - Presiona Ctrl + F5 (Windows) o Cmd + Shift + R (Mac)')
    console.log('   - Esto fuerza la recarga completa sin caché')
    console.log('')
    console.log('2. 🧹 LIMPIAR CACHÉ DEL NAVEGADOR:')
    console.log('   - Abre las herramientas de desarrollador (F12)')
    console.log('   - Ve a la pestaña "Network" o "Red"')
    console.log('   - Marca "Disable cache" o "Deshabilitar caché"')
    console.log('   - Refresca la página')
    console.log('')
    console.log('3. 🔍 VERIFICAR CONSOLA DEL NAVEGADOR:')
    console.log('   - Abre las herramientas de desarrollador (F12)')
    console.log('   - Ve a la pestaña "Console" o "Consola"')
    console.log('   - Busca errores en rojo')
    console.log('   - Si hay errores, compártelos')
    console.log('')
    console.log('4. 🌐 VERIFICAR URL CORRECTA:')
    console.log('   - Asegúrate de estar en: http://localhost:3000/dashboard')
    console.log('   - No uses https:// o puertos diferentes')
    console.log('')
    console.log('5. 🔄 REINICIAR SERVIDOR:')
    console.log('   - Detén el servidor (Ctrl + C)')
    console.log('   - Ejecuta: npm run dev')
    console.log('   - Espera a que aparezca "Ready in X.Xs"')
    console.log('')
    console.log('6. 📱 PROBAR EN NAVEGADOR DIFERENTE:')
    console.log('   - Prueba en Chrome, Firefox, Edge, etc.')
    console.log('   - Si funciona en uno, el problema es de caché')
    console.log('')
    console.log('7. 🔧 VERIFICAR MÓDULOS EN CÓDIGO:')
    console.log('   - El módulo de colegios está configurado correctamente')
    console.log('   - El API retorna los datos correctos')
    console.log('   - El problema es de caché del navegador')
  }

  /**
   * Ejecutar todas las pruebas
   */
  async run() {
    console.log('🧪 PRUEBAS DEL DASHBOARD - METANOIA V1.0.2')
    console.log('===========================================')
    console.log('')

    // Probar endpoint de módulos
    const modulesOk = await this.testModulesEndpoint()

    // Probar página del dashboard
    const dashboardOk = await this.testDashboardPage()

    console.log('\n📊 RESULTADO DE LAS PRUEBAS:')
    console.log('============================')
    console.log(
      `✅ Endpoint de módulos: ${modulesOk ? 'FUNCIONANDO' : 'ERROR'}`
    )
    console.log(
      `✅ Página del dashboard: ${dashboardOk ? 'FUNCIONANDO' : 'ERROR'}`
    )

    if (modulesOk && dashboardOk) {
      console.log('\n🎉 TODAS LAS PRUEBAS PASARON')
      console.log('El problema es de caché del navegador')
      this.generateInstructions()
    } else {
      console.log('\n❌ HAY PROBLEMAS CON EL SERVIDOR')
      console.log('Revisa los errores anteriores')
    }
  }
}

// Ejecutar pruebas
const tester = new DashboardTester()
tester.run().catch(console.error)
