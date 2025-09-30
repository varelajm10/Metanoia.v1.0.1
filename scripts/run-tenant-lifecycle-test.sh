#!/bin/bash

echo "=========================================="
echo "Ejecutando Test de Ciclo de Vida de Tenant"
echo "=========================================="

# Establecer variable de entorno para modo test
export NODE_ENV=test

# Ejecutar el test específico
npx playwright test tests/e2e/tenant-lifecycle.spec.ts --headed

echo "=========================================="
echo "Test completado"
echo "=========================================="
