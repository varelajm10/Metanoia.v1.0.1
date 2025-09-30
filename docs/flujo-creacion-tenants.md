# Flujo Completo de Creación de Tenants (Clientes-Empresa)

## 📋 Descripción General

Este documento describe el flujo completo implementado para agregar nuevos clientes-empresa (Tenants) al sistema ERP SaaS Metanoia v1.0.1, incluyendo la creación automática del usuario administrador.

## 🎯 Características Implementadas

### ✅ Frontend
- Componente Dialog moderno con shadcn/ui
- Formulario validado con react-hook-form + Zod
- Captura de información completa del tenant y administrador
- Estados de carga y feedback visual
- Notificaciones con react-hot-toast
- Refresh automático tras crear el tenant

### ✅ Backend
- API REST endpoint seguro
- Validación robusta de datos
- Transacciones atómicas con Prisma
- Generación automática de slug único
- Contraseñas seguras con bcrypt
- Manejo completo de errores

## 📁 Archivos Creados

```
src/
├── components/
│   └── admin/
│       └── CreateTenantDialog.tsx    # Componente de diálogo
└── app/
    └── api/
        └── superadmin/
            └── tenants/
                └── route.ts          # Endpoint API
```

## 🔧 Uso del Componente

### 1. Importar el componente

```tsx
import { CreateTenantDialog } from '@/components/admin/CreateTenantDialog'
```

### 2. Usar en tu página

```tsx
<CreateTenantDialog />
```

El componente renderiza un botón "Agregar Nuevo Cliente" con ícono +, que al hacer clic abre un diálogo con el formulario.

## 📝 Campos del Formulario

| Campo | Tipo | Validación | Descripción |
|-------|------|-----------|-------------|
| **Nombre de la Empresa** | string | min 2 caracteres | Nombre legal de la empresa |
| **Nombre del Administrador** | string | min 2 caracteres | Nombre del usuario admin |
| **Apellido del Administrador** | string | min 2 caracteres | Apellido del usuario admin |
| **Email del Administrador** | email | formato válido | Email único para login |

## 🚀 Flujo de Operación

### 1. Usuario Completa el Formulario
El Super Admin ingresa los datos del nuevo tenant y su administrador.

### 2. Validación Frontend
- Zod valida los campos en tiempo real
- Muestra errores específicos debajo de cada campo
- Solo permite enviar si todos los campos son válidos

### 3. Envío a API
```typescript
POST /api/superadmin/tenants
Content-Type: application/json

{
  "companyName": "Empresa ABC S.A.",
  "adminFirstName": "Juan",
  "adminLastName": "Pérez",
  "adminEmail": "admin@empresa.com"
}
```

### 4. Procesamiento Backend

#### a) Validación de datos
- Valida con Zod el cuerpo de la petición
- Verifica que no exista tenant con ese nombre
- Verifica que no exista usuario con ese email

#### b) Generación automática
- **Slug**: Genera desde el nombre de empresa
  - Ejemplo: "Empresa ABC S.A." → "empresa-abc-sa"
  - Si existe, agrega timestamp: "empresa-abc-sa-1727741234567"
- **Contraseña**: Genera contraseña segura de 12 caracteres
  - Incluye mayúsculas, minúsculas, números y símbolos
  - Hashea con bcrypt (10 rounds)

#### c) Transacción atómica
```typescript
await prisma.$transaction(async (tx) => {
  // 1. Crear Tenant
  const tenant = await tx.tenant.create({...})
  
  // 2. Crear User ADMIN
  const user = await tx.user.create({...})
  
  return { tenant, user, tempPassword }
})
```

✅ **Si todo sale bien**: Se crean ambos registros
❌ **Si algo falla**: No se crea nada (rollback automático)

### 5. Respuesta Exitosa

```json
{
  "success": true,
  "message": "Tenant y usuario administrador creados correctamente",
  "data": {
    "tenantId": "clxxx...",
    "tenantName": "Empresa ABC S.A.",
    "tenantSlug": "empresa-abc-sa",
    "adminEmail": "admin@empresa.com",
    "tempPassword": "aB3$xY9#mN2k"
  }
}
```

### 6. Feedback al Usuario

- ✅ **Toast de éxito**: "El nuevo cliente ha sido creado correctamente."
- 🔄 **Refresh automático**: Actualiza la tabla de tenants
- ❌ **Toast de error**: Muestra mensaje específico si falla

## 🔒 Seguridad Implementada

### ✅ Validación Dual
- Frontend: UX rápida con feedback inmediato
- Backend: Validación definitiva (nunca confiar en frontend)

### ✅ Verificación de Duplicados
- Busca email existente (case-insensitive)
- Busca nombre de empresa existente (case-insensitive)
- Busca slug existente

### ✅ Contraseñas Seguras
- Generación aleatoria con caracteres variados
- Hash con bcrypt (10 rounds)
- NUNCA se almacena en texto plano

