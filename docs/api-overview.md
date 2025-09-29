# API Overview - Metanoia V1.0.1

## 📋 Resumen General

Metanoia V1.0.1 es un sistema ERP SaaS modular con arquitectura multi-tenant. Este documento proporciona una visión general de todas las APIs disponibles en el sistema.

## 🏗️ Arquitectura del Sistema

### **Stack Tecnológico**

- **Backend**: Node.js + Next.js 14 (App Router)
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT con cookies HTTP-only
- **Multi-tenancy**: Separación por schema por tenant
- **Validación**: Zod para validación de esquemas
- **Autorización**: Sistema de roles y permisos

### **Entidades Principales**

```
Tenant → User, Customer, Product, Order, Invoice
Customer → Order, Invoice
Product → OrderItem → Order
Order → OrderItem, Invoice
```

## 🔐 Autenticación y Autorización

### **Autenticación**

Todas las APIs requieren autenticación mediante JWT token almacenado en cookies HTTP-only.

```http
Cookie: access_token=<jwt_token>
```

### **Sistema de Roles**

- **SUPER_ADMIN**: Acceso completo a todas las funcionalidades
- **ADMIN**: Acceso completo excepto eliminación de algunos recursos
- **MANAGER**: Acceso de lectura y escritura, sin eliminación
- **USER**: Solo acceso de lectura

### **Permisos por Módulo**

| Módulo        | Leer  | Escribir                    | Eliminar           |
| ------------- | ----- | --------------------------- | ------------------ |
| **Customers** | Todos | SUPER_ADMIN, ADMIN, MANAGER | SUPER_ADMIN, ADMIN |
| **Products**  | Todos | SUPER_ADMIN, ADMIN, MANAGER | SUPER_ADMIN, ADMIN |
| **Orders**    | Todos | SUPER_ADMIN, ADMIN, MANAGER | SUPER_ADMIN, ADMIN |
| **Invoices**  | Todos | SUPER_ADMIN, ADMIN, MANAGER | SUPER_ADMIN, ADMIN |

## 📚 APIs Disponibles

### 1. **API Customers (CRM)**

**Base URL**: `/api/customers`

Gestión completa de clientes y contactos.

#### Endpoints Principales

- `GET /api/customers` - Listar clientes con filtros
- `POST /api/customers` - Crear cliente
- `GET /api/customers/{id}` - Obtener cliente por ID
- `PUT /api/customers/{id}` - Actualizar cliente
- `DELETE /api/customers/{id}` - Eliminar cliente
- `PATCH /api/customers/{id}/toggle` - Activar/desactivar
- `GET /api/customers/search` - Búsqueda de clientes

#### Características

- ✅ Multi-tenancy
- ✅ Validación de email único por tenant
- ✅ Soft delete con validación de integridad
- ✅ Búsqueda por nombre, email o teléfono
- ✅ Paginación y filtros avanzados

**📖 Documentación completa**: [api-customers.md](./api-customers.md)

### 2. **API Products (Inventario)**

**Base URL**: `/api/products`

Gestión completa de productos e inventario.

#### Endpoints Principales

- `GET /api/products` - Listar productos con filtros
- `POST /api/products` - Crear producto
- `GET /api/products/{id}` - Obtener producto por ID
- `PUT /api/products/{id}` - Actualizar producto
- `DELETE /api/products/{id}` - Eliminar producto
- `PATCH /api/products/{id}/toggle` - Activar/desactivar
- `PATCH /api/products/{id}/stock` - Actualizar stock
- `GET /api/products/search` - Búsqueda de productos
- `GET /api/products/categories` - Obtener categorías
- `GET /api/products/brands` - Obtener marcas
- `GET /api/products/low-stock` - Productos con stock bajo
- `GET /api/products/stats` - Estadísticas de inventario

#### Características

- ✅ Multi-tenancy
- ✅ Validación de SKU único por tenant
- ✅ Gestión de stock con alertas
- ✅ Categorías y marcas dinámicas
- ✅ Soporte para productos digitales
- ✅ Dimensiones y peso
- ✅ Sistema de tags

**📖 Documentación completa**: [api-products.md](./api-products.md)

### 3. **API Orders (Ventas)**

**Base URL**: `/api/orders`

Gestión completa de órdenes y ventas.

#### Endpoints Principales

- `GET /api/orders` - Listar órdenes con filtros
- `POST /api/orders` - Crear orden
- `GET /api/orders/{id}` - Obtener orden por ID
- `PUT /api/orders/{id}` - Actualizar orden
- `DELETE /api/orders/{id}` - Cancelar orden
- `PATCH /api/orders/{id}/status` - Actualizar estado
- `PATCH /api/orders/{id}/payment` - Actualizar estado de pago
- `GET /api/orders/search` - Búsqueda de órdenes
- `GET /api/orders/stats` - Estadísticas de ventas

#### Características

- ✅ Multi-tenancy
- ✅ Validación de stock automática
- ✅ Numeración automática de órdenes
- ✅ Gestión de estados con transiciones controladas
- ✅ Restauración automática de stock al cancelar
- ✅ Cálculos automáticos de totales e impuestos

