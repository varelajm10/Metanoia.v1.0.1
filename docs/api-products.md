# API Products - Documentación

## 📋 Resumen

API REST completa para la gestión de productos e inventario en Metanoia V1.0.1. Incluye operaciones CRUD, gestión de stock, categorías, marcas, estadísticas y control de acceso basado en roles.

## 🔐 Autenticación

Todas las rutas requieren autenticación mediante JWT token almacenado en cookies HTTP-only.

### Headers Requeridos

```
Cookie: access_token=<jwt_token>
```

## 📚 Endpoints

### 1. Listar Productos

```http
GET /api/products
```

#### Parámetros de Query

| Parámetro   | Tipo    | Requerido | Default   | Descripción                           |
| ----------- | ------- | --------- | --------- | ------------------------------------- |
| `page`      | number  | No        | 1         | Número de página                      |
| `limit`     | number  | No        | 10        | Elementos por página (max: 100)       |
| `search`    | string  | No        | -         | Búsqueda en nombre, SKU o descripción |
| `category`  | string  | No        | -         | Filtrar por categoría                 |
| `brand`     | string  | No        | -         | Filtrar por marca                     |
| `isActive`  | boolean | No        | -         | Filtrar por estado activo/inactivo    |
| `isDigital` | boolean | No        | -         | Filtrar por productos digitales       |
| `lowStock`  | boolean | No        | -         | Filtrar productos con stock bajo      |
| `sortBy`    | string  | No        | createdAt | Campo de ordenamiento                 |
| `sortOrder` | string  | No        | desc      | Orden (asc/desc)                      |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "cmfvrxggk00038mzbmmmlau5q",
      "name": "Producto Test API",
      "description": "Descripción del producto",
      "sku": "TEST-API-001",
      "price": 250.5,
      "cost": 150.0,
      "stock": 100,
      "minStock": 10,
      "maxStock": 500,
      "category": "Electrónicos",
      "brand": "TechCorp",
      "weight": 1.5,
      "dimensions": {
        "length": 20,
        "width": 15,
        "height": 5,
        "unit": "cm"
      },
      "isActive": true,
      "isDigital": false,
      "tags": ["tecnología", "gadgets"],
      "createdAt": "2025-09-22T00:00:00.000Z",
      "updatedAt": "2025-09-22T00:00:00.000Z",
      "tenantId": "cmfvpav7y000081usww0d1u80",
      "_count": {
        "orderItems": 15
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Crear Producto

```http
POST /api/products
```

#### Cuerpo de la Petición

```json
{
  "name": "Nuevo Producto",
  "description": "Descripción del nuevo producto",
  "sku": "NEW-PROD-001",
  "price": 299.99,
  "cost": 180.0,
  "stock": 50,
  "minStock": 5,
  "maxStock": 200,
  "category": "Hogar",
  "brand": "HomeBrand",
  "weight": 2.0,
  "dimensions": {
    "length": 30,
    "width": 20,
    "height": 10,
    "unit": "cm"
  },
  "isActive": true,
  "isDigital": false,
  "tags": ["hogar", "decoración"]
}
```

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "data": {
    "id": "cmfvrxggk00038mzbmmmlau5q",
    "name": "Nuevo Producto",
    "description": "Descripción del nuevo producto",
    "sku": "NEW-PROD-001",
    "price": 299.99,
    "cost": 180.0,
    "stock": 50,
    "minStock": 5,
    "maxStock": 200,
    "category": "Hogar",
    "brand": "HomeBrand",
    "weight": 2.0,
    "dimensions": {
      "length": 30,
      "width": 20,
      "height": 10,
      "unit": "cm"
    },
    "isActive": true,
    "isDigital": false,
    "tags": ["hogar", "decoración"],
    "createdAt": "2025-09-23T00:00:00.000Z",
    "updatedAt": "2025-09-23T00:00:00.000Z",
    "tenantId": "cmfvpav7y000081usww0d1u80"
  },
  "message": "Producto creado exitosamente"
}
```

### 3. Obtener Producto por ID

```http
GET /api/products/{id}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvrxggk00038mzbmmmlau5q",
    "name": "Producto Test API",
    "description": "Descripción del producto",
    "sku": "TEST-API-001",
    "price": 250.5,
    "cost": 150.0,
    "stock": 100,
    "minStock": 10,
    "maxStock": 500,
    "category": "Electrónicos",
    "brand": "TechCorp",
    "weight": 1.5,
    "dimensions": {
      "length": 20,
      "width": 15,
      "height": 5,
      "unit": "cm"
    },
    "isActive": true,
    "isDigital": false,
    "tags": ["tecnología", "gadgets"],
    "createdAt": "2025-09-22T00:00:00.000Z",
    "updatedAt": "2025-09-22T00:00:00.000Z",
    "tenantId": "cmfvpav7y000081usww0d1u80",
    "_count": {
      "orderItems": 15
    }
  }
}
```

### 4. Actualizar Producto

```http
PUT /api/products/{id}
```

#### Cuerpo de la Petición

```json
{
  "name": "Producto Actualizado",
  "price": 275.0,
  "stock": 75,
  "description": "Nueva descripción del producto"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvrxggk00038mzbmmmlau5q",
    "name": "Producto Actualizado",
    "price": 275.0,
    "stock": 75,
    "description": "Nueva descripción del producto",
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Producto actualizado exitosamente"
}
```

### 5. Eliminar Producto

```http
DELETE /api/products/{id}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvrxggk00038mzbmmmlau5q",
    "name": "Producto Test API",
    "sku": "TEST-API-001",
    "isActive": false,
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Producto eliminado exitosamente"
}
```

### 6. Activar/Desactivar Producto

```http
PATCH /api/products/{id}/toggle
```

#### Cuerpo de la Petición

```json
{
  "isActive": false
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvrxggk00038mzbmmmlau5q",
    "name": "Producto Test API",
    "isActive": false,
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Producto desactivado exitosamente"
}
```

### 7. Actualizar Stock

```http
PATCH /api/products/{id}/stock
```

#### Cuerpo de la Petición

```json
{
  "quantity": 25,
  "reason": "Reabastecimiento de inventario",
  "type": "in",
  "notes": "Llegada de mercancía del proveedor"
}
```

#### Tipos de Movimiento

- `in`: Entrada de stock
- `out`: Salida de stock
- `adjustment`: Ajuste de inventario

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvrxggk00038mzbmmmlau5q",
    "name": "Producto Test API",
    "stock": 125,
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Stock actualizado exitosamente"
}
```

