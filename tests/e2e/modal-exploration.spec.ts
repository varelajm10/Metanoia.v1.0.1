import { test, expect } from '@playwright/test'

test.describe('Exploración del Modal de Gestión de Tenants', () => {
  test('Explorar el formulario del modal de gestión de tenants', async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login')
    await expect(page).toHaveTitle(/Sistema ERP SaaS/)

    // Hacer login como Super-Admin
    await page.fill('input[name="email"]', 'mentanoiaclick@gmail.com')
    await page.fill('input[name="password"]', 'Tool2225-')
    await page.click('button[type="submit"]')

    // Esperar redirección al dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    console.log('✅ Login exitoso, en el dashboard')

    // Esperar a que la página cargue completamente
    await page.waitForTimeout(3000)

    // Hacer clic en "Gestionar Tenants"
    console.log('🖱️ Haciendo clic en "Gestionar Tenants"...')
    await page.click('button:has-text("Gestionar Tenants")')
    console.log('✅ Click en "Gestionar Tenants" realizado')

    // Esperar a que aparezca el modal
    console.log('⏳ Esperando que aparezca el modal...')
    await page.waitForTimeout(2000)

    // Verificar si el modal está visible
    const modal = page.locator('[role="dialog"]')
    const isModalVisible = await modal.isVisible()
    console.log(`🔍 Modal visible: ${isModalVisible}`)

    if (isModalVisible) {
      console.log('✅ Modal abierto correctamente')
      
      // Explorar todos los campos de entrada en el modal
      console.log('🔍 Explorando campos de entrada en el modal...')
      const inputs = await page.locator('input').all()
      console.log(`📊 Total de inputs encontrados: ${inputs.length}`)

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        const name = await input.getAttribute('name')
        const type = await input.getAttribute('type')
        const placeholder = await input.getAttribute('placeholder')
        const isVisible = await input.isVisible()
        console.log(`  ${i + 1}. name="${name}" type="${type}" placeholder="${placeholder}" - Visible: ${isVisible}`)
      }

      // Explorar todos los labels en el modal
      console.log('🔍 Explorando labels en el modal...')
      const labels = await page.locator('label').all()
      console.log(`📊 Total de labels encontrados: ${labels.length}`)

      for (let i = 0; i < labels.length; i++) {
        const label = labels[i]
        const text = await label.textContent()
        const forAttr = await label.getAttribute('for')
        const isVisible = await label.isVisible()
        console.log(`  ${i + 1}. "${text}" for="${forAttr}" - Visible: ${isVisible}`)
      }

      // Explorar todos los botones en el modal
      console.log('🔍 Explorando botones en el modal...')
      const buttons = await page.locator('button').all()
      console.log(`📊 Total de botones encontrados: ${buttons.length}`)

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i]
        const text = await button.textContent()
        const type = await button.getAttribute('type')
        const isVisible = await button.isVisible()
        console.log(`  ${i + 1}. "${text}" type="${type}" - Visible: ${isVisible}`)
      }

      // Explorar la estructura del modal
      console.log('🔍 Explorando estructura del modal...')
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      console.log(`📊 Total de encabezados en el modal: ${headings.length}`)

      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i]
        const text = await heading.textContent()
        const tagName = await heading.evaluate(el => el.tagName)
        console.log(`  ${i + 1}. <${tagName}> "${text}"`)
      }

      // Buscar específicamente campos relacionados con tenant
      console.log('🔍 Buscando campos relacionados con tenant...')
      const companyInputs = await page.locator('input[placeholder*="empresa"], input[placeholder*="company"], input[name*="company"]').all()
      const nameInputs = await page.locator('input[placeholder*="nombre"], input[name*="name"]').all()
      const emailInputs = await page.locator('input[type="email"], input[placeholder*="email"]').all()

      console.log(`📊 Inputs de empresa: ${companyInputs.length}`)
      console.log(`📊 Inputs de nombre: ${nameInputs.length}`)
      console.log(`📊 Inputs de email: ${emailInputs.length}`)

      // Tomar una captura de pantalla del modal
      await page.screenshot({ path: 'modal-exploration.png', fullPage: true })
      console.log('📸 Captura de pantalla del modal guardada como modal-exploration.png')

    } else {
      console.log('❌ Modal no está visible')
      
      // Verificar si hay algún mensaje de error
      const errorMessages = await page.locator('[class*="error"], [class*="alert"], .text-red-500').allTextContents()
      if (errorMessages.length > 0) {
        console.log('❌ Mensajes de error encontrados:')
        errorMessages.forEach(msg => console.log(`  - ${msg}`))
      }

      // Verificar si hay algún loading
      const loadingElements = await page.locator('[class*="loading"], [class*="spinner"]').count()
      if (loadingElements > 0) {
        console.log(`⏳ Elementos de carga encontrados: ${loadingElements}`)
      }
    }

    console.log('🎉 Exploración del modal completada')
  })
})
