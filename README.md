# 🚀 Metanoia V1.0.2 - Sistema ERP Modular SaaS

## 📋 Descripción

**Metanoia** es un sistema ERP modular SaaS multi-tenant diseñado para empresas que necesitan gestión integral de sus operaciones. El sistema incluye módulos especializados para diferentes industrias y puede escalarse según las necesidades del negocio.

## 🎯 Características Principales

### 🏗️ Arquitectura Multi-tenant

- **Separación por tenant**: Cada cliente tiene su propio espacio de datos
- **Configuración independiente**: Cada tenant puede personalizar sus módulos
- **Escalabilidad**: Soporte para miles de tenants simultáneos

### 🧩 Sistema Modular

- **Módulos independientes**: Cada módulo puede activarse/desactivarse
- **Configuración flexible**: Personalización por tenant
- **APIs RESTful**: Integración fácil con sistemas externos

## 📦 Módulos Disponibles

### 🎓 **Gestión de Colegios** (NUEVO)

- **Gestión de Estudiantes**: Registro, matrícula, historial académico
- **Gestión de Docentes**: Personal académico, horarios, evaluaciones
- **Gestión Académica**: Grados, secciones, materias, horarios
- **Control de Asistencia**: Registro diario, reportes, alertas
- **Gestión Financiera**: Pagos de matrícula, pensiones, servicios
- **Biblioteca Digital**: Catálogo, préstamos, devoluciones
- **Transporte Escolar**: Rutas, asignaciones, seguimiento
- **Comedor**: Menús, planes alimentarios, control nutricional
- **Disciplina**: Registro de incidentes, seguimiento
- **Portal de Padres**: Acceso a información de sus hijos

### 🏢 **Gestión de Ascensores**

- **Gestión de Clientes**: Empresas que requieren servicios
- **Instalaciones**: Proyectos de instalación de ascensores
- **Mantenimiento**: Contratos, programación, seguimiento
- **Inspecciones**: Checklist, certificaciones, reportes
- **Técnicos**: Personal especializado, certificaciones
- **Repuestos**: Inventario, compras, control de stock
- **Órdenes de Trabajo**: Asignación, seguimiento, completado

### 🖥️ **Gestión de Servidores**

- **Monitoreo**: Estado, métricas, alertas en tiempo real
- **Mantenimiento**: Programación, seguimiento, historial
- **Red**: Análisis de conectividad, configuración
- **Clientes**: Gestión de clientes de servicios de hosting
- **Usuarios**: Acceso y permisos del sistema

### 👥 **Recursos Humanos**

- **Empleados**: Registro, nómina, vacaciones
- **Evaluaciones**: Desempeño, objetivos, seguimiento
- **Capacitación**: Cursos, certificaciones, desarrollo

### 📊 **CRM y Ventas**

- **Clientes**: Gestión de relaciones comerciales
- **Leads**: Prospección, seguimiento, conversión
- **Oportunidades**: Pipeline de ventas, cierre

### 📦 **Inventario**

- **Productos**: Catálogo, stock, precios
- **Órdenes**: Pedidos, facturación, envíos
- **Reportes**: Análisis de ventas, stock bajo

## 🛠️ Stack Tecnológico

### Frontend

- **Next.js 14+** con App Router para SSR/SSG
- **React 18+** como framework principal
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos rápidos
- **shadcn/ui** para componentes modernos
- **React Hook Form + Zod** para formularios
- **TanStack Query** para gestión de estado

### Backend

- **Node.js + Express** para API REST
- **Prisma ORM** para base de datos
- **PostgreSQL** como base de datos principal
- **Redis** para cache y sesiones
- **JWT** para autenticación
- **Bcrypt** para hashing seguro

### Infraestructura

- **Docker + Docker Compose** para containerización
- **Nginx** como proxy reverso
- **AWS/Vercel** para hosting
- **Stripe** para pagos SaaS
- **SendGrid/Resend** para emails

### Herramientas de Desarrollo

- **ESLint + Prettier** para linting
- **Husky + lint-staged** para Git hooks
- **Jest + Testing Library** para testing
- **Storybook** para documentación

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (opcional)

