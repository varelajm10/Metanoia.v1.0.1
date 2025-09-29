# Módulo de Gestión de Ascensores - Metanoia V1.0.1

## 📋 Descripción General

Módulo completo para empresas que se dedican a la instalación y mantenimiento de ascensores. Incluye gestión de clientes, ascensores, instalaciones, mantenimiento preventivo y correctivo, inspecciones técnicas, técnicos especializados, inventario de repuestos y órdenes de trabajo.

## 🏗️ Arquitectura del Módulo

### Entidades Principales

1. **ElevatorClient** - Clientes/Propietarios de ascensores
2. **Elevator** - Ascensores individuales con especificaciones técnicas
3. **Installation** - Proyectos de instalación de ascensores
4. **MaintenanceContract** - Contratos de mantenimiento
5. **MaintenanceRecord** - Registros de mantenimiento realizados
6. **Inspection** - Inspecciones técnicas y certificaciones
7. **ElevatorTechnician** - Técnicos especializados
8. **ElevatorSparePart** - Repuestos y componentes
9. **WorkOrder** - Órdenes de trabajo

### Características del Módulo

#### 🔧 Gestión de Ascensores

- **Registro completo** con especificaciones técnicas detalladas
- **Tracking de ubicación** (edificio, dirección, piso)
- **Información técnica**: capacidad, velocidad, pisos, tipo de motor, sistema de control
- **Dimensiones** del carro y hueco
- **Estado operacional**: operativo, fuera de servicio, en mantenimiento
- **Historial completo** de mantenimientos e inspecciones
- **Certificaciones** y cumplimiento normativo (NOM-053, EN 81, etc.)
- **Garantías** y fechas de vencimiento
- **Documentación** adjunta (manuales, planos, certificados)
- **Fotos** del ascensor y ubicación

#### 👥 Gestión de Clientes

- **Tipos de clientes**: Individual, Empresa, Administrador de propiedades, Constructor, Arquitecto, Gobierno
- **Información de contacto** completa
- **Clasificación** por industria (Residencial, Comercial, Industrial)
- **Múltiples ascensores** por cliente
- **Contratos de mantenimiento** activos
- **Historial de proyectos** de instalación

#### 🏗️ Gestión de Instalaciones

- **Proyectos de instalación** con seguimiento de progreso (0-100%)
- **Estados**: Planeado, En progreso, Pruebas, Completado, En espera, Cancelado
- **Fechas** de inicio, finalización planificada y real
- **Presupuesto** estimado vs. costo real
- **Equipo de trabajo**: gerente de proyecto y técnicos asignados
- **Hitos del proyecto** con fechas
- **Permisos** y certificaciones de construcción
- **Documentación** y fotos del progreso
- **Cantidad de ascensores** en el proyecto

#### 🔧 Gestión de Mantenimiento

##### Contratos de Mantenimiento

- **Tipos**: Preventivo, Servicio completo, Solo emergencias, Solo inspecciones
- **Frecuencia**: Mensual, Bimensual, Trimestral, Semestral, Anual
- **Período del contrato** con auto-renovación opcional
- **Tarifas**: Mensual, anual, y tarifa por emergencia
- **Alcance del servicio** detallado
- **Tiempo de respuesta** y cobertura (24/7, horario laboral)
- **Repuestos incluidos** o no
- **Términos y condiciones**

##### Registros de Mantenimiento

- **Tipos**: Preventivo, Correctivo, Emergencia, Inspección, Modernización
- **Prioridades**: Baja, Normal, Alta, Urgente, Emergencia
- **Estados**: Programado, En progreso, Completado, Cancelado, Pendiente de repuestos
- **Fechas**: Programada, real, completada
- **Técnicos asignados** con horas trabajadas
- **Hallazgos** y trabajo realizado
- **Repuestos utilizados** con costos
- **Checklist** de verificación
- **Resultados de pruebas**
- **Fotos** del trabajo realizado
- **Firma digital** del cliente
- **Retroalimentación** del cliente
- **Acciones recomendadas** para próxima visita

#### 🔍 Gestión de Inspecciones

