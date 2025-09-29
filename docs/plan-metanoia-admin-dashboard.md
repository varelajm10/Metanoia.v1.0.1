# 📋 PLAN: Dashboard de Administración de Metanoia

## 🎯 **OBJETIVO PRINCIPAL**

Crear un sistema donde Metanoia (tu empresa) pueda gestionar clientes (ferreterías, etc.) y habilitar/deshabilitar módulos específicos para cada cliente.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Usuarios del Sistema:**

1. **Metanoia Admin** (Tú) - Gestión de clientes y módulos
2. **Clientes** (Ferreterías, etc.) - Uso de módulos habilitados

### **Estructura Multi-tenant:**

- Cada cliente tiene su propia base de datos/schema
- Cada cliente solo ve los módulos que Metanoia le habilita
- Acceso independiente con credenciales específicas

---

## 📝 **FASES DE IMPLEMENTACIÓN**

### **FASE 1: Dashboard de Administración de Metanoia** ⭐

**Objetivo**: Crear la consola donde tú (Metanoia) gestionas todo

#### **1.1 Página Principal de Admin**

- [ ] Crear `/dashboard/admin` (acceso solo para Metanoia)
- [ ] Dashboard con estadísticas generales:
  - Total de clientes activos
  - Módulos más utilizados
  - Ingresos por módulo
  - Clientes nuevos este mes

#### **1.2 Gestión de Clientes**

- [ ] Lista de todos los clientes (ferreterías, etc.)
- [ ] Información de cada cliente:
  - Nombre de la empresa
  - Contacto principal
  - Fecha de registro
  - Estado (activo/inactivo)
  - Plan de suscripción
- [ ] Botón "Crear Nuevo Cliente"

#### **1.3 Gestión de Módulos por Cliente**

- [ ] Vista detallada de cada cliente
- [ ] Lista de todos los módulos disponibles
- [ ] Checkbox para habilitar/deshabilitar cada módulo
- [ ] Guardar cambios en tiempo real

#### **1.4 Creación de Nuevos Clientes**

- [ ] Formulario para crear cliente:
  - Datos de la empresa
  - Contacto principal
  - Plan de suscripción
  - Módulos iniciales a habilitar
- [ ] Generación automática de credenciales
- [ ] Creación automática de base de datos del cliente

---

### **FASE 2: Sistema de Autenticación y Roles**

**Objetivo**: Separar acceso de Metanoia vs Clientes

#### **2.1 Sistema de Roles**

- [ ] Crear roles: `METANOIA_ADMIN`, `CLIENT_ADMIN`, `CLIENT_USER`
- [ ] Middleware de autorización por roles
- [ ] Protección de rutas por rol

#### **2.2 Autenticación Diferenciada**

- [ ] Login de Metanoia (acceso a `/dashboard/admin`)
- [ ] Login de Clientes (acceso a `/dashboard` con módulos limitados)
- [ ] Redirección automática según rol

---

### **FASE 3: Gestión de Módulos Dinámica**

**Objetivo**: Sistema que permita habilitar/deshabilitar módulos dinámicamente

#### **3.1 Base de Datos de Módulos**

- [ ] Tabla de módulos disponibles
- [ ] Configuración por módulo (precio, descripción, etc.)
- [ ] Estados: activo, inactivo, en desarrollo

#### **3.2 Sistema de Habilitación**

- [ ] Tabla de módulos habilitados por cliente
- [ ] API para habilitar/deshabilitar módulos
- [ ] Actualización en tiempo real del dashboard del cliente

---

### **FASE 4: Dashboard del Cliente Mejorado**

**Objetivo**: Los clientes solo ven sus módulos habilitados

#### **4.1 Dashboard Dinámico**

- [ ] Cargar solo módulos habilitados para el cliente
- [ ] Navegación dinámica según módulos disponibles
- [ ] Mensaje cuando no hay módulos habilitados

#### **4.2 Gestión de Usuarios del Cliente**

- [ ] El cliente puede crear usuarios adicionales
- [ ] Roles dentro del cliente (admin, usuario, etc.)
- [ ] Gestión de permisos por módulo

