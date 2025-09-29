# API Orders - Documentación

## 📋 Resumen

API REST completa para la gestión de órdenes y ventas en Metanoia V1.0.1. Incluye operaciones CRUD, gestión de estados, control de stock, estadísticas de ventas y control de acceso basado en roles.

## 🔐 Autenticación

Todas las rutas requieren autenticación mediante JWT token almacenado en cookies HTTP-only.

### Headers Requeridos

```
Cookie: access_token=<jwt_token>
```

## 📚 Endpoints

### 1. Listar Órdenes

```http
GET /api/orders
```

#### Parámetros de Query

| Parámetro       | Tipo   | Requerido | Default   | Descripción                           |
| --------------- | ------ | --------- | --------- | ------------------------------------- |
| `page`          | number | No        | 1         | Número de página                      |
| `limit`         | number | No        | 10        | Elementos por página (max: 100)       |
| `search`        | string | No        | -         | Búsqueda en número de orden o cliente |
| `status`        | string | No        | -         | Filtrar por estado de orden           |
| `paymentStatus` | string | No        | -         | Filtrar por estado de pago            |
| `customerId`    | string | No        | -         | Filtrar por cliente específico        |
| `dateFrom`      | date   | No        | -         | Filtrar desde fecha                   |
| `dateTo`        | date   | No        | -         | Filtrar hasta fecha                   |
| `sortBy`        | string | No        | createdAt | Campo de ordenamiento                 |
| `sortOrder`     | string | No        | desc      | Orden (asc/desc)                      |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "cmfvssgkm0004dsmyhzop64s0",
      "orderNumber": "ORD-20250922-0001",
      "status": "CONFIRMED",
      "subtotal": "501",
      "taxRate": "16",
      "taxAmount": "80.16",
      "discountAmount": "0",
      "total": "581.16",
      "paymentMethod": "CARD",
      "paymentStatus": "PENDING",
      "shippingAddress": null,
      "notes": "Orden confirmada por el cliente",
      "expectedDeliveryDate": null,
      "createdAt": "2025-09-23T00:09:13.702Z",
      "updatedAt": "2025-09-23T00:09:20.363Z",
      "tenantId": "cmfvpav7y000081usww0d1u80",
      "customerId": "cmfvpaw8c000681usx3n0f46d",
      "userId": "cmfvpavtn000281usv7clqljp",
      "orderItems": [
        {
          "id": "cmfvssgku0006dsmy4dmllooi",
          "quantity": 2,
          "unitPrice": "250.5",
          "discount": "0",
          "total": "501",
          "notes": "Producto test",
          "createdAt": "2025-09-23T00:09:13.710Z",
          "updatedAt": "2025-09-23T00:09:13.710Z",
          "orderId": "cmfvssgkm0004dsmyhzop64s0",
          "productId": "cmfvrxggk00038mzbmmmlau5q",
          "product": {
            "id": "cmfvrxggk00038mzbmmmlau5q",
            "name": "Producto Test API",
            "sku": "TEST-API-001",
            "price": "250.5"
          }
        }
      ],
      "customer": {
        "id": "cmfvpaw8c000681usx3n0f46d",
        "name": "Cliente Demo",
        "email": "cliente@demo.com",
        "phone": "+52 55 1234 5678"
      },
      "_count": {
        "orderItems": 1
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 2. Crear Orden

```http
POST /api/orders
```

#### Cuerpo de la Petición

```json
{
  "customerId": "cmfvpaw8c000681usx3n0f46d",
  "orderNumber": "ORD-CUSTOM-001",
  "items": [
    {
      "productId": "cmfvrxggk00038mzbmmmlau5q",
      "quantity": 2,
      "unitPrice": 250.5,
      "discount": 0,
      "notes": "Producto test"
    }
  ],
  "subtotal": 501.0,
  "taxRate": 16,
  "taxAmount": 80.16,
  "discountAmount": 0,
  "total": 581.16,
  "status": "PENDING",
  "paymentMethod": "CARD",
  "paymentStatus": "PENDING",
  "shippingAddress": {
    "street": "Calle Principal 123",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zipCode": "06000",
    "country": "México"
  },
  "notes": "Orden de prueba API",
  "expectedDeliveryDate": "2025-09-25T00:00:00.000Z"
}
```

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "data": {
    "id": "cmfvssgkm0004dsmyhzop64s0",
    "orderNumber": "ORD-20250922-0001",
    "status": "PENDING",
    "subtotal": "501",
    "taxRate": "16",
    "taxAmount": "80.16",
    "discountAmount": "0",
    "total": "581.16",
    "paymentMethod": "CARD",
    "paymentStatus": "PENDING",
    "shippingAddress": null,
    "notes": "Orden de prueba API",
    "expectedDeliveryDate": null,
    "createdAt": "2025-09-23T00:09:13.702Z",
    "updatedAt": "2025-09-23T00:09:13.702Z",
    "tenantId": "cmfvpav7y000081usww0d1u80",
    "customerId": "cmfvpaw8c000681usx3n0f46d",
    "userId": "cmfvpavtn000281usv7clqljp",
    "orderItems": [
      {
        "id": "cmfvssgku0006dsmy4dmllooi",
        "quantity": 2,
        "unitPrice": "250.5",
        "discount": "0",
        "total": "501",
        "notes": "Producto test",
        "createdAt": "2025-09-23T00:09:13.710Z",
        "updatedAt": "2025-09-23T00:09:13.710Z",
        "orderId": "cmfvssgkm0004dsmyhzop64s0",
        "productId": "cmfvrxggk00038mzbmmmlau5q",
        "product": {
          "id": "cmfvrxggk00038mzbmmmlau5q",
          "name": "Producto Test API",
          "sku": "TEST-API-001",
          "price": "250.5"
        }
      }
    ],
    "customer": {
      "id": "cmfvpaw8c000681usx3n0f46d",
      "name": "Cliente Demo",
      "email": "cliente@demo.com",
      "phone": "+52 55 1234 5678"
    },
    "_count": {
      "orderItems": 1
    }
  },
  "message": "Orden creada exitosamente"
}
```

### 3. Obtener Orden por ID

```http
GET /api/orders/{id}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvssgkm0004dsmyhzop64s0",
    "orderNumber": "ORD-20250922-0001",
    "status": "CONFIRMED",
    "subtotal": "501",
    "taxRate": "16",
    "taxAmount": "80.16",
    "discountAmount": "0",
    "total": "581.16",
    "paymentMethod": "CARD",
    "paymentStatus": "PENDING",
    "shippingAddress": null,
    "notes": "Orden confirmada por el cliente",
    "expectedDeliveryDate": null,
    "createdAt": "2025-09-23T00:09:13.702Z",
    "updatedAt": "2025-09-23T00:09:20.363Z",
    "tenantId": "cmfvpav7y000081usww0d1u80",
    "customerId": "cmfvpaw8c000681usx3n0f46d",
    "userId": "cmfvpavtn000281usv7clqljp",
    "orderItems": [
      {
        "id": "cmfvssgku0006dsmy4dmllooi",
        "quantity": 2,
        "unitPrice": "250.5",
        "discount": "0",
        "total": "501",
        "notes": "Producto test",
        "createdAt": "2025-09-23T00:09:13.710Z",
        "updatedAt": "2025-09-23T00:09:13.710Z",
        "orderId": "cmfvssgkm0004dsmyhzop64s0",
        "productId": "cmfvrxggk00038mzbmmmlau5q",
        "product": {
          "id": "cmfvrxggk00038mzbmmmlau5q",
          "name": "Producto Test API",
          "sku": "TEST-API-001",
          "price": "250.5"
        }
      }
    ],
    "customer": {
      "id": "cmfvpaw8c000681usx3n0f46d",
      "name": "Cliente Demo",
      "email": "cliente@demo.com",
      "phone": "+52 55 1234 5678"
    },
    "_count": {
      "orderItems": 1
    }
  }
}
```

### 4. Actualizar Orden

```http
PUT /api/orders/{id}
```

#### Cuerpo de la Petición

```json
{
  "notes": "Orden actualizada con nueva información",
  "expectedDeliveryDate": "2025-09-25T00:00:00.000Z",
  "shippingAddress": {
    "street": "Nueva Dirección 456",
    "city": "Ciudad de México",
    "state": "CDMX",
    "zipCode": "06000",
    "country": "México"
  }
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvssgkm0004dsmyhzop64s0",
    "orderNumber": "ORD-20250922-0001",
    "status": "CONFIRMED",
    "notes": "Orden actualizada con nueva información",
    "expectedDeliveryDate": "2025-09-25T00:00:00.000Z",
    "shippingAddress": {
      "street": "Nueva Dirección 456",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zipCode": "06000",
      "country": "México"
    },
    "updatedAt": "2025-09-23T00:09:20.363Z"
  },
  "message": "Orden actualizada exitosamente"
}
```

### 5. Cancelar Orden

```http
DELETE /api/orders/{id}
```

#### Cuerpo de la Petición (Opcional)

```json
{
  "reason": "Cliente canceló la orden"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvssgkm0004dsmyhzop64s0",
    "orderNumber": "ORD-20250922-0001",
    "status": "CANCELLED",
    "notes": "Orden cancelada: Cliente canceló la orden",
    "updatedAt": "2025-09-23T00:09:20.363Z"
  },
  "message": "Orden cancelada exitosamente"
}
```

### 6. Actualizar Estado de Orden

```http
PATCH /api/orders/{id}/status
```

#### Cuerpo de la Petición

```json
{
  "status": "CONFIRMED",
  "notes": "Orden confirmada por el cliente"
}
```

#### Estados de Orden

- `PENDING`: Pendiente
- `CONFIRMED`: Confirmada
- `PROCESSING`: En procesamiento
- `SHIPPED`: Enviada
- `DELIVERED`: Entregada
- `CANCELLED`: Cancelada

#### Transiciones Válidas

```
PENDING → CONFIRMED, CANCELLED
CONFIRMED → PROCESSING, CANCELLED
PROCESSING → SHIPPED, CANCELLED
SHIPPED → DELIVERED
DELIVERED → (Estado final)
CANCELLED → (Estado final)
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvssgkm0004dsmyhzop64s0",
    "orderNumber": "ORD-20250922-0001",
    "status": "CONFIRMED",
    "notes": "Orden confirmada por el cliente",
    "updatedAt": "2025-09-23T00:09:20.363Z"
  },
  "message": "Estado de la orden actualizado a CONFIRMED"
}
```

### 7. Actualizar Estado de Pago

```http
PATCH /api/orders/{id}/payment
```

#### Cuerpo de la Petición

```json
{
  "paymentStatus": "PAID",
  "paymentMethod": "CARD",
  "notes": "Pago procesado exitosamente"
}
```

#### Estados de Pago

- `PENDING`: Pendiente
- `PAID`: Pagado
- `PARTIAL`: Pago parcial
- `REFUNDED`: Reembolsado

#### Métodos de Pago

- `CASH`: Efectivo
- `CARD`: Tarjeta
- `TRANSFER`: Transferencia
- `CHECK`: Cheque
- `CREDIT`: Crédito

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvssgkm0004dsmyhzop64s0",
    "orderNumber": "ORD-20250922-0001",
    "paymentStatus": "PAID",
    "paymentMethod": "CARD",
    "notes": "Pago procesado exitosamente",
    "updatedAt": "2025-09-23T00:09:20.363Z"
  },
  "message": "Estado de pago actualizado a PAID"
}
```

