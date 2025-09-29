'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Monitor, Wifi, WifiOff } from 'lucide-react'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginForm = z.infer<typeof loginSchema>

// Componente del Logo de Metanoia
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(true)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError('')

    try {
      const success = await login(data.email, data.password)
      if (!success) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

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
            <span className="text-sm">Sistema ERP Modular Matias 1.0.2</span>
          </div>
          <p className="max-w-sm text-xs">
            Transforma tu negocio con nuestra plataforma de gestión empresarial
            modular y escalable.
          </p>
        </div>
      </div>

      {/* Panel derecho con formulario de login */}
      <div className="flex w-full flex-col justify-center bg-white p-8 lg:w-1/2 lg:p-12">
        {/* Header móvil */}
        <div className="mb-8 text-center lg:hidden">
          <MetanoiaLogo />
        </div>

        {/* Título del formulario */}
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600">Accede a tu cuenta de Metanoia</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              className={`h-12 border-gray-300 px-4 focus:border-primary focus:ring-primary ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                {...register('password')}
                className={`h-12 border-gray-300 px-4 pr-12 focus:border-primary focus:ring-primary ${
                  errors.password ? 'border-red-500' : ''
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Estado de conexión */}
          <div className="flex items-center space-x-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Conectado</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Sin conexión</span>
              </>
            )}
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Botón de login */}
          <Button
            type="submit"
            className="h-12 w-full bg-gradient-to-r from-primary to-accent font-medium text-white shadow-lg transition-all duration-200 hover:from-primary/90 hover:to-accent/90 hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        {/* Credenciales de prueba */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            Credenciales de Prueba:
          </h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div>
              <p className="font-medium">Administrador Metanoia:</p>
              <p>Email: admin@metanoia.click</p>
              <p>Contraseña: metanoia123</p>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="font-medium">Administrador Ariel:</p>
              <p>Email: admin@ariel.com</p>
              <p>Contraseña: ariel123</p>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="font-medium">Usuario Ariel:</p>
              <p>Email: usuario@ariel.com</p>
              <p>Contraseña: usuario123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            © 2025{' '}
            <a
              href="https://metanoia.click"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary transition-colors hover:text-primary/80"
            >
              metanoia.click
            </a>{' '}
            - Matias 1.0.2
          </p>
          <Link
            href="/"
            className="text-primary transition-colors hover:text-primary/80"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
