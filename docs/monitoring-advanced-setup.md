# Sistema de Monitoreo Avanzado - Metanoia ERP

## 🎯 Visión General

Este documento describe la implementación completa del sistema de monitoreo avanzado con **Prometheus + Grafana + Alertmanager** para Metanoia ERP, incluyendo métricas de infraestructura, base de datos, negocio y SLA/SLO.

## 🏗️ Arquitectura Completa

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Metanoia App  │    │   Prometheus    │    │     Grafana     │
│   (Next.js)     │───▶│   (Metrics)     │───▶│ (Visualization) │
│   /api/metrics  │    │   Port: 9090    │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │  Alertmanager   │              │
         │              │   Port: 9093    │              │
         │              └─────────────────┘              │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │      Redis      │    │   Node/CAdvisor │
│   Exporter      │    │    Exporter     │    │    Exporters    │
│   Port: 9187    │    │   Port: 9121    │    │  Ports: 9100,   │
└─────────────────┘    └─────────────────┘    │      8080       │
                                               └─────────────────┘
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Docker y Docker Compose instalados
- Node.js 18+ para desarrollo local
- Puertos disponibles: 3000, 3001, 9090, 9093, 9187, 9121, 9100, 8080

### Instalación Automática

```bash
# Ejecutar script de configuración
./scripts/setup-monitoring.sh

# O manualmente:
docker-compose up -d
```

### Verificación de Servicios

```bash
# Verificar estado de todos los servicios
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs -f prometheus
docker-compose logs -f grafana
docker-compose logs -f alertmanager
```

## 📊 Métricas Disponibles

### **Métricas de Aplicación (Metanoia ERP)**
- `metanoia_process_cpu_user_seconds_total` - CPU usage
- `metanoia_process_resident_memory_bytes` - Memoria residente
- `metanoia_process_heap_bytes` - Heap size
- `metanoia_nodejs_eventloop_lag_seconds` - Event loop lag
- `metanoia_http_requests_total` - Total de requests HTTP
- `metanoia_http_request_duration_seconds` - Duración de requests
- `metanoia_tenants_total` - Total de tenants
- `metanoia_users_total` - Total de usuarios
- `metanoia_active_users` - Usuarios activos
- `metanoia_customers_total` - Clientes por tenant
- `metanoia_products_total` - Productos por tenant
- `metanoia_orders_total` - Órdenes por tenant
- `metanoia_revenue_total` - Revenue por tenant

### **Métricas de Base de Datos (PostgreSQL)**
- `pg_stat_database_numbackends` - Conexiones activas
- `pg_stat_database_xact_commit` - Transacciones confirmadas
- `pg_stat_database_xact_rollback` - Transacciones revertidas
- `pg_database_size_bytes` - Tamaño de base de datos
- `pg_stat_database_tup_returned` - Tuplas retornadas
- `pg_stat_database_tup_fetched` - Tuplas obtenidas

### **Métricas de Cache (Redis)**
- `redis_connected_clients` - Clientes conectados
- `redis_commands_processed_total` - Comandos procesados
- `redis_keyspace_hits_total` - Hits en keyspace
- `redis_keyspace_misses_total` - Misses en keyspace
- `redis_memory_used_bytes` - Memoria usada

### **Métricas de Sistema (Node Exporter)**
- `node_cpu_seconds_total` - Uso de CPU por core
- `node_memory_MemTotal_bytes` - Memoria total del sistema
- `node_memory_MemAvailable_bytes` - Memoria disponible
- `node_filesystem_size_bytes` - Tamaño de filesystem
- `node_filesystem_free_bytes` - Espacio libre en disco
- `node_load1`, `node_load5`, `node_load15` - Load average

### **Métricas de Contenedores (cAdvisor)**
- `container_cpu_usage_seconds_total` - CPU usage por contenedor
- `container_memory_usage_bytes` - Memoria por contenedor
- `container_network_receive_bytes_total` - Network RX
- `container_network_transmit_bytes_total` - Network TX
- `container_fs_usage_bytes` - Uso de filesystem por contenedor

