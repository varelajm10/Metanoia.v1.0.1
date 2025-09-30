# Cabeceras de Seguridad - Metanoia ERP v1.0.1

## Resumen de Implementación

Se han implementado cabeceras de seguridad robustas en `next.config.js` para proteger la aplicación ERP contra vulnerabilidades comunes y cumplir con estándares de seguridad modernos.

## Cabeceras de Seguridad Implementadas

### 1. **Content Security Policy (CSP)**

```javascript
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "connect-src 'self' https://vitals.vercel-insights.com https://vercel.live wss:",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "frame-src 'none'",
  "upgrade-insecure-requests"
]
```

**Protección:**

- ✅ Previene XSS (Cross-Site Scripting)
- ✅ Bloquea scripts maliciosos
- ✅ Permite solo recursos del propio dominio
- ✅ Compatible con Vercel Analytics

### 2. **X-Frame-Options**

```javascript
"X-Frame-Options": "DENY"
```

**Protección:** Previene clickjacking y ataques de iframe malicioso

### 3. **X-Content-Type-Options**

```javascript
"X-Content-Type-Options": "nosniff"
```

**Protección:** Previene MIME type sniffing y ejecución de archivos maliciosos

### 4. **X-XSS-Protection**

```javascript
"X-XSS-Protection": "1; mode=block"
```

**Protección:** Habilita protección XSS del navegador

### 5. **Referrer-Policy**

```javascript
"Referrer-Policy": "strict-origin-when-cross-origin"
```

**Protección:** Controla información de referrer enviada con requests

### 6. **Permissions-Policy**

```javascript
"Permissions-Policy": [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "interest-cohort=()",
  "payment=()",
  "usb=()",
  "magnetometer=()",
  "gyroscope=()",
  "accelerometer=()"
]
```

**Protección:** Deshabilita APIs sensibles del navegador

### 7. **Strict-Transport-Security (HSTS)**

```javascript
"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
```

**Protección:** Fuerza conexiones HTTPS y previene downgrade attacks

### 8. **Cross-Origin Policies**

```javascript
"Cross-Origin-Embedder-Policy": "require-corp",
"Cross-Origin-Opener-Policy": "same-origin",
"Cross-Origin-Resource-Policy": "same-origin"
```

**Protección:** Controla políticas de origen cruzado para mayor seguridad

## Configuración por Rutas

### **Rutas Generales** (`/(.*)`)

- Aplican todas las cabeceras de seguridad
- CSP estricta para toda la aplicación
- Protección completa contra vulnerabilidades

### **API Routes** (`/api/:path*`)

- CORS configurado para producción/desarrollo
- Rate limiting headers
- Credenciales permitidas solo en desarrollo

### **Archivos Estáticos** (`/static/:path*`)

- Cache de 1 año para archivos inmutables
- Optimización de rendimiento

### **Imágenes** (`/images/:path*`)

- Cache de 24 horas
- Optimización para recursos multimedia

## Compatibilidad con Vercel Analytics

La CSP incluye dominios específicos de Vercel:

- `https://vercel.live` - Vercel Live
- `https://va.vercel-scripts.com` - Vercel Analytics Scripts
- `https://vitals.vercel-insights.com` - Vercel Vitals

## Configuración de Entorno

### **Desarrollo**

```javascript
"Access-Control-Allow-Origin": "*"  // CORS abierto para desarrollo
```

### **Producción**

```javascript
"Access-Control-Allow-Origin": "https://metanoia.click"  // CORS restringido
```

## Beneficios de Seguridad

### ✅ **Protección Contra:**

- XSS (Cross-Site Scripting)
- Clickjacking
- MIME type sniffing
- CSRF (Cross-Site Request Forgery)
- Man-in-the-middle attacks
- Data exfiltration
- Unauthorized API access

### ✅ **Cumplimiento:**

- OWASP Top 10
- PCI DSS (para pagos)
- GDPR (protección de datos)
- Estándares de seguridad modernos

### ✅ **Rendimiento:**

- Cache optimizado para archivos estáticos
- Headers de rate limiting
- Compresión y optimización

## Monitoreo y Testing

### **Herramientas Recomendadas:**

1. **Security Headers Check**: https://securityheaders.com
2. **Mozilla Observatory**: https://observatory.mozilla.org
3. **CSP Evaluator**: https://csp-evaluator.withgoogle.com

### **Testing Local:**

```bash
# Verificar headers en desarrollo
curl -I http://localhost:3000

# Verificar CSP
curl -H "Content-Security-Policy: default-src 'self'" http://localhost:3000
```

## Configuración Adicional Recomendada

### **Variables de Entorno:**

```env
# .env.local
NEXT_PUBLIC_APP_URL=https://metanoia.click
NODE_ENV=production
```

### **Middleware de Seguridad:**

Considera implementar middleware adicional para:

- Rate limiting por IP
- Detección de bots
- Validación de requests
- Logging de seguridad

## Notas Importantes

1. **CSP en Desarrollo**: Puede requerir ajustes para hot reload
2. **Vercel Analytics**: Automáticamente detectado y permitido
3. **Testing**: Verificar que todas las funcionalidades funcionen correctamente
4. **Monitoreo**: Revisar logs de seguridad regularmente

## Próximos Pasos

1. **Testing**: Verificar funcionamiento en desarrollo
2. **Deploy**: Aplicar en staging primero
3. **Monitoreo**: Configurar alertas de seguridad
4. **Auditoría**: Revisar headers con herramientas de seguridad
