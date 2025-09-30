# Script de PowerShell para ejecutar el test de ciclo de vida de tenant
# Ejecutar con: powershell -ExecutionPolicy Bypass -File scripts/run-tenant-lifecycle-test.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Ejecutando Test de Ciclo de Vida de Tenant" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Establecer variable de entorno para modo test
$env:NODE_ENV = "test"

Write-Host "Variable NODE_ENV establecida a: $env:NODE_ENV" -ForegroundColor Green

# Verificar que Playwright está instalado
try {
    $playwrightVersion = npx playwright --version
    Write-Host "Playwright versión: $playwrightVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Playwright no está instalado. Ejecuta 'npm install' primero." -ForegroundColor Red
    exit 1
}

# Verificar que el archivo de test existe
$testFile = "tests/e2e/tenant-lifecycle.spec.ts"
if (-not (Test-Path $testFile)) {
    Write-Host "Error: Archivo de test no encontrado: $testFile" -ForegroundColor Red
    exit 1
}

Write-Host "Archivo de test encontrado: $testFile" -ForegroundColor Green

# Ejecutar el test
Write-Host "Iniciando ejecución del test..." -ForegroundColor Yellow
Write-Host "Comando: npx playwright test $testFile --headed" -ForegroundColor Gray

try {
    npx playwright test $testFile --headed
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Test completado exitosamente" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
} catch {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Error durante la ejecución del test" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Cyan
    exit 1
}

Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
