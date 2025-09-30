# Configuración de Stripe - Metanoia ERP v1.0.1

## Variables de Entorno Requeridas

### **Archivo .env.local**

```env
# Claves de API de Stripe
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Configuración de la aplicación
NEXT_PUBLIC_APP_URL=https://metanoia.click
NODE_ENV=production
```

## Configuración en Stripe Dashboard

### **1. Crear Productos y Precios**

#### **Plan Básico**

- **Producto**: "Plan Básico - Metanoia ERP"
- **Precio**: $29.99/mes
- **ID del Precio**: `price_basic_monthly`

#### **Plan Estándar**

- **Producto**: "Plan Estándar - Metanoia ERP"
- **Precio**: $79.99/mes
- **ID del Precio**: `price_standard_monthly`

#### **Plan Premium**

- **Producto**: "Plan Premium - Metanoia ERP"
- **Precio**: $199.99/mes
- **ID del Precio**: `price_premium_monthly`

#### **Plan Enterprise**

- **Producto**: "Plan Enterprise - Metanoia ERP"
- **Precio**: $499.99/mes
- **ID del Precio**: `price_enterprise_monthly`

### **2. Configurar Webhooks**

#### **Endpoint del Webhook**

```
https://metanoia.click/api/webhooks/stripe
```

#### **Eventos a Escuchar**

- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.deleted`

#### **Configuración de Seguridad**

- **Versión de API**: `2023-10-16`
- **Firma del Webhook**: Habilitada
- **Tolerancia de Tiempo**: 300 segundos

### **3. Configurar Métodos de Pago**

#### **Métodos Aceptados**

- Tarjetas de crédito/débito
- PayPal (opcional)
- Transferencia bancaria (opcional)

#### **Configuración de Facturación**

- **Período de gracia**: 3 días
- **Reintentos**: 3 intentos
- **Notificaciones**: Habilitadas

## Testing

### **1. Testing con Stripe CLI**

#### **Instalación**

```bash
npm install -g stripe-cli
```

#### **Login**

```bash
stripe login
```

#### **Escuchar Webhooks**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### **Simular Eventos**

```bash
# Simular pago exitoso
stripe trigger invoice.paid

# Simular fallo de pago
stripe trigger invoice.payment_failed

# Simular cancelación de suscripción
stripe trigger customer.subscription.deleted
```

### **2. Testing en Desarrollo**

#### **Usar Claves de Prueba**

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### **Crear Customer de Prueba**

```typescript
const customer = await stripe.customers.create({
  name: 'Test Customer',
  email: 'test@example.com',
})
```

#### **Crear Suscripción de Prueba**

```typescript
const subscription = await stripe.subscriptions.create({
  customer: customer.id,
  items: [{ price: 'price_basic_monthly' }],
})
```

## Monitoreo

### **1. Logs de Webhooks**

```bash
# Ver logs en tiempo real
tail -f logs/stripe-webhooks.log

# Filtrar por tipo de evento
grep "invoice.paid" logs/stripe-webhooks.log
```

### **2. Métricas en Stripe Dashboard**

- Tasa de éxito de webhooks
- Tiempo de respuesta
- Errores por endpoint

### **3. Alertas Configuradas**

- Webhook fallido más de 3 veces
- Error de verificación de firma
- Tenant desactivado por fallo de pago

## Troubleshooting

### **Problemas Comunes**

#### **1. Webhook no se ejecuta**

```bash
# Verificar configuración
curl -X POST https://metanoia.click/api/webhooks/stripe \
  -H "stripe-signature: test" \
  -d "test payload"
```

#### **2. Error de firma**

```typescript
// Verificar variables de entorno
console.log('Webhook secret:', process.env.STRIPE_WEBHOOK_SECRET)
console.log('Secret key:', process.env.STRIPE_SECRET_KEY)
```

#### **3. Tenant no se actualiza**

```sql
-- Verificar base de datos
SELECT * FROM tenants WHERE stripe_customer_id IS NOT NULL;
```

### **Comandos de Debug**

```bash
# Verificar configuración de Stripe
stripe config --list

# Probar conexión
stripe customers list --limit 1

# Verificar webhooks
stripe events list --limit 10
```

## Producción

### **Checklist de Despliegue**

- [ ] Claves de producción configuradas
- [ ] Webhook endpoint configurado
- [ ] Certificado SSL válido
- [ ] Logging configurado
- [ ] Monitoreo activo
- [ ] Backup de base de datos

### **Configuración de Seguridad**

- [ ] Firma de webhook habilitada
- [ ] Tolerancia de tiempo configurada
- [ ] IPs permitidas configuradas
- [ ] Logs de auditoría habilitados

### **Monitoreo de Producción**

- [ ] Alertas configuradas
- [ ] Métricas en tiempo real
- [ ] Logs centralizados
- [ ] Backup automático
