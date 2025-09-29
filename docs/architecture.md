# Arquitectura de Metanoia V1.0.1

## Visión General

Metanoia V1.0.1 es un sistema ERP SaaS modular con arquitectura multi-tenant, diseñado para escalabilidad, seguridad y mantenibilidad. La arquitectura sigue los principios de Domain-Driven Design (DDD) y Clean Architecture.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTE                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Web App   │  │  Mobile App │  │  Desktop    │            │
│  │  (Next.js)  │  │   (React)   │  │   (Electron)│            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS/REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX PROXY                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Load Balancer | SSL Termination | Rate Limiting       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  APLICACIÓN NEXT.JS                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Frontend  │  │   API Routes│  │   Server    │            │
│  │   (React)   │  │  (Next.js)  │  │ Components │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Auth      │  │  Multi-     │  │   Modules   │            │
│  │ Middleware  │  │  Tenant     │  │ (CRM, Inv,  │            │
│  │             │  │ Middleware  │  │  Acc, etc)  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  PostgreSQL │  │    Redis    │  │   Prisma    │            │
│  │ (Multi-Tenant│  │   (Cache)   │  │    ORM      │            │
│  │   Schemas)  │  │             │  │             │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend)

**Tecnologías**: Next.js 14, React 18, TypeScript, Tailwind CSS

**Responsabilidades**:

- Interfaz de usuario responsive
- Gestión de estado del cliente (TanStack Query)
- Formularios y validación (React Hook Form + Zod)
- Componentes UI reutilizables (shadcn/ui)

**Estructura**:

```
src/app/
├── (auth)/              # Rutas de autenticación
├── (dashboard)/         # Rutas del dashboard
├── api/                 # API Routes de Next.js
├── globals.css          # Estilos globales
├── layout.tsx           # Layout principal
└── page.tsx             # Página de inicio
```

### 2. Capa de Aplicación (API)

**Tecnologías**: Next.js API Routes, Express/Fastify

**Responsabilidades**:

- Endpoints REST
- Middleware de autenticación
- Middleware multi-tenant
- Validación de entrada
- Rate limiting

**Estructura**:

```
src/server/
├── middleware/          # Middlewares personalizados
├── routes/              # Definición de rutas
├── controllers/         # Controladores de API
├── services/            # Lógica de negocio
└── utils/               # Utilidades del servidor
```

### 3. Capa de Dominio (Business Logic)

**Tecnologías**: TypeScript, Prisma

**Responsabilidades**:

- Lógica de negocio
- Validaciones de dominio
- Reglas de negocio
- Eventos de dominio

**Módulos**:

- **CRM**: Gestión de clientes y contactos
- **Inventario**: Control de productos y stock
- **Facturación**: Órdenes, facturas y pagos
- **Contabilidad**: Reportes financieros
- **Usuarios**: Gestión de usuarios y permisos

### 4. Capa de Infraestructura (Data)

**Tecnologías**: PostgreSQL, Redis, Prisma ORM

**Responsabilidades**:

- Persistencia de datos
- Cache
- Migraciones de base de datos
- Multi-tenancy

## Multi-Tenancy

### Estrategia de Separación

Metanoia implementa multi-tenancy usando **separación por schema**:

```
PostgreSQL Database: metanoia
├── public (schema global)
│   ├── tenants
│   └── migrations
├── tenant_1 (schema específico)
│   ├── users
│   ├── customers
│   ├── products
│   └── orders
└── tenant_2 (schema específico)
    ├── users
    ├── customers
    ├── products
    └── orders
```

### Identificación de Tenant

1. **Por Dominio**: `tenant1.metanoia.click`
2. **Por Subdirectorio**: `metanoia.click/tenant1`
3. **Por Header**: `X-Tenant-ID: tenant1`
4. **Por Token JWT**: Incluye información del tenant

### Middleware Multi-Tenant

```typescript
// src/server/middleware/tenant.ts
export function tenantMiddleware(req: Request) {
  const tenantId = extractTenantFromRequest(req)
  const tenant = await getTenant(tenantId)

  // Configurar Prisma para usar schema del tenant
  req.prisma = createPrismaClient(tenant.schema)

  return tenant
}
```

## Seguridad

### Autenticación

- **JWT Tokens**: Access tokens (15 min) + Refresh tokens (7 días)
- **Bcrypt**: Hashing de contraseñas con salt
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **CORS**: Configuración restrictiva

### Autorización

- **RBAC**: Role-Based Access Control
- **Permisos Granulares**: Por módulo y acción
- **Multi-Tenant**: Aislamiento completo entre tenants

### Validación y Sanitización

