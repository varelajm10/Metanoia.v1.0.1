# Tests - Metanoia V1.0.1

## 📋 Resumen

Este directorio contiene todos los tests unitarios e integración para el sistema ERP Metanoia V1.0.1. Los tests están organizados por módulos y cubren todas las APIs principales del sistema.

## 🏗️ Estructura de Tests

```
src/__tests__/
├── api/                          # Tests unitarios de APIs
│   ├── customers.test.ts         # Tests API Customers
│   ├── products.test.ts          # Tests API Products
│   ├── orders.test.ts            # Tests API Orders
│   └── invoices.test.ts          # Tests API Invoices
├── integration/                  # Tests de integración
│   └── api-integration.test.ts   # Tests de integración de APIs
├── utils/                        # Utilidades para tests
│   └── test-helpers.ts           # Helpers y mocks para tests
├── setup.ts                      # Configuración global de tests
└── README.md                     # Este archivo
```

## 🧪 Tipos de Tests

### **Tests Unitarios**

- **API Customers**: Tests para todos los endpoints de gestión de clientes
- **API Products**: Tests para todos los endpoints de gestión de productos e inventario
- **API Orders**: Tests para todos los endpoints de gestión de órdenes
- **API Invoices**: Tests para todos los endpoints de gestión de facturas

### **Tests de Integración**

- **API Integration**: Tests que verifican la integración entre diferentes APIs
- **Formato de Respuesta**: Verificación de consistencia en formatos de respuesta
- **Multi-tenancy**: Verificación del aislamiento de datos por tenant
- **Performance**: Tests de rendimiento y tiempo de respuesta

## 🔧 Configuración

### **Jest Configuration**

Los tests están configurados en `jest.config.js` con:

- **Setup Files**: `jest.setup.js` y `src/__tests__/setup.ts`
- **Module Mapping**: Soporte para alias `@/` de TypeScript
- **Coverage**: Umbral mínimo del 70% en branches, functions, lines y statements
- **Test Environment**: `jest-environment-jsdom` para tests de componentes

### **Mocks y Stubs**

- **Prisma Client**: Mock completo de Prisma para tests de base de datos
- **Next.js**: Mock de componentes de Next.js (router, server, etc.)
- **Middleware**: Mock de autenticación y autorización
- **Servicios**: Mock de todos los servicios de negocio

## 🚀 Ejecutar Tests

### **Comandos Disponibles**

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests específicos
npm test -- --testPathPattern=customers

# Ejecutar tests de integración
npm test -- --testPathPattern=integration
```

### **Variables de Entorno para Tests**

```env
DATABASE_URL="postgresql://test:test@localhost:5432/test"
JWT_SECRET="test-jwt-secret"
REDIS_URL="redis://localhost:6379"
```

## 📊 Cobertura de Tests

### **APIs Cubiertas**

- ✅ **Customers API**: 100% de endpoints cubiertos
- ✅ **Products API**: 100% de endpoints cubiertos
- ✅ **Orders API**: 100% de endpoints cubiertos
- ✅ **Invoices API**: 100% de endpoints cubiertos

### **Casos de Prueba**

- ✅ **Casos Exitosos**: Creación, lectura, actualización, eliminación
- ✅ **Validación de Datos**: Errores de validación con Zod
- ✅ **Autorización**: Verificación de permisos por rol
- ✅ **Multi-tenancy**: Aislamiento de datos por tenant
- ✅ **Manejo de Errores**: Errores de base de datos, validación, permisos
- ✅ **Paginación**: Tests de paginación y filtros
- ✅ **Búsqueda**: Tests de funcionalidad de búsqueda

## 🛠️ Utilidades de Test

### **Test Helpers**

El archivo `test-helpers.ts` proporciona:

- **Datos Mock**: Objetos de prueba predefinidos para todas las entidades
- **Utilidades de Request**: Funciones para crear requests de prueba
- **Validadores**: Funciones para validar respuestas de API
- **Mocks de Error**: Utilidades para simular diferentes tipos de errores

### **Ejemplo de Uso**

```typescript
import {
  createMockRequest,
  createMockCustomer,
  expectApiSuccess,
} from '@/__tests__/utils/test-helpers'

