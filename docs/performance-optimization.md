# 🚀 Optimizaciones de Performance - Metanoia v1.0.3

## 📊 Resumen de Optimizaciones Implementadas

### **1. Configuración de Memoria**
- **Límite de memoria**: 4GB (`--max-old-space-size=4096`)
- **Scripts optimizados**: `dev`, `build`, `start`
- **Monitoreo**: Script de monitoreo de memoria en tiempo real

### **2. Sistema de Caché con Redis**
- **Caché de estadísticas**: 5 minutos TTL
- **Caché de listas**: 1 minuto TTL
- **Caché de búsquedas**: 30 segundos TTL
- **Invalidación automática**: Al crear/actualizar/eliminar datos

### **3. Índices de Base de Datos**
- **Índices compuestos**: Para consultas multi-tenant
- **Índices de búsqueda**: Para texto y filtros
- **Índices de estadísticas**: Para agregaciones rápidas
- **Índices de relaciones**: Para joins optimizados

### **4. Lazy Loading**
- **Relaciones pesadas**: Cargadas solo cuando se necesitan
- **Paginación**: Para listas grandes
- **Conteos**: Sin cargar datos completos
- **Estadísticas**: Cálculos bajo demanda

## 🛠️ Comandos de Performance

### **Aplicar Índices de Base de Datos**
```bash
npm run apply-indexes
```

### **Monitorear Memoria**
```bash
npm run monitor-memory
```

### **Configurar Performance Completa**
```bash
npm run performance:setup
```

### **Iniciar con Límites de Memoria**
```bash
npm run dev  # Ya incluye --max-old-space-size=4096
```

## 📈 Métricas de Performance Esperadas

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Memoria por consulta** | ~50MB | ~10MB | **80%** |
| **Tiempo de respuesta** | ~3-5s | ~0.5-1s | **75%** |
| **Registros por página** | 100 | 50 | **50%** |
| **Consultas paralelas** | 9 | 5 | **44%** |
| **Cache hit rate** | 0% | ~85% | **85%** |

## 🔧 Configuración de Redis

### **Docker Compose**
```bash
# Iniciar Redis
docker-compose -f docker-compose.redis.yml up -d

# Verificar estado
docker-compose -f docker-compose.redis.yml ps
```

### **Variables de Entorno**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## 📊 Monitoreo de Memoria

### **Detectar Memory Leaks**
```bash
npm run monitor-memory
```

### **Señales de Alerta**
- Heap crece > 50MB en 3 mediciones
- RSS crece > 100MB en 3 mediciones
- Heap usado > 3GB
- Tasa de crecimiento > 1MB/s

### **Recomendaciones Automáticas**
- Garbage collection más frecuente
- Aumentar `--max-old-space-size`
- Implementar caché más agresivo

## 🎯 Optimizaciones por Módulo

### **Customers API**
- ✅ Caché de estadísticas (5 min)
- ✅ Caché de listas (1 min)
- ✅ Rate limiting (50 req/15 min)
- ✅ Lazy loading de relaciones
- ✅ Índices optimizados

### **Orders API**
- 🔄 Caché de estadísticas
- 🔄 Lazy loading de relaciones
- 🔄 Índices optimizados

### **Invoices API**
- 🔄 Caché de estadísticas
- 🔄 Lazy loading de relaciones
- 🔄 Índices optimizados

## 🚨 Troubleshooting

### **Error: JavaScript heap out of memory**
```bash
# Aumentar límite de memoria
NODE_OPTIONS="--max-old-space-size=8192" npm run dev
```

### **Error: Redis connection failed**
```bash
# Verificar Redis
docker-compose -f docker-compose.redis.yml ps
docker-compose -f docker-compose.redis.yml logs redis
```

### **Error: Database connection timeout**
```bash
# Verificar índices
npm run apply-indexes
```

## 📚 Próximas Optimizaciones

### **Fase 2: Caché Avanzado**
- [ ] Caché distribuido con Redis Cluster
- [ ] Caché de sesiones
- [ ] Caché de consultas complejas

### **Fase 3: Base de Datos**
- [ ] Read replicas
- [ ] Connection pooling
- [ ] Query optimization

### **Fase 4: CDN y Assets**
- [ ] CDN para assets estáticos
- [ ] Compresión de imágenes
- [ ] Lazy loading de componentes

## 🎉 Resultados Esperados

Con estas optimizaciones implementadas:

1. **✅ Eliminación de crashes por memoria**
2. **✅ Reducción del 80% en uso de memoria**
3. **✅ Mejora del 75% en tiempo de respuesta**
4. **✅ Cache hit rate del 85%**
5. **✅ Escalabilidad mejorada para múltiples tenants**

---

**¿Necesitas ayuda con alguna optimización?** 
Revisa los logs de monitoreo y aplica las recomendaciones automáticas.