### 8. Estadísticas de Órdenes

```http
GET /api/orders/stats
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "totalOrders": 2,
    "totalRevenue": "987.16",
    "averageOrderValue": 493.58,
    "ordersByStatus": [
      {
        "status": "PENDING",
        "count": 1,
        "percentage": 50
      },
      {
        "status": "CONFIRMED",
        "count": 1,
        "percentage": 50
      }
    ],
    "ordersByPaymentStatus": [
      {
        "paymentStatus": "PENDING",
        "count": 2,
        "percentage": 100
      }
    ],
    "topCustomers": [
      {
        "customerId": "cmfvpaw8c000681usx3n0f46d",
        "customerName": "Cliente Demo",
        "orderCount": 2,
        "totalSpent": "987.16"
      }
    ],
    "topProducts": [
      {
        "productId": "cmfvrxggk00038mzbmmmlau5q",
        "productName": "Producto Test API",
        "quantitySold": 1,
        "revenue": "501"
      }
    ]
  }
}
```

### 9. Buscar Órdenes

```http
GET /api/orders/search
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
      "id": "cmfvssgkm0004dsmyhzop64s0",
      "orderNumber": "ORD-20250922-0001",
      "status": "CONFIRMED",
      "total": "581.16",
      "customer": {
        "id": "cmfvpaw8c000681usx3n0f46d",
        "name": "Cliente Demo",
        "email": "cliente@demo.com",
        "phone": "+52 55 1234 5678"
      },
      "createdAt": "2025-09-23T00:09:13.702Z"
    }
  ],
  "query": "ORD-20250922",
  "count": 1
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
      "path": ["customerId"],
      "message": "ID del cliente es requerido"
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
  "message": "No tienes permisos para delete en orders",
  "requiredRole": "SUPER_ADMIN o ADMIN",
  "currentRole": "USER"
}
```

