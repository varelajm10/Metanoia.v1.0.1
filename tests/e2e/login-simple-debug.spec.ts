import { test, expect } from '@playwright/test'

test.describe('Debug Login Simple', () => {
  test('Login básico con logging detallado', async ({ page }) => {
    console.log('🔍 Iniciando test de login simple...')
    
    // Navegar a la página de login
    await page.goto('/login')
    console.log('✅ Navegación a /login exitosa')
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
    console.log('✅ Página cargada completamente')
    
    // Verificar que estamos en la página de login
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Confirmado: estamos en /login')
    
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
    await page.waitForTimeout(2000)
    console.log('✅ Espera de 2 segundos completada')
    
    // Verificar la URL actual
    const currentUrl = page.url()
    console.log(`🔍 URL actual después del login: ${currentUrl}`)
    
    // Verificar si hay errores en la consola
    const consoleLogs = []
    page.on('console', msg => {
      consoleLogs.push(`[CONSOLE] ${msg.type()}: ${msg.text()}`)
    })
    
    // Esperar más tiempo si es necesario
    await page.waitForTimeout(3000)
    console.log('✅ Espera adicional de 3 segundos completada')
    
    // Mostrar logs de consola si los hay
    if (consoleLogs.length > 0) {
      console.log('📋 Logs de consola capturados:')
      consoleLogs.forEach(log => console.log(log))
    }
    
    // Verificar la URL final
    const finalUrl = page.url()
    console.log(`🔍 URL final: ${finalUrl}`)
    
    // El test fallará intencionalmente para que podamos ver los logs
    expect(finalUrl).toContain('dashboard')
  })
})
