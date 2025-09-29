'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateEmployeeSchema,
  CreateEmployeeInput,
} from '@/lib/validations/employee'

export default function NewEmployeePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [employees, setEmployees] = useState<
    Array<{
      id: string
      firstName: string
      lastName: string
      employeeNumber: string
    }>
  >([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(CreateEmployeeSchema),
  })

  useEffect(() => {
    if (user) {
      fetchEmployees()
    }
  }, [user])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/hr/employees?limit=100')
      const result = await response.json()

      if (result.success) {
        setEmployees(result.data.employees)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const onSubmit = async (data: CreateEmployeeInput) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/hr/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        router.push('/dashboard/hr/employees')
      } else {
        alert('Error al crear empleado: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      alert('Error al crear empleado')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="btn-ghost-modern"
            >
              <Link href="/dashboard/hr/employees">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Empleados
              </Link>
            </Button>
            <div>
              <h1 className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                Nuevo Empleado
              </h1>
              <p className="text-muted-foreground">
                Registra un nuevo empleado en el sistema
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información Personal */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos personales del empleado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="employeeNumber">Número de Empleado</Label>
                  <Input
                    id="employeeNumber"
                    {...register('employeeNumber')}
                    placeholder="Ej: 1001"
                  />
                  {errors.employeeNumber && (
                    <p className="text-sm text-red-500">
                      {errors.employeeNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="Ej: Juan"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Ej: Pérez"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="Ej: juan.perez@empresa.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="Ej: +57 300 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="personalEmail">Email Personal</Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    {...register('personalEmail')}
                    placeholder="Ej: juan.perez@gmail.com"
                  />
                  {errors.personalEmail && (
                    <p className="text-sm text-red-500">
                      {errors.personalEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select onValueChange={value => setValue('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar género" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Femenino">Femenino</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                      <SelectItem value="Prefiero no decir">
                        Prefiero no decir
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Estado Civil</Label>
                  <Select
                    onValueChange={value => setValue('maritalStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado civil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Soltero">Soltero</SelectItem>
                      <SelectItem value="Casado">Casado</SelectItem>
                      <SelectItem value="Divorciado">Divorciado</SelectItem>
                      <SelectItem value="Viudo">Viudo</SelectItem>
                      <SelectItem value="Unión Libre">Unión Libre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidad</Label>
                  <Input
                    id="nationality"
                    {...register('nationality')}
                    placeholder="Ej: Colombiano"
                  />
                  {errors.nationality && (
                    <p className="text-sm text-red-500">
                      {errors.nationality.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Textarea
                  id="address"
                  {...register('address')}
                  placeholder="Dirección completa del empleado"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información Laboral */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Información Laboral</CardTitle>
              <CardDescription>
                Datos relacionados con el trabajo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo *</Label>
                  <Input
                    id="position"
                    {...register('position')}
                    placeholder="Ej: Desarrollador Frontend"
                  />
                  {errors.position && (
                    <p className="text-sm text-red-500">
                      {errors.position.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento *</Label>
                  <Select
                    onValueChange={value => setValue('department', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administración">
                        Administración
                      </SelectItem>
                      <SelectItem value="Ventas">Ventas</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                      <SelectItem value="Soporte">Soporte</SelectItem>
                      <SelectItem value="Finanzas">Finanzas</SelectItem>
                      <SelectItem value="RRHH">RRHH</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-500">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Tipo de Contrato *</Label>
                  <Select
                    onValueChange={value =>
                      setValue('employmentType', value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de contrato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">Tiempo Completo</SelectItem>
                      <SelectItem value="PART_TIME">Medio Tiempo</SelectItem>
                      <SelectItem value="CONTRACT">Por Contrato</SelectItem>
                      <SelectItem value="TEMPORARY">Temporal</SelectItem>
                      <SelectItem value="INTERN">Practicante</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.employmentType && (
                    <p className="text-sm text-red-500">
                      {errors.employmentType.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hireDate">Fecha de Contratación *</Label>
                  <Input id="hireDate" type="date" {...register('hireDate')} />
                  {errors.hireDate && (
                    <p className="text-sm text-red-500">
                      {errors.hireDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salario</Label>
                  <Input
                    id="salary"
                    type="number"
                    step="0.01"
                    {...register('salary', { valueAsNumber: true })}
                    placeholder="Ej: 3000000"
                  />
                  {errors.salary && (
                    <p className="text-sm text-red-500">
                      {errors.salary.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="managerId">Jefe Directo</Label>
                  <Select onValueChange={value => setValue('managerId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar jefe directo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin jefe directo</SelectItem>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName} (#
                          {employee.employeeNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Contacto de Emergencia */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Contacto de Emergencia</CardTitle>
              <CardDescription>
                Información de contacto en caso de emergencia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Nombre del Contacto</Label>
                  <Input
                    id="emergencyContact"
                    {...register('emergencyContact')}
                    placeholder="Ej: María Pérez"
                  />
                  {errors.emergencyContact && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContact.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                  <Input
                    id="emergencyPhone"
                    {...register('emergencyPhone')}
                    placeholder="Ej: +57 300 987 6543"
                  />
                  {errors.emergencyPhone && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Información Adicional</CardTitle>
              <CardDescription>Habilidades y notas adicionales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skills">Habilidades</Label>
                <Textarea
                  id="skills"
                  {...register('skills')}
                  placeholder="Lista las habilidades del empleado separadas por comas"
                  rows={3}
                />
                {errors.skills && (
                  <p className="text-sm text-red-500">
                    {errors.skills.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Notas adicionales sobre el empleado"
                  rows={3}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/hr/employees">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Link>
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-gradient"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Empleado
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
