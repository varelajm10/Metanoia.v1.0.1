# Módulo de Recursos Humanos (RRHH) - Metanoia V1.0.1

## 📋 Descripción General

El módulo de Recursos Humanos (RRHH) es un sistema completo para la gestión de empleados, nómina, vacaciones y talento humano. Está diseñado para empresas que necesitan un control integral de su capital humano.

## 🚀 Características Principales

### 1. Gestión de Empleados

- **Registro completo** de información personal y laboral
- **Control de jerarquías** organizacionales
- **Seguimiento de estado** (Activo, Inactivo, Terminado, En Licencia)
- **Gestión de habilidades** y competencias
- **Historial completo** de cada empleado

### 2. Gestión de Nómina

- **Cálculo automático** de salarios y deducciones
- **Procesamiento por períodos** (mensual, quincenal)
- **Control de horas extra** y bonificaciones
- **Generación automática** de nóminas
- **Estados de nómina** (Pendiente, Procesada, Pagada)

### 3. Gestión de Vacaciones

- **Solicitud de vacaciones** por empleados
- **Flujo de aprobación** configurable
- **Control de días disponibles** por empleado
- **Tipos de vacaciones** (Anuales, Enfermedad, Maternidad, etc.)
- **Calendario de vacaciones** y conflictos

### 4. Evaluaciones de Desempeño

- **Sistema de calificaciones** (1-5)
- **Múltiples criterios** de evaluación
- **Seguimiento de objetivos** y metas
- **Historial de evaluaciones**
- **Reportes de desempeño**

### 5. Control de Asistencia

- **Registro de entrada y salida**
- **Control de horas trabajadas**
- **Gestión de descansos**
- **Detección de tardanzas** y horas extra
- **Estados de asistencia** (Presente, Ausente, Licencia, etc.)

## 🏗️ Arquitectura Técnica

### Base de Datos

#### Modelos Principales

```prisma
// Empleado
model Employee {
  id              String   @id @default(cuid())
  employeeNumber  String   @unique
  firstName       String
  lastName        String
  email           String   @unique
  position        String
  department      String
  employmentType  EmploymentType
  hireDate        DateTime
  salary          Decimal?
  status          EmployeeStatus
  // ... más campos
}

// Nómina
model Payroll {
  id              String   @id @default(cuid())
  employeeId      String
  period          String   // "2024-01"
  basicSalary     Decimal
  overtimePay     Decimal
  bonuses         Decimal
  grossSalary     Decimal
  totalDeductions Decimal
  netSalary       Decimal
  status          PayrollStatus
  // ... más campos
}

// Vacaciones
model Vacation {
  id              String   @id @default(cuid())
  employeeId      String
  type            VacationType
  startDate       DateTime
  endDate         DateTime
  days            Int
  status          VacationStatus
  // ... más campos
}
```

### APIs Backend

#### Empleados

- `GET /api/hr/employees` - Listar empleados con filtros
- `POST /api/hr/employees` - Crear nuevo empleado
- `GET /api/hr/employees/[id]` - Obtener empleado por ID
- `PUT /api/hr/employees/[id]` - Actualizar empleado
- `DELETE /api/hr/employees/[id]` - Eliminar empleado
- `GET /api/hr/employees/stats` - Estadísticas de empleados

#### Nómina

- `GET /api/hr/payroll` - Listar nóminas
- `POST /api/hr/payroll` - Crear nómina
- `POST /api/hr/payroll/generate` - Generar nóminas por período
- `PUT /api/hr/payroll/[id]` - Actualizar nómina
- `POST /api/hr/payroll/[id]/process` - Procesar nómina

#### Vacaciones

- `GET /api/hr/vacations` - Listar vacaciones
- `POST /api/hr/vacations` - Crear solicitud de vacaciones
- `POST /api/hr/vacations/[id]/approve` - Aprobar vacaciones
- `POST /api/hr/vacations/[id]/reject` - Rechazar vacaciones
- `GET /api/hr/vacations/stats` - Estadísticas de vacaciones

### Frontend

#### Páginas Principales

- `/dashboard/hr` - Dashboard principal de RRHH
- `/dashboard/hr/employees` - Lista de empleados
- `/dashboard/hr/employees/new` - Formulario de nuevo empleado
- `/dashboard/hr/employees/[id]` - Detalle de empleado
- `/dashboard/hr/employees/[id]/edit` - Editar empleado
- `/dashboard/hr/payroll` - Gestión de nómina
- `/dashboard/hr/vacations` - Gestión de vacaciones
- `/dashboard/hr/reports` - Reportes RRHH

#### Componentes UI

- `EmployeeCard` - Tarjeta de empleado
- `EmployeeForm` - Formulario de empleado
- `PayrollTable` - Tabla de nómina
- `VacationCalendar` - Calendario de vacaciones
- `PerformanceChart` - Gráfico de desempeño

