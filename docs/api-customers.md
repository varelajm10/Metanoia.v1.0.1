# API Customers - Documentación

## 📋 Resumen

API REST completa para la gestión de clientes (CRM) en Metanoia V1.0.1. Incluye operaciones CRUD, búsqueda, activación/desactivación y control de acceso basado en roles.

## 🔐 Autenticación

Todas las rutas requieren autenticación mediante JWT token almacenado en cookies HTTP-only.

### Headers Requeridos

```
Cookie: access_token=<jwt_token>
```

## 📚 Endpoints

### 1. Listar Clientes

```http
GET /api/customers
```

#### Parámetros de Query

| Parámetro   | Tipo    | Requerido | Default   | Descripción                          |
| ----------- | ------- | --------- | --------- | ------------------------------------ |
| `page`      | number  | No        | 1         | Número de página                     |
| `limit`     | number  | No        | 10        | Elementos por página (max: 100)      |
| `search`    | string  | No        | -         | Búsqueda en nombre, email o teléfono |
| `isActive`  | boolean | No        | -         | Filtrar por estado activo/inactivo   |
| `sortBy`    | string  | No        | createdAt | Campo de ordenamiento                |
| `sortOrder` | string  | No        | desc      | Orden (asc/desc)                     |

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id": "cmfvpaw8c000681usx3n0f46d",
      "name": "Cliente Demo",
      "email": "cliente@demo.com",
      "phone": "+52 55 1234 5678",
      "address": {
        "street": "Calle Principal 123",
        "city": "Ciudad de México",
        "state": "CDMX",
        "zipCode": "06000",
        "country": "México"
      },
      "isActive": true,
      "createdAt": "2025-09-22T00:00:00.000Z",
      "updatedAt": "2025-09-22T00:00:00.000Z",
      "tenantId": "cmfvpav7y000081usww0d1u80",
      "_count": {
        "orders": 5,
        "invoices": 3
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

### 2. Crear Cliente

```http
POST /api/customers
```

#### Cuerpo de la Petición

```json
{
  "name": "Nuevo Cliente",
  "email": "nuevo@cliente.com",
  "phone": "+52 55 9876 5432",
  "address": {
    "street": "Nueva Calle 456",
    "city": "Guadalajara",
    "state": "Jalisco",
    "zipCode": "44100",
    "country": "México"
  },
  "isActive": true
}
```

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "data": {
    "id": "cmfvpaw8c000681usx3n0f46d",
    "name": "Nuevo Cliente",
    "email": "nuevo@cliente.com",
    "phone": "+52 55 9876 5432",
    "address": {
      "street": "Nueva Calle 456",
      "city": "Guadalajara",
      "state": "Jalisco",
      "zipCode": "44100",
      "country": "México"
    },
    "isActive": true,
    "createdAt": "2025-09-23T00:00:00.000Z",
    "updatedAt": "2025-09-23T00:00:00.000Z",
    "tenantId": "cmfvpav7y000081usww0d1u80"
  },
  "message": "Cliente creado exitosamente"
}
```

### 3. Obtener Cliente por ID

```http
GET /api/customers/{id}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvpaw8c000681usx3n0f46d",
    "name": "Cliente Demo",
    "email": "cliente@demo.com",
    "phone": "+52 55 1234 5678",
    "address": {
      "street": "Calle Principal 123",
      "city": "Ciudad de México",
      "state": "CDMX",
      "zipCode": "06000",
      "country": "México"
    },
    "isActive": true,
    "createdAt": "2025-09-22T00:00:00.000Z",
    "updatedAt": "2025-09-22T00:00:00.000Z",
    "tenantId": "cmfvpav7y000081usww0d1u80",
    "_count": {
      "orders": 5,
      "invoices": 3
    }
  }
}
```

### 4. Actualizar Cliente

```http
PUT /api/customers/{id}
```

#### Cuerpo de la Petición

```json
{
  "name": "Cliente Actualizado",
  "email": "actualizado@cliente.com",
  "phone": "+52 55 1111 2222",
  "address": {
    "street": "Calle Actualizada 789",
    "city": "Monterrey",
    "state": "Nuevo León",
    "zipCode": "64000",
    "country": "México"
  }
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvpaw8c000681usx3n0f46d",
    "name": "Cliente Actualizado",
    "email": "actualizado@cliente.com",
    "phone": "+52 55 1111 2222",
    "address": {
      "street": "Calle Actualizada 789",
      "city": "Monterrey",
      "state": "Nuevo León",
      "zipCode": "64000",
      "country": "México"
    },
    "isActive": true,
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Cliente actualizado exitosamente"
}
```

### 5. Eliminar Cliente

```http
DELETE /api/customers/{id}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id": "cmfvpaw8c000681usx3n0f46d",
    "name": "Cliente Demo",
    "email": "cliente@demo.com",
    "isActive": false,
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Cliente eliminado exitosamente"
}
```

### 6. Activar/Desactivar Cliente

```http
PATCH /api/customers/{id}/toggle
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
    "id": "cmfvpaw8c000681usx3n0f46d",
    "name": "Cliente Demo",
    "isActive": false,
    "updatedAt": "2025-09-23T00:00:00.000Z"
  },
  "message": "Cliente desactivado exitosamente"
}
```

### 7. Buscar Clientes

```http
GET /api/customers/search
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
      "id": "cmfvpaw8c000681usx3n0f46d",
      "name": "Cliente Demo",
      "email": "cliente@demo.com",
      "phone": "+52 55 1234 5678",
      "isActive": true,
      "createdAt": "2025-09-22T00:00:00.000Z"
    }
  ],
  "query": "demo",
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
  "message": "No tienes permisos para write en customers",
  "requiredRole": "SUPER_ADMIN, ADMIN o MANAGER",
  "currentRole": "USER"
}
```

### 404 - Not Found

```json
{
  "error": "Cliente no encontrado"
}
```

### 409 - Conflict

```json
{
  "error": "Error de validación",
  "message": "Ya existe un cliente con este email en el tenant"
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

# Listar clientes
Invoke-WebRequest -Uri "http://localhost:3000/api/customers" -Method GET -WebSession $session

# Crear cliente
$customerData = @{
  name = "Nuevo Cliente"
  email = "nuevo@cliente.com"
  phone = "+52 55 9876 5432"
  address = @{
    street = "Nueva Calle 456"
    city = "Guadalajara"
    state = "Jalisco"
    zipCode = "44100"
    country = "México"
  }
  isActive = $true
} | ConvertTo-Json -Depth 3
Invoke-WebRequest -Uri "http://localhost:3000/api/customers" -Method POST -Body $customerData -ContentType "application/json" -WebSession $session

# Buscar clientes
Invoke-WebRequest -Uri "http://localhost:3000/api/customers/search?q=demo" -Method GET -WebSession $session

# Desactivar cliente
$toggleData = @{isActive=$false} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/customers/{id}/toggle" -Method PATCH -Body $toggleData -ContentType "application/json" -WebSession $session
```

### JavaScript/Fetch

```javascript
// Listar clientes
const response = await fetch('/api/customers', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})
const data = await response.json()

