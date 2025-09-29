# API Invoices - Documentación

## 📋 Resumen

API REST completa para la gestión de facturas y contabilidad en Metanoia V1.0.1. Incluye operaciones CRUD, gestión de estados, registro de pagos, estadísticas financieras y control de acceso basado en roles.

## 🔐 Autenticación

Todas las rutas requieren autenticación mediante JWT token almacenado en cookies HTTP-only.

### Headers Requeridos

```
Cookie: access_token=<jwt_token>
```

## 📚 Endpoints

### 1. Listar Facturas

```http
GET /api/invoices
```

#### Parámetros de Query

| Parámetro    | Tipo    | Requerido | Default   | Descripción                             |
| ------------ | ------- | --------- | --------- | --------------------------------------- |
| `page`       | number  | No        | 1         | Número de página                        |
| `limit`      | number  | No        | 10        | Elementos por página (max: 100)         |
| `search`     | string  | No        | -         | Búsqueda en número de factura o cliente |
| `status`     | string  | No        | -         | Filtrar por estado de factura           |
| `customerId` | string  | No        | -         | Filtrar por cliente específico          |
| `dateFrom`   | date    | No        | -         | Filtrar desde fecha                     |
| `dateTo`     | date    | No        | -         | Filtrar hasta fecha                     |
| `overdue`    | boolean | No        | -         | Filtrar facturas vencidas               |
| `sortBy`     | string  | No        | createdAt | Campo de ordenamiento                   |
| `sortOrder`  | string  | No        | desc      | Orden (asc/desc)                        |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "cmfvinv0010001usx3n0f46d",
      "invoiceNumber": "INV-20250923-0001",
      "status": "SENT",
      "subtotal": 1000.0,
      "tax": 160.0,
      "total": 1160.0,
      "dueDate": "2025-10-23T00:00:00.000Z",
      "paidDate": null,
      "notes": "Factura por servicios prestados",
      "createdAt": "2025-09-23T00:00:00.000Z",
      "updatedAt": "2025-09-23T00:00:00.000Z",
      "tenantId": "cmfvpav7y000081usww0d1u80",
      "customerId": "cmfvpaw8c000681usx3n0f46d",
      "customer": {
        "id": "cmfvpaw8c000681usx3n0f46d",
        "name": "Cliente Demo",
        "email": "cliente@demo.com",
        "phone": "+52 55 1234 5678"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. Crear Factura

```http
POST /api/invoices
```

#### Cuerpo de la Petición

```json
{
  "customerId": "cmfvpaw8c000681usx3n0f46d",
  "invoiceNumber": "INV-CUSTOM-001",
  "subtotal": 1000.0,
  "tax": 160.0,
  "total": 1160.0,
  "dueDate": "2025-10-23T00:00:00.000Z",
  "notes": "Factura por servicios prestados",
  "status": "DRAFT"
}
```

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "data": {
    "id": "cmfvinv0010001usx3n0f46d",
    "invoiceNumber": "INV-20250923-0001",
    "status": "DRAFT",
    "subtotal": 1000.0,
    "tax": 160.0,
    "total": 1160.0,
    "dueDate": "2025-10-23T00:00:00.000Z",
    "paidDate": null,
    "notes": "Factura por servicios prestados",
    "createdAt": "2025-09-23T00:00:00.000Z",
    "updatedAt": "2025-09-23T00:00:00.000Z",
    "tenantId": "cmfvpav7y000081usww0d1u80",
    "customerId": "cmfvpaw8c000681usx3n0f46d",
    "customer": {
      "id": "cmfvpaw8c000681usx3n0f46d",
      "name": "Cliente Demo",
      "email": "cliente@demo.com",
      "phone": "+52 55 1234 5678"
    }
  },
  "message": "Factura creada exitosamente"
}
```

### 3. Obtener Factura por ID

```http
GET /api/invoices/{id}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvinv0010001usx3n0f46d",
    "invoiceNumber": "INV-20250923-0001",
    "status": "SENT",
    "subtotal": 1000.0,
    "tax": 160.0,
    "total": 1160.0,
    "dueDate": "2025-10-23T00:00:00.000Z",
    "paidDate": null,
    "notes": "Factura por servicios prestados",
    "createdAt": "2025-09-23T00:00:00.000Z",
    "updatedAt": "2025-09-23T00:00:00.000Z",
    "tenantId": "cmfvpav7y000081usww0d1u80",
    "customerId": "cmfvpaw8c000681usx3n0f46d",
    "customer": {
      "id": "cmfvpaw8c000681usx3n0f46d",
      "name": "Cliente Demo",
      "email": "cliente@demo.com",
      "phone": "+52 55 1234 5678"
    }
  }
}
```

### 4. Actualizar Factura

```http
PUT /api/invoices/{id}
```

#### Cuerpo de la Petición

```json
{
  "subtotal": 1200.0,
  "tax": 192.0,
  "total": 1392.0,
  "notes": "Factura actualizada con nuevos servicios"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvinv0010001usx3n0f46d",
    "invoiceNumber": "INV-20250923-0001",
    "subtotal": 1200.0,
    "tax": 192.0,
    "total": 1392.0,
    "notes": "Factura actualizada con nuevos servicios",
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Factura actualizada exitosamente"
}
```

### 5. Cancelar Factura

```http
DELETE /api/invoices/{id}
```

#### Cuerpo de la Petición (Opcional)

```json
{
  "reason": "Cliente canceló el servicio"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvinv0010001usx3n0f46d",
    "invoiceNumber": "INV-20250923-0001",
    "status": "CANCELLED",
    "notes": "Factura cancelada: Cliente canceló el servicio",
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Factura cancelada exitosamente"
}
```

### 6. Actualizar Estado de Factura

```http
PATCH /api/invoices/{id}/status
```

#### Cuerpo de la Petición

```json
{
  "status": "SENT",
  "notes": "Factura enviada al cliente"
}
```

#### Estados de Factura

- `DRAFT`: Borrador
- `SENT`: Enviada
- `PAID`: Pagada
- `OVERDUE`: Vencida
- `CANCELLED`: Cancelada

#### Transiciones Válidas

```
DRAFT → SENT, CANCELLED
SENT → PAID, OVERDUE, CANCELLED
PAID → (Estado final)
OVERDUE → PAID, CANCELLED
CANCELLED → (Estado final)
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvinv0010001usx3n0f46d",
    "invoiceNumber": "INV-20250923-0001",
    "status": "SENT",
    "notes": "Factura enviada al cliente",
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Estado de la factura actualizado a SENT"
}
```

### 7. Registrar Pago

```http
PATCH /api/invoices/{id}/payment
```

#### Cuerpo de la Petición

```json
{
  "amount": 1160.0,
  "paymentDate": "2025-09-23T00:00:00.000Z",
  "paymentMethod": "CARD",
  "notes": "Pago procesado exitosamente"
}
```

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
    "id": "cmfvinv0010001usx3n0f46d",
    "invoiceNumber": "INV-20250923-0001",
    "status": "PAID",
    "paidDate": "2025-09-23T00:00:00.000Z",
    "notes": "Pago registrado: Pago procesado exitosamente",
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Pago registrado exitosamente"
}
```

