# Webhooks de Stripe - Metanoia ERP v1.0.1

## Resumen de Implementación

Se ha implementado un sistema completo de webhooks de Stripe para manejar eventos de facturación y suscripciones en el sistema ERP multi-tenant.

## Endpoint de Webhooks

### **URL del Webhook**

```
POST /api/webhooks/stripe
```

### **Configuración en Stripe Dashboard**

1. Ir a **Developers > Webhooks**
2. Crear nuevo endpoint: `https://metanoia.click/api/webhooks/stripe`
3. Seleccionar eventos:
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`

## Eventos Manejados

### 1. **invoice.paid**

**Descripción**: Factura pagada exitosamente

**Acciones Realizadas**:

- ✅ Activar tenant (`isActive = true`)
- ✅ Actualizar plan ID
- ✅ Actualizar subscription ID
- ✅ Registrar fecha de pago

**Flujo**:

```typescript
// 1. Verificar firma del webhook
// 2. Buscar tenant por Stripe customer ID
// 3. Obtener información de suscripción
// 4. Determinar plan (suscripción o metadata)
// 5. Activar tenant con plan correspondiente
```

### 2. **invoice.payment_failed**

**Descripción**: Fallo en el pago de una factura

**Acciones Realizadas**:

- ❌ Desactivar tenant (`isActive = false`)
- 📧 Notificar al administrador
- 🔄 Programar recordatorio de pago

**Flujo**:

```typescript
// 1. Verificar firma del webhook
// 2. Buscar tenant por Stripe customer ID
// 3. Desactivar tenant temporalmente
// 4. Enviar notificación de fallo de pago
```

### 3. **customer.subscription.deleted**

**Descripción**: Suscripción cancelada

**Acciones Realizadas**:

- ❌ Desactivar tenant (`isActive = false`)
- 📧 Enviar email de cancelación
- 💾 Programar eliminación de datos (opcional)

**Flujo**:

```typescript
// 1. Verificar firma del webhook
// 2. Buscar tenant por Stripe customer ID
// 3. Desactivar tenant
// 4. Enviar email de cancelación
```

## Seguridad

### **Verificación de Firma**

```typescript
// Verificación obligatoria de la firma
const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
```

**Características**:

- ✅ Verificación de firma HMAC
- ✅ Validación de timestamp
- ✅ Prevención de ataques de replay
- ✅ Autenticación de origen

### **Variables de Entorno Requeridas**

```env
# .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Modelo de Base de Datos

### **Campos Agregados al Modelo Tenant**

```prisma
model Tenant {
  // ... campos existentes ...

  // Integración con Stripe
  stripeCustomerId      String?  @unique
  stripeSubscriptionId  String?  @unique
  planId               String?  // ID del plan en Stripe
  stripeWebhookSecret  String?  // Secret para webhooks específicos
}
```

### **Índices para Optimización**

```prisma
@@index([stripeCustomerId])
@@index([stripeSubscriptionId])
@@index([isActive, planId])
```

## Configuración de Planes

### **Planes Disponibles**

```typescript
const plans = {
  BASIC: {
    id: 'price_basic_monthly',
    name: 'Plan Básico',
    price: 29.99,
    features: ['Hasta 5 usuarios', '10 servidores', '100GB almacenamiento'],
  },
  STANDARD: {
    id: 'price_standard_monthly',
    name: 'Plan Estándar',
    price: 79.99,
    features: ['Hasta 25 usuarios', '50 servidores', '500GB almacenamiento'],
  },
  PREMIUM: {
    id: 'price_premium_monthly',
    name: 'Plan Premium',
    price: 199.99,
    features: [
      'Usuarios ilimitados',
      'Servidores ilimitados',
      '1TB almacenamiento',
    ],
  },
  ENTERPRISE: {
    id: 'price_enterprise_monthly',
    name: 'Plan Enterprise',
    price: 499.99,
    features: ['Todo incluido', 'Soporte prioritario', 'Personalización'],
  },
}
```

## Manejo de Errores

### **Tipos de Errores**

