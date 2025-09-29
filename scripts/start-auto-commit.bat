@echo off
REM 🤖 Script de Inicio para Commit Automático en Windows
REM Generado automáticamente por setup-auto-commit.js

echo 🚀 Iniciando commit automático para Metanoia V1.0.1...
echo 📁 Directorio: %CD%
echo ⏰ Intervalo: 30 minutos
echo.

REM Verificar si Node.js está disponible
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado, usando script JavaScript...
    node scripts/auto-commit.js
) else (
    echo ⚠️ Node.js no encontrado, usando script Batch...
    call scripts/auto-commit.bat
)