### 404 - Not Found

```json
{
  "error": "Orden no encontrada"
}
```

### 409 - Conflict

```json
{
  "error": "Error de stock",
  "message": "Stock insuficiente para Producto A. Disponible: 5, Solicitado: 10"
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

# Listar órdenes
Invoke-WebRequest -Uri "http://localhost:3000/api/orders" -Method GET -WebSession $session

# Crear orden
$orderData = @{
  customerId = "cmfvpaw8c000681usx3n0f46d"
  items = @(
    @{
      productId = "cmfvrxggk00038mzbmmmlau5q"
      quantity = 2
      unitPrice = 250.50
      discount = 0
      notes = "Producto test"
    }
  )
  subtotal = 501.00
  taxRate = 16
  taxAmount = 80.16
  discountAmount = 0
  total = 581.16
  status = "PENDING"
  paymentMethod = "CARD"
  paymentStatus = "PENDING"
  notes = "Orden de prueba API"
} | ConvertTo-Json -Depth 3
Invoke-WebRequest -Uri "http://localhost:3000/api/orders" -Method POST -Body $orderData -ContentType "application/json" -WebSession $session

# Cambiar estado de orden
$statusData = @{status="CONFIRMED"; notes="Orden confirmada"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/orders/{id}/status" -Method PATCH -Body $statusData -ContentType "application/json" -WebSession $session

# Obtener estadísticas
Invoke-WebRequest -Uri "http://localhost:3000/api/orders/stats" -Method GET -WebSession $session
```

