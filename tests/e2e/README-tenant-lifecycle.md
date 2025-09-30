# Test de Ciclo de Vida Completo de Tenant

Este test E2E valida todo el flujo de creación, configuración y uso de un nuevo tenant en Metanoia.

## Descripción del Test

El test `tenant-lifecycle.spec.ts` simula el ciclo de vida completo de un tenant:

1. **Super-Admin inicia sesión** - Autenticación con credenciales de administrador
2. **Creación de nuevo Tenant** - Formulario de creación con datos únicos
3. **Configuración de módulos** - Habilitación de módulos específicos (CRM, Inventario)
4. **Primer login del Cliente** - Autenticación con contraseña temporal
5. **Verificación de módulos** - Validación de que solo los módulos habilitados son visibles
6. **Uso del módulo CRM** - Creación de un cliente dentro del módulo CRM
7. **Modificación de módulos** - Deshabilitación de un módulo por parte del Super-Admin
8. **Verificación de cambios** - Confirmación de que los cambios se reflejan en el cliente

## Configuración Requerida

### Variables de Entorno

El test requiere que se establezca `NODE_ENV=test` para que la API devuelva la contraseña temporal:

```bash
export NODE_ENV=test
```

### Credenciales del Super-Admin

- **Email**: `mentanoiaclick@gmail.com`
- **Password**: `Tool2225-`

## Ejecución del Test

### Opción 1: Script Automatizado (Recomendado)

**Windows:**
```bash
scripts/run-tenant-lifecycle-test.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/run-tenant-lifecycle-test.sh
./scripts/run-tenant-lifecycle-test.sh
```

### Opción 2: Comando Manual

```bash
# Establecer entorno de test
export NODE_ENV=test

# Ejecutar test específico
npx playwright test tests/e2e/tenant-lifecycle.spec.ts --headed

# O ejecutar en modo headless
npx playwright test tests/e2e/tenant-lifecycle.spec.ts
```

## Características del Test

### Datos Únicos
- Genera datos únicos usando timestamp para evitar colisiones
- Crea empresa, usuario y cliente con nombres únicos
- Utiliza emails únicos para evitar conflictos

### Captura de Respuestas API
- Intercepta la respuesta de creación de tenant
- Captura automáticamente el `tenantId` y `tempPassword`
- Utiliza estos datos para las siguientes acciones

### Validaciones Robustas
- Verifica visibilidad de módulos en el sidebar
- Confirma funcionalidad de módulos habilitados
- Valida cambios en tiempo real
- Verifica que módulos deshabilitados no son visibles

### Limpieza Automática
- Incluye lógica de limpieza en `afterEach`
- Prepara el sistema para futuras ejecuciones

## Estructura del Test

```
tenant-lifecycle.spec.ts
├── Configuración inicial
├── Generación de datos únicos
├── Helper para captura de API
├── Test principal con 12 pasos:
│   ├── Login Super-Admin
│   ├── Creación de Tenant
│   ├── Configuración de módulos
│   ├── Logout Super-Admin
│   ├── Login Cliente
│   ├── Verificación de módulos
│   ├── Uso del módulo CRM
│   ├── Logout Cliente
│   ├── Re-login Super-Admin
│   ├── Deshabilitación de módulo
│   ├── Logout Super-Admin
│   └── Verificación final
└── Limpieza automática
```

## Troubleshooting

### Error: "tempPassword is undefined"
- Verificar que `NODE_ENV=test` está establecido
- Confirmar que la API está devolviendo la contraseña temporal

### Error: "Element not found"
- Verificar que la aplicación está corriendo en `localhost:3000`
- Confirmar que los selectores CSS son correctos
- Revisar que los módulos están correctamente implementados

### Error: "Test timeout"
- Aumentar el timeout en la configuración de Playwright
- Verificar que la base de datos está funcionando correctamente
- Confirmar que todos los servicios están ejecutándose

## Mejoras Futuras

- [ ] Agregar más validaciones de datos
- [ ] Implementar tests de rendimiento
- [ ] Agregar validación de emails enviados
- [ ] Incluir tests de seguridad
- [ ] Implementar tests de carga

## Notas Importantes

1. **Datos de Prueba**: El test genera datos únicos para evitar conflictos
2. **Modo Test**: Requiere `NODE_ENV=test` para funcionar correctamente
3. **Limpieza**: Incluye lógica de limpieza automática
4. **Robustez**: Incluye múltiples validaciones y verificaciones
5. **Documentación**: Cada paso está documentado con logs descriptivos
