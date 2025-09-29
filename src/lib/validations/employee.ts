import { z } from 'zod'

// Enum values for validation
const EmploymentTypeEnum = z.enum([
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'TEMPORARY',
  'INTERN',
])
const EmployeeStatusEnum = z.enum([
  'ACTIVE',
  'INACTIVE',
  'TERMINATED',
  'ON_LEAVE',
])

// Schema para crear empleado
export const CreateEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, 'Número de empleado es requerido').max(20),
  firstName: z.string().min(1, 'Nombre es requerido').max(100),
  lastName: z.string().min(1, 'Apellido es requerido').max(100),
  email: z.string().email('Email inválido').max(255),
  phone: z.string().optional(),
  personalEmail: z
    .string()
    .email('Email personal inválido')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha de nacimiento inválida'),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  position: z.string().min(1, 'Cargo es requerido').max(100),
  department: z.string().min(1, 'Departamento es requerido').max(100),
  employmentType: EmploymentTypeEnum,
  hireDate: z
    .string()
    .min(1, 'Fecha de contratación es requerida')
    .refine(val => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha de contratación inválida'),
  terminationDate: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha de terminación inválida'),
  salary: z.number().positive('Salario debe ser positivo').optional(),
  managerId: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  skills: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

// Schema para actualizar empleado
export const UpdateEmployeeSchema = CreateEmployeeSchema.partial()

// Schema para nómina
export const CreatePayrollSchema = z.object({
  employeeId: z.string().min(1, 'ID de empleado es requerido'),
  period: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Período debe estar en formato YYYY-MM'),
  basicSalary: z.number().positive('Salario básico debe ser positivo'),
  overtimePay: z
    .number()
    .min(0, 'Pago de horas extra no puede ser negativo')
    .default(0),
  bonuses: z.number().min(0, 'Bonos no pueden ser negativos').default(0),
  allowances: z
    .number()
    .min(0, 'Asignaciones no pueden ser negativos')
    .default(0),
  taxes: z.number().min(0, 'Impuestos no pueden ser negativos').default(0),
  socialSecurity: z
    .number()
    .min(0, 'Seguridad social no puede ser negativo')
    .default(0),
  healthInsurance: z
    .number()
    .min(0, 'Seguro de salud no puede ser negativo')
    .default(0),
  otherDeductions: z
    .number()
    .min(0, 'Otras deducciones no pueden ser negativas')
    .default(0),
  notes: z.string().optional(),
})

export const UpdatePayrollSchema = CreatePayrollSchema.partial()

// Schema para vacaciones
const VacationTypeEnum = z.enum([
  'ANNUAL',
  'SICK',
  'MATERNITY',
  'PATERNITY',
  'EMERGENCY',
  'UNPAID',
])
const VacationStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
])

export const CreateVacationSchema = z
  .object({
    employeeId: z.string().min(1, 'ID de empleado es requerido'),
    type: VacationTypeEnum,
    startDate: z
      .string()
      .min(1, 'Fecha de inicio es requerida')
      .refine(val => {
        const date = new Date(val)
        return !isNaN(date.getTime())
      }, 'Fecha de inicio inválida'),
    endDate: z
      .string()
      .min(1, 'Fecha de fin es requerida')
      .refine(val => {
        const date = new Date(val)
        return !isNaN(date.getTime())
      }, 'Fecha de fin inválida'),
    reason: z.string().optional(),
  })
  .refine(
    data => {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      return endDate >= startDate
    },
    {
      message:
        'La fecha de fin debe ser posterior o igual a la fecha de inicio',
      path: ['endDate'],
    }
  )

export const UpdateVacationSchema = z.object({
  status: VacationStatusEnum,
  rejectionReason: z.string().optional(),
})

// Schema para evaluaciones de desempeño
const PerformanceTypeEnum = z.enum([
  'PROBATION',
  'ANNUAL',
  'QUARTERLY',
  'PROJECT_BASED',
])
const PerformanceStatusEnum = z.enum([
  'DRAFT',
  'IN_PROGRESS',
  'COMPLETED',
  'REVIEWED',
])

export const CreatePerformanceSchema = z.object({
  employeeId: z.string().min(1, 'ID de empleado es requerido'),
  reviewPeriod: z.string().min(1, 'Período de revisión es requerido'),
  reviewType: PerformanceTypeEnum,
  overallScore: z.number().min(1).max(5).optional(),
  technicalSkills: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  teamwork: z.number().min(1).max(5).optional(),
  leadership: z.number().min(1).max(5).optional(),
  punctuality: z.number().min(1).max(5).optional(),
  strengths: z.string().optional(),
  areasForImprovement: z.string().optional(),
  goals: z.string().optional(),
  comments: z.string().optional(),
})

export const UpdatePerformanceSchema = CreatePerformanceSchema.partial()

// Schema para asistencia
const AttendanceStatusEnum = z.enum([
  'PRESENT',
  'ABSENT',
  'LATE',
  'SICK_LEAVE',
  'VACATION',
  'HOLIDAY',
])

export const CreateAttendanceSchema = z.object({
  employeeId: z.string().min(1, 'ID de empleado es requerido'),
  date: z
    .string()
    .min(1, 'Fecha es requerida')
    .refine(val => {
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Fecha inválida'),
  clockIn: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Hora de entrada inválida'),
  clockOut: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Hora de salida inválida'),
  breakStart: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Hora de inicio de descanso inválida'),
  breakEnd: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true
      const date = new Date(val)
      return !isNaN(date.getTime())
    }, 'Hora de fin de descanso inválida'),
  status: AttendanceStatusEnum,
  notes: z.string().optional(),
})

export const UpdateAttendanceSchema = CreateAttendanceSchema.partial()

// Tipos TypeScript derivados de los schemas
export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>
export type CreatePayrollInput = z.infer<typeof CreatePayrollSchema>
export type UpdatePayrollInput = z.infer<typeof UpdatePayrollSchema>
export type CreateVacationInput = z.infer<typeof CreateVacationSchema>
export type UpdateVacationInput = z.infer<typeof UpdateVacationSchema>
export type CreatePerformanceInput = z.infer<typeof CreatePerformanceSchema>
export type UpdatePerformanceInput = z.infer<typeof UpdatePerformanceSchema>
export type CreateAttendanceInput = z.infer<typeof CreateAttendanceSchema>
export type UpdateAttendanceInput = z.infer<typeof UpdateAttendanceSchema>
