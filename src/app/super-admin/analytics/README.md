# Dashboard de Inteligencia de Negocio

## Descripción

El dashboard de analytics proporciona métricas clave y visualizaciones para el Super Admin de Metanoia, permitiendo un análisis completo del ecosistema de la plataforma.

## Características

### 📊 Métricas Principales

- **MRR (Monthly Recurring Revenue)**: Ingreso mensual recurrente con tendencias
- **Tasa de Abandono (Churn Rate)**: Porcentaje de clientes que cancelan
- **Clientes Activos**: Número de tenants con suscripción activa
- **Total de Usuarios**: Usuarios registrados en todo el sistema

### 📈 Visualizaciones

- **Gráfico de Barras**: Módulos más populares entre clientes
- **Gráfico de Área**: Tendencias de ingresos en los últimos 6 meses
- **Gráfico de Línea**: Crecimiento de usuarios en el tiempo
- **Resumen Ejecutivo**: KPIs clave del ecosistema

### 🎨 Diseño

- **Cards interactivos** con efectos hover y animaciones
- **Gradientes y colores** que reflejan el estado de las métricas
- **Iconos intuitivos** para cada tipo de métrica
- **Responsive design** que funciona en todos los dispositivos

## API Endpoint

### GET `/api/superadmin/analytics`

Retorna las métricas calculadas del ecosistema Metanoia.

#### Respuesta

```json
{
  "success": true,
  "data": {
    "mrr": {
      "current": 57500,
      "growth": 15.0,
      "trend": [...]
    },
    "churn": {
      "rate": 5.2,
      "trend": [...]
    },
    "customers": {
      "total": 25,
      "active": 23,
      "growth": {...}
    },
    "users": {
      "total": 82,
      "trend": [...]
    },
    "modules": [...],
    "summary": {...}
  }
}
```

## Componentes Técnicos

### Librerías Utilizadas

- **recharts**: Para gráficos interactivos y responsivos
- **shadcn/ui**: Para componentes de UI consistentes
- **Lucide React**: Para iconos modernos
- **Tailwind CSS**: Para estilos y animaciones

### Tipos de Gráficos

1. **BarChart**: Módulos más populares
2. **AreaChart**: Tendencias de ingresos
3. **LineChart**: Crecimiento de usuarios
4. **Cards**: Métricas principales con iconos

## Funcionalidades

### 🔄 Actualización en Tiempo Real

- Botón de actualización manual
- Indicadores de carga
- Manejo de errores

### 📱 Responsive Design

- Grid adaptativo para diferentes pantallas
- Gráficos que se ajustan al contenedor
- Navegación optimizada para móviles

### 🎯 Accesibilidad

- Colores con suficiente contraste
- Iconos descriptivos
- Texto alternativo para gráficos
- Navegación por teclado

## Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Permisos

- Solo usuarios con rol `SUPER_ADMIN` pueden acceder
- Verificación automática de permisos
- Redirección automática si no tiene acceso

## Uso

### Navegación

1. Acceder como Super Admin
2. Ir a `/super-admin`
3. Hacer clic en el botón "Analytics"
4. Explorar las métricas y gráficos

### Interpretación de Datos

- **MRR Verde**: Crecimiento positivo
- **Churn Rojo**: Indicador de alerta
- **Clientes Activos**: Base de ingresos
- **Módulos Populares**: Oportunidades de expansión

## Desarrollo

### Agregar Nuevas Métricas

1. Modificar el endpoint `/api/superadmin/analytics/route.ts`
2. Actualizar la interfaz `AnalyticsData`
3. Agregar el componente en la página
4. Actualizar los tipos TypeScript

### Personalizar Gráficos

```tsx
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#3B82F6" />
  </BarChart>
</ResponsiveContainer>
```

## Notas Técnicas

- Los datos son simulados para desarrollo
- En producción, integrar con Stripe para datos reales
- Considerar cache para mejorar rendimiento
- Implementar WebSockets para actualizaciones en tiempo real