- **Tipos**: Periódica, Anual, Post-instalación, Post-modernización, Especial, Emergencia
- **Inspector certificado** con número de licencia
- **Organismo regulador** (Protección Civil, NOM-053, etc.)
- **Resultados**: Aprobado, Reprobado, Condicional, Pendiente de correcciones
- **Puntuación** 0-100
- **Hallazgos** y defectos encontrados
- **Recomendaciones** y acciones correctivas
- **Certificación**: Número, fecha de emisión y vencimiento
- **Generación de certificado** en PDF
- **Checklist** de inspección
- **Fotos** y documentación

#### 👷 Gestión de Técnicos

- **Información personal** y de contacto
- **Especializaciones**: Hidráulicos, Tracción, Montacargas, etc.
- **Certificaciones** y licencias
- **Años de experiencia**
- **Nivel de habilidad**: Aprendiz, Junior, Intermedio, Senior, Maestro, Especialista
- **Estado**: Activo, De permiso, Inactivo, En capacitación
- **Disponibilidad** para asignación
- **Contacto de emergencia**
- **Documentos** (licencias, certificados)
- **Foto** del técnico

#### 📦 Gestión de Repuestos

- **Número de parte** único
- **Categorías**: Motor, Cables, Puertas, Controles, Seguridad, etc.
- **Fabricante** y proveedor
- **Compatibilidad**: Marcas y modelos compatibles
- **Inventario**: Stock actual, mínimo y máximo
- **Ubicación** en almacén
- **Precios**: Costo unitario y precio de venta
- **Dimensiones** y peso
- **Garantía**
- **Alertas** de stock bajo
- **Foto** del repuesto

#### 📝 Órdenes de Trabajo

- **Tipos**: Mantenimiento, Reparación, Instalación, Inspección, Modernización, Emergencia
- **Prioridades**: Baja, Normal, Alta, Urgente, Emergencia
- **Estados**: Abierta, Asignada, En progreso, En espera, Completada, Cancelada, Cerrada
- **Fechas**: Creación, programada, inicio, completada, vencimiento
- **Técnicos asignados** con horas estimadas y reales
- **Costos**: Estimado vs. real
- **Trabajo realizado** y hallazgos
- **Materiales** y repuestos utilizados
- **Fotos** y documentación
- **Firma** del cliente
- **Retroalimentación** y calificación (1-5 estrellas)

## 📊 Dashboards y Reportes

### Dashboard Principal

- Total de ascensores por estado
- Ascensores operativos vs. fuera de servicio
- Mantenimientos programados vs. vencidos
- Inspecciones próximas (30 días)
- Certificaciones vencidas
- Contratos activos y próximos a vencer
- Órdenes de trabajo abiertas por prioridad
- Técnicos disponibles
- Repuestos con stock bajo

### Reportes Disponibles

1. **Reporte de Ascensores**
   - Por cliente, ubicación, marca, modelo
   - Estado operacional
   - Historial de mantenimiento

2. **Reporte de Mantenimiento**
   - Mantenimientos realizados por período
   - Tiempo promedio de servicio
   - Costos por ascensor/cliente
   - Técnicos más eficientes

3. **Reporte de Inspecciones**
   - Inspecciones completadas/pendientes
   - Tasa de aprobación
   - Certificaciones vencidas
   - Acciones correctivas requeridas

4. **Reporte de Instalaciones**
   - Proyectos en curso
   - Proyectos completados
   - Presupuesto vs. costo real
   - Tiempo de instalación promedio

5. **Reporte Financiero**
   - Ingresos por contratos de mantenimiento
   - Costos de repuestos
   - Rentabilidad por cliente
   - Órdenes de trabajo facturadas

6. **Reporte de Inventario**
   - Stock de repuestos
   - Repuestos más utilizados
   - Valor del inventario
   - Alertas de reabastecimiento

## 🔔 Notificaciones Automáticas

### Notificaciones por Email

- **Inspección próxima** (30, 15, 7 días antes)
- **Certificación vencida** o próxima a vencer
- **Mantenimiento programado** (3 días antes)
- **Mantenimiento vencido**
- **Contrato próximo a vencer** (60, 30, 15 días)
- **Orden de trabajo asignada**
- **Stock bajo** de repuestos críticos
- **Ascensor fuera de servicio** (emergencia)

### Notificaciones en Sistema

- Todas las anteriores más:
- **Nuevo cliente** registrado
- **Nueva instalación** iniciada
- **Inspección reprobada**
- **Orden de trabajo completada**
- **Calificación baja** del cliente (< 3 estrellas)

## 🔐 Permisos y Roles

### Roles del Módulo

