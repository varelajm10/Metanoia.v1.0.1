'use client';

import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface OnboardingTourProps {
  isFirstTime?: boolean;
  onComplete?: () => void;
}

export default function OnboardingTour({ 
  isFirstTime = false, 
  onComplete 
}: OnboardingTourProps) {
  const [tourStarted, setTourStarted] = useState(false);

  useEffect(() => {
    if (isFirstTime && !tourStarted) {
      startTour();
    }
  }, [isFirstTime, tourStarted]);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: 'header',
          popover: {
            title: '🎯 Navegación Principal',
            description: 'Aquí encontrarás el logo de Metanoia y acceso a todas las funciones principales del sistema.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: 'button[class*="Search"]',
          popover: {
            title: '⚡ Paleta de Comandos',
            description: 'Presiona Cmd+K (o Ctrl+K) para acceder rápidamente a cualquier función. Es tu atajo más poderoso para navegar por el sistema.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: 'main',
          popover: {
            title: '📊 Dashboard Principal',
            description: 'Aquí verás todas tus métricas importantes, módulos activos y acceso rápido a todas las funciones de Metanoia.',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: 'button[class*="LogOut"]',
          popover: {
            title: '👤 Tu Perfil',
            description: 'Desde aquí puedes cerrar sesión y acceder a la configuración de tu cuenta. Tu información de usuario se muestra en la parte superior.',
            side: 'bottom',
            align: 'end'
          }
        }
      ],
      onDestroyStarted: () => {
        setTourStarted(false);
        onComplete?.();
      },
      onDestroyed: () => {
        setTourStarted(false);
        onComplete?.();
      }
    });

    // Pequeño delay para asegurar que los elementos estén renderizados
    setTimeout(() => {
      driverObj.drive();
      setTourStarted(true);
    }, 500);
  };

  const handleStartTour = () => {
    startTour();
  };

  // Si no es primera vez, mostrar botón para iniciar tour manualmente
  if (!isFirstTime) {
    return (
      <button
        onClick={handleStartTour}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2"
        title="Iniciar tour de bienvenida"
      >
        <span className="text-lg">🎯</span>
        Tour de Bienvenida
      </button>
    );
  }

  return null;
}
