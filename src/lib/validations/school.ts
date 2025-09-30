import { z } from 'zod'

// ========================================
// VALIDACIONES PARA EL MÓDULO DE COLEGIOS
// ========================================

// Estudiante
export const SchoolStudentSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  dateOfBirth: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de nacimiento inválida',
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medicalNotes: z.string().optional(),

  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  studentCode: z
    .string()
    .min(3, 'El código de estudiante debe tener al menos 3 caracteres'),
  grade: z.string().min(1, 'El grado es requerido'),
  section: z.string().optional(),
  enrollmentDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de matrícula inválida',
  }),
  status: z
    .enum([
      'ACTIVE',
      'INACTIVE',
      'GRADUATED',
      'TRANSFERRED',
      'EXPELLED',
      'WITHDRAWN',
    ])
    .default('ACTIVE'),

  photoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type SchoolStudentInput = z.infer<typeof SchoolStudentSchema>

// Padre/Tutor
export const SchoolParentSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  relationship: z.enum([
    'FATHER',
    'MOTHER',
    'GUARDIAN',
    'GRANDPARENT',
    'OTHER',
  ]),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
  cellPhone: z.string().optional(),
  workPhone: z.string().optional(),
  occupation: z.string().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  isPrimaryContact: z.boolean().default(false),
  canPickup: z.boolean().default(true),
  emergencyContact: z.boolean().default(false),

  photoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type SchoolParentInput = z.infer<typeof SchoolParentSchema>

// Docente
export const SchoolTeacherSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  dateOfBirth: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de nacimiento inválida',
    })
    .optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
  cellPhone: z.string().optional(),

  teacherCode: z
    .string()
    .min(3, 'El código de docente debe tener al menos 3 caracteres'),
  specialization: z
    .string()
    .min(2, 'La especialización debe tener al menos 2 caracteres'),
  degree: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  certifications: z.string().optional(),
  hireDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de contratación inválida',
  }),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'])
    .default('ACTIVE'),

  employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'SUBSTITUTE']),
  salary: z.number().positive('El salario debe ser positivo').optional(),
  department: z.string().optional(),

  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  photoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type SchoolTeacherInput = z.infer<typeof SchoolTeacherSchema>

// Grado/Nivel
export const SchoolGradeLevelSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(1, 'El código es requerido'),
  level: z
    .string()
    .refine(
      val => ['preschool', 'elementary', 'middle', 'high'].includes(val),
      {
        message: 'Nivel inválido',
      }
    ),
  description: z.string().optional(),
  capacity: z
    .number()
    .int()
    .positive('La capacidad debe ser positiva')
    .optional(),
})

export type SchoolGradeLevelInput = z.infer<typeof SchoolGradeLevelSchema>

// Sección
export const SchoolSectionSchema = z.object({
  gradeLevelId: z.string().min(1, 'El grado es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  code: z.string().min(1, 'El código es requerido'),
  capacity: z.number().int().positive('La capacidad debe ser positiva'),
  academicYear: z.string().min(4, 'El año académico es requerido'),
})

export type SchoolSectionInput = z.infer<typeof SchoolSectionSchema>

// Materia/Asignatura
export const SchoolSubjectSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(1, 'El código es requerido'),
  description: z.string().optional(),
  credits: z
    .number()
    .int()
    .positive('Los créditos deben ser positivos')
    .optional(),
  hoursPerWeek: z
    .number()
    .int()
    .positive('Las horas por semana deben ser positivas')
    .optional(),
  gradeLevelId: z.string().optional(),
  teacherId: z.string().optional(),
})

export type SchoolSubjectInput = z.infer<typeof SchoolSubjectSchema>

// Horario
export const SchoolScheduleSchema = z.object({
  subjectId: z.string().min(1, 'La materia es requerida'),
  teacherId: z.string().min(1, 'El docente es requerido'),
  sectionId: z.string().min(1, 'La sección es requerida'),
  dayOfWeek: z
    .number()
    .int()
    .min(0, 'El día debe estar entre 0 y 6')
    .max(6, 'El día debe estar entre 0 y 6'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora de inicio inválida (formato: HH:MM)',
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora de fin inválida (formato: HH:MM)',
  }),
  classroom: z.string().optional(),
  academicYear: z.string().min(4, 'El año académico es requerido'),
})

export type SchoolScheduleInput = z.infer<typeof SchoolScheduleSchema>

// Matrícula
export const SchoolEnrollmentSchema = z.object({
  studentId: z.string().min(1, 'El estudiante es requerido'),
  sectionId: z.string().min(1, 'La sección es requerida'),
  academicYear: z.string().min(4, 'El año académico es requerido'),
  enrollmentDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de matrícula inválida',
  }),
  status: z
    .enum(['ENROLLED', 'WITHDRAWN', 'TRANSFERRED', 'GRADUATED', 'EXPELLED'])
    .default('ENROLLED'),
  notes: z.string().optional(),
})

