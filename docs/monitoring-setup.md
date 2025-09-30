# Sistema de Monitoreo Metanoia ERP

## 📊 Visión General

Este documento describe la implementación del sistema de monitoreo con **Prometheus + Grafana** para Metanoia ERP, que proporciona visibilidad completa del rendimiento y salud del sistema.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Metanoia App  │    │   Prometheus    │    │     Grafana     │
│   (Next.js)     │───▶│   (Metrics)     │───▶│ (Visualization) │
│   /api/metrics  │    │   Port: 9090    │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose instalados
- Node.js 18+ para desarrollo local

### 1. Instalación de Dependencias

```bash
npm install prom-client
```

### 2. Configuración de Docker Compose

El archivo `docker-compose.yml` incluye los siguientes servicios:

- **Prometheus**: Puerto 9090
- **Grafana**: Puerto 3001
- **Metanoia App**: Puerto 3000

### 3. Iniciar el Sistema de Monitoreo

```bash
# Iniciar todos los servicios
docker-compose up -d

# Verificar que todos los servicios estén corriendo
docker-compose ps
```

## 📈 Métricas Disponibles

### Métricas de Node.js (Automáticas)
- `metanoia_process_cpu_user_seconds_total` - CPU usage
- `metanoia_process_resident_memory_bytes` - Memoria residente
- `metanoia_process_heap_bytes` - Heap size
- `metanoia_nodejs_eventloop_lag_seconds` - Event loop lag
- `metanoia_nodejs_gc_duration_seconds` - Garbage collection time

### Métricas HTTP Personalizadas
- `metanoia_http_requests_total` - Total de requests HTTP
- `metanoia_http_request_duration_seconds` - Duración de requests
- `metanoia_http_request_errors_total` - Errores HTTP
- `metanoia_api_response_time_seconds` - Tiempo de respuesta de API
- `metanoia_api_errors_total` - Errores de API

### Métricas de Negocio
- `metanoia_tenants_total` - Total de tenants
- `metanoia_users_total` - Total de usuarios
- `metanoia_active_users` - Usuarios activos (última hora)
- `metanoia_customers_total` - Clientes por tenant
- `metanoia_products_total` - Productos por tenant
- `metanoia_orders_total` - Órdenes por tenant
- `metanoia_revenue_total` - Revenue por tenant

### Métricas de Sistema
- `metanoia_active_connections` - Conexiones activas
- `metanoia_database_connections` - Conexiones a BD

## 🔧 Configuración

### Prometheus (Puerto 9090)

**URL**: http://localhost:9090

**Configuración**: `docker/prometheus/prometheus.yml`

**Targets configurados**:
- `metanoia-app`: http://app:3000/api/metrics
- `prometheus`: http://localhost:9090/metrics

### Grafana (Puerto 3001)

**URL**: http://localhost:3001

**Credenciales**:
- Usuario: `admin`
- Contraseña: `metanoia_grafana_2025`

**Dashboards incluidos**:
- Metanoia ERP - System Overview
- Métricas de Node.js
- Métricas de negocio por tenant

## 📊 Uso de Métricas en el Código

### Ejemplo: Registrar tiempo de respuesta de API

```typescript
import { recordApiResponseTime, recordError } from '@/app/api/metrics/route'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Tu lógica de API aquí
    const result = await processRequest(request)
    
    // Registrar tiempo de respuesta
    const duration = (Date.now() - startTime) / 1000
    recordApiResponseTime('/api/example', 'POST', duration, tenantId)
    
    return NextResponse.json(result)
  } catch (error) {
    // Registrar error
    recordError('/api/example', 'processing_error', tenantId)
    throw error
  }
}
```

### Ejemplo: Middleware para métricas automáticas

```typescript
import { captureMetrics } from '@/app/api/metrics/route'

export function metricsMiddleware(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const startTime = Date.now()
    
    try {
      const result = await handler(req, res)
      captureMetrics(req, startTime)
      return result
    } catch (error) {
      captureMetrics(req, startTime)
      throw error
    }
  }
}
```

## 📋 Consultas Prometheus Útiles

### Requests por segundo
```promql
rate(metanoia_http_requests_total[5m])
```

### Tiempo de respuesta promedio
```promql
histogram_quantile(0.95, rate(metanoia_http_request_duration_seconds_bucket[5m]))
```

### Usuarios activos por tenant
```promql
metanoia_active_users
```

### Revenue total del sistema
```promql
sum(metanoia_revenue_total)
```

### Errores por endpoint
```promql
rate(metanoia_api_errors_total[5m])
```

## 🚨 Alertas (Próximamente)

### Alertas Planificadas
- Alto uso de CPU (>80%)
- Alta latencia de respuesta (>2s)
- Muchos errores HTTP (>5% error rate)
- Bajo número de usuarios activos
- Conexiones de BD agotadas

### Configuración de Alertas
```yaml
# docker/prometheus/alerts.yml
groups:
  - name: metanoia-alerts
    rules:
      - alert: HighCPUUsage
        expr: metanoia_process_cpu_user_seconds_total > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
```

## 🔍 Troubleshooting

### Verificar métricas del endpoint
```bash
curl http://localhost:3000/api/metrics
```

### Verificar Prometheus targets
1. Ir a http://localhost:9090/targets
2. Verificar que `metanoia-app` esté "UP"

### Verificar Grafana datasource
1. Ir a http://localhost:3001/datasources
2. Verificar que Prometheus esté configurado correctamente

### Logs de contenedores
```bash
# Logs de Prometheus
docker-compose logs prometheus

# Logs de Grafana
docker-compose logs grafana

# Logs de la aplicación
docker-compose logs app
```

## 📚 Recursos Adicionales

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client Documentation](https://github.com/siimon/prom-client)
- [Node.js Metrics](https://prometheus.io/docs/guides/node-exporter/)

## 🎯 Próximos Pasos

1. **Implementar alertas** con Alertmanager
2. **Agregar métricas de base de datos** (PostgreSQL, Redis)
3. **Crear dashboards específicos** por módulo
4. **Implementar métricas de negocio** más detalladas
5. **Configurar SLA/SLO** y alertas correspondientes
6. **Agregar métricas de infraestructura** (Docker, sistema)

## 🔐 Seguridad

- Grafana está configurado con autenticación básica
- Prometheus está expuesto solo en la red interna de Docker
- Considera usar HTTPS en producción
- Implementa autenticación adicional para Grafana en producción