1. **Administrador de Ascensores**
   - Acceso completo a todas las funcionalidades
   - Gestión de clientes, ascensores, contratos
   - Asignación de técnicos
   - Configuración del módulo

2. **Gerente de Operaciones**
   - Ver y editar ascensores, instalaciones, mantenimiento
   - Asignar técnicos a órdenes de trabajo
   - Ver reportes y estadísticas
   - No puede eliminar registros

3. **Técnico**
   - Ver órdenes de trabajo asignadas
   - Completar registros de mantenimiento
   - Subir fotos y firmas
   - Ver información de ascensores asignados
   - No puede crear/editar clientes o contratos

4. **Supervisor de Calidad**
   - Ver todas las inspecciones
   - Aprobar/rechazar certificaciones
   - Ver reportes de calidad
   - No puede editar datos financieros

5. **Cliente (Portal)**
   - Ver sus ascensores
   - Ver historial de mantenimiento
   - Solicitar servicio
   - Ver certificaciones
   - Pagar facturas

## 🛠️ Tecnologías Utilizadas

### Backend

- **Prisma ORM** - Gestión de base de datos
- **PostgreSQL** - Base de datos relacional
- **Zod** - Validación de datos
- **Next.js API Routes** - Endpoints REST

### Frontend

- **Next.js 14** - Framework principal
- **React 18** - UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **TanStack Query** - Gestión de estado del servidor

### Servicios

- **Node.js** - Runtime
- **Docker** - Containerización
- **Redis** - Cache y sesiones

## 📱 Características Móviles

### App para Técnicos (PWA)

- **Offline capability** - Trabajo sin conexión
- **Registro de mantenimiento** con checklist
- **Captura de fotos** y firma digital
- **Geolocalización** para verificar ubicación
- **Escaneo de QR** para identificar ascensores
- **Sincronización automática** cuando hay conexión

### Portal del Cliente (Web Responsive)

- Ver ascensores y estado
- Historial de mantenimiento
- Solicitar servicio técnico
- Ver certificaciones
- Descargar reportes
- Chat con soporte

## 🚀 Flujos de Trabajo

### 1. Flujo de Nueva Instalación

```
1. Cliente solicita cotización
2. Se crea cliente en sistema (si es nuevo)
3. Se genera proyecto de instalación
4. Se asignan técnicos y recursos
5. Se programa instalación por fases
6. Técnicos registran progreso
7. Inspección post-instalación
8. Certificación y entrega
9. Cliente firma conformidad
10. Se crea registro de ascensor
11. Se genera contrato de mantenimiento
```

### 2. Flujo de Mantenimiento Preventivo

```
1. Sistema genera mantenimiento automáticamente (por contrato)
2. Se asigna técnico disponible
3. Se envía notificación al técnico
4. Técnico realiza mantenimiento según checklist
5. Registra hallazgos y trabajo realizado
6. Registra repuestos utilizados
7. Cliente firma conformidad
8. Se actualiza historial del ascensor
9. Sistema programa próximo mantenimiento
```

### 3. Flujo de Emergencia

```
1. Cliente reporta ascensor fuera de servicio
2. Sistema crea orden de trabajo URGENTE
3. Notifica a técnico disponible más cercano
4. Técnico se desplaza (GPS tracking)
5. Técnico diagnostica problema
6. Solicita repuestos si es necesario
7. Realiza reparación
8. Prueba funcionalidad
9. Cliente firma conformidad
10. Se cierra orden de trabajo
11. Se genera factura por emergencia
```

### 4. Flujo de Inspección Anual

```
1. Sistema alerta inspección próxima (30 días antes)
2. Se programa inspección con inspector certificado
3. Inspector realiza checklist completo
4. Registra hallazgos y defectos
5. Asigna puntuación
6. Genera reporte de inspección
7. Si aprueba: emite certificado PDF
8. Si reprueba: lista acciones correctivas
9. Se programa re-inspección
10. Cliente recibe certificado digital
```

## 📦 Instalación del Módulo

### 1. Ejecutar migración de base de datos

```bash
npm run prisma:migrate
```

### 2. Generar cliente de Prisma

```bash
npm run prisma:generate
```

### 3. Seed de módulo

```bash
npx ts-node scripts/seed-elevator-module.ts
```

### 4. Activar módulo para tenant

```bash
npx ts-node scripts/enable-elevator-module.ts
```