**📖 Documentación completa**: [api-orders.md](./api-orders.md)

### 4. **API Invoices (Contabilidad)**

**Base URL**: `/api/invoices`

Gestión completa de facturas y contabilidad.

#### Endpoints Principales

- `GET /api/invoices` - Listar facturas con filtros
- `POST /api/invoices` - Crear factura
- `GET /api/invoices/{id}` - Obtener factura por ID
- `PUT /api/invoices/{id}` - Actualizar factura
- `DELETE /api/invoices/{id}` - Cancelar factura
- `PATCH /api/invoices/{id}/status` - Actualizar estado
- `PATCH /api/invoices/{id}/payment` - Registrar pago
- `GET /api/invoices/search` - Búsqueda de facturas
- `GET /api/invoices/stats` - Estadísticas de facturación
- `GET /api/invoices/overdue` - Facturas vencidas

#### Características

- ✅ Multi-tenancy
- ✅ Numeración automática de facturas
- ✅ Gestión de estados con transiciones controladas
- ✅ Registro de pagos con validación de montos
- ✅ Detección automática de facturas vencidas
- ✅ Estadísticas financieras completas

**📖 Documentación completa**: [api-invoices.md](./api-invoices.md)

## 🔄 Flujo de Trabajo Típico

### **1. Gestión de Clientes**

```
Crear Cliente → Actualizar Información → Activar/Desactivar
```

### **2. Gestión de Productos**

```
Crear Producto → Actualizar Stock → Configurar Categorías → Monitorear Stock Bajo
```

### **3. Proceso de Ventas**

```
Crear Orden → Confirmar → Procesar → Enviar → Entregar
```

### **4. Proceso de Facturación**

```
Crear Factura → Enviar → Registrar Pago → Marcar como Pagada
```

## 📊 Estadísticas y Reportes

### **Métricas Disponibles**

- **Customers**: Total de clientes, clientes activos/inactivos
- **Products**: Total de productos, stock total, valor del inventario, productos con stock bajo
- **Orders**: Total de órdenes, revenue, valor promedio por orden, órdenes por estado
- **Invoices**: Total de facturas, revenue, facturas pendientes, facturas vencidas

### **Endpoints de Estadísticas**

- `GET /api/customers/stats` - Estadísticas de clientes
- `GET /api/products/stats` - Estadísticas de inventario
- `GET /api/orders/stats` - Estadísticas de ventas
- `GET /api/invoices/stats` - Estadísticas de facturación

## 🧪 Ejemplos de Uso

### **Autenticación**

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'metanoia@gmail.com',
    password: 'admin1234',
  }),
})
```

### **Uso Básico de APIs**

```javascript
// Listar clientes
const customers = await fetch('/api/customers', {
  credentials: 'include',
})

// Crear producto
const newProduct = await fetch('/api/products', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Nuevo Producto',
    sku: 'NEW-001',
    price: 99.99,
    stock: 50,
  }),
})

// Crear orden
const newOrder = await fetch('/api/orders', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customerId: 'customer-id',
    items: [
      {
        productId: 'product-id',
        quantity: 2,
        unitPrice: 99.99,
      },
    ],
    subtotal: 199.98,
    total: 231.98,
  }),
})
```

## 🔧 Configuración y Despliegue

### **Variables de Entorno Requeridas**

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-jwt-secret"
REDIS_URL="redis://..."
```

### **URLs de Desarrollo**

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Prisma Studio**: http://localhost:5555

### **Comandos Útiles**

```bash
# Desarrollo
npm run dev

# Base de datos
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Testing
npm test
npm run test:coverage
```

## 📝 Notas de Implementación

### **Características Comunes**

- **Multi-tenancy**: Todas las APIs están aisladas por tenant
- **Validación**: Validación robusta con Zod en todas las entradas
- **Autorización**: Control de acceso basado en roles
- **Paginación**: Soporte completo para paginación y filtros
- **Búsqueda**: Búsqueda semántica en todos los módulos
- **Auditoría**: Registro de usuario que crea/modifica cada recurso
- **Manejo de Errores**: Respuestas de error consistentes y descriptivas

### **Patrones de Respuesta**

```json
// Respuesta exitosa
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}

// Respuesta con paginación
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}

// Respuesta de error
{
  "error": "Descripción del error",
  "details": [ ... ]
}
```

## 🚀 Próximas Funcionalidades

### **En Desarrollo**

- [ ] Tests unitarios completos
- [ ] Frontend dashboard
- [ ] Integración con Stripe
- [ ] Sistema de notificaciones
- [ ] Reportes avanzados

### **Planificadas**

- [ ] API de usuarios y roles
- [ ] API de configuración del tenant
- [ ] API de reportes personalizados
- [ ] Webhooks para integraciones
- [ ] API de auditoría

---

**Última actualización:** 23 de Septiembre, 2024
**Versión:** 1.0.0
**© 2024 metanoia.click - Metanoia V1.0.1**