### ✅ Transacciones Atómicas
- Todo o nada: evita estados inconsistentes
- Rollback automático si hay errores

### 🔴 Pendiente de Implementar
```typescript
// TODO: Verificar sesión de SUPER_ADMIN
const session = await getServerSession(authOptions)
if (!session || session.user.role !== 'SUPER_ADMIN') {
  return NextResponse.json({ message: 'No autorizado' }, { status: 403 })
}
```

## 📧 Integración con Email (Pendiente)

Actualmente, la contraseña temporal se imprime en la consola del servidor:

```typescript
console.log(`
=========================================
NUEVO TENANT CREADO:
=========================================
Empresa: ${result.tenant.name}
Slug: ${result.tenant.slug}
Email Admin: ${result.user.email}
Contraseña Temporal: ${result.tempPassword}
=========================================
`)
```

### Implementar Envío de Email

```typescript
// Ejemplo con SendGrid/Resend
await sendWelcomeEmail({
  to: body.adminEmail,
  companyName: body.companyName,
  firstName: body.adminFirstName,
  tempPassword: result.tempPassword,
  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`
})
```

## 🧪 Cómo Probar

### 1. Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 2. Acceder al Super Admin Dashboard
```
http://localhost:3000/super-admin
```

### 3. Hacer clic en "Agregar Nuevo Cliente"

### 4. Completar el formulario
- **Empresa**: "Tech Solutions S.A."
- **Nombre**: "María"
- **Apellido**: "González"
- **Email**: "maria@techsolutions.com"

### 5. Verificar la creación
- Ver toast de éxito
- Ver nuevo tenant en la tabla
- Revisar consola del servidor para ver contraseña temporal

### 6. Probar login del nuevo admin
```
URL: http://localhost:3000/login
Email: maria@techsolutions.com
Contraseña: [la que apareció en la consola]
```

## 🐛 Manejo de Errores

| Error | Código | Mensaje |
|-------|--------|---------|
| Email duplicado | 409 | "Ya existe un usuario con ese email." |
| Empresa duplicada | 409 | "Ya existe una empresa con ese nombre." |
| Datos inválidos | 422 | "Datos de entrada inválidos" + detalles |
| Error DB | 500 | "Error interno del servidor al crear el tenant." |
| No autorizado | 403 | "No autorizado. Solo super-admins..." |

## 📊 Estructura de Base de Datos

### Tabla: Tenant
```prisma
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  email     String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users     User[]
  // ... otras relaciones
}
```

### Tabla: User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String
  password  String
  firstName String
  lastName  String
  role      UserRole @default(USER)
  isActive  Boolean  @default(true)
  
  tenantId  String
  tenant    Tenant   @relation(...)
}
```

### Enum: UserRole
```prisma
enum UserRole {
  SUPER_ADMIN  // Administrador del sistema completo
  ADMIN        // Administrador del tenant
  MANAGER      // Gerente con permisos limitados
  USER         // Usuario estándar
}
```

## 🎨 UX/UI Implementada

### Componente Dialog
- ✅ Overlay semi-transparente
- ✅ Animaciones suaves de apertura/cierre
- ✅ Responsive (mobile-first)
- ✅ Cierre con ESC o clic fuera
- ✅ Focus trap (accesibilidad)

### Formulario
- ✅ Labels claros con asteriscos rojos (*)
- ✅ Placeholders descriptivos
- ✅ Errores en rojo debajo de cada campo
- ✅ Hint informativo en email
- ✅ Estados disabled durante loading
- ✅ Icono spinner durante envío

### Botones
- ✅ Primario: "Crear Cliente" (verde)
- ✅ Secundario: "Cancelar" (outline)
- ✅ Estados: default, hover, disabled, loading
- ✅ Iconos: PlusCircle, Loader2 (animado)

## 🔄 Próximas Mejoras

### Alta Prioridad
1. [ ] Implementar verificación de sesión SUPER_ADMIN
2. [ ] Integrar envío de emails con SendGrid/Resend
3. [ ] Agregar opción de personalizar contraseña
4. [ ] Implementar límite de tenants según plan

### Media Prioridad
5. [ ] Agregar más campos opcionales (teléfono, dirección)
6. [ ] Preview del slug antes de enviar
7. [ ] Validación de dominio personalizado
8. [ ] Historial de tenants creados

### Baja Prioridad
9. [ ] Import masivo desde CSV
10. [ ] Plantillas de bienvenida personalizables
11. [ ] Analytics de creación de tenants
12. [ ] Modo "demo" para testing

## 📚 Recursos Adicionales

- [Documentación de Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)
- [bcrypt Best Practices](https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns)

## 🤝 Contribución

Si encuentras bugs o tienes sugerencias:
1. Abre un issue en el repositorio
2. Describe el problema con detalle
3. Incluye pasos para reproducir
4. Propón una solución si es posible

---

**Desarrollado para Metanoia v1.0.1**
*Sistema ERP SaaS Multi-Tenant*