---

### **FASE 5: Sistema de Facturación y Planes**

**Objetivo**: Gestionar planes y facturación

#### **5.1 Planes de Suscripción**

- [ ] Planes predefinidos (Básico, Premium, Enterprise)
- [ ] Precios por módulo
- [ ] Límites por plan (usuarios, almacenamiento, etc.)

#### **5.2 Facturación**

- [ ] Generación de facturas automática
- [ ] Historial de pagos
- [ ] Alertas de vencimiento

---

### **FASE 6: Reportes y Analytics**

**Objetivo**: Visibilidad del negocio para Metanoia

#### **6.1 Reportes de Metanoia**

- [ ] Ingresos por cliente
- [ ] Módulos más populares
- [ ] Crecimiento de clientes
- [ ] Uso por módulo

#### **6.2 Analytics de Clientes**

- [ ] Métricas de uso por cliente
- [ ] Reportes de adopción de módulos
- [ ] Alertas de clientes inactivos

---

## 🛠️ **TECNOLOGÍAS A USAR**

### **Frontend:**

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query para estado del servidor

### **Backend:**

- API Routes de Next.js
- Prisma ORM
- PostgreSQL (multi-tenant por schema)

### **Autenticación:**

- JWT con roles
- Bcrypt para passwords
- Middleware de autorización

---

## 📊 **ESTRUCTURA DE BASE DE DATOS**

### **Tablas Principales:**

```sql
-- Clientes de Metanoia (ferreterías, etc.)
tenants (
  id, name, slug, email, contact_name,
  subscription_plan, status, created_at
)

-- Módulos disponibles
modules (
  id, name, display_name, description,
  price, category, is_active
)

-- Módulos habilitados por cliente
tenant_modules (
  tenant_id, module_id, is_enabled,
  enabled_at, disabled_at
)

-- Usuarios del sistema
users (
  id, email, password, role,
  tenant_id, is_active
)
```

---

## 🎯 **CRITERIOS DE ÉXITO**

### **Para Metanoia (Tú):**

- [ ] Puedo ver todos mis clientes en un dashboard
- [ ] Puedo crear nuevos clientes fácilmente
- [ ] Puedo habilitar/deshabilitar módulos por cliente
- [ ] Puedo ver estadísticas de mi negocio
- [ ] Puedo gestionar planes y facturación

### **Para Clientes (Ferreterías):**

- [ ] Acceso independiente con sus credenciales
- [ ] Solo ven los módulos que les habilitaste
- [ ] Pueden crear usuarios adicionales
- [ ] Experiencia fluida sin confusión

---

## 📅 **CRONOGRAMA SUGERIDO**

### **Semana 1: Fase 1**

- Dashboard de administración básico
- Lista de clientes
- Gestión básica de módulos

### **Semana 2: Fase 2**

- Sistema de roles y autenticación
- Separación de accesos

### **Semana 3: Fase 3**

- Sistema dinámico de módulos
- APIs de gestión

### **Semana 4: Fase 4**

- Dashboard del cliente mejorado
- Gestión de usuarios del cliente

### **Semana 5-6: Fases 5-6**

- Facturación y reportes
- Analytics y optimizaciones

---

## 🚀 **PRÓXIMO PASO INMEDIATO**

**Empezar con FASE 1.1: Página Principal de Admin**

Crear `/dashboard/admin` con:

- Acceso solo para usuarios Metanoia
- Dashboard con estadísticas básicas
- Navegación a gestión de clientes

---

## 📝 **NOTAS IMPORTANTES**

1. **Ir paso a paso**: Completar cada fase antes de pasar a la siguiente
2. **Testing continuo**: Probar cada funcionalidad antes de continuar
3. **Documentación**: Documentar cada cambio importante
4. **Backup**: Hacer backup antes de cambios importantes
5. **Feedback**: Revisar con el usuario antes de continuar a la siguiente fase

---

_Este plan será nuestro mapa de ruta para crear el sistema completo de administración de Metanoia._