### 8. Buscar Productos

```http
GET /api/products/search
```

#### Parámetros de Query

| Parámetro | Tipo   | Requerido | Default | Descripción                             |
| --------- | ------ | --------- | ------- | --------------------------------------- |
| `q`       | string | Sí        | -       | Término de búsqueda (min: 2 caracteres) |
| `limit`   | number | No        | 10      | Máximo de resultados (max: 50)          |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "cmfvrxggk00038mzbmmmlau5q",
      "name": "Producto Test API",
      "sku": "TEST-API-001",
      "price": 250.5,
      "stock": 100,
      "isActive": true,
      "createdAt": "2025-09-22T00:00:00.000Z"
    }
  ],
  "query": "test",
  "count": 1
}
```

### 9. Obtener Categorías

```http
GET /api/products/categories
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": ["Electrónicos", "Hogar", "Ropa", "Deportes", "Libros"],
  "count": 5
}
```

### 10. Obtener Marcas

```http
GET /api/products/brands
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": ["TechCorp", "HomeBrand", "FashionCo", "SportsPro", "BookWorld"],
  "count": 5
}
```

### 11. Productos con Stock Bajo

```http
GET /api/products/low-stock
```

#### Parámetros de Query

| Parámetro | Tipo   | Requerido | Default | Descripción                     |
| --------- | ------ | --------- | ------- | ------------------------------- |
| `limit`   | number | No        | 50      | Máximo de resultados (max: 100) |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "cmfvrxggk00038mzbmmmlau5q",
      "name": "Producto con Stock Bajo",
      "sku": "LOW-STOCK-001",
      "stock": 5,
      "minStock": 10,
      "price": 99.99,
      "category": "Electrónicos"
    }
  ],
  "count": 1
}
```

### 12. Estadísticas de Inventario

```http
GET /api/products/stats
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "totalProducts": 150,
    "totalStock": 5000,
    "totalValue": 125000.0,
    "lowStockProducts": 12,
    "outOfStockProducts": 3,
    "categories": [
      {
        "name": "Electrónicos",
        "count": 45,
        "totalStock": 1500
      },
      {
        "name": "Hogar",
        "count": 30,
        "totalStock": 800
      }
    ]
  }
}
```

## 🔒 Permisos por Rol

| Acción       | SUPER_ADMIN | ADMIN | MANAGER | USER |
| ------------ | ----------- | ----- | ------- | ---- |
| **Leer**     | ✅          | ✅    | ✅      | ✅   |
| **Escribir** | ✅          | ✅    | ✅      | ❌   |
| **Eliminar** | ✅          | ✅    | ❌      | ❌   |

## ❌ Códigos de Error

### 400 - Bad Request

```json
{
  "error": "Datos inválidos",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "El nombre es requerido"
    }
  ]
}
```

### 401 - Unauthorized

