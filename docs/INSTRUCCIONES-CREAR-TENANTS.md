# 🚀 Guía Rápida: Crear Nuevos Tenants (Clientes-Empresa)

## ✅ Implementación Completada

Se ha implementado el **flujo completo** para agregar nuevos clientes-empresa (Tenants) con creación automática de usuario administrador.

---

## 📦 ¿Qué se Creó?

### 1. **Frontend Component**
```
src/components/admin/CreateTenantDialog.tsx
```
- ✅ Dialog moderno con shadcn/ui
- ✅ Formulario validado con react-hook-form + Zod
- ✅ Manejo de estados y notificaciones

### 2. **Backend API Endpoint**
```
src/app/api/superadmin/tenants/route.ts
```
- ✅ POST: Crear tenant + usuario administrador
- ✅ GET: Listar todos los tenants
- ✅ Transacciones atómicas con Prisma
- ✅ Generación de contraseñas seguras

### 3. **Integración**
```
src/app/super-admin/page.tsx (actualizado)
```
- ✅ Componente integrado en Super Admin Dashboard

### 4. **Documentación**
```
docs/flujo-creacion-tenants.md
scripts/test-create-tenant-api.ts
```
- ✅ Documentación técnica completa
- ✅ Script de prueba

---

## 🎯 Cómo Usar

### Opción 1: Desde la UI (Recomendado)

1. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

2. **Accede al Super Admin Dashboard**
   ```
   http://localhost:3000/super-admin
   ```

3. **Haz clic en el botón "Agregar Nuevo Cliente"**
   - Está ubicado en la esquina superior derecha
   - Tiene un ícono de "+" (PlusCircle)

4. **Completa el formulario**
   - **Nombre de la Empresa**: Nombre legal de la empresa
   - **Nombre del Administrador**: Nombre del contacto
   - **Apellido del Administrador**: Apellido del contacto
   - **Email del Administrador**: Email único para login

5. **Haz clic en "Crear Cliente"**
   - Espera la confirmación (toast verde)
   - La página se refrescará automáticamente
   - Verás el nuevo tenant en la tabla

6. **Revisa la consola del servidor**
   ```bash
   =========================================
   NUEVO TENANT CREADO:
   =========================================
   Empresa: Tech Solutions S.A.
   Slug: tech-solutions-sa
   Email Admin: admin@techsolutions.com
   Contraseña Temporal: aB3$xY9#mN2k
   =========================================
   ```
   ⚠️ **IMPORTANTE**: Guarda esta contraseña para entregarla al cliente

### Opción 2: Desde la API Directa

```bash
curl -X POST http://localhost:3000/api/superadmin/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Tech Solutions S.A.",
    "adminFirstName": "María",
    "adminLastName": "González",
    "adminEmail": "maria@techsolutions.com"
  }'
```

### Opción 3: Con el Script de Prueba

```bash
npx ts-node scripts/test-create-tenant-api.ts
```

---

## 📋 Datos que se Crean Automáticamente

### Tenant (Empresa)
```typescript
{
  id: "clxxx...",                    // CUID generado
  name: "Tech Solutions S.A.",       // Del formulario
  slug: "tech-solutions-sa",         // Generado automáticamente
  email: "admin@techsolutions.com",  // Del formulario
  isActive: true,                    // Por defecto
  createdAt: "2025-09-30...",        // Timestamp actual
  updatedAt: "2025-09-30...",        // Timestamp actual
}
```

### User (Administrador)
```typescript
{
  id: "clyyy...",                     // CUID generado
  firstName: "María",                 // Del formulario
  lastName: "González",               // Del formulario
  email: "maria@techsolutions.com",   // Del formulario
  password: "$2a$10$...",              // Hash bcrypt
  role: "ADMIN",                      // Asignado automáticamente
  tenantId: "clxxx...",               // Referencia al tenant
  isActive: true,                     // Por defecto
}
```

### Contraseña Temporal
```
Ejemplo: aB3$xY9#mN2k
- 12 caracteres
- Mayúsculas, minúsculas, números, símbolos
- Hasheada con bcrypt (10 rounds)
```

---

## 🔒 Seguridad

### ✅ Validaciones Implementadas

1. **Email único**: No permite emails duplicados
2. **Nombre único**: No permite empresas duplicadas (case-insensitive)
3. **Slug único**: Agrega timestamp si hay conflicto
4. **Contraseñas seguras**: Hash bcrypt, nunca en texto plano
5. **Transacciones atómicas**: Todo o nada

### 🔴 Pendiente de Implementar

```typescript
// En: src/app/api/superadmin/tenants/route.ts
// Línea: ~20

// TODO: Descomentar cuando tengas auth configurado
const session = await getServerSession(authOptions)
if (!session || session.user.role !== 'SUPER_ADMIN') {
  return NextResponse.json(
    { message: 'No autorizado' },
    { status: 403 }
  )
}
```

---

## 📧 Envío de Contraseñas

### Estado Actual: Consola del Servidor
La contraseña se imprime en la consola del servidor. Debes copiarla manualmente y enviarla al cliente.

### Próxima Mejora: Email Automático

Agregar al final de la transacción en `route.ts`:

```typescript
// Importar al inicio
import { sendWelcomeEmail } from '@/lib/email'

// Después de crear el tenant
await sendWelcomeEmail({
  to: body.adminEmail,
  companyName: body.companyName,
  firstName: body.adminFirstName,
  tempPassword: result.tempPassword,
  loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`
})
```

Crear `src/lib/email.ts`:

```typescript
import nodemailer from 'nodemailer'