// Crear request de prueba
const request = createMockRequest('/api/customers', {
  method: 'POST',
  body: createMockCustomer({ name: 'Nuevo Cliente' }),
})

// Validar respuesta exitosa
const response = await POST(request)
expectApiSuccess(response, expectedData)
```

## 🔍 Casos de Prueba Específicos

### **API Customers**

- ✅ Listar clientes con filtros y paginación
- ✅ Crear cliente con validación de email único
- ✅ Obtener cliente por ID
- ✅ Actualizar cliente
- ✅ Eliminar cliente (soft delete)
- ✅ Activar/desactivar cliente
- ✅ Búsqueda de clientes
- ✅ Manejo de errores de integridad

### **API Products**

- ✅ Listar productos con filtros avanzados
- ✅ Crear producto con validación de SKU único
- ✅ Gestión de stock con validaciones
- ✅ Categorías y marcas dinámicas
- ✅ Productos con stock bajo
- ✅ Estadísticas de inventario
- ✅ Soporte para productos digitales

### **API Orders**

- ✅ Crear orden con validación de stock
- ✅ Gestión de estados con transiciones controladas
- ✅ Cálculos automáticos de totales e impuestos
- ✅ Restauración de stock al cancelar
- ✅ Estadísticas de ventas
- ✅ Búsqueda por número de orden o cliente

### **API Invoices**

- ✅ Crear factura con numeración automática
- ✅ Gestión de estados de factura
- ✅ Registro de pagos con validación de montos
- ✅ Facturas vencidas
- ✅ Estadísticas financieras
- ✅ Búsqueda por número de factura o cliente

## 🚨 Manejo de Errores

### **Tipos de Error Cubiertos**

- **400 Bad Request**: Datos inválidos, parámetros incorrectos
- **401 Unauthorized**: Token faltante o inválido
- **403 Forbidden**: Permisos insuficientes
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflictos de integridad, duplicados
- **500 Internal Server Error**: Errores del servidor

### **Validaciones Específicas**

- **Email único**: Por tenant
- **SKU único**: Por tenant
- **Stock suficiente**: Para órdenes
- **Transiciones de estado**: Válidas según reglas de negocio
- **Montos de pago**: No exceder total de factura

## 📈 Métricas de Calidad

### **Cobertura Mínima**

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### **Tiempo de Ejecución**

- **Tests Unitarios**: < 5 segundos
- **Tests de Integración**: < 10 segundos
- **Tests Completos**: < 15 segundos

## 🔄 CI/CD Integration

### **GitHub Actions**

Los tests se ejecutan automáticamente en:

- **Push**: A cualquier rama
- **Pull Request**: Antes de merge
- **Release**: Antes de deploy

### **Pre-commit Hooks**

- **Husky**: Ejecuta tests antes de commit
- **Lint-staged**: Ejecuta linting en archivos modificados

## 📝 Mejores Prácticas

### **Escribir Tests**

1. **Arrange**: Configurar datos de prueba y mocks
2. **Act**: Ejecutar la función/endpoint a probar
3. **Assert**: Verificar resultados esperados

### **Naming Conventions**

- **Describe**: `API [Module]` o `[Function]`
- **It**: `debería [acción] [condición]`
- **Test Files**: `[module].test.ts`

### **Mocking**

- **Servicios**: Mock completo de servicios de negocio
- **Base de Datos**: Mock de Prisma Client
- **Middleware**: Mock de autenticación y autorización
- **Next.js**: Mock de componentes de Next.js

## 🐛 Debugging Tests

### **Comandos de Debug**

```bash
# Ejecutar tests con verbose output
npm test -- --verbose

# Ejecutar tests específicos con debug
npm test -- --testNamePattern="debería crear cliente" --verbose

# Ejecutar tests con coverage detallado
npm run test:coverage -- --coverageReporters=text-lcov
```

### **Logs de Debug**

Los tests incluyen logs detallados para:

- **Requests**: Datos enviados a las APIs
- **Responses**: Respuestas recibidas
- **Mocks**: Estado de los mocks utilizados
- **Errors**: Detalles de errores capturados

---

**Última actualización:** 23 de Septiembre, 2025
**Versión:** 1.0.0
**© 2025 metanoia.click - Metanoia V1.0.1**
