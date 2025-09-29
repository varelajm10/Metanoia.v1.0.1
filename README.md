# Metanoia V1.0.1 - Sistema ERP SaaS Modular

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)

Sistema ERP SaaS modular con arquitectura multi-tenant, diseñado para escalabilidad, seguridad y mantenibilidad.

## 🚀 Características Principales

- **Multi-Tenant**: Arquitectura multi-tenant con separación por schema para máxima seguridad
- **Modular**: Módulos independientes (CRM, Inventario, Contabilidad, etc.)
- **Escalable**: Diseñado para crecer con tu negocio
- **Seguro**: Autenticación JWT, encriptación de datos y mejores prácticas de seguridad
- **Responsive**: Diseño mobile-first con UI moderna
- **API-First**: Documentación OpenAPI/Swagger integrada

## 🛠 Stack Tecnológico

### Frontend

- **Next.js 14+** con App Router para SSR/SSG y SEO optimizado
- **React 18+** como framework principal
- **TypeScript** para tipado estático y mejor DX
- **Tailwind CSS** para estilos rápidos y consistentes
- **shadcn/ui** para componentes UI modernos y accesibles
- **React Hook Form + Zod** para manejo de formularios y validación
- **TanStack Query** para gestión de estado del servidor

### Backend

- **Node.js + Express/Fastify** para API REST
- **Prisma ORM** para base de datos y migraciones
- **PostgreSQL** como base de datos principal (optimizada para multi-tenant)
- **Redis** para cache y gestión de sesiones
- **JWT** para autenticación
- **Bcrypt** para hashing seguro de contraseñas

### Multi-Tenant & Infraestructura

- **Docker + Docker Compose** para containerización
- **Nginx** como proxy reverso y load balancer
- **AWS/Vercel** para hosting y despliegue
- **Stripe** para pagos y suscripciones SaaS
- **SendGrid/Resend** para emails transaccionales

### Herramientas de Desarrollo

- **ESLint + Prettier** para linting y formateo de código
- **Husky + lint-staged** para Git hooks automáticos
- **Jest + Testing Library** para testing unitario e integración
- **Storybook** para documentación de componentes

### Monitoreo y Analytics

- **Sentry** para error tracking y monitoring
- **Posthog/Mixpanel** para analytics de usuario
- **LogRocket** para session replay y debugging

## 📋 Prerrequisitos

- Node.js 18+
- npm 8+
- Docker y Docker Compose
- PostgreSQL 15+
- Redis 7+

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/your-org/metanoia-v1.git
cd metanoia-v1
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp env.example .env.local
```

Edita el archivo `.env.local` con tus configuraciones:

```env
# Base de datos
DATABASE_URL="postgresql://metanoia_user:metanoia_password@localhost:5432/metanoia"

# Redis
REDIS_URL="redis://localhost:6379"

# Autenticación JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Stripe (Pagos)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (SendGrid/Resend)
EMAIL_FROM="noreply@metanoia.click"
SENDGRID_API_KEY="SG..."
RESEND_API_KEY="re_..."
```

### 4. Configurar base de datos

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar base de datos con datos de ejemplo
npm run prisma:seed
```

### 5. Iniciar servicios con Docker

```bash
# Iniciar PostgreSQL y Redis
docker-compose up -d postgres redis

# O iniciar todos los servicios
docker-compose up -d
```

### 6. Iniciar la aplicación en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📚 Scripts Disponibles

### Desarrollo

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción
```

### Base de Datos

```bash
npm run prisma:generate  # Generar cliente de Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Poblar base de datos
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:reset     # Resetear base de datos
npm run db:setup         # Configurar base de datos completa
```

### Testing

```bash
npm run test         # Ejecutar tests
npm run test:watch   # Ejecutar tests en modo watch
npm run test:coverage # Ejecutar tests con coverage
```

### Linting y Formateo

```bash
npm run lint         # Ejecutar ESLint
npm run lint:fix     # Ejecutar ESLint con autofix
npm run format       # Formatear código con Prettier
npm run format:check # Verificar formateo
npm run type-check   # Verificar tipos de TypeScript
```

### Storybook

```bash
npm run storybook        # Iniciar Storybook
npm run build-storybook  # Construir Storybook
```

## 🏗 Arquitectura

### Estructura del Proyecto

```
metanoia-v1/
├── src/
│   ├── app/                 # App Router de Next.js
│   ├── components/          # Componentes React
│   │   └── ui/             # Componentes UI de shadcn
│   ├── lib/                # Utilidades y configuración
│   ├── hooks/              # Custom hooks
│   ├── types/              # Definiciones de tipos
│   ├── utils/              # Funciones utilitarias
│   └── server/             # Lógica del servidor
├── prisma/                 # Schema y migraciones
├── docs/                   # Documentación
├── tests/                  # Tests
├── storybook/              # Configuración de Storybook
├── docker/                 # Configuración de Docker
└── .storybook/             # Configuración de Storybook
```

### Multi-Tenancy

El sistema implementa multi-tenancy usando:

1. **Separación por Schema**: Cada tenant tiene su propio schema en PostgreSQL
2. **Middleware de Tenant**: Middleware que identifica el tenant basado en el dominio o header
3. **Context de Tenant**: Context React para manejar el tenant actual
4. **Filtrado Automático**: Prisma filtra automáticamente por tenant

### Módulos del Sistema

- **CRM**: Gestión de clientes, contactos y oportunidades
- **Inventario**: Control de productos, stock y movimientos
- **Facturación**: Órdenes, facturas y pagos
- **Contabilidad**: Reportes financieros y análisis
- **Usuarios**: Gestión de usuarios y permisos
- **Configuración**: Configuración del sistema y tenant

## 🔐 Seguridad

- **Autenticación JWT** con refresh tokens
- **Autorización basada en roles** (RBAC)
- **Encriptación de contraseñas** con bcrypt
- **Rate limiting** para prevenir ataques
- **CORS** configurado correctamente
- **Headers de seguridad** con Helmet
- **Validación de entrada** con Zod
- **Sanitización de datos** para prevenir XSS

## 🧪 Testing

El proyecto incluye:

- **Unit Tests** con Jest y Testing Library
- **Integration Tests** para APIs
- **Component Tests** con Storybook
- **E2E Tests** (opcional con Playwright)
- **Coverage Reports** con umbrales mínimos

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 📦 Despliegue

### Docker

```bash
# Construir imagen
docker build -t metanoia-v1 .

# Ejecutar contenedor
docker run -p 3000:3000 metanoia-v1
```

### Docker Compose

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### AWS

1. Configurar ECS/EKS
2. Usar RDS para PostgreSQL
3. Usar ElastiCache para Redis
4. Configurar Load Balancer

## 📖 Documentación

- [Guía de Desarrollo](docs/development.md)
- [API Documentation](docs/api.md)
- [Arquitectura](docs/architecture.md)
- [Multi-Tenancy](docs/multi-tenancy.md)
- [Seguridad](docs/security.md)
- [Despliegue](docs/deployment.md)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar TypeScript estricto
- Seguir las reglas de ESLint y Prettier
- Escribir tests para nuevas funcionalidades
- Documentar APIs y componentes
- Usar conventional commits

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Documentación**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/metanoia-v1/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/your-org/metanoia-v1/discussions)
- **Email**: support@metanoia.click

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://prisma.io/) - ORM para TypeScript
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vercel](https://vercel.com/) - Plataforma de despliegue

---

**© 2025 metanoia.click - Metanoia V1.0.1**