export type SchoolEnrollmentInput = z.infer<typeof SchoolEnrollmentSchema>

// Calificación
export const SchoolGradeSchema = z.object({
  studentId: z.string().min(1, 'El estudiante es requerido'),
  subjectId: z.string().min(1, 'La materia es requerida'),
  academicYear: z.string().min(4, 'El año académico es requerido'),
  term: z.string().min(1, 'El período es requerido'),
  gradeValue: z.number().min(0, 'La calificación debe ser mayor o igual a 0'),
  maxGradeValue: z
    .number()
    .positive('La calificación máxima debe ser positiva')
    .default(100),
  gradeType: z
    .enum(['NUMERICAL', 'LETTER', 'PASS_FAIL', 'DESCRIPTIVE'])
    .default('NUMERICAL'),
  comments: z.string().optional(),
})

export type SchoolGradeInput = z.infer<typeof SchoolGradeSchema>

// Asistencia
export const SchoolAttendanceSchema = z.object({
  studentId: z.string().min(1, 'El estudiante es requerido'),
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha inválida',
  }),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'SICK']),
  arrivalTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Hora de llegada inválida (formato: HH:MM)',
    })
    .optional(),
  departureTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Hora de salida inválida (formato: HH:MM)',
    })
    .optional(),
  comments: z.string().optional(),
})

export type SchoolAttendanceInput = z.infer<typeof SchoolAttendanceSchema>

// Pago
export const SchoolPaymentSchema = z.object({
  studentId: z.string().min(1, 'El estudiante es requerido'),
  paymentType: z.enum([
    'ENROLLMENT',
    'TUITION',
    'TRANSPORT',
    'CAFETERIA',
    'LIBRARY',
    'UNIFORM',
    'MATERIALS',
    'EXTRACURRICULAR',
    'OTHER',
  ]),
  amount: z.number().positive('El monto debe ser positivo'),
  dueDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de vencimiento inválida',
  }),
  paymentDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de pago inválida',
    })
    .optional(),
  status: z
    .enum(['PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED'])
    .default('PENDING'),
  concept: z.string().min(3, 'El concepto debe tener al menos 3 caracteres'),
  academicYear: z.string().min(4, 'El año académico es requerido'),
  month: z.string().optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  receiptNumber: z.string().optional(),
  notes: z.string().optional(),
})

export type SchoolPaymentInput = z.infer<typeof SchoolPaymentSchema>

// Registro Disciplinario
export const SchoolDisciplinarySchema = z.object({
  studentId: z.string().min(1, 'El estudiante es requerido'),
  incidentDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha del incidente inválida',
  }),
  incidentType: z.enum([
    'BEHAVIORAL',
    'ACADEMIC',
    'ATTENDANCE',
    'BULLYING',
    'VIOLENCE',
    'THEFT',
    'OTHER',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  action: z
    .string()
    .min(5, 'La acción tomada debe tener al menos 5 caracteres'),
  reportedBy: z.string().min(3, 'El nombre del reportero es requerido'),
  status: z.enum(['OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED']).default('OPEN'),
  resolvedDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de resolución inválida',
    })
    .optional(),
  notes: z.string().optional(),
})

export type SchoolDisciplinaryInput = z.infer<typeof SchoolDisciplinarySchema>

// Libro de Biblioteca
export const SchoolLibraryBookSchema = z.object({
  isbn: z.string().optional(),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  author: z.string().min(2, 'El autor debe tener al menos 2 caracteres'),
  publisher: z.string().optional(),
  publishYear: z
    .number()
    .int()
    .min(1900, 'El año de publicación debe ser mayor a 1900')
    .max(new Date().getFullYear(), 'El año de publicación no puede ser futuro')
    .optional(),
  category: z.string().min(2, 'La categoría es requerida'),
  language: z.string().default('Español'),
  totalCopies: z
    .number()
    .int()
    .positive('El total de copias debe ser positivo'),
  availableCopies: z
    .number()
    .int()
    .min(0, 'Las copias disponibles no pueden ser negativas'),
  location: z.string().optional(),
  status: z
    .enum([
      'AVAILABLE',
      'CHECKED_OUT',
      'RESERVED',
      'MAINTENANCE',
      'LOST',
      'DAMAGED',
    ])
    .default('AVAILABLE'),
  coverUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  description: z.string().optional(),
  notes: z.string().optional(),
})

export type SchoolLibraryBookInput = z.infer<typeof SchoolLibraryBookSchema>