## 🎛️ Dashboards Disponibles

### **1. Metanoia ERP - System Overview**
- **URL**: http://localhost:3001/d/metanoia-erp-overview
- **Descripción**: Dashboard principal con métricas generales del sistema
- **Métricas**: HTTP requests, response time, usuarios, tenants, revenue

### **2. Database Monitoring - PostgreSQL & Redis**
- **URL**: http://localhost:3001/d/database-monitoring
- **Descripción**: Monitoreo específico de bases de datos
- **Métricas**: Conexiones, transacciones, memoria, performance

### **3. Infrastructure Monitoring - System & Docker**
- **URL**: http://localhost:3001/d/infrastructure-monitoring
- **Descripción**: Monitoreo de infraestructura y contenedores
- **Métricas**: CPU, memoria, disco, network, contenedores Docker

### **4. Business Metrics - ERP KPIs**
- **URL**: http://localhost:3001/d/business-metrics
- **Descripción**: Métricas de negocio y KPIs del ERP
- **Métricas**: Usuarios, clientes, productos, órdenes, revenue por tenant

### **5. SLA/SLO Monitoring - Service Level Objectives**
- **URL**: http://localhost:3001/d/sla-slo-monitoring
- **Descripción**: Monitoreo de objetivos de nivel de servicio
- **Métricas**: Disponibilidad, latencia, error rate, cumplimiento SLA

## 🚨 Sistema de Alertas

### **Alertmanager**
- **URL**: http://localhost:9093
- **Configuración**: `docker/alertmanager/alertmanager.yml`
- **Características**:
  - Rutas de alertas por severidad
  - Inhibiciones para evitar spam
  - Múltiples canales de notificación (email, Slack, webhook)

### **Reglas de Alertas**
- **Archivo**: `docker/prometheus/alerts.yml`
- **Categorías**:
  - Sistema: CPU, memoria, event loop
  - HTTP/API: Latencia, error rate, throughput
  - Base de datos: Conexiones, performance
  - Negocio: Usuarios activos, revenue
  - SLA/SLO: Cumplimiento de objetivos

### **Tipos de Alertas**
- **Critical**: Requieren acción inmediata (< 5 min)
- **Warning**: Requieren atención pronto (< 30 min)
- **Info**: Informativas, para seguimiento

## 📈 SLA/SLO Configurados

### **Service Level Objectives (SLOs)**
- **Disponibilidad**: 99.9% uptime
- **Latencia**: P95 < 1 segundo
- **Error Rate**: < 0.1%
- **Throughput**: > 100 requests/segundo

### **Service Level Agreements (SLAs)**
- **Disponibilidad**: 99.9% uptime mensual
- **Rendimiento**: P95 < 1s para 95% de requests
- **Soporte**: Respuesta < 4h para incidentes críticos

## 🔧 Configuración Avanzada

### **Prometheus**
```yaml
# docker/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'metanoia-app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: /api/metrics
    scrape_interval: 10s
```

### **Grafana Datasources**
```yaml
# docker/grafana/provisioning/datasources/prometheus.yml
datasources:
  - name: Prometheus
    type: prometheus
    url: http://prometheus:9090
    isDefault: true
```

### **Alertmanager**
```yaml
# docker/alertmanager/alertmanager.yml
route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  repeat_interval: 1h
  receiver: 'web.hook'
```

## 📋 Consultas Prometheus Útiles

### **Disponibilidad**
```promql
# Disponibilidad actual
(rate(metanoia_http_requests_total{status_code!~"5.."}[1h]) / rate(metanoia_http_requests_total[1h])) * 100

# Disponibilidad por endpoint
(rate(metanoia_http_requests_total{status_code!~"5..",route="/api/customers"}[1h]) / rate(metanoia_http_requests_total{route="/api/customers"}[1h])) * 100
```

