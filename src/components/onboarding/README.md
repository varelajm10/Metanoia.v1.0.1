# Tour de Bienvenida - OnboardingTour

## Descripción

El componente `OnboardingTour` proporciona una experiencia de bienvenida guiada para nuevos usuarios del sistema Metanoia. Utiliza la librería `driver.js` para crear un tour interactivo que resalta los elementos clave de la interfaz.

## Características

- **Tour automático**: Se inicia automáticamente para usuarios nuevos
- **Tour manual**: Botón flotante para iniciar el tour en cualquier momento
- **4 pasos guiados**: Navegación, Paleta de Comandos, Dashboard y Perfil
- **Responsive**: Funciona en todos los dispositivos
- **Accesible**: Cumple con estándares de accesibilidad

## Uso

### Integración Básica

```tsx
import OnboardingTour from '@/components/onboarding/OnboardingTour'

// Para usuarios nuevos (tour automático)
<OnboardingTour isFirstTime={true} />

// Para usuarios existentes (botón manual)
<OnboardingTour isFirstTime={false} />
```

### Props

- `isFirstTime?: boolean` - Si es true, inicia el tour automáticamente
- `onComplete?: () => void` - Callback ejecutado cuando el tour termina

## Pasos del Tour

1. **Navegación Principal** - Explica el header y logo de Metanoia
2. **Paleta de Comandos** - Muestra el acceso rápido con Cmd+K
3. **Dashboard Principal** - Resalta las métricas y módulos
4. **Perfil de Usuario** - Explica la información del usuario y logout

## Personalización

Para modificar los pasos del tour, edita el array `steps` en el método `startTour()`:

```tsx
steps: [
  {
    element: 'selector-css',
    popover: {
      title: 'Título del paso',
      description: 'Descripción detallada',
      side: 'bottom', // 'top', 'bottom', 'left', 'right'
      align: 'start'   // 'start', 'center', 'end'
    }
  }
]
```

## Dependencias

- `driver.js` - Librería para crear tours guiados
- `driver.js/dist/driver.css` - Estilos de driver.js

## Notas Técnicas

- El tour se inicia con un delay de 500ms para asegurar que los elementos estén renderizados
- Los selectores CSS deben ser específicos para evitar conflictos
- El componente es "use client" para funcionar en el lado del cliente
- Incluye manejo de estado para evitar múltiples tours simultáneos
