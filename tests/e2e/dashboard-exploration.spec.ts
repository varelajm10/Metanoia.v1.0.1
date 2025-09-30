import { test, expect } from '@playwright/test'

test.describe('Exploración del Dashboard de Administración', () => {
  test('Explorar la interfaz del dashboard de administración', async ({ page }) => {
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

    // Explorar todos los botones visibles
    console.log('🔍 Explorando botones en la página...')
    const buttons = await page.locator('button').all()
    console.log(`📊 Total de botones encontrados: ${buttons.length}`)

    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i]
      const text = await button.textContent()
      const isVisible = await button.isVisible()
      console.log(`  ${i + 1}. "${text}" - Visible: ${isVisible}`)
    }

    // Explorar todos los enlaces visibles
    console.log('🔍 Explorando enlaces en la página...')
    const links = await page.locator('a').all()
    console.log(`📊 Total de enlaces encontrados: ${links.length}`)

    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      const text = await link.textContent()
      const href = await link.getAttribute('href')
      const isVisible = await link.isVisible()
      console.log(`  ${i + 1}. "${text}" (${href}) - Visible: ${isVisible}`)
    }

    // Buscar específicamente botones que contengan "Agregar", "Nuevo", "Cliente"
    console.log('🔍 Buscando botones relacionados con "Agregar Nuevo Cliente"...')
    const agregarButtons = await page.locator('button:has-text("Agregar")').all()
    const nuevoButtons = await page.locator('button:has-text("Nuevo")').all()
    const clienteButtons = await page.locator('button:has-text("Cliente")').all()

    console.log(`📊 Botones con "Agregar": ${agregarButtons.length}`)
    console.log(`📊 Botones con "Nuevo": ${nuevoButtons.length}`)
    console.log(`📊 Botones con "Cliente": ${clienteButtons.length}`)

    // Explorar la estructura de la página
    console.log('🔍 Explorando estructura de la página...')
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    console.log(`📊 Total de encabezados encontrados: ${headings.length}`)

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i]
      const text = await heading.textContent()
      const tagName = await heading.evaluate(el => el.tagName)
      console.log(`  ${i + 1}. <${tagName}> "${text}"`)
    }

    // Verificar si hay algún modal o diálogo abierto
    console.log('🔍 Verificando modales o diálogos...')
    const modals = await page.locator('[role="dialog"], .modal, .dialog').all()
    console.log(`📊 Total de modales encontrados: ${modals.length}`)

    // Verificar si hay algún formulario visible
    console.log('🔍 Verificando formularios...')
    const forms = await page.locator('form').all()
    console.log(`📊 Total de formularios encontrados: ${forms.length}`)

    // Tomar una captura de pantalla para inspección visual
    await page.screenshot({ path: 'dashboard-exploration.png', fullPage: true })
    console.log('📸 Captura de pantalla guardada como dashboard-exploration.png')

    // Verificar la URL actual
    const currentUrl = page.url()
    console.log(`🌐 URL actual: ${currentUrl}`)

    // Verificar si hay algún mensaje de error o loading
    const errorMessages = await page.locator('[class*="error"], [class*="alert"], .text-red-500').allTextContents()
    if (errorMessages.length > 0) {
      console.log('❌ Mensajes de error encontrados:')
      errorMessages.forEach(msg => console.log(`  - ${msg}`))
    }

    const loadingElements = await page.locator('[class*="loading"], [class*="spinner"]').count()
    if (loadingElements > 0) {
      console.log(`⏳ Elementos de carga encontrados: ${loadingElements}`)
    }

    console.log('🎉 Exploración completada')
  })
})
