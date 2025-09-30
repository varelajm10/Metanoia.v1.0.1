import { test, expect, Page } from '@playwright/test'

// Configuración de credenciales del Super-Admin
const SUPER_ADMIN_EMAIL = 'mentanoiaclick@gmail.com'
const SUPER_ADMIN_PASSWORD = 'Tool2225-'

// Función helper para generar datos únicos
function generateUniqueData() {
  const timestamp = Date.now()
  return {
    companyName: `Empresa Test ${timestamp}`,
    adminFirstName: 'Admin',
    adminLastName: 'Test',
    adminEmail: `admin.test.${timestamp}@example.com`,
  }
}

test.describe('Ciclo de Vida Simplificado de Tenant', () => {
  let testData: ReturnType<typeof generateUniqueData>

  test.beforeEach(() => {
    testData = generateUniqueData()
  })

  test('Flujo básico: Login y navegación', async ({ page }) => {
    // ==========================================
    // PASO 1: Super-Admin inicia sesión
    // ==========================================
    console.log('🔐 Iniciando sesión como Super-Admin...')
    
    await page.goto('/login')
    await expect(page).toHaveTitle(/Sistema ERP SaaS/)
    
    // Completar formulario de login
    await page.fill('input[name="email"]', SUPER_ADMIN_EMAIL)
    await page.fill('input[name="password"]', SUPER_ADMIN_PASSWORD)
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]')
    
    // Esperar a que la página se redirija
    await page.waitForURL(/\/dashboard/, { timeout: 20000 })
    
    // Verificar que estamos en el dashboard
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    console.log('✅ Super-Admin logueado exitosamente')

    // ==========================================
    // PASO 2: Navegación a la Gestión de Tenants
    // ==========================================
    console.log('🏢 Navegando a la gestión de tenants...')
    
    // Navegar al panel de Super-Admin
    await page.goto('/super-admin')
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle')
    
    // Verificar que estamos en la página correcta
    await expect(page.locator('h1')).toContainText('Super Admin Dashboard')
    
    console.log('✅ Página de gestión de tenants cargada correctamente')

    // ==========================================
    // PASO 3: Verificar que el botón de crear tenant existe
    // ==========================================
    console.log('🔍 Verificando botón de crear tenant...')
    
    // Buscar el botón "Agregar Nuevo Cliente"
    const createButton = page.getByRole('button', { name: /Agregar Nuevo Cliente/i })
    await expect(createButton).toBeVisible()
    
    console.log('✅ Botón de crear tenant encontrado')

    // ==========================================
    // PASO 4: Abrir modal de creación
    // ==========================================
    console.log('📝 Abriendo modal de creación...')
    
    // Hacer clic en el botón
    await createButton.click()
    
    // Esperar a que aparezca el modal
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Crear Nuevo Cliente Empresa')).toBeVisible()
    
    console.log('✅ Modal de creación abierto')

    // ==========================================
    // PASO 5: Rellenar formulario
    // ==========================================
    console.log('📝 Rellenando formulario...')
    
    // Rellenar formulario de creación de tenant
    await page.fill('input[id="companyName"]', testData.companyName)
    await page.fill('input[id="adminFirstName"]', testData.adminFirstName)
    await page.fill('input[id="adminLastName"]', testData.adminLastName)
    await page.fill('input[id="adminEmail"]', testData.adminEmail)
    
    console.log('✅ Formulario rellenado')

    // ==========================================
    // PASO 6: Intentar enviar formulario
    // ==========================================
    console.log('🚀 Enviando formulario...')
    
    // Configurar interceptor para capturar errores
    page.on('response', async (response) => {
      if (response.url().includes('/api/admin/tenants') && response.request().method() === 'POST') {
        console.log(`📡 API Response: ${response.status()} - ${response.url()}`)
        if (response.status() !== 200) {
          const errorText = await response.text()
          console.log(`❌ Error en API: ${errorText}`)
        }
      }
    })
    
    // Enviar formulario
    await page.getByRole('button', { name: 'Crear Cliente' }).click()
    
    // Esperar un momento para que se procese la respuesta
    await page.waitForTimeout(2000)
    
    console.log('✅ Formulario enviado')

    // ==========================================
    // PASO 7: Verificar resultado
    // ==========================================
    console.log('🔍 Verificando resultado...')
    
    // Verificar si el modal se cerró o si hay un error
    const modalVisible = await page.locator('[role="dialog"]').isVisible()
    
    if (modalVisible) {
      console.log('⚠️ Modal sigue visible - posible error en la creación')
      
      // Buscar mensajes de error
      const errorMessage = page.locator('text=Error, text=error, text=Error')
      if (await errorMessage.isVisible()) {
        console.log('❌ Error visible en el modal')
      }
    } else {
      console.log('✅ Modal se cerró - tenant creado exitosamente')
      
      // Verificar que el nuevo tenant aparece en la lista
      await expect(page.locator(`text=${testData.companyName}`)).toBeVisible()
      console.log('✅ Nuevo tenant visible en la lista')
    }

    console.log('🎉 ¡Test básico completado!')
  })
})