## 📊 Funcionalidades Detalladas

### Gestión de Empleados

#### Información Personal

- Número de empleado único
- Nombre completo
- Email corporativo y personal
- Teléfono de contacto
- Dirección de residencia
- Fecha de nacimiento
- Género y estado civil
- Nacionalidad

#### Información Laboral

- Cargo y departamento
- Tipo de contrato (Tiempo completo, Medio tiempo, etc.)
- Fecha de contratación
- Fecha de terminación (si aplica)
- Salario base
- Jefe directo
- Habilidades y competencias

#### Estados del Empleado

- **ACTIVE**: Empleado activo y trabajando
- **INACTIVE**: Empleado inactivo temporalmente
- **TERMINATED**: Empleado terminado
- **ON_LEAVE**: Empleado en licencia

### Gestión de Nómina

#### Cálculo de Salarios

- **Salario básico**: Salario fijo mensual
- **Horas extra**: Pago adicional por horas extra
- **Bonificaciones**: Bonos por desempeño o metas
- **Asignaciones**: Subsidios y beneficios

#### Deducciones

- **Impuestos**: Retención en la fuente
- **Seguridad social**: Aportes a pensiones y salud
- **Seguro de salud**: Aporte a EPS
- **Otras deducciones**: Préstamos, embargos, etc.

#### Procesamiento

- **Períodos**: Control mensual por formato YYYY-MM
- **Estados**: Pendiente → Procesada → Pagada
- **Generación automática**: Para empleados activos
- **Validaciones**: Verificación de datos antes de procesar

### Gestión de Vacaciones

#### Tipos de Vacaciones

- **ANNUAL**: Vacaciones anuales
- **SICK**: Licencia por enfermedad
- **MATERNITY**: Licencia de maternidad
- **PATERNITY**: Licencia de paternidad
- **EMERGENCY**: Licencia de emergencia
- **UNPAID**: Licencia sin goce de sueldo

#### Flujo de Aprobación

1. **Solicitud**: Empleado solicita vacaciones
2. **Revisión**: Supervisor revisa la solicitud
3. **Aprobación/Rechazo**: Decisión final
4. **Notificación**: Empleado es notificado

#### Control de Disponibilidad

- Verificación de días disponibles
- Detección de conflictos con otras vacaciones
- Validación de fechas válidas
- Control de períodos de alta demanda

### Evaluaciones de Desempeño

#### Criterios de Evaluación

- **Habilidades técnicas**: Conocimiento del trabajo
- **Comunicación**: Habilidad para comunicarse
- **Trabajo en equipo**: Colaboración con otros
- **Liderazgo**: Capacidad de liderar
- **Puntualidad**: Cumplimiento de horarios
- **Calificación general**: Puntuación promedio

#### Tipos de Evaluación

- **PROBATION**: Evaluación de período de prueba
- **ANNUAL**: Evaluación anual
- **QUARTERLY**: Evaluación trimestral
- **PROJECT_BASED**: Evaluación por proyecto

### Control de Asistencia

#### Registro de Tiempo

- **Entrada**: Hora de llegada
- **Salida**: Hora de salida
- **Descanso**: Horarios de descanso
- **Total de horas**: Cálculo automático

#### Estados de Asistencia

- **PRESENT**: Presente y trabajando
- **ABSENT**: Ausente sin justificación
- **LATE**: Llegó tarde
- **SICK_LEAVE**: En licencia por enfermedad
- **VACATION**: En vacaciones
- **HOLIDAY**: Día festivo

## 🔐 Permisos y Seguridad

### Roles y Permisos

#### USER (Usuario básico)

- Ver información de empleados
- Ver su propia información
- Solicitar vacaciones

#### MANAGER (Gerente)

- Ver todos los empleados
- Crear y editar empleados
- Aprobar vacaciones
- Ver reportes de su equipo

#### ADMIN (Administrador)

- Todas las funciones de MANAGER
- Gestionar nómina
- Eliminar empleados
- Acceso completo a reportes

#### SUPER_ADMIN (Super Administrador)

- Acceso completo al sistema
- Configuración de módulos
- Gestión de permisos

### Validaciones de Seguridad

- **Multi-tenancy**: Aislamiento completo por tenant
- **Validación de datos**: Zod schemas para todas las entradas
- **Autenticación JWT**: Tokens seguros para acceso
- **Autorización por roles**: Control granular de permisos
- **Auditoría**: Log de todas las acciones importantes

## 📈 Reportes y Analytics

### Dashboard Principal

- **Total de empleados**: Contador general
- **Empleados activos**: Solo empleados trabajando
- **Distribución por departamento**: Gráfico de barras
- **Estado de empleados**: Gráfico de pastel
- **Contrataciones recientes**: Lista de últimos 30 días
- **Próximos cumpleaños**: Lista de próximos 30 días