// Préstamo de Biblioteca
export const SchoolLibraryLoanSchema = z.object({
  bookId: z.string().min(1, 'El libro es requerido'),
  studentId: z.string().min(1, 'El estudiante es requerido'),
  loanDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de préstamo inválida',
    })
    .default(new Date().toISOString()),
  dueDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de devolución inválida',
  }),
  returnDate: z
    .string()
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Fecha de devolución inválida',
    })
    .optional(),
  status: z.enum(['ACTIVE', 'RETURNED', 'OVERDUE', 'LOST']).default('ACTIVE'),
  notes: z.string().optional(),
})

export type SchoolLibraryLoanInput = z.infer<typeof SchoolLibraryLoanSchema>

// Ruta de Transporte
export const SchoolTransportRouteSchema = z.object({
  routeName: z.string().min(2, 'El nombre de la ruta es requerido'),
  routeCode: z.string().min(1, 'El código de la ruta es requerido'),
  description: z.string().optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora de inicio inválida (formato: HH:MM)',
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora de fin inválida (formato: HH:MM)',
  }),
  driverName: z.string().min(3, 'El nombre del conductor es requerido'),
  driverPhone: z.string().min(8, 'El teléfono del conductor es requerido'),
  vehiclePlate: z.string().min(5, 'La placa del vehículo es requerida'),
  vehicleModel: z.string().optional(),
  vehicleCapacity: z
    .number()
    .int()
    .positive('La capacidad del vehículo debe ser positiva'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  notes: z.string().optional(),
})

export type SchoolTransportRouteInput = z.infer<
  typeof SchoolTransportRouteSchema
>

// Asignación de Transporte
export const SchoolTransportAssignmentSchema = z.object({
  routeId: z.string().min(1, 'La ruta es requerida'),
  studentId: z.string().min(1, 'El estudiante es requerido'),
  pickupAddress: z
    .string()
    .min(5, 'La dirección de recogida debe tener al menos 5 caracteres'),
  pickupTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora de recogida inválida (formato: HH:MM)',
  }),
  dropoffAddress: z
    .string()
    .min(5, 'La dirección de entrega debe tener al menos 5 caracteres'),
  dropoffTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Hora de entrega inválida (formato: HH:MM)',
  }),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
})

export type SchoolTransportAssignmentInput = z.infer<
  typeof SchoolTransportAssignmentSchema
>

// Menú de Comedor
export const SchoolCafeteriaMenuSchema = z.object({
  date: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha inválida',
  }),
  mealType: z.enum(['BREAKFAST', 'LUNCH', 'SNACK', 'DINNER']),
  menuName: z.string().min(3, 'El nombre del menú es requerido'),
  description: z.string().optional(),
  calories: z
    .number()
    .int()
    .positive('Las calorías deben ser positivas')
    .optional(),
  proteins: z.number().positive('Las proteínas deben ser positivas').optional(),
  carbohydrates: z
    .number()
    .positive('Los carbohidratos deben ser positivos')
    .optional(),
  fats: z.number().positive('Las grasas deben ser positivas').optional(),
})

export type SchoolCafeteriaMenuInput = z.infer<typeof SchoolCafeteriaMenuSchema>

// Asignación de Comedor
export const SchoolCafeteriaAssignmentSchema = z.object({
  studentId: z.string().min(1, 'El estudiante es requerido'),
  plan: z.enum(['FULL', 'PARTIAL', 'NONE']),
  dietaryRestrictions: z.string().optional(),
  allergies: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
})

export type SchoolCafeteriaAssignmentInput = z.infer<
  typeof SchoolCafeteriaAssignmentSchema
>

// Evaluación de Docente
export const SchoolEvaluationSchema = z.object({
  teacherId: z.string().min(1, 'El docente es requerido'),
  evaluationDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Fecha de evaluación inválida',
  }),
  evaluationType: z.enum([
    'ANNUAL',
    'SEMESTER',
    'QUARTERLY',
    'OBSERVATION',
    'PEER_REVIEW',
  ]),
  evaluator: z.string().min(3, 'El nombre del evaluador es requerido'),
  teaching: z
    .number()
    .min(1, 'La calificación debe ser entre 1 y 5')
    .max(5, 'La calificación debe ser entre 1 y 5'),
  planning: z
    .number()
    .min(1, 'La calificación debe ser entre 1 y 5')
    .max(5, 'La calificación debe ser entre 1 y 5'),
  discipline: z
    .number()
    .min(1, 'La calificación debe ser entre 1 y 5')
    .max(5, 'La calificación debe ser entre 1 y 5'),
  communication: z
    .number()
    .min(1, 'La calificación debe ser entre 1 y 5')
    .max(5, 'La calificación debe ser entre 1 y 5'),
  overall: z
    .number()
    .min(1, 'La calificación debe ser entre 1 y 5')
    .max(5, 'La calificación debe ser entre 1 y 5'),
  comments: z.string().optional(),
  recommendations: z.string().optional(),
})

export type SchoolEvaluationInput = z.infer<typeof SchoolEvaluationSchema>
