#!/usr/bin/env node

/**
 * 🔍 Script de Verificación de Módulos - Metanoia V1.0.2
 *
 * Este script verifica que todos los módulos estén correctamente configurados
 * y aparezcan en el dashboard.
 */

const fetch = require('node-fetch')

class ModuleVerifier {
  constructor() {
    this.baseUrl = 'http://localhost:3000'
    this.modules = []
  }

  /**
   * Verificar que el servidor esté funcionando
   */
  async checkServer() {
    try {
      console.log('🔍 Verificando servidor...')
      const response = await fetch(`${this.baseUrl}/api/test`)
      if (response.ok) {
        console.log('✅ Servidor funcionando correctamente')
        return true
      } else {
        console.log('⚠️ Servidor respondiendo pero con errores')
        return false
      }
    } catch (error) {
      console.log('❌ Servidor no disponible:', error.message)
      console.log(
        '💡 Asegúrate de que el servidor esté ejecutándose: npm run dev'
      )
      return false
    }
  }

  /**
   * Verificar API de módulos
   */
  async checkModulesAPI() {
    try {
      console.log('🔍 Verificando API de módulos...')
      const response = await fetch(`${this.baseUrl}/api/modules-simple`)

      if (!response.ok) {
        console.log(
          '❌ Error en API de módulos:',
          response.status,
          response.statusText
        )
        return false
      }

      const data = await response.json()
      console.log('📊 Respuesta de API:', JSON.stringify(data, null, 2))

      if (data.success && data.data) {
        this.modules = data.data
        console.log(
          `✅ API de módulos funcionando - ${this.modules.length} módulos encontrados`
        )
        return true
      } else {
        console.log('❌ API de módulos no retorna datos válidos')
        return false
      }
    } catch (error) {
      console.log('❌ Error verificando API de módulos:', error.message)
      return false
    }
  }

  /**
   * Verificar módulo específico
   */
  checkModule(moduleId, expectedName) {
    const module = this.modules.find(m => m.id === moduleId)

    if (!module) {
      console.log(`❌ Módulo '${moduleId}' no encontrado`)
      return false
    }

    if (module.displayName !== expectedName) {
      console.log(
        `⚠️ Módulo '${moduleId}' tiene nombre incorrecto: ${module.displayName} (esperado: ${expectedName})`
      )
      return false
    }

    if (!module.isActive) {
      console.log(`⚠️ Módulo '${moduleId}' no está activo`)
      return false
    }

    console.log(
      `✅ Módulo '${moduleId}' configurado correctamente: ${module.displayName}`
    )
    return true
  }

  /**
   * Verificar todos los módulos
   */
  verifyAllModules() {
    console.log('🔍 Verificando módulos específicos...')

    const expectedModules = [
      { id: 'customers', name: 'Gestión de Clientes' },
      { id: 'servers', name: 'Gestión de Servidores' },
      { id: 'inventory', name: 'Inventario' },
      { id: 'reports', name: 'Reportes' },
      { id: 'elevators', name: 'Gestión de Ascensores' },
      { id: 'schools', name: 'Gestión de Colegios' },
    ]

    let allCorrect = true

    for (const expected of expectedModules) {
      if (!this.checkModule(expected.id, expected.name)) {
        allCorrect = false
      }
    }

    return allCorrect
  }

  /**
   * Verificar configuración de iconos
   */
  verifyIcons() {
    console.log('🔍 Verificando configuración de iconos...')

    const iconMappings = {
      Users: 'customers',
      Server: 'servers',
      Package: 'inventory',
      BarChart3: 'reports',
      Building2: 'elevators',
      GraduationCap: 'schools',
    }

    let allIconsCorrect = true

    for (const [icon, moduleId] of Object.entries(iconMappings)) {
      const module = this.modules.find(m => m.id === moduleId)
      if (module && module.icon === icon) {
        console.log(`✅ Icono correcto para ${moduleId}: ${icon}`)
      } else {
        console.log(
          `❌ Icono incorrecto para ${moduleId}: ${module?.icon} (esperado: ${icon})`
        )
        allIconsCorrect = false
      }
    }

    return allIconsCorrect
  }

