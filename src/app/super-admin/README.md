# Super Admin Dashboard - Guía de Uso

## Acceso al Dashboard

### URL

```
https://metanoia.click/super-admin
```

### Permisos Requeridos

- Rol: `SUPER_ADMIN`
- Autenticación: Token válido
- Acceso: Solo usuarios autorizados

## Funcionalidades Principales

### 📊 **Dashboard Principal**

#### **Estadísticas del Sistema**

- **Total Tenants**: Número total de organizaciones
- **Tenants Activos**: Organizaciones activas
- **Tenants Inactivos**: Organizaciones inactivas
- **Total Usuarios**: Usuarios en todo el sistema
- **Total Clientes**: Clientes registrados
- **Total Productos**: Productos en inventario

#### **Tarjetas de Métricas**

```typescript
// Ejemplo de datos mostrados
{
  totalTenants: 25,
  activeTenants: 23,
  inactiveTenants: 2,
  totalUsers: 150,
  totalCustomers: 500,
  totalProducts: 1200
}
```

### 🏢 **Gestión de Tenants**

#### **Tabla de Tenants**

| Columna   | Descripción                                    |
| --------- | ---------------------------------------------- |
| Estado    | Switch para activar/desactivar                 |
| Tenant    | Nombre y slug de la organización               |
| Dominio   | Dominio personalizado (si existe)              |
| Usuarios  | Número de usuarios del tenant                  |
| Clientes  | Número de clientes                             |
| Productos | Número de productos                            |
| Órdenes   | Número de órdenes                              |
| Facturas  | Número de facturas                             |
| Otros     | Empleados, servidores, ascensores, estudiantes |
| Creado    | Tiempo transcurrido desde la creación          |
| Acciones  | Menú desplegable con opciones                  |

#### **Switch de Estado**

```typescript
// Funcionamiento del Switch
- ✅ Activado: Tenant funcional
- ❌ Desactivado: Tenant inactivo
- 🔄 Carga: Estado de actualización
- ⚠️ Error: Notificación de error
```

### ➕ **Crear Nuevo Tenant**

#### **Formulario de Creación**

```typescript
// Campos requeridos
{
  name: "Empresa ABC S.A.",           // Nombre de la organización
  slug: "empresa-abc",                // URL única (auto-generado)
  domain: "miempresa.com"             // Dominio personalizado (opcional)
}
```

#### **Validaciones**

- ✅ Nombre mínimo 2 caracteres
- ✅ Slug único en el sistema
- ✅ Dominio único (si se proporciona)
- ✅ Generación automática de slug

#### **Proceso de Creación**

1. Hacer clic en "Nuevo Tenant"
2. Completar el formulario
3. Validación automática
4. Creación del tenant
5. Actualización de la tabla

### 🔧 **Acciones Disponibles**

#### **Activar/Desactivar Tenant**

```typescript
// Server Action
await toggleTenantStatus(tenantId, isActive)
```

- Cambio de estado inmediato
- Feedback visual
- Revalidación automática

#### **Eliminar Tenant**

```typescript
// Server Action
await deleteTenant(tenantId)
```

- Solo tenants inactivos
- Confirmación requerida
- Eliminación completa (CASCADE)

#### **Ver Detalles**

- Información completa del tenant
- Métricas detalladas
- Historial de cambios

## Ejemplos de Uso

### **Escenario 1: Activar Tenant Inactivo**

```typescript
// 1. Localizar tenant en la tabla
// 2. Cambiar Switch de OFF a ON
// 3. Confirmar cambio
// 4. Ver notificación de éxito
```

### **Escenario 2: Crear Nuevo Tenant**

```typescript
// 1. Hacer clic en "Nuevo Tenant"
// 2. Completar formulario:
//    - Nombre: "Nueva Empresa S.A."
//    - Slug: "nueva-empresa" (auto-generado)
//    - Dominio: "nuevaempresa.com"
// 3. Hacer clic en "Crear Tenant"
// 4. Ver tenant en la tabla
```

### **Escenario 3: Eliminar Tenant**

```typescript
// 1. Desactivar tenant primero
// 2. Abrir menú de acciones
// 3. Seleccionar "Eliminar"
// 4. Confirmar eliminación
// 5. Ver notificación de éxito
```

## Estados de la Aplicación

### **Estados de Carga**

- 🔄 **Skeleton Loading**: Carga inicial de la tabla
- ⏳ **Button Loading**: Acciones en progreso
- 🎯 **Individual Loading**: Actualización por tenant

### **Estados de Error**

- ❌ **Error de Red**: Problemas de conectividad
- ⚠️ **Error de Validación**: Datos inválidos
- 🚫 **Error de Permisos**: Acceso denegado

### **Estados de Éxito**

- ✅ **Tenant Activado**: Cambio de estado exitoso
- 🎉 **Tenant Creado**: Nueva organización creada
- 🗑️ **Tenant Eliminado**: Eliminación exitosa

## Notificaciones

### **Tipos de Notificaciones**

```typescript
// Toast notifications
- ✅ Éxito: Acción completada
- ❌ Error: Acción fallida
- ⚠️ Advertencia: Confirmación requerida
- ℹ️ Información: Estado del sistema
```

### **Duración de Notificaciones**

- **Éxito**: 3 segundos
- **Error**: 5 segundos
- **Advertencia**: 4 segundos
- **Información**: 3 segundos

## Troubleshooting

### **Problemas Comunes**

#### **1. No se puede acceder al dashboard**

```typescript
// Solución
- Verificar rol de usuario
- Comprobar autenticación
- Revisar permisos de acceso
```

#### **2. Switch no responde**

```typescript
// Solución
- Verificar conexión de red
- Comprobar estado del servidor
- Revisar logs de error
```

#### **3. Error al crear tenant**

```typescript
// Solución
- Verificar unicidad de slug
- Comprobar formato de dominio
- Revisar validaciones
```

### **Logs de Debug**

```typescript
// Error handling examples
// Error fetching tenants, toggling status, or creating tenants
```

## Configuración Avanzada

### **Variables de Entorno**

```env
# .env.local
NEXT_PUBLIC_APP_URL=https://metanoia.click
NODE_ENV=production
```

### **Configuración de Base de Datos**

```typescript
// Prisma schema
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  domain    String?  @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **Middleware de Protección**

```typescript
// Verificación de permisos
const isSuperAdmin = await checkUserRole(userId)
if (!isSuperAdmin) {
  return redirect('/dashboard?error=unauthorized')
}
```

## Soporte Técnico

### **Contacto**

- **Email**: soporte@metanoia.click
- **Documentación**: /docs/super-admin-dashboard.md
- **Issues**: GitHub Issues

### **Recursos Adicionales**

- [Documentación de API](./api-documentation.md)
- [Guía de Despliegue](./deployment-guide.md)
- [Troubleshooting](./troubleshooting.md)