### 8. Estadísticas de Facturas

```http
GET /api/invoices/stats
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "totalInvoices": 150,
    "totalRevenue": 250000.0,
    "totalOutstanding": 45000.0,
    "averageInvoiceValue": 1666.67,
    "invoicesByStatus": [
      {
        "status": "PAID",
        "count": 120,
        "percentage": 80
      },
      {
        "status": "SENT",
        "count": 20,
        "percentage": 13.33
      },
      {
        "status": "OVERDUE",
        "count": 10,
        "percentage": 6.67
      }
    ],
    "overdueInvoices": 10,
    "overdueAmount": 15000.0,
    "topCustomers": [
      {
        "customerId": "cmfvpaw8c000681usx3n0f46d",
        "customerName": "Cliente Demo",
        "invoiceCount": 25,
        "totalAmount": 50000.0
      }
    ]
  }
}
```

### 9. Buscar Facturas

```http
GET /api/invoices/search
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
      "id": "cmfvinv0010001usx3n0f46d",
      "invoiceNumber": "INV-20250923-0001",
      "status": "SENT",
      "total": 1160.0,
      "customer": {
        "id": "cmfvpaw8c000681usx3n0f46d",
        "name": "Cliente Demo",
        "email": "cliente@demo.com",
        "phone": "+52 55 1234 5678"
      },
      "createdAt": "2025-09-23T00:00:00.000Z"
    }
  ],
  "query": "INV-20250923",
  "count": 1
}
```

### 10. Facturas Vencidas

