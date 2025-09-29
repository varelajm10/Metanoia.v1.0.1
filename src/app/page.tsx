import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Monitor } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Inicio - Matias 1.0.2',
  description: 'Sistema ERP SaaS modular con arquitectura multi-tenant',
}

// Componente del Logo de Metanoia (mismo que en login)
function MetanoiaLogo() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Logo SVG basado en la descripción */}
      <div className="relative mb-6">
        {/* Arco con gradiente */}
        <svg
          width="120"
          height="60"
          viewBox="0 0 120 60"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF6B35" />
              <stop offset="30%" stopColor="#FF8C42" />
              <stop offset="50%" stopColor="#FFD23F" />
              <stop offset="70%" stopColor="#06FFA5" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          {/* Arco principal */}
          <path
            d="M 10 50 Q 60 10 110 50"
            stroke="url(#arcGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          {/* Línea blanca inferior */}
          <path
            d="M 10 50 Q 60 10 110 50"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        {/* Círculo blanco flotante */}
        <div className="absolute -top-2 right-8 h-6 w-6 rounded-full bg-white shadow-lg"></div>
      </div>

      {/* Texto del logo */}
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-light text-white">metanoia.click</h1>
        <p className="text-sm font-light tracking-wider text-white/80">
          SMART CHANGE. REAL RESULTS.
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-black">
      {/* Panel izquierdo con logo y branding */}
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800 p-12 lg:flex lg:w-1/2">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,53,0.1),transparent_50%)]"></div>

        {/* Logo principal */}
        <MetanoiaLogo />

        {/* Información adicional */}
        <div className="mt-16 text-center text-white/60">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span className="text-sm">Sistema ERP Modular Matias 1.0.1</span>
          </div>
          <p className="max-w-sm text-xs">
            Transforma tu negocio con nuestra plataforma de gestión empresarial
            modular y escalable.
          </p>
        </div>
      </div>

      {/* Panel derecho con botón de inicio de sesión */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:p-12">
        {/* Header móvil */}
        <div className="mb-8 text-center lg:hidden">
          <MetanoiaLogo />
        </div>

        {/* Contenido principal */}
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-3xl font-semibold text-gray-900">
            Bienvenido a Metanoia
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Sistema ERP SaaS modular con arquitectura multi-tenant. Gestiona tu
            negocio de manera eficiente y escalable.
          </p>

          {/* Botón de inicio de sesión */}
          <Button
            asChild
            size="lg"
            className="h-14 w-full bg-gradient-to-r from-primary to-accent text-lg font-medium text-white shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-accent/90 hover:shadow-xl"
          >
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>
            © 2025 Metanoia{' '}
            <a
              href="https://metanoia.click"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary transition-colors hover:text-primary/80"
            >
              metanoia.click
            </a>{' '}
            v1.0.2
          </p>
        </div>
      </div>
    </div>
  )
}
