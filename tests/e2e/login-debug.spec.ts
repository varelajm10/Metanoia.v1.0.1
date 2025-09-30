import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'admin@metanoia.com',
  password: 'admin123'
};

test.describe('Debug Login', () => {
  test('Verificar login paso a paso', async ({ page }) => {
    console.log('🔍 Iniciando debug del login...');
    
    // Navegar a la página de login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Página de login cargada');
    
    // Verificar que el formulario está presente
    const form = page.locator('form');
    await expect(form).toBeVisible();
    console.log('✅ Formulario de login visible');
    
    // Llenar el formulario
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    console.log('✅ Formulario llenado');
    
    // Interceptar la request de login
    await page.route('/api/auth/login', async (route) => {
      const request = route.request();
      console.log('📡 Request interceptada:', {
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      });
      
      // Continuar con la request original
      await route.continue();
    });
    
    // Interceptar la respuesta
    await page.route('/api/auth/login', async (route) => {
      const response = await route.fetch();
      console.log('📡 Response interceptada:', {
        status: response.status(),
        statusText: response.statusText(),
        headers: Object.fromEntries(response.headers())
      });
      
      const responseBody = await response.text();
      console.log('📡 Response body:', responseBody);
      
      // Continuar con la respuesta original
      await route.fulfill({
        status: response.status(),
        statusText: response.statusText(),
        headers: response.headers(),
        body: responseBody
      });
    });
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    console.log('✅ Botón de login clickeado');
    
    // Esperar un poco para ver qué pasa
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // Verificar si hay mensajes de error
    const errorMessage = page.locator('.error, .alert-error, [data-testid*="error"], .text-red-500, .text-red-600, .text-destructive');
    if (await errorMessage.isVisible({ timeout: 1000 })) {
      const errorText = await errorMessage.textContent();
      console.log('❌ Error encontrado:', errorText);
    } else {
      console.log('✅ No se encontraron errores visibles');
    }
    
    // Verificar el estado de la consola
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });
    
    console.log('📋 Logs de consola:', logs);
    
    // Si estamos en login, el test falla
    if (currentUrl.includes('/login')) {
      console.log('❌ Login falló - permanecemos en login');
      expect(currentUrl).not.toContain('/login');
    } else {
      console.log('✅ Login exitoso - redirigido');
    }
  });
});