export async function sendWelcomeEmail(data: {
  to: string
  companyName: string
  firstName: string
  tempPassword: string
  loginUrl: string
}) {
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: data.to,
    subject: `Bienvenido a Metanoia - ${data.companyName}`,
    html: `
      <h1>¡Bienvenido a Metanoia, ${data.firstName}!</h1>
      <p>Tu cuenta de administrador ha sido creada para <strong>${data.companyName}</strong>.</p>
      
      <h2>Tus credenciales de acceso:</h2>
      <ul>
        <li><strong>Email:</strong> ${data.to}</li>
        <li><strong>Contraseña Temporal:</strong> <code>${data.tempPassword}</code></li>
      </ul>
      
      <p>
        <a href="${data.loginUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Iniciar Sesión
        </a>
      </p>
      
      <p><small>Por favor, cambia tu contraseña al iniciar sesión por primera vez.</small></p>
    `,
  })
}
```

Variables de entorno necesarias (`.env`):
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=tu_api_key_de_sendgrid
SMTP_FROM=noreply@metanoia.com
```

---

## 🧪 Probar el Flujo Completo

### 1. Crear un Tenant de Prueba

```bash
# Opción A: Desde la UI
npm run dev
# Ir a http://localhost:3000/super-admin
# Clic en "Agregar Nuevo Cliente"

# Opción B: Desde la API
curl -X POST http://localhost:3000/api/superadmin/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Empresa Prueba",
    "adminFirstName": "Test",
    "adminLastName": "User",
    "adminEmail": "test@prueba.com"
  }'
```

### 2. Copiar las Credenciales

```bash
# Buscar en la consola del servidor:
Contraseña Temporal: xYz#9aB$2mN7
```

### 3. Probar el Login

```
URL: http://localhost:3000/login
Email: test@prueba.com
Contraseña: xYz#9aB$2mN7
```

### 4. Verificar en la Base de Datos

```bash
# Abrir Prisma Studio
npx prisma studio

# Verificar:
# - Tabla "Tenant": Nuevo registro
# - Tabla "User": Nuevo admin con tenantId correcto
```

---

## 🐛 Troubleshooting

### Error: "Ya existe un usuario con ese email"
**Causa**: El email ya está registrado
**Solución**: Usa otro email o elimina el usuario existente

### Error: "Ya existe una empresa con ese nombre"
**Causa**: El nombre de la empresa ya está registrado
**Solución**: Usa otro nombre o elimina el tenant existente

### Error: "Cannot find module '@/lib/db'"
**Causa**: TypeScript no encuentra el módulo (error de IDE)
**Solución**: Reinicia el servidor TypeScript en tu editor

### No aparece el botón "Agregar Nuevo Cliente"
**Causa**: El componente no se importó correctamente
**Solución**: Verifica que la página importe `CreateTenantDialog`

### La contraseña no aparece en la consola
**Causa**: No estás viendo la consola correcta
**Solución**: Revisa la terminal donde corre `npm run dev`, no la consola del navegador

---

## 📊 Estructura de Archivos Final

```
Metanoia_v1.0.1/
├── src/
│   ├── components/
│   │   ├── admin/                    # ✨ NUEVO
│   │   │   └── CreateTenantDialog.tsx
│   │   └── super-admin/
│   │       ├── super-admin-table.tsx
│   │       └── create-tenant-form.tsx
│   ├── app/
│   │   ├── api/
│   │   │   └── superadmin/
│   │   │       └── tenants/          # ✨ NUEVO
│   │   │           └── route.ts
│   │   └── super-admin/
│   │       └── page.tsx              # ✨ ACTUALIZADO
│   └── lib/
│       └── db.ts
├── docs/
│   ├── flujo-creacion-tenants.md     # ✨ NUEVO
│   └── INSTRUCCIONES-CREAR-TENANTS.md # ✨ NUEVO
├── scripts/
│   └── test-create-tenant-api.ts     # ✨ NUEVO
└── prisma/
    └── schema.prisma
```

---

## 📚 Recursos

- **Documentación Técnica Completa**: `docs/flujo-creacion-tenants.md`
- **Componente Frontend**: `src/components/admin/CreateTenantDialog.tsx`
- **API Backend**: `src/app/api/superadmin/tenants/route.ts`
- **Script de Prueba**: `scripts/test-create-tenant-api.ts`

---

## 🎯 Próximos Pasos Recomendados

### Alta Prioridad
1. ✅ **Implementar autenticación**: Proteger el endpoint con verificación de SUPER_ADMIN
2. ✅ **Envío de emails**: Configurar SendGrid/Resend para enviar credenciales
3. ✅ **Cambio de contraseña obligatorio**: Forzar cambio en primer login

### Media Prioridad
4. ✅ **Agregar más campos**: Teléfono, dirección, país, etc.
5. ✅ **Configuración de módulos**: Permitir elegir módulos activos al crear
6. ✅ **Límites por plan**: Restringir número de tenants según suscripción

---

## ✨ ¡Todo Listo!

Ya puedes empezar a crear nuevos clientes-empresa desde tu Super Admin Dashboard.

**¿Preguntas o problemas?**
Revisa la documentación técnica completa en `docs/flujo-creacion-tenants.md`

---

**Desarrollado para Metanoia v1.0.1**
*Sistema ERP SaaS Multi-Tenant con Next.js 14, Prisma y PostgreSQL*