## 🔧 API Endpoints

### Clientes

- `GET /api/elevators/clients` - Listar clientes
- `GET /api/elevators/clients/:id` - Obtener cliente
- `POST /api/elevators/clients` - Crear cliente
- `PUT /api/elevators/clients/:id` - Actualizar cliente
- `DELETE /api/elevators/clients/:id` - Eliminar cliente
- `GET /api/elevators/clients/stats` - Estadísticas

### Ascensores

- `GET /api/elevators` - Listar ascensores
- `GET /api/elevators/:id` - Obtener ascensor
- `POST /api/elevators` - Crear ascensor
- `PUT /api/elevators/:id` - Actualizar ascensor
- `DELETE /api/elevators/:id` - Eliminar ascensor
- `GET /api/elevators/stats` - Estadísticas
- `GET /api/elevators/by-client/:clientId` - Ascensores por cliente

### Instalaciones

- `GET /api/elevators/installations` - Listar instalaciones
- `GET /api/elevators/installations/:id` - Obtener instalación
- `POST /api/elevators/installations` - Crear instalación
- `PUT /api/elevators/installations/:id` - Actualizar instalación
- `DELETE /api/elevators/installations/:id` - Eliminar instalación
- `GET /api/elevators/installations/stats` - Estadísticas

### Mantenimiento

- `GET /api/elevators/maintenance/records` - Listar registros
- `GET /api/elevators/maintenance/records/:id` - Obtener registro
- `POST /api/elevators/maintenance/records` - Crear registro
- `PUT /api/elevators/maintenance/records/:id` - Actualizar registro
- `DELETE /api/elevators/maintenance/records/:id` - Eliminar registro
- `GET /api/elevators/maintenance/contracts` - Listar contratos
- `POST /api/elevators/maintenance/contracts` - Crear contrato
- `GET /api/elevators/maintenance/stats` - Estadísticas

### Inspecciones

- `GET /api/elevators/inspections` - Listar inspecciones
- `GET /api/elevators/inspections/:id` - Obtener inspección
- `POST /api/elevators/inspections` - Crear inspección
- `PUT /api/elevators/inspections/:id` - Actualizar inspección
- `DELETE /api/elevators/inspections/:id` - Eliminar inspección
- `GET /api/elevators/inspections/stats` - Estadísticas

### Técnicos

- `GET /api/elevators/technicians` - Listar técnicos
- `GET /api/elevators/technicians/:id` - Obtener técnico
- `POST /api/elevators/technicians` - Crear técnico
- `PUT /api/elevators/technicians/:id` - Actualizar técnico
- `DELETE /api/elevators/technicians/:id` - Eliminar técnico
- `GET /api/elevators/technicians/stats` - Estadísticas

### Repuestos

- `GET /api/elevators/spare-parts` - Listar repuestos
- `GET /api/elevators/spare-parts/:id` - Obtener repuesto
- `POST /api/elevators/spare-parts` - Crear repuesto
- `PUT /api/elevators/spare-parts/:id` - Actualizar repuesto
- `DELETE /api/elevators/spare-parts/:id` - Eliminar repuesto
- `GET /api/elevators/spare-parts/stats` - Estadísticas

### Órdenes de Trabajo

- `GET /api/elevators/work-orders` - Listar órdenes
- `GET /api/elevators/work-orders/:id` - Obtener orden
- `POST /api/elevators/work-orders` - Crear orden
- `PUT /api/elevators/work-orders/:id` - Actualizar orden
- `DELETE /api/elevators/work-orders/:id` - Eliminar orden
- `GET /api/elevators/work-orders/stats` - Estadísticas

## 📱 Páginas del Frontend

### Páginas Principales

- `/dashboard/elevators` - Dashboard principal
- `/dashboard/elevators/clients` - Gestión de clientes
- `/dashboard/elevators/list` - Listado de ascensores
- `/dashboard/elevators/:id` - Detalle de ascensor
- `/dashboard/elevators/installations` - Proyectos de instalación
- `/dashboard/elevators/maintenance` - Gestión de mantenimiento
- `/dashboard/elevators/contracts` - Contratos de mantenimiento
- `/dashboard/elevators/inspections` - Inspecciones técnicas
- `/dashboard/elevators/technicians` - Gestión de técnicos
- `/dashboard/elevators/spare-parts` - Inventario de repuestos
- `/dashboard/elevators/work-orders` - Órdenes de trabajo
- `/dashboard/elevators/reports` - Reportes y análisis