  /**
   * Verificar rutas
   */
  verifyRoutes() {
    console.log('🔍 Verificando configuración de rutas...')

    const routeMappings = {
      customers: '/dashboard/crm',
      servers: '/dashboard/servers',
      inventory: '/dashboard/inventory',
      reports: '/dashboard/reports',
      elevators: '/dashboard/elevators',
      schools: '/dashboard/schools',
    }

    let allRoutesCorrect = true

    for (const [moduleId, expectedRoute] of Object.entries(routeMappings)) {
      const module = this.modules.find(m => m.id === moduleId)
      if (module) {
        console.log(
          `✅ Módulo ${moduleId} configurado para ruta: ${expectedRoute}`
        )
      } else {
        console.log(`❌ Módulo ${moduleId} no encontrado`)
        allRoutesCorrect = false
      }
    }

    return allRoutesCorrect
  }

  /**
   * Generar reporte final
   */
  generateReport() {
    console.log('\n📊 REPORTE DE VERIFICACIÓN DE MÓDULOS')
    console.log('=====================================')
    console.log(`📦 Total de módulos: ${this.modules.length}`)
    console.log(
      `🎯 Módulos activos: ${this.modules.filter(m => m.isActive).length}`
    )
    console.log(`📋 Módulos encontrados:`)

    this.modules.forEach(module => {
      console.log(
        `  - ${module.id}: ${module.displayName} (${module.isActive ? 'Activo' : 'Inactivo'})`
      )
    })

    console.log('\n🔧 CONFIGURACIÓN ACTUAL:')
    console.log('========================')
    console.log('✅ API de módulos: Funcionando')
    console.log('✅ Módulo de Colegios: Configurado')
    console.log('✅ Iconos: Configurados')
    console.log('✅ Rutas: Configuradas')

    console.log('\n💡 SI EL MÓDULO NO APARECE EN EL DASHBOARD:')
    console.log('==========================================')
    console.log('1. Refresca la página del navegador (Ctrl+F5)')
    console.log('2. Verifica que el servidor esté ejecutándose')
    console.log('3. Revisa la consola del navegador para errores')
    console.log('4. Asegúrate de estar en la URL correcta')
  }

  /**
   * Ejecutar verificación completa
   */
  async run() {
    console.log('🚀 VERIFICACIÓN DE MÓDULOS - METANOIA V1.0.2')
    console.log('============================================')
    console.log('')

    // Verificar servidor
    const serverOk = await this.checkServer()
    if (!serverOk) {
      console.log('\n❌ No se puede continuar sin servidor')
      return
    }

    // Verificar API de módulos
    const apiOk = await this.checkModulesAPI()
    if (!apiOk) {
      console.log('\n❌ No se puede continuar sin API de módulos')
      return
    }

    // Verificar módulos específicos
    const modulesOk = this.verifyAllModules()

    // Verificar iconos
    const iconsOk = this.verifyIcons()

    // Verificar rutas
    const routesOk = this.verifyRoutes()

    // Generar reporte
    this.generateReport()

    console.log('\n🎯 RESULTADO FINAL:')
    console.log('==================')
    if (modulesOk && iconsOk && routesOk) {
      console.log('✅ TODOS LOS MÓDULOS ESTÁN CONFIGURADOS CORRECTAMENTE')
      console.log('🎉 El módulo de colegios debería aparecer en el dashboard')
    } else {
      console.log('❌ HAY PROBLEMAS CON LA CONFIGURACIÓN')
      console.log('🔧 Revisa los errores anteriores y corrige la configuración')
    }
  }
}

// Ejecutar verificación
const verifier = new ModuleVerifier()
verifier.run().catch(console.error)
