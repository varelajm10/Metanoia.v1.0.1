# Tests End-to-End (E2E) con Playwright

Este directorio contiene los tests end-to-end del sistema Metanoia V1.0.1 utilizando Playwright.

## 🚀 Configuración

### Prerrequisitos
- Node.js 18+ instalado
- Playwright instalado: `npm install -D @playwright/test`
- Navegadores instalados: `npx playwright install`

### Configuración del Proyecto
- Archivo de configuración: `playwright.config.ts` en la raíz del proyecto
- Base URL: `http://localhost:3000`
- Timeout de servidor: 2 minutos

## 📋 Scripts Disponibles

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests con interfaz gráfica
npm run test:e2e:ui

# Ejecutar tests en modo headed (con navegador visible)
npm run test:e2e:headed

# Ejecutar tests en modo debug
npm run test:e2e:debug

# Ver reporte de tests
npm run test:e2e:report
```

## 🧪 Tests Implementados

### 1. `onboarding.spec.ts` - Flujo Crítico de Usuario
**Descripción**: Simula el flujo más importante del sistema desde el login hasta la creación de un cliente.

**Pasos del Test**:
1. **Login**: Navega a `/login` y autentica al usuario
2. **Dashboard**: Verifica redirección y elementos críticos
3. **Navegación**: Busca y hace clic en la sección de clientes
4. **Creación**: Abre modal para crear nuevo cliente
5. **Verificación**: Confirma que el modal se abre correctamente
6. **Formulario** (opcional): Rellena y envía el formulario

**Datos de Prueba**:
```typescript
const TEST_USER = {
  email: 'admin@metanoia.com',
  password: 'admin123'
};

const TEST_CLIENT = {
  name: 'Cliente de Prueba E2E',
  email: 'cliente.e2e@test.com',
  phone: '+1234567890',
  company: 'Empresa de Prueba',
  address: 'Calle de Prueba 123'
};
```

### Tests Adicionales
- **Verificación de elementos críticos del login**
- **Verificación de elementos críticos del dashboard**
- **Manejo de credenciales incorrectas**

## 🎯 Cobertura de Navegadores

Los tests se ejecutan en:
- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)
- **Mobile Chrome** (Pixel 5)
- **Mobile Safari** (iPhone 12)
- **Microsoft Edge**
- **Google Chrome**

## 📊 Reportes y Debugging

### Reportes HTML
Después de ejecutar los tests, se genera un reporte HTML interactivo:
```bash
npm run test:e2e:report
```

### Screenshots y Videos
- **Screenshots**: Se capturan automáticamente en caso de fallo
- **Videos**: Se graban automáticamente en caso de fallo
- **Traces**: Se generan para debugging en caso de reintento

### Ubicación de Archivos
```
test-results/
├── results.json          # Resultados en formato JSON
├── results.xml           # Resultados en formato JUnit
├── playwright-report/    # Reporte HTML interactivo
└── [test-name]/          # Screenshots y videos por test
```

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# Ejecutar en CI
CI=true npm run test:e2e

# Ejecutar con configuración específica
PLAYWRIGHT_BROWSERS_PATH=/custom/path npm run test:e2e
```

### Configuración Personalizada
Editar `playwright.config.ts` para:
- Cambiar timeouts
- Agregar nuevos navegadores
- Modificar la base URL
- Configurar proxies
- Agregar autenticación

## 🐛 Debugging

### Modo Debug
```bash
npm run test:e2e:debug
```
- Pausa la ejecución en cada paso
- Permite inspeccionar el estado de la página
- Abre DevTools del navegador

### Modo Headed
```bash
npm run test:e2e:headed
```
- Ejecuta los tests con el navegador visible
- Útil para ver qué está pasando en tiempo real

### Logs de Consola
Los tests incluyen logs detallados:
```
🔐 Paso 1: Iniciando sesión...
✅ Login exitoso
📊 Paso 2: Verificando dashboard...
✅ Dashboard cargado correctamente
```

## 📝 Mejores Prácticas

### Selectores Robustos
- Usar `data-testid` cuando sea posible
- Evitar selectores basados en clases CSS
- Priorizar selectores semánticos

### Timeouts
- Usar timeouts apropiados para cada operación
- Esperar a que los elementos estén visibles antes de interactuar
- Usar `waitForLoadState('networkidle')` para páginas complejas

### Datos de Prueba
- Usar datos únicos para evitar conflictos
- Limpiar datos después de cada test si es necesario
- Usar fixtures para datos complejos

## 🚀 Próximos Pasos

1. **Agregar más flujos críticos**:
   - Gestión de productos
   - Procesamiento de órdenes
   - Configuración de módulos

2. **Implementar Page Object Model**:
   - Crear clases para cada página
   - Centralizar selectores y métodos
   - Mejorar mantenibilidad

3. **Agregar tests de API**:
   - Verificar endpoints críticos
   - Tests de integración backend
   - Validación de datos

4. **Implementar CI/CD**:
   - Ejecutar tests en GitHub Actions
   - Reportes automáticos
   - Notificaciones de fallos

## 📚 Recursos Adicionales

- [Documentación oficial de Playwright](https://playwright.dev/)
- [Mejores prácticas de E2E testing](https://playwright.dev/docs/best-practices)
- [Guía de debugging](https://playwright.dev/docs/debug)
- [Configuración de CI/CD](https://playwright.dev/docs/ci)