### Instalación Local

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/Metanoia.v1.0.2.git
cd Metanoia.v1.0.2
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp env.example .env.local
# Editar .env.local con tus configuraciones
```

4. **Configurar base de datos**

```bash
# Iniciar PostgreSQL y Redis
docker-compose up -d postgres redis

# Ejecutar migraciones
npm run prisma:migrate

# Poblar datos iniciales
npm run prisma:seed
```

5. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

## 📊 Estructura del Proyecto

```
Metanoia_v1.0.2/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # APIs REST
│   │   ├── dashboard/         # Páginas del dashboard
│   │   └── login/            # Página de login
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/              # Componentes base
│   │   ├── modules/         # Componentes de módulos
│   │   └── elevators/       # Componentes específicos
│   ├── lib/                 # Utilidades y servicios
│   │   ├── services/        # Servicios de base de datos
│   │   ├── validations/     # Schemas Zod
│   │   └── modules/         # Sistema de módulos
│   ├── hooks/               # React hooks personalizados
│   └── types/               # Tipos TypeScript
├── prisma/                  # Schema y migraciones
├── docs/                    # Documentación técnica
├── scripts/                 # Scripts de utilidad
└── docker/                  # Configuración Docker
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build de producción
npm run start           # Servidor de producción

# Base de datos
npm run prisma:generate # Generar cliente Prisma
npm run prisma:migrate  # Ejecutar migraciones
npm run prisma:seed     # Poblar datos iniciales

# Testing
npm run test            # Ejecutar tests
npm run test:watch      # Tests en modo watch

# Linting
npm run lint            # Ejecutar ESLint
npm run lint:fix        # Corregir errores automáticamente
npm run format          # Formatear con Prettier
```

## 🎯 Módulo de Colegios - Funcionalidades

### 📚 Gestión Académica

- **Grados y Secciones**: Organización por niveles educativos
- **Materias**: Asignaturas por grado y sección
- **Horarios**: Planificación de clases
- **Matrículas**: Proceso de inscripción
- **Calificaciones**: Sistema de evaluación

### 👨‍🎓 Gestión de Estudiantes

- **Registro**: Datos personales y académicos
- **Historial**: Seguimiento académico completo
- **Asistencia**: Control diario de presencia
- **Disciplina**: Registro de incidentes
- **Padres**: Información de contacto

### 👨‍🏫 Gestión de Docentes

- **Personal**: Registro de docentes
- **Asignaciones**: Materias y secciones
- **Evaluaciones**: Desempeño docente
- **Horarios**: Disponibilidad y carga

### 💰 Gestión Financiera

- **Matrícula**: Pagos de inscripción
- **Pensiones**: Pagos mensuales
- **Servicios**: Transporte, comedor, biblioteca
- **Reportes**: Estados de cuenta, morosidad

### 🏫 Servicios Auxiliares

- **Biblioteca**: Catálogo digital, préstamos
- **Transporte**: Rutas, asignaciones, seguimiento
- **Comedor**: Menús, planes nutricionales
- **Notificaciones**: Alertas automáticas

## 📈 Valor Comercial

### 💼 Precios Sugeridos por Módulo

- **Módulo de Colegios**: $500-1000/mes
- **Módulo de Ascensores**: $300-800/mes
- **Módulo de Servidores**: $200-500/mes
- **Sistema Completo**: $2000-5000/mes

### 🎯 Mercado Objetivo

- **Colegios privados**: 500-2000 estudiantes
- **Empresas de ascensores**: Mantenimiento e instalación
- **Proveedores de hosting**: Gestión de servidores
- **Empresas medianas**: Necesidades ERP completas

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Desarrollador**: Juan
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [tu-usuario]
- **Proyecto**: [https://github.com/tu-usuario/Metanoia.v1.0.2]

## 🙏 Agradecimientos

- Next.js team por el framework
- Prisma team por el ORM
- Tailwind CSS por el sistema de estilos
- shadcn/ui por los componentes
- La comunidad de desarrolladores

---

**© 2024 Metanoia.click - Sistema ERP Modular SaaS**
