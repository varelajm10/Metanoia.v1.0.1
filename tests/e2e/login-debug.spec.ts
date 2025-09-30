import { test, expect } from '@playwright/test'

test.describe('Debug Login API', () => {
  test('Verificar que el endpoint de login devuelve JSON válido', async ({ page }) => {
    // Interceptar la respuesta de la API
    let apiResponse: any = null
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/auth/login')) {
        try {
          apiResponse = await response.json()
          console.log('API Response:', apiResponse)
        } catch (error) {
          console.error('Error parsing API response:', error)
          console.log('Response status:', response.status())
          console.log('Response headers:', response.headers())
        }
      }
    })

    // Navegar a la página de login
    await page.goto('/login')
    await expect(page).toHaveTitle(/Sistema ERP SaaS/)

    // Intentar hacer login
    await page.fill('input[name="email"]', 'mentanoiaclick@gmail.com')
    await page.fill('input[name="password"]', 'Tool2225-')
    
    // Hacer clic en el botón de submit
    await page.click('button[type="submit"]')
    
    // Esperar un poco para que se procese la respuesta
    await page.waitForTimeout(2000)
    
    // Verificar que recibimos una respuesta JSON válida
    expect(apiResponse).not.toBeNull()
    expect(apiResponse).toHaveProperty('success')
    
    if (apiResponse.success) {
      console.log('✅ Login exitoso')
      expect(apiResponse).toHaveProperty('user')
      expect(apiResponse).toHaveProperty('token')
    } else {
      console.log('❌ Login falló:', apiResponse.error)
    }
  })
})