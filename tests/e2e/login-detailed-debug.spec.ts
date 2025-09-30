import { test, expect } from '@playwright/test'

test.describe('Debug Login Detallado', () => {
  test('Diagnóstico completo del proceso de login', async ({ page }) => {
    // Interceptar todas las respuestas de red
    let loginResponse: any = null
    let networkErrors: string[] = []
    
    page.on('response', async (response) => {
      if (response.url().includes('/api/auth/login')) {
        console.log('🔍 Login API Response Status:', response.status())
        console.log('🔍 Login API Response Headers:', Object.fromEntries(response.headers()))
        
        try {
          loginResponse = await response.json()
          console.log('🔍 Login API Response Body:', loginResponse)
        } catch (error) {
          console.error('❌ Error parsing login response:', error)
          networkErrors.push(`Login API parsing error: ${error}`)
        }
      }
    })

    page.on('requestfailed', (request) => {
      if (request.url().includes('/api/auth/login')) {
        console.error('❌ Login request failed:', request.failure())
        networkErrors.push(`Login request failed: ${request.failure()?.errorText}`)
      }
    })

    // Navegar a la página de login
    console.log('🌐 Navegando a /login...')
    await page.goto('/login')
    await expect(page).toHaveTitle(/Sistema ERP SaaS/)
    console.log('✅ Página de login cargada correctamente')

    // Verificar que los campos están presentes
    console.log('🔍 Verificando campos del formulario...')
    const emailField = page.locator('input[name="email"]')
    const passwordField = page.locator('input[name="password"]')
    const submitButton = page.locator('button[type="submit"]')
    
    await expect(emailField).toBeVisible()
    await expect(passwordField).toBeVisible()
    await expect(submitButton).toBeVisible()
    console.log('✅ Campos del formulario encontrados')

    // Llenar el formulario
    console.log('📝 Llenando formulario de login...')
    await emailField.fill('mentanoiaclick@gmail.com')
    await passwordField.fill('Tool2225-')
    console.log('✅ Formulario llenado')

    // Hacer clic en submit
    console.log('🖱️ Haciendo clic en submit...')
    await submitButton.click()
    console.log('✅ Click en submit realizado')

    // Esperar y verificar la respuesta
    console.log('⏳ Esperando respuesta del servidor...')
    await page.waitForTimeout(3000)

    // Verificar si hay errores de red
    if (networkErrors.length > 0) {
      console.log('❌ Errores de red detectados:')
      networkErrors.forEach(error => console.log(`  - ${error}`))
    }

    // Verificar la respuesta de la API
    if (loginResponse) {
      console.log('📊 Respuesta de la API recibida:')
      console.log(`  - Success: ${loginResponse.success}`)
      console.log(`  - User: ${loginResponse.user?.email}`)
      console.log(`  - Token: ${loginResponse.token ? 'Presente' : 'Ausente'}`)
      
      if (loginResponse.success) {
        console.log('✅ Login API exitoso')
      } else {
        console.log('❌ Login API falló:', loginResponse.error)
      }
    } else {
      console.log('❌ No se recibió respuesta de la API')
    }

    // Verificar la URL actual
    const currentUrl = page.url()
    console.log(`🌐 URL actual: ${currentUrl}`)
    
    if (currentUrl.includes('/dashboard')) {
      console.log('✅ Redirección al dashboard exitosa')
    } else if (currentUrl.includes('/login')) {
      console.log('❌ Permanece en la página de login')
      
      // Verificar si hay mensajes de error en la página
      const errorMessages = await page.locator('[class*="error"], [class*="alert"], .text-red-500').allTextContents()
      if (errorMessages.length > 0) {
        console.log('❌ Mensajes de error en la página:')
        errorMessages.forEach(msg => console.log(`  - ${msg}`))
      }
    }

    // Verificar si hay elementos del dashboard visibles
    const dashboardElements = await page.locator('h1:has-text("Dashboard"), [data-testid="dashboard"]').count()
    console.log(`🔍 Elementos del dashboard encontrados: ${dashboardElements}`)

    // Esperar un poco más para ver si hay redirección tardía
    console.log('⏳ Esperando redirección tardía...')
    await page.waitForTimeout(2000)
    
    const finalUrl = page.url()
    console.log(`🌐 URL final: ${finalUrl}`)

    // Hacer assertions basadas en los resultados
    if (loginResponse && loginResponse.success) {
      expect(finalUrl).toMatch(/\/dashboard/)
      console.log('🎉 Test completado exitosamente')
    } else {
      console.log('❌ Test falló - Login no exitoso')
      throw new Error('Login no fue exitoso')
    }
  })
})