```json
{
  "error": "No autorizado - Token requerido"
}
```

### 403 - Forbidden

```json
{
  "error": "Permisos insuficientes",
  "message": "No tienes permisos para write en products",
  "requiredRole": "SUPER_ADMIN, ADMIN o MANAGER",
  "currentRole": "USER"
}
```

### 404 - Not Found

```json
{
  "error": "Producto no encontrado"
}
```

### 409 - Conflict

```json
{
  "error": "Error de validación",
  "message": "Ya existe un producto con este SKU en el tenant"
}
```

### 500 - Internal Server Error

```json
{
  "error": "Error interno del servidor",
  "message": "Descripción del error"
}
```

## 🧪 Ejemplos de Uso

### PowerShell

```powershell
# Login
$loginData = @{email="metanoia@gmail.com"; password="admin1234"} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -SessionVariable session

# Listar productos
Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method GET -WebSession $session

# Crear producto
$productData = @{
  name = "Nuevo Producto"
  description = "Descripción del producto"
  sku = "NEW-PROD-001"
  price = 299.99
  cost = 180.00
  stock = 50
  minStock = 5
  maxStock = 200
  category = "Hogar"
  brand = "HomeBrand"
  isActive = $true
  isDigital = $false
  tags = @("hogar", "decoración")
} | ConvertTo-Json -Depth 3
Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method POST -Body $productData -ContentType "application/json" -WebSession $session

# Actualizar stock
$stockData = @{
  quantity = 25
  reason = "Reabastecimiento"
  type = "in"
  notes = "Llegada de mercancía"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/products/{id}/stock" -Method PATCH -Body $stockData -ContentType "application/json" -WebSession $session

# Obtener estadísticas
Invoke-WebRequest -Uri "http://localhost:3000/api/products/stats" -Method GET -WebSession $session
```

### JavaScript/Fetch

```javascript
// Listar productos
const response = await fetch('/api/products', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
const data = await response.json()

// Crear producto
const newProduct = await fetch('/api/products', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nuevo Producto',
    description: 'Descripción del producto',
    sku: 'NEW-PROD-001',
    price: 299.99,
    cost: 180.0,
    stock: 50,
    minStock: 5,
    maxStock: 200,
    category: 'Hogar',
    brand: 'HomeBrand',
    isActive: true,
    isDigital: false,
    tags: ['hogar', 'decoración'],
  }),
})

// Actualizar stock
const stockUpdate = await fetch('/api/products/{id}/stock', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    quantity: 25,
    reason: 'Reabastecimiento de inventario',
    type: 'in',
    notes: 'Llegada de mercancía del proveedor',
  }),
})

// Obtener estadísticas
const stats = await fetch('/api/products/stats', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## 📝 Notas de Implementación

- **Multi-tenancy**: Todos los productos están aislados por tenant
- **Validación de SKU**: Verificación de unicidad por tenant
- **Gestión de Stock**: Control automático de stock con alertas de stock bajo
- **Categorías y Marcas**: Gestión dinámica de categorías y marcas
- **Productos Digitales**: Soporte para productos digitales sin stock físico
- **Dimensiones**: Soporte para peso y dimensiones con unidades configurables
- **Tags**: Sistema de etiquetas para categorización flexible
- **Auditoría**: Registro de usuario que crea/modifica cada producto
- **Búsqueda**: Búsqueda por nombre, SKU o descripción
- **Estadísticas**: Métricas completas de inventario

## 🔧 Validaciones Específicas

### Campos Requeridos

- `name`: Nombre del producto (máximo 255 caracteres)
- `sku`: SKU único por tenant (máximo 100 caracteres)
- `price`: Precio mayor o igual a 0

### Campos Opcionales

- `description`: Descripción del producto
- `cost`: Costo del producto
- `stock`: Stock inicial (default: 0)
- `minStock`: Stock mínimo (default: 0)
- `maxStock`: Stock máximo
- `category`: Categoría del producto
- `brand`: Marca del producto
- `weight`: Peso del producto
- `dimensions`: Dimensiones (largo, ancho, alto, unidad)
- `isActive`: Estado activo/inactivo (default: true)
- `isDigital`: Producto digital (default: false)
- `tags`: Array de etiquetas

### Validaciones de Stock

- `maxStock` debe ser mayor que `minStock` si ambos están definidos
- Movimientos de stock validados (no se puede sacar más stock del disponible)
- Alertas automáticas cuando el stock está por debajo del mínimo

### Validaciones de Integridad

- No se puede eliminar producto con órdenes asociadas
- SKU debe ser único dentro del tenant
- Validación de tipos de movimiento de stock

---

**Última actualización:** 23 de Septiembre, 2024
**Versión:** 1.0.0
