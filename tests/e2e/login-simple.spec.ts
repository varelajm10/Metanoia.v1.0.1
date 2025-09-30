import { test, expect } from '@playwright/test';

const TEST_USER = {
  email: 'admin@metanoia.com',
  password: 'admin123'
};

test.describe('Login Simple', () => {
  test('Login básico sin interceptación compleja', async ({ page }) => {
    console.log('🔍 Iniciando login simple...');
    
    // Navegar a la página de login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Página de login cargada');
    
    // Llenar el formulario
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    console.log('✅ Formulario llenado');
    
    // Escuchar las requests de red
    const requests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/auth/login')) {
        console.log('📡 Request detectada:', {
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData()
        });
        requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData()
        });
      }
    });
    
    // Escuchar las responses
    const responses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('/api/auth/login')) {
        console.log('📡 Response detectada:', {
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          headers: Object.fromEntries(response.headers())
        });
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText(),
          headers: Object.fromEntries(response.headers())
        });
      }
    });
    
    // Hacer clic en el botón de login
    await page.click('button[type="submit"]');
    console.log('✅ Botón de login clickeado');
    
    // Esperar un poco para que se procese
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log('📍 URL actual:', currentUrl);
    
    // Mostrar información de las requests y responses
    console.log('📋 Requests capturadas:', requests.length);
    console.log('📋 Responses capturadas:', responses.length);
    
    if (requests.length > 0) {
      console.log('📤 Request details:', requests[0]);
    }
    
    if (responses.length > 0) {
      console.log('📥 Response details:', responses[0]);
    }
    
    // Verificar si hay mensajes de error
    const errorMessage = page.locator('.error, .alert-error, [data-testid*="error"], .text-red-500, .text-red-600, .text-destructive');
    if (await errorMessage.isVisible({ timeout: 1000 })) {
      const errorText = await errorMessage.textContent();
      console.log('❌ Error encontrado:', errorText);
    }
    
    // Si estamos en login, mostrar más información de debug
    if (currentUrl.includes('/login')) {
      console.log('❌ Login falló - permanecemos en login');
      
      // Verificar si el formulario tiene algún estado de error
      const form = page.locator('form');
      const formHTML = await form.innerHTML();
      console.log('📋 HTML del formulario:', formHTML.substring(0, 500) + '...');
      
      // Verificar si hay algún input con error
      const errorInputs = page.locator('input[aria-invalid="true"]');
      const errorInputCount = await errorInputs.count();
      console.log('📋 Inputs con error:', errorInputCount);
      
      if (errorInputCount > 0) {
        for (let i = 0; i < errorInputCount; i++) {
          const input = errorInputs.nth(i);
          const name = await input.getAttribute('name');
          const value = await input.inputValue();
          console.log(`  - Input ${name}: "${value}"`);
        }
      }
    } else {
      console.log('✅ Login exitoso - redirigido');
    }
  });
});
