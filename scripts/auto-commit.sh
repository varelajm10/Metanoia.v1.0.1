#!/bin/bash

# 🤖 Script de Commit Automático - Metanoia V1.0.2
# Este script hace commit automático cada 30 minutos en Linux/Mac

# Configuración
INTERVAL_MINUTES=30
COMMIT_PREFIX="🤖 Auto-commit"
LOG_FILE="scripts/auto-commit.log"

# Función para logging
log() {
    local message="$1"
    local level="${2:-INFO}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_message="[$timestamp] [$level] $message"
    
    echo "$log_message"
    echo "$log_message" >> "$LOG_FILE"
}

# Función para verificar si hay cambios
has_changes() {
    git status --porcelain | grep -q .
}

# Función para obtener estadísticas de cambios
get_change_stats() {
    local status=$(git status --porcelain)
    local total=$(echo "$status" | wc -l)
    local added=$(echo "$status" | grep -c "^A")
    local modified=$(echo "$status" | grep -c "^M")
    local deleted=$(echo "$status" | grep -c "^D")
    local untracked=$(echo "$status" | grep -c "^??")
    
    echo "Total: $total, Added: $added, Modified: $modified, Deleted: $deleted, Untracked: $untracked"
}

# Función para ejecutar commit
execute_commit() {
    log "🔍 Verificando cambios..."
    
    if ! has_changes; then
        log "✅ No hay cambios pendientes, saltando commit"
        return 0
    fi
    
    local stats=$(get_change_stats)
    log "📊 Encontrados cambios: $stats"
    
    # Agregar todos los archivos
    log "📁 Agregando archivos al staging..."
    git add .
    
    # Generar mensaje de commit
    local timestamp=$(date '+%d/%m/%Y %H:%M:%S')
    local commit_message="$COMMIT_PREFIX - $timestamp - Cambios automáticos del sistema"
    
    # Crear commit
    log "💾 Creando commit automático..."
    git commit -m "$commit_message"
    
    if [ $? -eq 0 ]; then
        log "✅ Commit creado exitosamente"
        
        # Intentar push a GitHub
        log "🚀 Intentando push a GitHub..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            log "✅ Push exitoso a GitHub"
        else
            log "⚠️ Push falló, pero el commit se guardó localmente" "WARN"
        fi
    else
        log "❌ Error al crear commit" "ERROR"
        return 1
    fi
}

# Función para manejar señales
cleanup() {
    log "🛑 Recibida señal de interrupción, deteniendo commit automático..."
    exit 0
}

# Configurar manejo de señales
trap cleanup SIGINT SIGTERM

# Iniciar el proceso
log "🚀 Iniciando commit automático cada $INTERVAL_MINUTES minutos..."
log "📁 Directorio de trabajo: $(pwd)"
log "⏰ Intervalo: $INTERVAL_MINUTES minutos"
log "📝 Log file: $LOG_FILE"

# Ejecutar commit inmediatamente
execute_commit

# Mostrar información
echo ""
echo "🤖 COMMIT AUTOMÁTICO - METANOIA V1.0.2"
echo "====================================="
echo "📝 El script está ejecutándose en segundo plano"
echo "⏰ Hace commit automático cada $INTERVAL_MINUTES minutos"
echo "📊 Presiona Ctrl+C para detener"
echo "📁 Logs guardados en: $LOG_FILE"
echo "====================================="
echo ""

# Loop principal
while true; do
    sleep $((INTERVAL_MINUTES * 60))
    execute_commit
done
