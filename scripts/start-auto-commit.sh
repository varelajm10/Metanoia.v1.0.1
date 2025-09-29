#!/bin/bash
# 🤖 Script de Inicio para Commit Automático
# Generado automáticamente por setup-auto-commit.js

echo "🚀 Iniciando commit automático para Metanoia V1.0.2..."
echo "📁 Directorio: $(pwd)"
echo "⏰ Intervalo: 30 minutos"
echo ""

# Verificar si Node.js está disponible
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js encontrado, usando script JavaScript..."
    node scripts/auto-commit.js
else
    echo "⚠️ Node.js no encontrado, usando script Bash..."
    bash scripts/auto-commit.sh
fi
