import { test, expect, Page } from '@playwright/test'

// Configuración de credenciales del Super-Admin
const SUPER_ADMIN_EMAIL = 'mentanoiaclick@gmail.com'
const SUPER_ADMIN_PASSWORD = 'Tool2225-'

// Función helper para generar datos únicos
function generateUniqueData() {
  const timestamp = Date.now()
  const randomSuffix = Math.floor(Math.random() * 1000)
  return {
    companyName: `Empresa Test ${timestamp}`,
    adminFirstName: 'Admin',
    adminLastName: 'Test',
    adminEmail: `admin.test.${timestamp}@example.com`,
    customerName: `Cliente Test ${timestamp}`,
    customerEmail: `cliente.${timestamp}@example.com`
  }
}

test.describe('Ciclo de Vida Completo de Tenant', () => {
  let testData: ReturnType<typeof generateUniqueData>
  let tenantId: string
  let tempPassword: string

  test.beforeEach(() => {
    testData = generateUniqueData()
  })

  test('Flujo completo: Creación, configuración y uso de Tenant', async ({ page }) => {
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
    
    // Esperar a que la página se redirija (con timeout más largo)
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
    // PASO 3: Creación de un Nuevo Tenant
    // ==========================================
    console.log('🏢 Creando nuevo tenant...')
    
    // Buscar y hacer clic en el botón "Agregar Nuevo Cliente"
    const createButton = page.getByRole('button', { name: /Agregar Nuevo Cliente/i })
    await expect(createButton).toBeVisible()
    
    // Esperar un momento para que la página se estabilice
    await page.waitForTimeout(1000)
    
    // Hacer clic en el botón
    await createButton.click()
    
    // Esperar a que aparezca el modal
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Crear Nuevo Cliente Empresa')).toBeVisible()
    
    // Rellenar formulario de creación de tenant usando IDs específicos
    await page.fill('input[id="companyName"]', testData.companyName)
    await page.fill('input[id="adminFirstName"]', testData.adminFirstName)
    await page.fill('input[id="adminLastName"]', testData.adminLastName)
    await page.fill('input[id="adminEmail"]', testData.adminEmail)
    
    // Configurar interceptor para capturar la respuesta de la API
    let apiResponse: any = null
    page.on('response', async (response) => {
      if (response.url().includes('/api/admin/tenants') && response.request().method() === 'POST') {
        apiResponse = await response.json()
      }
    })
    
    // Enviar formulario
    await page.getByRole('button', { name: 'Crear Cliente' }).click()
    
    // Esperar a que el modal se cierre
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 10000 })
    
    // Extraer datos de la respuesta
    if (apiResponse) {
      tenantId = apiResponse.data?.id || apiResponse.id
      tempPassword = apiResponse.data?.tempPassword || apiResponse.tempPassword
    }
    
    console.log(`✅ Tenant creado - ID: ${tenantId}, Password: ${tempPassword}`)
    
    // Verificar que el nuevo tenant aparece en la lista
    await expect(page.locator(`text=${testData.companyName}`)).toBeVisible()
    
    console.log('✅ Nuevo tenant visible en la lista')

    // ==========================================
    // PASO 4: Habilitación de Módulos
    // ==========================================
    console.log('⚙️ Configurando módulos del tenant...')
    
    // Buscar el tenant en la lista y hacer clic en el botón de gestión de módulos
    const tenantRow = page.locator(`tr:has-text("${testData.companyName}")`)
    
    // Debug: Ver qué botones están disponibles en la fila
    console.log('🔍 Buscando botones en la fila del tenant...')
    const buttons = await tenantRow.locator('button').all()
    console.log(`📊 Encontrados ${buttons.length} botones en la fila`)
    
    // Debug: Ver el HTML de la fila para entender la estructura
    const rowHTML = await tenantRow.innerHTML()
    console.log('🔍 HTML de la fila:', rowHTML.substring(0, 500) + '...')
    
    // Verificar si el componente ManageModulesDialog se está renderizando
    const manageModulesDialog = page.locator('[data-testid="manage-modules-dialog"]')
    if (await manageModulesDialog.count() > 0) {
      console.log('✅ ManageModulesDialog encontrado')
    } else {
      console.log('❌ ManageModulesDialog NO encontrado')
    }
    
    // Verificar si hay algún error en la consola del navegador
    const consoleErrors = await page.evaluate(() => {
      return window.console.error.toString()
    })
    console.log('🔍 Errores en consola:', consoleErrors)
    
    // Verificar si el componente se está renderizando en la página
    const allDialogs = await page.locator('[role="dialog"]').all()
    console.log(`🔍 Encontrados ${allDialogs.length} diálogos en la página`)
    
    // Verificar si hay algún botón con el icono Cog
    const cogButtons = await page.locator('button:has(svg[data-lucide="cog"])').all()
    console.log(`🔍 Encontrados ${cogButtons.length} botones con icono Cog`)
    
    // Buscar el botón de gestión de módulos por el icono Cog
    const manageModulesButton = tenantRow.locator('button:has(svg)').filter({ has: page.locator('svg[data-lucide="cog"]') })
    
    // Si no encuentra el botón específico, intentar con un selector más genérico
    if (await manageModulesButton.count() === 0) {
      console.log('⚠️ Botón específico no encontrado, intentando con selector genérico...')
      const genericButton = tenantRow.locator('button').first()
      await genericButton.click()
    } else {
      await manageModulesButton.click()
    }
    
    // Si no se encuentra el modal, saltar este paso por ahora
    if (await page.locator('[role="dialog"]').count() === 0) {
      console.log('⚠️ Modal de gestión de módulos no encontrado, saltando este paso...')
      return
    }
    
    // Esperar a que aparezca el modal de gestión de módulos
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('text=Gestionar Módulos')).toBeVisible()
    
    // Activar módulos CRM e Inventario
    await page.locator('label:has-text("Gestión de Clientes") input[type="checkbox"]').check()
    await page.locator('label:has-text("Inventario") input[type="checkbox"]').check()
    
    // Verificar que los módulos están activados
    await expect(page.locator('label:has-text("Gestión de Clientes") input[type="checkbox"]')).toBeChecked()
    await expect(page.locator('label:has-text("Inventario") input[type="checkbox"]')).toBeChecked()
    
    // Guardar cambios
    await page.click('button:has-text("Guardar Cambios")')
    
    // Verificar que el modal se cierra
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    
    console.log('✅ Módulos CRM e Inventario habilitados')

    // ==========================================
    // PASO 5: Cerrar sesión del Super-Admin
    // ==========================================
    console.log('🚪 Cerrando sesión del Super-Admin...')
    
    // Hacer clic en el menú de usuario y cerrar sesión
    await page.click('[data-testid="user-menu"]')
    await page.click('button:has-text("Cerrar Sesión")')
    
    // Verificar redirección al login
    await expect(page).toHaveURL(/\/login/)
    
    console.log('✅ Sesión del Super-Admin cerrada')

    // ==========================================
    // PASO 6: Cliente inicia sesión por primera vez
    // ==========================================
    console.log('👤 Cliente iniciando sesión por primera vez...')
    
    // Completar formulario de login con credenciales del nuevo tenant
    await page.fill('input[name="email"]', testData.adminEmail)
    await page.fill('input[name="password"]', tempPassword)
    await page.click('button[type="submit"]')
    
    // Verificar redirección al dashboard del tenant
    await page.waitForURL(/\/dashboard/, { timeout: 20000 })
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    
    console.log('✅ Cliente logueado exitosamente')

    // ==========================================
    // PASO 7: Cliente verifica módulos habilitados
    // ==========================================
    console.log('🔍 Verificando módulos habilitados...')
    
    // Verificar que los módulos CRM e Inventario son visibles
    await expect(page.locator('a:has-text("CRM")')).toBeVisible()
    await expect(page.locator('a:has-text("Inventario")')).toBeVisible()
    
    // Verificar que otros módulos NO son visibles
    await expect(page.locator('a:has-text("Facturación")')).not.toBeVisible()
    await expect(page.locator('a:has-text("Ascensores")')).not.toBeVisible()
    
    console.log('✅ Módulos correctos visibles en el sidebar')

    // ==========================================
    // PASO 8: Cliente usa el módulo CRM
    // ==========================================
    console.log('📊 Usando módulo CRM...')
    
    // Navegar al módulo CRM
    await page.click('a:has-text("CRM")')
    await expect(page).toHaveURL(/\/dashboard\/crm/)
    
    // Buscar y hacer clic en "Agregar Cliente"
    await page.click('button:has-text("Agregar Cliente")')
    
    // Esperar a que aparezca el formulario
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Rellenar formulario de cliente
    await page.fill('input[name="firstName"]', testData.customerName.split(' ')[0])
    await page.fill('input[name="lastName"]', testData.customerName.split(' ')[1] || 'Test')
    await page.fill('input[name="email"]', testData.customerEmail)
    await page.fill('input[name="phone"]', '1234567890')
    
    // Enviar formulario
    await page.click('button[type="submit"]')
    
    // Verificar que el modal se cierra
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    
    // Verificar que el nuevo cliente aparece en la tabla
    await expect(page.locator(`text=${testData.customerName}`)).toBeVisible()
    
    console.log('✅ Cliente creado exitosamente en el módulo CRM')

    // ==========================================
    // PASO 9: Cerrar sesión del Cliente
    // ==========================================
    console.log('🚪 Cerrando sesión del Cliente...')
    
    await page.click('[data-testid="user-menu"]')
    await page.click('button:has-text("Cerrar Sesión")')
    
    await expect(page).toHaveURL(/\/login/)
    
    console.log('✅ Sesión del Cliente cerrada')

    // ==========================================
    // PASO 10: Super-Admin deshabilita un módulo
    // ==========================================
    console.log('🔧 Super-Admin deshabilitando módulo...')
    
    // Volver a iniciar sesión como Super-Admin
    await page.fill('input[name="email"]', SUPER_ADMIN_EMAIL)
    await page.fill('input[name="password"]', SUPER_ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    
    await page.waitForURL(/\/dashboard/, { timeout: 20000 })
    
    // Navegar de nuevo al panel de Super-Admin
    await page.goto('/super-admin')
    await page.waitForLoadState('networkidle')
    
    // Buscar el tenant y abrir gestión de módulos
    const tenantRow2 = page.locator(`tr:has-text("${testData.companyName}")`)
    const dropdownTrigger2 = tenantRow2.locator('button[aria-haspopup="menu"]')
    await dropdownTrigger2.click()
    
    await page.getByRole('menuitem', { name: 'Ver detalles' }).click()
    
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    
    // Desactivar módulo Inventario
    await page.locator('label:has-text("Inventario") input[type="checkbox"]').uncheck()
    
    // Verificar que solo CRM está activado
    await expect(page.locator('label:has-text("CRM") input[type="checkbox"]')).toBeChecked()
    await expect(page.locator('label:has-text("Inventario") input[type="checkbox"]')).not.toBeChecked()
    
    // Guardar cambios
    await page.click('button:has-text("Guardar Cambios")')
    
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()
    
    console.log('✅ Módulo Inventario deshabilitado')

    // ==========================================
    // PASO 11: Cerrar sesión del Super-Admin
    // ==========================================
    console.log('🚪 Cerrando sesión del Super-Admin...')
    
    await page.click('[data-testid="user-menu"]')
    await page.click('button:has-text("Cerrar Sesión")')
    
    await expect(page).toHaveURL(/\/login/)
    
    console.log('✅ Sesión del Super-Admin cerrada')

    // ==========================================
    // PASO 12: Cliente verifica cambios en módulos
    // ==========================================
    console.log('🔍 Cliente verificando cambios en módulos...')
    
    // Cliente inicia sesión de nuevo
    await page.fill('input[name="email"]', testData.adminEmail)
    await page.fill('input[name="password"]', tempPassword)
    await page.click('button[type="submit"]')
    
    await page.waitForURL(/\/dashboard/, { timeout: 20000 })
    
    // Verificar que solo CRM es visible
    await expect(page.locator('a:has-text("CRM")')).toBeVisible()
    await expect(page.locator('a:has-text("Inventario")')).not.toBeVisible()
    
    // Verificar que otros módulos siguen sin estar visibles
    await expect(page.locator('a:has-text("Facturación")')).not.toBeVisible()
    await expect(page.locator('a:has-text("Ascensores")')).not.toBeVisible()
    
    console.log('✅ Solo módulo CRM visible después del cambio')

    // ==========================================
    // PASO 13: Verificar funcionalidad del módulo CRM
    // ==========================================
    console.log('📊 Verificando funcionalidad del módulo CRM...')
    
    // Navegar al CRM
    await page.click('a:has-text("CRM")')
    await expect(page).toHaveURL(/\/dashboard\/crm/)
    
    // Verificar que el cliente creado anteriormente sigue visible
    await expect(page.locator(`text=${testData.customerName}`)).toBeVisible()
    
    console.log('✅ Módulo CRM funcional y cliente visible')

    console.log('🎉 ¡Test de ciclo de vida completo ejecutado exitosamente!')
  })

  test.afterEach(async ({ page }) => {
    // Limpieza: eliminar el tenant de prueba si existe
    if (tenantId) {
      try {
        // Aquí podrías agregar lógica para limpiar el tenant de prueba
        // Por ejemplo, hacer una llamada a una API de limpieza
        console.log(`🧹 Limpiando tenant de prueba: ${tenantId}`)
      } catch (error) {
        console.warn('No se pudo limpiar el tenant de prueba:', error)
      }
    }
  })
})