1. **Error de Firma**: Firma inválida o faltante
2. **Error de Tenant**: Tenant no encontrado
3. **Error de Base de Datos**: Fallo en actualización
4. **Error de Stripe**: API de Stripe no disponible

### **Logging y Monitoreo**

```typescript
// Logs estructurados para monitoreo
console.log('Processing Stripe webhook:', event.type)
console.log('Tenant updated:', tenantId, 'isActive:', isActive)
console.error('Webhook error:', error)
```

### **Respuestas HTTP**

- **200**: Webhook procesado exitosamente
- **400**: Firma inválida o datos faltantes
- **405**: Método no permitido
- **500**: Error interno del servidor

## Testing

### **Testing Local con Stripe CLI**

```bash
# Instalar Stripe CLI
npm install -g stripe-cli

# Login a Stripe
stripe login

# Escuchar webhooks localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Simular eventos
stripe trigger invoice.paid
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted
```

### **Testing en Desarrollo**

```typescript
// Ejemplo de test unitario
describe('Stripe Webhooks', () => {
  it('should handle invoice.paid event', async () => {
    const event = createMockStripeEvent('invoice.paid')
    const response = await processWebhook(event)
    expect(response.status).toBe(200)
  })
})
```

## Monitoreo y Alertas

### **Métricas Importantes**

- Tasa de éxito de webhooks
- Tiempo de procesamiento
- Errores por tipo de evento
- Tenants activados/desactivados

### **Alertas Recomendadas**

- Webhook fallido más de 3 veces
- Tenant desactivado por fallo de pago
- Suscripción cancelada
- Error de verificación de firma

## Flujo de Datos

### **1. Evento de Stripe**

```
Stripe → Webhook → Verificación → Procesamiento → Base de Datos
```

### **2. Actualización de Tenant**

```
Evento → Buscar Tenant → Actualizar Estado → Notificar → Log
```

### **3. Manejo de Errores**

```
Error → Log → Notificación → Rollback (si es necesario)
```

## Configuración de Producción

### **Checklist de Despliegue**

- [ ] Variables de entorno configuradas
- [ ] Webhook endpoint configurado en Stripe
- [ ] Certificado SSL válido
- [ ] Logging configurado
- [ ] Monitoreo activo
- [ ] Backup de base de datos

### **Configuración de Stripe Dashboard**

1. **Webhooks**:
   - Endpoint: `https://metanoia.click/api/webhooks/stripe`
   - Eventos: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`
   - Versión de API: `2024-06-20`

2. **Productos y Precios**:
   - Crear productos para cada plan
   - Configurar precios mensuales/anuales
   - Establecer límites de uso

3. **Configuración de Pagos**:
   - Métodos de pago aceptados
   - Configuración de facturación
   - Políticas de reembolso

## Troubleshooting

### **Problemas Comunes**

#### **1. Webhook no se ejecuta**

```typescript
// Verificar configuración
- URL del webhook correcta
- Eventos seleccionados
- Firma del webhook válida
```

#### **2. Tenant no se actualiza**

```typescript
// Verificar base de datos
- Conexión a la base de datos
- Permisos de escritura
- Índices creados
```

#### **3. Error de firma**

```typescript
// Verificar configuración
- STRIPE_WEBHOOK_SECRET correcto
- Headers de Stripe presentes
- Payload no modificado
```

### **Comandos de Debug**

```bash
# Verificar logs
tail -f logs/stripe-webhooks.log

# Probar webhook
curl -X POST https://metanoia.click/api/webhooks/stripe \
  -H "stripe-signature: test" \
  -d "test payload"

# Verificar base de datos
psql -c "SELECT * FROM tenants WHERE stripe_customer_id IS NOT NULL;"
```

## Próximas Mejoras

### **Funcionalidades Adicionales**

- [ ] Webhooks para eventos de prueba
- [ ] Notificaciones por email
- [ ] Dashboard de métricas de facturación
- [ ] Integración con sistemas de soporte
- [ ] Automatización de recordatorios de pago

### **Optimizaciones**

- [ ] Cache de información de Stripe
- [ ] Procesamiento asíncrono de webhooks
- [ ] Retry automático en caso de fallo
- [ ] Compresión de logs
- [ ] Métricas en tiempo real