### JavaScript/Fetch

```javascript
// Listar órdenes
const response = await fetch('/api/orders', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
const data = await response.json()

// Crear orden
const newOrder = await fetch('/api/orders', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    customerId: 'cmfvpaw8c000681usx3n0f46d',
    items: [
      {
        productId: 'cmfvrxggk00038mzbmmmlau5q',
        quantity: 2,
        unitPrice: 250.5,
        discount: 0,
        notes: 'Producto test',
      },
    ],
    subtotal: 501.0,
    taxRate: 16,
    taxAmount: 80.16,
    discountAmount: 0,
    total: 581.16,
    status: 'PENDING',
    paymentMethod: 'CARD',
    paymentStatus: 'PENDING',
    notes: 'Orden de prueba API',
  }),
})

// Cambiar estado de orden
const statusUpdate = await fetch('/api/orders/{id}/status', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'CONFIRMED',
    notes: 'Orden confirmada por el cliente',
  }),
})

// Obtener estadísticas
const stats = await fetch('/api/orders/stats', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## 📝 Notas de Implementación

- **Multi-tenancy**: Todas las órdenes están aisladas por tenant
- **Validación de Stock**: Verificación automática de disponibilidad al crear órdenes
- **Gestión de Estados**: Flujo controlado de estados con validaciones
- **Restauración de Stock**: Al cancelar órdenes se restaura el stock automáticamente
- **Numeración Automática**: Generación automática de números de orden únicos
- **Cálculos Automáticos**: Totales, impuestos y descuentos calculados automáticamente
- **Auditoría**: Registro de usuario que crea/modifica cada orden
- **Estadísticas**: Métricas de ventas en tiempo real
- **Búsqueda**: Búsqueda por número de orden o cliente

## 🔧 Validaciones Específicas

### Campos Requeridos

- `customerId`: ID del cliente (debe existir y estar activo)
- `items`: Array de productos (mínimo 1 item)
- `subtotal`: Subtotal calculado
- `total`: Total calculado

### Validaciones de Items

- `productId`: ID del producto (debe existir y estar activo)
- `quantity`: Cantidad mayor a 0
- `unitPrice`: Precio unitario mayor o igual a 0
- `discount`: Descuento entre 0 y 100%

### Validaciones de Stock

- Verificación de disponibilidad antes de crear la orden
- Reducción automática de stock al confirmar
- Restauración automática al cancelar

### Validaciones de Estado

- Transiciones de estado controladas
- No se puede modificar órdenes entregadas o canceladas
- Validación de permisos por rol

---

**Última actualización:** 23 de Septiembre, 2024
**Versión:** 1.0.0