### Reportes de Nómina

- **Costo total de nómina**: Por período
- **Distribución de salarios**: Por departamento
- **Tendencias salariales**: Gráfico de líneas
- **Comparación de períodos**: Mes anterior vs actual

### Reportes de Vacaciones

- **Días de vacaciones utilizados**: Por empleado
- **Disponibilidad de vacaciones**: Por departamento
- **Patrones de vacaciones**: Por época del año
- **Tiempo promedio de aprobación**: Por tipo de vacación

### Reportes de Desempeño

- **Calificaciones promedio**: Por empleado
- **Distribución de calificaciones**: Histograma
- **Tendencias de desempeño**: Por período
- **Comparación entre departamentos**: Ranking

## 🔧 Configuración y Personalización

### Configuraciones del Módulo

- **enablePayrollManagement**: Gestión de nómina habilitada
- **enableVacationTracking**: Seguimiento de vacaciones habilitado
- **enablePerformanceReviews**: Evaluaciones de desempeño habilitadas
- **enableTimeTracking**: Control de tiempo habilitado
- **enableEmployeeSelfService**: Portal del empleado habilitado
- **enableAttendanceTracking**: Control de asistencia habilitado

### Campos Personalizables

- **employee_id**: ID de empleado personalizado
- **department**: Departamentos personalizados
- **position**: Cargos personalizados
- **employment_type**: Tipos de contrato personalizados
- **skills**: Habilidades personalizadas
- **emergency_contact**: Información de contacto de emergencia

### Workflows Automatizados

- **new_employee_welcome**: Bienvenida a nuevo empleado
- **vacation_approval**: Aprobación de vacaciones
- **payroll_reminder**: Recordatorio de nómina

## 🚀 Instalación y Configuración

### Prerequisitos

- Node.js 18+
- PostgreSQL 13+
- Redis 6+
- Prisma ORM

### Pasos de Instalación

1. **Migrar base de datos**:

   ```bash
   npm run prisma:migrate
   ```

2. **Poblar módulos**:

   ```bash
   npx ts-node prisma/seed-modules.ts
   ```

3. **Verificar instalación**:
   - Acceder a `/dashboard/hr`
   - Verificar que el módulo aparece en la lista
   - Crear un empleado de prueba

### Configuración Inicial

1. **Activar módulo RRHH**:
   - Ir a `/dashboard/modules`
   - Activar el módulo "Recursos Humanos"
   - Configurar permisos por rol

2. **Configurar departamentos**:
   - Personalizar lista de departamentos
   - Configurar jerarquías organizacionales

3. **Configurar tipos de contrato**:
   - Definir tipos de empleo
   - Configurar beneficios por tipo

## 📝 Casos de Uso

### Caso 1: Contratación de Nuevo Empleado

1. HR crea el registro del empleado
2. Sistema genera número de empleado único
3. Se envía email de bienvenida automáticamente
4. Se crea registro de nómina para el período actual
5. Se asigna supervisor y departamento

### Caso 2: Solicitud de Vacaciones

1. Empleado solicita vacaciones
2. Sistema verifica días disponibles
3. Se envía notificación al supervisor
4. Supervisor aprueba o rechaza
5. Se actualiza calendario de vacaciones
6. Se notifica al empleado

### Caso 3: Procesamiento de Nómina

1. HR inicia proceso de nómina
2. Sistema genera nóminas para empleados activos
3. Se calculan salarios y deducciones
4. Se valida información
5. Se procesan pagos
6. Se generan reportes

### Caso 4: Evaluación de Desempeño

1. Manager inicia evaluación
2. Se completan criterios de evaluación
3. Se calculan puntuaciones promedio
4. Se generan comentarios y objetivos
5. Se programa reunión de feedback
6. Se actualiza historial del empleado

## 🔮 Roadmap Futuro

### Versión 1.1

- [ ] Portal del empleado (self-service)
- [ ] Integración con sistemas de tiempo
- [ ] Notificaciones push
- [ ] Reportes avanzados con gráficos

### Versión 1.2

- [ ] Módulo de reclutamiento
- [ ] Gestión de capacitaciones
- [ ] Sistema de incentivos
- [ ] Integración con bancos para pagos

### Versión 1.3

- [ ] Inteligencia artificial para análisis
- [ ] Predicción de rotación de personal
- [ ] Optimización de horarios
- [ ] Integración con sistemas externos

## 📞 Soporte y Contacto

Para soporte técnico o consultas sobre el módulo RRHH:

- **Email**: soporte@metanoia.click
- **Documentación**: [docs.metanoia.click](https://docs.metanoia.click)
- **GitHub**: [github.com/metanoia/modulo-rrhh](https://github.com/metanoia/modulo-rrhh)

---

**© 2024 metanoia.click - Metanoia V1.0.1**