// Crear cliente
const newCustomer = await fetch('/api/customers', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Nuevo Cliente',
    email: 'nuevo@cliente.com',
    phone: '+52 55 9876 5432',
    address: {
      street: 'Nueva Calle 456',
      city: 'Guadalajara',
      state: 'Jalisco',
      zipCode: '44100',
      country: 'México',
    },
    isActive: true,
  }),
})

// Buscar clientes
const searchResults = await fetch('/api/customers/search?q=demo', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Desactivar cliente
const toggleStatus = await fetch('/api/customers/{id}/toggle', {
  method: 'PATCH',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    isActive: false,
  }),
})
```

## 📝 Notas de Implementación

- **Multi-tenancy**: Todos los clientes están aislados por tenant
- **Validación de Email**: Verificación de unicidad por tenant
- **Soft Delete**: Los clientes se eliminan físicamente solo si no tienen órdenes o facturas asociadas
- **Búsqueda**: Búsqueda por nombre, email o teléfono
- **Auditoría**: Registro de usuario que crea/modifica cada cliente
- **Paginación**: Soporte completo para paginación y filtros
- **Estados**: Control de activación/desactivación de clientes

## 🔧 Validaciones Específicas

### Campos Requeridos

- `name`: Nombre del cliente (máximo 255 caracteres)

### Campos Opcionales

- `email`: Email válido y único por tenant
- `phone`: Teléfono del cliente
- `address`: Objeto con dirección completa
- `isActive`: Estado activo/inactivo (default: true)

### Validaciones de Integridad

- No se puede eliminar cliente con órdenes o facturas asociadas
- Email debe ser único dentro del tenant
- Validación de formato de email

---

**Última actualización:** 23 de Septiembre, 2024
**Versión:** 1.0.0
