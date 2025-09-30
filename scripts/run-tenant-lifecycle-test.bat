@echo off
echo ==========================================
echo Ejecutando Test de Ciclo de Vida de Tenant
echo ==========================================

REM Establecer variable de entorno para modo test
set NODE_ENV=test

REM Ejecutar el test específico
npx playwright test tests/e2e/tenant-lifecycle.spec.ts --headed

echo ==========================================
echo Test completado
echo ==========================================
pause