### **Latencia**
```promql
# P95 latencia
histogram_quantile(0.95, rate(metanoia_http_request_duration_seconds_bucket[5m]))

# Latencia promedio
rate(metanoia_http_request_duration_seconds_sum[5m]) / rate(metanoia_http_request_duration_seconds_count[5m])
```

### **Error Rate**
```promql
# Error rate total
rate(metanoia_http_request_errors_total[5m]) / rate(metanoia_http_requests_total[5m])

# Error rate por endpoint
rate(metanoia_http_request_errors_total{route="/api/orders"}[5m]) / rate(metanoia_http_requests_total{route="/api/orders"}[5m])
```

### **Métricas de Negocio**
```promql
# Revenue total
sum(metanoia_revenue_total)

# Usuarios activos por tenant
metanoia_active_users

# Crecimiento de clientes
increase(metanoia_customers_total[1d])
```

## 🔍 Troubleshooting

### **Problemas Comunes**

#### **Prometheus no puede scrapear métricas**
```bash
# Verificar que la aplicación esté corriendo
curl http://localhost:3000/api/metrics

# Verificar targets en Prometheus
curl http://localhost:9090/api/v1/targets
```

#### **Grafana no muestra datos**
```bash
# Verificar datasources
curl http://localhost:3001/api/datasources

# Verificar que Prometheus esté respondiendo
curl http://localhost:9090/api/v1/query?query=up
```

#### **Alertmanager no envía alertas**
```bash
# Verificar configuración
curl http://localhost:9093/api/v1/status

# Verificar rutas de alertas
curl http://localhost:9093/api/v1/alerts
```

### **Logs de Debugging**
```bash
# Logs de Prometheus
docker-compose logs -f prometheus

# Logs de Grafana
docker-compose logs -f grafana

# Logs de Alertmanager
docker-compose logs -f alertmanager

# Logs de la aplicación
docker-compose logs -f app
```

## 📚 Recursos Adicionales

### **Documentación**
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Node Exporter](https://github.com/prometheus/node_exporter)
- [cAdvisor](https://github.com/google/cadvisor)

### **Plugins de Grafana**
- `grafana-piechart-panel` - Gráficos de pastel
- `grafana-worldmap-panel` - Mapas mundiales
- `grafana-clock-panel` - Reloj personalizado
- `grafana-datatable-panel` - Tablas de datos

### **Alertas Recomendadas**
- CPU usage > 80%
- Memory usage > 90%
- Disk usage > 85%
- Error rate > 1%
- Response time P95 > 2s
- Database connections > 80%
- Low active users < 10

## 🎯 Próximos Pasos

### **Mejoras Planificadas**
1. **Machine Learning**: Predicción de SLA usando ML
2. **Anomaly Detection**: Detección automática de anomalías
3. **Auto-scaling**: Escalado automático basado en métricas
4. **Cost Monitoring**: Monitoreo de costos de infraestructura
5. **Security Monitoring**: Monitoreo de seguridad y acceso

### **Integraciones Futuras**
- **PagerDuty**: Para escalación de incidentes
- **Slack**: Notificaciones en tiempo real
- **Jira**: Creación automática de tickets
- **Datadog**: Comparación con herramientas comerciales
- **New Relic**: APM y métricas de aplicación

## 🔐 Seguridad

### **Consideraciones de Seguridad**
- Grafana con autenticación básica
- Prometheus accesible solo en red interna
- Alertmanager con configuración segura
- Métricas sensibles filtradas
- Logs de acceso monitoreados

### **Hardening**
- Cambiar contraseñas por defecto
- Configurar HTTPS en producción
- Implementar autenticación 2FA
- Restringir acceso por IP
- Encriptar comunicaciones internas

¡El sistema de monitoreo avanzado está completamente configurado y listo para usar! 🎉