- **Zod**: Validación de esquemas de entrada
- **Helmet**: Headers de seguridad
- **XSS Protection**: Sanitización de datos
- **SQL Injection**: Prevención con Prisma ORM

## Escalabilidad

### Horizontal Scaling

- **Load Balancer**: Nginx como proxy reverso
- **Stateless**: Sin estado en el servidor
- **Microservicios**: Preparado para separación futura
- **CDN**: Para assets estáticos

### Vertical Scaling

- **Database Optimization**: Índices y consultas optimizadas
- **Caching**: Redis para cache de aplicaciones
- **Connection Pooling**: Pool de conexiones a BD
- **Lazy Loading**: Carga diferida de componentes

### Monitoring y Observabilidad

- **Sentry**: Error tracking y performance
- **Posthog**: Analytics de usuario
- **LogRocket**: Session replay
- **Prometheus**: Métricas del sistema

## Patrones de Diseño

### 1. Repository Pattern

```typescript
// src/server/repositories/BaseRepository.ts
export abstract class BaseRepository<T> {
  constructor(protected prisma: PrismaClient) {}

  abstract create(data: CreateInput): Promise<T>
  abstract findById(id: string): Promise<T | null>
  abstract update(id: string, data: UpdateInput): Promise<T>
  abstract delete(id: string): Promise<void>
}
```

### 2. Service Layer Pattern

```typescript
// src/server/services/CustomerService.ts
export class CustomerService {
  constructor(
    private customerRepo: CustomerRepository,
    private tenantService: TenantService
  ) {}

  async createCustomer(data: CreateCustomerInput): Promise<Customer> {
    // Lógica de negocio
    const customer = await this.customerRepo.create(data)

    // Eventos de dominio
    await this.eventBus.publish(new CustomerCreatedEvent(customer))

    return customer
  }
}
```

### 3. Factory Pattern

```typescript
// src/server/factories/PrismaFactory.ts
export class PrismaFactory {
  static createForTenant(tenantId: string): PrismaClient {
    const schema = `tenant_${tenantId}`
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL.replace('public', schema),
        },
      },
    })
  }
}
```

## Event-Driven Architecture

### Domain Events

```typescript
// src/server/events/CustomerEvents.ts
export class CustomerCreatedEvent {
  constructor(
    public readonly customer: Customer,
    public readonly tenantId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class CustomerUpdatedEvent {
  constructor(
    public readonly customer: Customer,
    public readonly changes: Partial<Customer>,
    public readonly tenantId: string
  ) {}
}
```

### Event Bus

```typescript
// src/server/events/EventBus.ts
export class EventBus {
  async publish(event: DomainEvent): Promise<void> {
    // Publicar evento
    await this.redis.publish('events', JSON.stringify(event))

    // Log para auditoría
    await this.auditLogger.log(event)
  }
}
```

## Testing Strategy

### Unit Tests

- **Jest**: Framework de testing
- **Testing Library**: Testing de componentes
- **Mocks**: Para dependencias externas

### Integration Tests

- **Supertest**: Testing de APIs
- **Test Database**: Base de datos de pruebas
- **Docker**: Contenedores para tests

### E2E Tests

- **Playwright**: Testing end-to-end
- **Cypress**: Alternativa para E2E

## Deployment

### Docker

```dockerfile
# Multi-stage build
FROM node:18-alpine AS base
FROM base AS deps
FROM base AS builder
FROM base AS runner

# Optimizaciones de seguridad y performance
USER nextjs
EXPOSE 3000
```

### CI/CD Pipeline

1. **Lint & Test**: ESLint, Prettier, Jest
2. **Build**: Next.js build + Prisma generate
3. **Security Scan**: Dependency audit
4. **Deploy**: Docker build + push
5. **Health Check**: Verificación de salud

### Environment Strategy

- **Development**: Local con Docker Compose
- **Staging**: Vercel preview deployments
- **Production**: AWS ECS/EKS con RDS

## Performance

### Frontend Optimizations

- **Code Splitting**: Lazy loading de rutas
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Caching**: Service Workers + Cache API

### Backend Optimizations

- **Database Indexing**: Índices optimizados
- **Query Optimization**: N+1 problem prevention
- **Connection Pooling**: Pool de conexiones
- **Redis Caching**: Cache de consultas frecuentes

### Monitoring

- **Core Web Vitals**: Métricas de performance
- **Database Performance**: Query analysis
- **API Response Times**: Latencia de endpoints
- **Error Rates**: Tasa de errores

---

Esta arquitectura está diseñada para ser **escalable**, **mantenible** y **segura**, siguiendo las mejores prácticas de la industria para sistemas SaaS multi-tenant.
