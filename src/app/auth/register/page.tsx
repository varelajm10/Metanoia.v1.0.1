'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '@/lib/actions/auth-actions'

// Esquema de validación con Zod
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres'),
    lastName: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(50, 'El apellido no puede exceder 50 caracteres'),
    email: z
      .string()
      .email('Debe ser un email válido')
      .min(1, 'El email es requerido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
      ),
    confirmPassword: z.string(),
    companyName: z
      .string()
      .min(2, 'El nombre de la empresa debe tener al menos 2 caracteres')
      .max(100, 'El nombre de la empresa no puede exceder 100 caracteres'),
    companySlug: z
      .string()
      .min(2, 'El slug debe tener al menos 2 caracteres')
      .max(50, 'El slug no puede exceder 50 caracteres')
      .regex(
        /^[a-z0-9-]+$/,
        'El slug solo puede contener letras minúsculas, números y guiones'
      ),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const companyName = watch('companyName')

  // Generar slug automáticamente basado en el nombre de la empresa
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        companySlug: data.companySlug,
      })

      if (result.success) {
        // Redirigir al dashboard después del registro exitoso
        router.push('/dashboard')
      } else {
        setError(result.error || 'Error al crear la cuenta')
      }
    } catch (err) {
      setError('Error inesperado. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              inicia sesión si ya tienes una cuenta
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Información personal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className="mt-1"
                  placeholder="Tu nombre"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className="mt-1"
                  placeholder="Tu apellido"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1"
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="mt-1"
                  placeholder="Mínimo 8 caracteres"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="mt-1"
                  placeholder="Repite la contraseña"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Información de la empresa */}
            <div>
              <Label htmlFor="companyName">Nombre de la empresa</Label>
              <Input
                id="companyName"
                type="text"
                {...register('companyName')}
                className="mt-1"
                placeholder="Mi Empresa S.A."
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="companySlug">Slug de la empresa</Label>
              <Input
                id="companySlug"
                type="text"
                {...register('companySlug')}
                className="mt-1"
                placeholder="mi-empresa"
                onChange={e => {
                  const slug = generateSlug(e.target.value)
                  e.target.value = slug
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                Se usará para la URL de tu empresa: metanoia.click/
                {companyName ? generateSlug(companyName) : 'mi-empresa'}
              </p>
              {errors.companySlug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companySlug.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Al crear una cuenta, aceptas nuestros{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-500"
              >
                Política de Privacidad
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