```http
GET /api/invoices/overdue
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
      "id": "cmfvinv0010001usx3n0f46d",
      "invoiceNumber": "INV-20250920-0001",
      "status": "OVERDUE",
      "total": 2500.0,
      "dueDate": "2025-09-20T00:00:00.000Z",
      "customer": {
        "id": "cmfvpaw8c000681usx3n0f46d",
        "name": "Cliente Demo",
        "email": "cliente@demo.com",
        "phone": "+52 55 1234 5678"
      },
      "createdAt": "2025-09-15T00:00:00.000Z"
    }
  ],
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
  "message": "No tienes permisos para delete en invoices",
  "requiredRole": "SUPER_ADMIN o ADMIN",
  "currentRole": "USER"
}
```

### 404 - Not Found

```json
{
  "error": "Factura no encontrada"
}
```

### 409 - Conflict

```json
{
  "error": "Transición de estado inválida",
  "message": "No se puede cambiar el estado de PAID a SENT"
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

# Listar facturas
Invoke-WebRequest -Uri "http://localhost:3000/api/invoices" -Method GET -WebSession $session

# Crear factura
$invoiceData = @{
  customerId = "cmfvpaw8c000681usx3n0f46d"
  subtotal = 1000.00
  tax = 160.00
  total = 1160.00
  dueDate = "2025-10-23T00:00:00.000Z"
  notes = "Factura por servicios prestados"
  status = "DRAFT"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/invoices" -Method POST -Body $invoiceData -ContentType "application/json" -WebSession $session

# Cambiar estado de factura
$statusData = @{status="SENT"; notes="Factura enviada"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/invoices/{id}/status" -Method PATCH -Body $statusData -ContentType "application/json" -WebSession $session

# Registrar pago
$paymentData = @{
  amount = 1160.00
  paymentDate = "2025-09-23T00:00:00.000Z"
  paymentMethod = "CARD"
  notes = "Pago procesado exitosamente"
} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/invoices/{id}/payment" -Method PATCH -Body $paymentData -ContentType "application/json" -WebSession $session

# Obtener estadísticas
Invoke-WebRequest -Uri "http://localhost:3000/api/invoices/stats" -Method GET -WebSession $session
```

### JavaScript/Fetch

```javascript
// Listar facturas
const response = await fetch('/api/invoices', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
const data = await response.json()

// Crear factura
const newInvoice = await fetch('/api/invoices', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    customerId: 'cmfvpaw8c000681usx3n0f46d',
    subtotal: 1000.0,
    tax: 160.0,
    total: 1160.0,
    dueDate: '2025-10-23T00:00:00.000Z',
    notes: 'Factura por servicios prestados',
    status: 'DRAFT',
  }),
})

// Cambiar estado de factura
const statusUpdate = await fetch('/api/invoices/{id}/status', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'SENT',
    notes: 'Factura enviada al cliente',
  }),
})

// Registrar pago
const paymentRecord = await fetch('/api/invoices/{id}/payment', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 1160.0,
    paymentDate: new Date().toISOString(),
    paymentMethod: 'CARD',
    notes: 'Pago procesado exitosamente',
  }),
})

// Obtener estadísticas
const stats = await fetch('/api/invoices/stats', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

## 📝 Notas de Implementación

- **Multi-tenancy**: Todas las facturas están aisladas por tenant
- **Numeración Automática**: Generación automática de números de factura únicos
- **Gestión de Estados**: Flujo controlado de estados con validaciones
- **Registro de Pagos**: Sistema completo de registro y seguimiento de pagos
- **Facturas Vencidas**: Detección automática de facturas vencidas
- **Estadísticas Financieras**: Métricas completas de facturación y cobranza
- **Auditoría**: Registro de usuario que crea/modifica cada factura
- **Búsqueda**: Búsqueda por número de factura o cliente
- **Validación de Montos**: Verificación de montos de pago vs total de factura

## 🔧 Validaciones Específicas

### Campos Requeridos

- `customerId`: ID del cliente (debe existir y estar activo)
- `subtotal`: Subtotal calculado
- `total`: Total calculado

### Campos Opcionales

- `invoiceNumber`: Número de factura (se genera automáticamente si no se proporciona)
- `tax`: Impuesto aplicado (default: 0)
- `dueDate`: Fecha de vencimiento
- `notes`: Notas adicionales
- `status`: Estado de la factura (default: DRAFT)

### Validaciones de Estado

- Transiciones de estado controladas
- No se puede modificar facturas pagadas o canceladas
- Validación de permisos por rol

### Validaciones de Pago

- El monto del pago no puede exceder el total de la factura
- No se puede registrar pago en facturas canceladas
- Fecha de pago automática al marcar como pagada

---

**Última actualización:** 23 de Septiembre, 2024
**Versión:** 1.0.0
