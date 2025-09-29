@echo off
REM 🤖 Script de Commit Automático - Metanoia V1.0.1
REM Este script hace commit automático cada 30 minutos en Windows

echo 🤖 COMMIT AUTOMÁTICO - METANOIA V1.0.1
echo =====================================
echo 📝 Iniciando commit automático cada 30 minutos...
echo ⏰ Presiona Ctrl+C para detener
echo =====================================

:loop
echo.
echo 🔍 [%date% %time%] Verificando cambios...

REM Verificar si hay cambios
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: No se pudo verificar el estado de Git
    timeout /t 30 /nobreak > nul
    goto loop
)

REM Verificar si hay cambios pendientes
git status --porcelain | findstr /r "." > nul
if %errorlevel% neq 0 (
    echo ✅ No hay cambios pendientes, saltando commit
    timeout /t 30 /nobreak > nul
    goto loop
)

echo 📊 Encontrados cambios pendientes...

REM Agregar todos los archivos
echo 📁 Agregando archivos al staging...
git add .

REM Generar mensaje de commit con timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%DD%/%MM%/%YYYY% %HH%:%Min%:%Sec%"

echo 💾 Creando commit automático...
git commit -m "🤖 Auto-commit - %timestamp% - Cambios automáticos del sistema"

if %errorlevel% neq 0 (
    echo ❌ Error al crear commit
    timeout /t 30 /nobreak > nul
    goto loop
)

echo ✅ Commit creado exitosamente

REM Intentar push a GitHub
echo 🚀 Intentando push a GitHub...
git push origin main

if %errorlevel% neq 0 (
    echo ⚠️ Push falló, pero el commit se guardó localmente
) else (
    echo ✅ Push exitoso a GitHub
)

echo ⏰ Esperando 30 minutos para el próximo commit...
timeout /t 1800 /nobreak > nul
goto loop
