import { test, expect } from '@playwright/test'

test.describe('Debug Frontend Logs', () => {
  test('Capturar logs del frontend durante el login', async ({ page }) => {
    console.log('🔍 Iniciando test para capturar logs del frontend...')
    
    // Capturar logs de consola del navegador
    const consoleLogs: string[] = []
    page.on('console', msg => {
      const logMessage = `[BROWSER] ${msg.type()}: ${msg.text()}`
      consoleLogs.push(logMessage)
      console.log(logMessage) // Mostrar en tiempo real
    })

    // Navegar a la página de login
    await page.goto('/login')
    console.log('✅ Navegación a /login exitosa')
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
    console.log('✅ Página cargada completamente')
    
    // Llenar el formulario de login
    console.log('🔍 Llenando formulario de login...')
    await page.fill('input[name="email"]', 'mentanoiaclick@gmail.com')
    await page.fill('input[name="password"]', 'Tool2225-')
    console.log('✅ Formulario llenado')
    
    // Hacer clic en el botón de login
    console.log('🔍 Haciendo clic en el botón de login...')
    await page.click('button[type="submit"]')
    console.log('✅ Botón de login clickeado')
    
    // Esperar un momento para que se procese la petición
    await page.waitForTimeout(3000)
    console.log('✅ Espera de 3 segundos completada')
    
    // Mostrar todos los logs capturados
    console.log('\n📋 RESUMEN DE LOGS DEL NAVEGADOR:')
    consoleLogs.forEach(log => console.log(log))
    
    // Verificar la URL actual
    const currentUrl = page.url()
    console.log(`🔍 URL actual: ${currentUrl}`)
    
    // El test fallará intencionalmente para que podamos ver los logs
    expect(currentUrl).toContain('dashboard')
  })
})
