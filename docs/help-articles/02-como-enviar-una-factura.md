---
title: "Cómo enviar una factura por email"
description: "Aprende a generar y enviar facturas electrónicas a tus clientes desde Metanoia"
category: "Facturación"
tags: ["facturas", "email", "clientes", "ventas"]
author: "Equipo Metanoia"
date: "2024-01-15"
difficulty: "Intermedio"
---

# Cómo enviar una factura por email

En este artículo te enseñaremos cómo generar y enviar facturas electrónicas a tus clientes de manera profesional desde Metanoia.

## Requisitos previos

- Tener configurado el módulo de facturación
- Contar con datos válidos del cliente
- Tener permisos para generar y enviar facturas

## Paso 1: Crear la factura

### Opción A: Desde una orden de venta

1. Ve a **Ventas** → **Órdenes**
2. Busca la orden que deseas facturar
3. Haz clic en **Generar factura**
4. Revisa los detalles de la factura

### Opción B: Crear factura directa

1. Navega a **Facturación** → **Nueva factura**
2. Selecciona el cliente desde la base de datos
3. Agrega los productos o servicios
4. Configura los términos de pago

## Paso 2: Configurar el envío por email

### Configuración básica

1. En la vista de la factura, haz clic en **Enviar por email**
2. Verifica que la dirección de email del cliente sea correcta
3. Personaliza el asunto del email (opcional)

### Plantillas de email

Metanoia incluye plantillas profesionales predefinidas:

- **Plantilla estándar**: Diseño limpio y profesional
- **Plantilla corporativa**: Incluye logo y colores de tu empresa
- **Plantilla simple**: Versión minimalista

Para personalizar una plantilla:

1. Ve a **Configuración** → **Plantillas de email**
2. Selecciona la plantilla de factura
3. Modifica el contenido según tus necesidades
4. Guarda los cambios

## Paso 3: Personalizar el mensaje

### Asunto del email

El sistema genera automáticamente un asunto, pero puedes personalizarlo:

- **Asunto automático**: "Factura #[número] - [empresa]"
- **Asunto personalizado**: Escribe tu propio asunto

### Mensaje personalizado

Puedes agregar un mensaje personalizado antes del contenido de la factura:

```
Estimado/a [Nombre del cliente],

Adjunto encontrará la factura #[número] por un total de [monto].

Agradecemos su pronta atención al pago.

Saludos cordiales,
[Tu nombre]
```

## Paso 4: Enviar la factura

1. Revisa todos los detalles del email
2. Haz clic en **Enviar factura**
3. El sistema te mostrará una confirmación de envío
4. La factura se marcará como "Enviada" en el sistema

## Configuración avanzada

### Configuración de SMTP

Para usar tu propio servidor de email:

1. Ve a **Configuración** → **Integraciones** → **Email**
2. Configura los datos de tu servidor SMTP:
   - Servidor SMTP
   - Puerto
   - Usuario y contraseña
   - Configuración SSL/TLS

### Integración con servicios de email

Metanoia se integra con:

- **SendGrid**: Para envío masivo y tracking
- **Mailgun**: Para emails transaccionales
- **Amazon SES**: Para envío a gran escala

### Programar envíos

Puedes programar el envío de facturas:

1. Al crear la factura, selecciona **Programar envío**
2. Establece la fecha y hora deseada
3. El sistema enviará la factura automáticamente

## Seguimiento de envíos

### Estado de entrega

El sistema te permite conocer el estado de tus emails:

- **Enviado**: Email enviado exitosamente
- **Entregado**: Email recibido por el destinatario
- **Abierto**: Email abierto por el destinatario
- **Rebotado**: Email no pudo ser entregado
- **Fallido**: Error en el envío

### Notificaciones

Configura notificaciones para:

- Errores de envío
- Emails rebotados
- Confirmaciones de entrega

## Mejores prácticas

### Para el asunto del email

- Incluye el número de factura
- Menciona el monto total
- Usa un tono profesional
- Mantén el asunto conciso

### Para el contenido

- Personaliza el saludo con el nombre del cliente
- Incluye instrucciones claras de pago
- Menciona la fecha de vencimiento
- Proporciona información de contacto

### Para el archivo adjunto

- Usa formato PDF para garantizar compatibilidad
- Incluye tu logo y datos de contacto
- Verifica que todos los datos sean correctos

## Solución de problemas

### Error: "Dirección de email inválida"

Verifica que:
- La dirección de email tenga formato válido
- El cliente tenga una dirección de email registrada
- No haya espacios en blanco extra

### Error: "Servidor SMTP no disponible"

Comprueba:
- La configuración de SMTP
- La conectividad a internet
- Las credenciales de acceso

### Error: "Plantilla no encontrada"

Asegúrate de que:
- La plantilla existe en el sistema
- Tienes permisos para usar la plantilla
- La plantilla no esté corrupta

## Integración con otros módulos

### CRM

- Los emails se registran automáticamente en el historial del cliente
- Puedes crear tareas de seguimiento
- Se generan alertas para recordatorios de pago

### Contabilidad

- Las facturas enviadas se sincronizan con el módulo contable
- Se registran automáticamente los asientos correspondientes
- Se mantiene el historial de pagos

## Próximos pasos

Después de enviar una factura:

- [Configurar recordatorios automáticos](./05-recordatorios-pago.md)
- [Integrar con pasarelas de pago](./06-pagos-online.md)
- [Generar reportes de facturación](./07-reportes-facturacion.md)

## Contacto de soporte

Para ayuda con el envío de facturas:

- **Email**: facturacion@metanoia.com
- **Teléfono**: +1 (555) 123-4567
- **Chat en vivo**: Disponible desde las 9:00 AM a 6:00 PM