## 🎨 Componentes UI

### Componentes Creados

- `ElevatorCard` - Tarjeta de ascensor
- `ElevatorDetailDialog` - Diálogo con detalles completos
- `MaintenanceCalendar` - Calendario de mantenimientos
- `InspectionChecklist` - Checklist de inspección
- `TechnicianAssignment` - Asignación de técnicos
- `SparePartSelector` - Selector de repuestos
- `WorkOrderForm` - Formulario de orden de trabajo
- `ClientSelector` - Selector de clientes
- `StatusBadge` - Badge de estado
- `PriorityBadge` - Badge de prioridad
- `SignatureCanvas` - Canvas para firma digital
- `PhotoUpload` - Componente de carga de fotos
- `QRScanner` - Escáner de códigos QR
- `ElevatorStats` - Estadísticas visuales

## 🔍 Búsqueda y Filtros

### Filtros Disponibles

- Por cliente
- Por estado
- Por marca/modelo
- Por ubicación (ciudad, edificio)
- Por fechas (instalación, inspección)
- Por técnico asignado
- Por tipo de mantenimiento
- Por prioridad
- Por contrato
- Búsqueda de texto completo

## 📈 Métricas y KPIs

### KPIs Principales

1. **Disponibilidad de Ascensores** - % operativos vs. total
2. **Tiempo Promedio de Respuesta** - Emergencias
3. **Tasa de Mantenimientos a Tiempo** - % completados antes de la fecha
4. **Tasa de Aprobación de Inspecciones** - % aprobadas primera vez
5. **Satisfacción del Cliente** - Promedio de calificaciones
6. **Costo Promedio por Mantenimiento** - Por ascensor/mes
7. **Eficiencia de Técnicos** - Trabajos completados/mes
8. **Rotación de Inventario** - Repuestos
9. **Ingresos por Contratos** - MRR (Monthly Recurring Revenue)
10. **Certificaciones Vigentes** - % con certificación válida

## 🔒 Seguridad

### Medidas de Seguridad

- **Autenticación** JWT
- **Multi-tenant** - Separación total por tenant
- **Permisos granulares** por rol
- **Auditoría** de cambios
- **Encriptación** de datos sensibles
- **Firma digital** con timestamp
- **Backups automáticos**
- **Rate limiting** en APIs

## 🌐 Integraciones

### Integraciones Disponibles

- **Email** (SendGrid/Resend) - Notificaciones
- **SMS** (Twilio) - Alertas urgentes
- **WhatsApp** - Notificaciones a clientes
- **Google Calendar** - Sincronización de mantenimientos
- **Stripe** - Pagos de contratos
- **QuickBooks** - Facturación
- **Google Maps** - Geolocalización
- **Zapier** - Integraciones personalizadas

## 📝 Notas Importantes

1. **Este módulo es completamente funcional** y está listo para producción
2. **Escalable** - Soporta miles de ascensores y usuarios concurrentes
3. **Responsive** - Funciona en desktop, tablet y móvil
4. **Multi-idioma** - Preparado para i18n
5. **Personalizable** - Campos y flujos configurables por tenant
6. **Documentado** - Código comentado y documentación completa
7. **Testeado** - Unit tests e integration tests incluidos

## 🚀 Próximas Funcionalidades

### Roadmap V1.1

- [ ] App móvil nativa (React Native)
- [ ] Integración con IoT para monitoreo en tiempo real
- [ ] Machine Learning para mantenimiento predictivo
- [ ] Realidad Aumentada para asistencia técnica
- [ ] Blockchain para certificaciones inmutables
- [ ] Integración con ERP externos (SAP, Oracle)
- [ ] Portal de autoservicio para clientes
- [ ] Sistema de tickets y chat en vivo

## 📞 Soporte

Para soporte técnico o preguntas sobre el módulo:

- Email: support@metanoia.click
- Documentación: https://docs.metanoia.click/elevators
- GitHub Issues: https://github.com/metanoia/erp/issues

---

**Versión del Módulo:** 1.0.0  
**Fecha de Creación:** Septiembre 2025  
**Última Actualización:** Septiembre 2025  
**Autor:** Metanoia Development Team  
**Licencia:** Proprietaria - Metanoia.click

© 2025 Metanoia.click - Todos los derechos reservados
