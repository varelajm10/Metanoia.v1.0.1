#!/bin/bash

# Script para configurar el sistema de monitoreo completo de Metanoia ERP
# Autor: Metanoia Team
# Fecha: 2025-09-30

set -e

echo "🚀 Configurando sistema de monitoreo Metanoia ERP..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
        exit 1
    fi
    
    success "Dependencias verificadas"
}

# Crear directorios necesarios
create_directories() {
    log "Creando directorios de monitoreo..."
    
    mkdir -p docker/{prometheus,grafana/{provisioning/{datasources,dashboards},dashboards},alertmanager}
    mkdir -p logs/monitoring
    mkdir -p backups/monitoring
    
    success "Directorios creados"
}

# Configurar permisos
setup_permissions() {
    log "Configurando permisos..."
    
    # Permisos para Grafana
    chmod 755 docker/grafana/dashboards
    chmod 644 docker/grafana/dashboards/*.json
    
    # Permisos para Prometheus
    chmod 644 docker/prometheus/*.yml
    
    # Permisos para Alertmanager
    chmod 644 docker/alertmanager/*.yml
    
    success "Permisos configurados"
}

# Verificar configuración de red
check_network() {
    log "Verificando configuración de red..."
    
    # Verificar que los puertos estén disponibles
    ports=(3000 3001 9090 9093 9187 9121 9100 8080)
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            warning "Puerto $port está en uso. Verifica que no haya conflictos."
        else
            success "Puerto $port está disponible"
        fi
    done
}

# Iniciar servicios de monitoreo
start_monitoring() {
    log "Iniciando servicios de monitoreo..."
    
    # Iniciar solo los servicios de monitoreo
    docker-compose up -d prometheus alertmanager grafana postgres-exporter redis-exporter node-exporter cadvisor
    
    success "Servicios de monitoreo iniciados"
}

# Verificar estado de servicios
check_services() {
    log "Verificando estado de servicios..."
    
    sleep 10  # Esperar a que los servicios se inicien
    
    services=("prometheus" "alertmanager" "grafana" "postgres-exporter" "redis-exporter" "node-exporter" "cadvisor")
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            success "$service está corriendo"
        else
            error "$service no está corriendo"
        fi
    done
}

# Probar endpoints
test_endpoints() {
    log "Probando endpoints de monitoreo..."
    
    endpoints=(
        "http://localhost:9090"  # Prometheus
        "http://localhost:3001"  # Grafana
        "http://localhost:9093"  # Alertmanager
        "http://localhost:9187/metrics"  # PostgreSQL Exporter
        "http://localhost:9121/metrics"  # Redis Exporter
        "http://localhost:9100/metrics"  # Node Exporter
        "http://localhost:8080/metrics"  # cAdvisor
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -s -f "$endpoint" > /dev/null 2>&1; then
            success "$endpoint está respondiendo"
        else
            warning "$endpoint no está respondiendo (puede ser normal si el servicio aún no está listo)"
        fi
    done
}

# Configurar usuario de prueba en Grafana
setup_grafana_user() {
    log "Configurando usuario de prueba en Grafana..."
    
    # Esperar a que Grafana esté listo
    sleep 15
    
    # Verificar que Grafana esté respondiendo
    if curl -s -f "http://localhost:3001/api/health" > /dev/null 2>&1; then
        success "Grafana está listo"
        log "Credenciales de Grafana:"
        log "  Usuario: admin"
        log "  Contraseña: metanoia_grafana_2025"
    else
        warning "Grafana aún no está listo. Intenta acceder manualmente en unos minutos."
    fi
}

# Mostrar información de acceso
show_access_info() {
    log "Información de acceso al sistema de monitoreo:"
    echo ""
    echo "📊 Grafana Dashboard:"
    echo "   URL: http://localhost:3001"
    echo "   Usuario: admin"
    echo "   Contraseña: metanoia_grafana_2025"
    echo ""
    echo "🔍 Prometheus:"
    echo "   URL: http://localhost:9090"
    echo "   Targets: http://localhost:9090/targets"
    echo ""
    echo "🚨 Alertmanager:"
    echo "   URL: http://localhost:9093"
    echo ""
    echo "📈 Dashboards disponibles:"
    echo "   - Metanoia ERP - System Overview"
    echo "   - Database Monitoring - PostgreSQL & Redis"
    echo "   - Infrastructure Monitoring - System & Docker"
    echo "   - Business Metrics - ERP KPIs"
    echo "   - SLA/SLO Monitoring - Service Level Objectives"
    echo ""
    echo "🔧 Métricas de la aplicación:"
    echo "   URL: http://localhost:3000/api/metrics"
    echo ""
}

# Función principal
main() {
    echo "🎯 Metanoia ERP - Sistema de Monitoreo Avanzado"
    echo "=============================================="
    echo ""
    
    check_dependencies
    create_directories
    setup_permissions
    check_network
    start_monitoring
    check_services
    test_endpoints
    setup_grafana_user
    show_access_info
    
    echo ""
    success "✅ Sistema de monitoreo configurado exitosamente!"
    echo ""
    log "Próximos pasos:"
    echo "1. Accede a Grafana y explora los dashboards"
    echo "2. Configura alertas en Alertmanager si es necesario"
    echo "3. Revisa las métricas de la aplicación en /api/metrics"
    echo "4. Configura notificaciones (Slack, email) en Alertmanager"
    echo ""
    log "Para detener los servicios: docker-compose down"
    log "Para ver logs: docker-compose logs -f [servicio]"
}

# Ejecutar función principal
main "$@"
