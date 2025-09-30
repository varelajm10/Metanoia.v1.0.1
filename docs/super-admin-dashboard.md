# Dashboard de Super Admin - Metanoia ERP v1.0.1

## Resumen de Funcionalidad

Se ha implementado un dashboard completo de super-admin que permite la gestión centralizada de todos los tenants del sistema ERP multi-tenant.

## Características Implementadas

### 🎯 **Página Principal** (`/super-admin`)

- **Vista General**: Estadísticas del sistema en tiempo real
- **Gestión de Tenants**: Tabla interactiva con todos los tenants
- **Creación de Tenants**: Formulario para crear nuevas organizaciones
- **Control de Estado**: Switch para activar/desactivar tenants

### 📊 **Estadísticas del Sistema**

```typescript
// Métricas mostradas
- Total Tenants: Organizaciones registradas
- Tenants Activos: Organizaciones activas
- Tenants Inactivos: Organizaciones inactivas
- Total Usuarios: Usuarios en el sistema
- Total Clientes: Clientes registrados
- Total Productos: Productos en inventario
```

### 🏢 **Gestión de Tenants**

#### **Tabla Interactiva**

- **Estado**: Switch para activar/desactivar tenants
- **Información**: Nombre, slug, dominio del tenant
- **Métricas**: Contadores de usuarios, clientes, productos, órdenes, facturas
- **Módulos**: Empleados, servidores, ascensores, estudiantes
- **Fechas**: Tiempo transcurrido desde la creación
- **Acciones**: Menú desplegable con opciones adicionales

#### **Funcionalidades del Switch**

```typescript
// Server Action para cambiar estado
await toggleTenantStatus(tenantId: string, isActive: boolean)
```

**Características:**

- ✅ Actualización en tiempo real
- ✅ Feedback visual con toast notifications
- ✅ Estados de carga durante la actualización
- ✅ Validación de permisos

### ➕ **Creación de Tenants**

#### **Formulario de Creación**

```typescript
// Campos del formulario
- Nombre: Nombre de la organización
- Slug: URL única (generado automáticamente)
- Dominio: Dominio personalizado (opcional)
```

#### **Validaciones Implementadas**

- ✅ Nombre mínimo 2 caracteres
- ✅ Slug único en el sistema
- ✅ Dominio único (si se proporciona)
- ✅ Generación automática de slug desde el nombre
- ✅ Validación de formato de slug

### 🔧 **Server Actions Implementadas**

#### **1. toggleTenantStatus**

```typescript
// Activar/desactivar tenant
toggleTenantStatus(tenantId: string, isActive: boolean)
```

- Verifica que el tenant existe
- Actualiza el estado en la base de datos
- Revalida la página automáticamente

#### **2. deleteTenant**

```typescript
// Eliminar tenant (solo si está inactivo)
deleteTenant(tenantId: string)
```

- Verifica que el tenant esté inactivo
- Elimina todos los datos relacionados (CASCADE)
- Confirmación antes de eliminar

#### **3. createTenant**

```typescript
// Crear nuevo tenant
createTenant(name: string, slug: string, domain?: string)
```

- Valida unicidad de slug y dominio
- Crea tenant con estado activo por defecto
- Manejo de errores completo

#### **4. getSystemStats**

```typescript
// Obtener estadísticas del sistema
getSystemStats()
```

- Contadores de todas las entidades
- Métricas de rendimiento
- Datos para dashboard

### 🎨 **Componentes UI Implementados**

#### **Componentes Principales**

- `SuperAdminTable`: Tabla interactiva con Switch
- `CreateTenantForm`: Formulario de creación con validación
- `StatsCards`: Tarjetas de estadísticas
- `TableSkeleton`: Loading state para la tabla

#### **Componentes UI Adicionales**

- `Switch`: Toggle para activar/desactivar
- `Dialog`: Modal para formularios
- `DropdownMenu`: Menú de acciones
- `Skeleton`: Estados de carga
- `Toast`: Notificaciones

### 🔒 **Seguridad y Validaciones**

#### **Middleware de Protección**

```typescript
// Verificación de permisos
- Solo usuarios con rol SUPER_ADMIN
- Validación de token de autenticación
- Redirección automática si no autorizado
```

#### **Validaciones de Datos**

- ✅ Verificación de existencia de tenant
- ✅ Validación de estado antes de eliminar
- ✅ Unicidad de slug y dominio
- ✅ Formato correcto de datos

### 📱 **Experiencia de Usuario**

#### **Estados de Carga**

- Skeleton loading para la tabla
- Spinner en botones durante acciones
- Estados de carga individuales por tenant

#### **Feedback Visual**

- Toast notifications para todas las acciones
- Estados de éxito y error
- Confirmaciones para acciones destructivas

#### **Responsive Design**

- Tabla responsive con scroll horizontal
- Cards adaptables a diferentes tamaños
- Formularios optimizados para móvil

### 🚀 **Optimizaciones de Rendimiento**

#### **Server Components**

- Datos obtenidos en el servidor
- No hidratación innecesaria
- Mejor rendimiento inicial

#### **Suspense Boundaries**

- Loading states granulares
- Mejor experiencia de usuario
- Optimización de recursos

#### **Revalidación Inteligente**

- Solo revalida cuando es necesario
- Actualizaciones en tiempo real
- Cache optimizado

## Estructura de Archivos

```
src/
├── app/super-admin/
│   └── page.tsx                    # Página principal
├── components/super-admin/
│   ├── super-admin-table.tsx      # Tabla de tenants
│   └── create-tenant-form.tsx     # Formulario de creación
├── lib/actions/
│   └── super-admin-actions.ts     # Server Actions
├── middleware/
│   └── super-admin.ts             # Middleware de protección
└── components/ui/                 # Componentes UI adicionales
```

## Uso del Dashboard

### **Acceso al Dashboard**

1. Navegar a `/super-admin`
2. Verificar permisos de SUPER_ADMIN
3. Dashboard se carga automáticamente

### **Gestión de Tenants**

1. **Ver Lista**: Todos los tenants se muestran en la tabla
2. **Activar/Desactivar**: Usar el Switch en cada fila
3. **Crear Nuevo**: Botón "Nuevo Tenant" en el header
4. **Eliminar**: Menú de acciones (solo tenants inactivos)

### **Monitoreo del Sistema**

- Estadísticas en tiempo real
- Contadores de todas las entidades
- Métricas de uso por tenant

## Próximas Mejoras

### **Funcionalidades Adicionales**

- [ ] Filtros y búsqueda en la tabla
- [ ] Exportación de datos
- [ ] Logs de auditoría
- [ ] Métricas de rendimiento por tenant
- [ ] Configuración de módulos por tenant

### **Optimizaciones**

- [ ] Paginación para grandes volúmenes
- [ ] Cache de estadísticas
- [ ] Notificaciones en tiempo real
- [ ] Dashboard de métricas avanzadas

## Notas Técnicas

### **Dependencias Requeridas**

```json
{
  "@radix-ui/react-switch": "^1.0.3",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-label": "^2.0.2",
  "react-hot-toast": "^2.4.1",
  "date-fns": "^2.30.0",
  "class-variance-authority": "^0.7.0"
}
```

### **Configuración de Base de Datos**

- Índices compuestos para optimizar consultas
- Relaciones CASCADE para eliminación
- Validaciones a nivel de base de datos

### **Consideraciones de Seguridad**

- Validación de permisos en cada acción
- Sanitización de inputs
- Protección contra CSRF
- Logs de auditoría
