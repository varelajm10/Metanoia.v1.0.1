import { z } from 'zod'

// ========================================
// VALIDACIONES PARA EL MÓDULO DE ASCENSORES
// ========================================

// Cliente de ascensores
export const ElevatorClientSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  company: z.string().optional(),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  state: z.string().min(2, 'El estado debe tener al menos 2 caracteres'),
  zipCode: z.string().optional(),
  country: z.string().default('México'),

  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z
    .string()
    .email('Email de contacto inválido')
    .optional()
    .or(z.literal('')),

  clientType: z
    .enum([
      'INDIVIDUAL',
      'COMPANY',
      'PROPERTY_MANAGER',
      'CONSTRUCTOR',
      'ARCHITECT',
      'GOVERNMENT',
    ])
    .default('INDIVIDUAL'),
  industry: z.string().optional(),
  annualRevenue: z.number().optional(),

  status: z
    .enum(['ACTIVE', 'INACTIVE', 'PROSPECTIVE', 'SUSPENDED'])
    .default('ACTIVE'),
  notes: z.string().optional(),
})

export type ElevatorClientInput = z.infer<typeof ElevatorClientSchema>

// Ascensor
export const ElevatorSchema = z.object({
  serialNumber: z
    .string()
    .min(3, 'El número de serie debe tener al menos 3 caracteres'),
  model: z.string().min(2, 'El modelo debe tener al menos 2 caracteres'),
  brand: z.string().min(2, 'La marca debe tener al menos 2 caracteres'),
  capacity: z
    .number()
    .int()
    .positive('La capacidad debe ser un número positivo'),
  floors: z
    .number()
    .int()
    .positive('El número de pisos debe ser un número positivo'),
  speed: z.number().positive('La velocidad debe ser un número positivo'),

  motorType: z.string().optional(),
  controlSystem: z.string().optional(),
  doorType: z.string().optional(),
  carDimensions: z.string().optional(),
  shaftDimensions: z.string().optional(),
  machineLocation: z.string().optional(),
  driveType: z.string().optional(),

  buildingName: z
    .string()
    .min(2, 'El nombre del edificio debe tener al menos 2 caracteres'),
  buildingAddress: z
    .string()
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
  buildingType: z.string().optional(),
  floorLocation: z.string().optional(),
  shaftNumber: z.string().optional(),

  status: z
    .enum([
      'OPERATIONAL',
      'OUT_OF_SERVICE',
      'UNDER_MAINTENANCE',
      'UNDER_INSPECTION',
      'DECOMMISSIONED',
      'EMERGENCY_STOP',
    ])
    .default('OPERATIONAL'),
  installationDate: z.string().optional(),
  commissioningDate: z.string().optional(),
  lastInspection: z.string().optional(),
  nextInspection: z.string().optional(),

  maintenanceFrequency: z.string().optional(),
  warrantyExpiry: z.string().optional(),
  manufacturingYear: z.number().int().optional(),

  certificationNumber: z.string().optional(),
  certificationExpiry: z.string().optional(),
  regulatoryBody: z.string().optional(),

  notes: z.string().optional(),
  specifications: z.any().optional(),
  documents: z.any().optional(),
  photos: z.any().optional(),

  clientId: z.string().min(1, 'El cliente es requerido'),
})

export type ElevatorInput = z.infer<typeof ElevatorSchema>

// Instalación
export const InstallationSchema = z.object({
  projectNumber: z
    .string()
    .min(3, 'El número de proyecto debe tener al menos 3 caracteres'),
  projectName: z
    .string()
    .min(3, 'El nombre del proyecto debe tener al menos 3 caracteres'),
  description: z.string().optional(),

  startDate: z.string(),
  plannedEndDate: z.string(),
  actualEndDate: z.string().optional(),

  status: z
    .enum([
      'PLANNED',
      'IN_PROGRESS',
      'TESTING',
      'COMPLETED',
      'ON_HOLD',
      'CANCELLED',
    ])
    .default('PLANNED'),
  progress: z.number().int().min(0).max(100).default(0),

  projectManager: z.string().optional(),
  teamMembers: z.array(z.string()).optional().default([]),
  budget: z.number().optional(),
  actualCost: z.number().optional(),

  siteAddress: z
    .string()
    .min(5, 'La dirección del sitio debe tener al menos 5 caracteres'),
  siteContact: z.string().optional(),
  sitePhone: z.string().optional(),

  elevatorType: z.string().min(2, 'El tipo de ascensor es requerido'),
  numberOfElevators: z
    .number()
    .int()
    .positive('El número de ascensores debe ser mayor a 0'),

  milestones: z.any().optional(),
  permits: z.any().optional(),

  notes: z.string().optional(),
  documents: z.any().optional(),
  photos: z.any().optional(),

  clientId: z.string().min(1, 'El cliente es requerido'),
  elevatorId: z.string().optional(),
})

export type InstallationInput = z.infer<typeof InstallationSchema>

// Contrato de mantenimiento
export const MaintenanceContractSchema = z.object({
  contractNumber: z
    .string()
    .min(3, 'El número de contrato debe tener al menos 3 caracteres'),
  contractName: z
    .string()
    .min(3, 'El nombre del contrato debe tener al menos 3 caracteres'),
  description: z.string().optional(),

  startDate: z.string(),
  endDate: z.string(),
  autoRenew: z.boolean().default(false),

  contractType: z
    .enum(['PREVENTIVE', 'FULL_SERVICE', 'EMERGENCY_ONLY', 'INSPECTION_ONLY'])
    .default('PREVENTIVE'),
  frequency: z.string().min(2, 'La frecuencia es requerida'),
  visitsPerYear: z
    .number()
    .int()
    .positive('El número de visitas debe ser mayor a 0'),

  monthlyFee: z.number().optional(),
  annualFee: z.number().optional(),
  emergencyRate: z.number().optional(),
  sparesIncluded: z.boolean().default(false),

  serviceScope: z.any().optional(),
  responseTime: z.string().optional(),
  coverage: z.string().optional(),

  status: z
    .enum(['ACTIVE', 'EXPIRED', 'SUSPENDED', 'CANCELLED', 'PENDING_RENEWAL'])
    .default('ACTIVE'),

  notes: z.string().optional(),
  terms: z.string().optional(),

  clientId: z.string().min(1, 'El cliente es requerido'),
})

export type MaintenanceContractInput = z.infer<typeof MaintenanceContractSchema>

// Registro de mantenimiento
export const MaintenanceRecordSchema = z.object({
  recordNumber: z
    .string()
    .min(3, 'El número de registro debe tener al menos 3 caracteres'),
  maintenanceType: z
    .enum([
      'PREVENTIVE',
      'CORRECTIVE',
      'EMERGENCY',
      'INSPECTION',
      'MODERNIZATION',
    ])
    .default('PREVENTIVE'),

  scheduledDate: z.string(),
  actualDate: z.string().optional(),
  completedDate: z.string().optional(),

  description: z.string().optional(),
  findings: z.string().optional(),
  workPerformed: z.string().optional(),

  status: z
    .enum([
      'SCHEDULED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'PENDING_PARTS',
    ])
    .default('SCHEDULED'),
  priority: z
    .enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY'])
    .default('NORMAL'),

  technicianIds: z.array(z.string()).optional().default([]),
  hoursWorked: z.number().optional(),

  sparePartsUsed: z.any().optional(),
  totalCost: z.number().optional(),

  checklist: z.any().optional(),
  testResults: z.any().optional(),

  photos: z.any().optional(),
  signature: z.string().optional(),
  clientFeedback: z.string().optional(),

  notes: z.string().optional(),
  nextAction: z.string().optional(),

  elevatorId: z.string().min(1, 'El ascensor es requerido'),
  contractId: z.string().optional(),
})

export type MaintenanceRecordInput = z.infer<typeof MaintenanceRecordSchema>

// Inspección
export const InspectionSchema = z.object({
  inspectionNumber: z
    .string()
    .min(3, 'El número de inspección debe tener al menos 3 caracteres'),
  inspectionType: z
    .enum([
      'PERIODIC',
      'ANNUAL',
      'POST_INSTALLATION',
      'POST_MODERNIZATION',
      'SPECIAL',
      'EMERGENCY',
    ])
    .default('PERIODIC'),

  scheduledDate: z.string(),
  inspectionDate: z.string().optional(),
  expiryDate: z.string().optional(),

  inspector: z.string().min(2, 'El nombre del inspector es requerido'),
  inspectorLicense: z.string().optional(),
  regulatoryBody: z.string().optional(),

  status: z
    .enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED'])
    .default('SCHEDULED'),
  result: z
    .enum(['PASSED', 'FAILED', 'CONDITIONAL', 'PENDING_CORRECTIONS'])
    .optional(),
  score: z.number().int().min(0).max(100).optional(),

  findings: z.string().optional(),
  defects: z.any().optional(),
  recommendations: z.string().optional(),
  correctiveActions: z.string().optional(),

  certificateNumber: z.string().optional(),
  certificateIssued: z.boolean().default(false),
  certificateUrl: z.string().optional(),

  checklist: z.any().optional(),
  photos: z.any().optional(),
  documents: z.any().optional(),

  notes: z.string().optional(),

  elevatorId: z.string().min(1, 'El ascensor es requerido'),
})

export type InspectionInput = z.infer<typeof InspectionSchema>

// Técnico
export const ElevatorTechnicianSchema = z.object({
  employeeNumber: z
    .string()
    .min(2, 'El número de empleado debe tener al menos 2 caracteres'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(5, 'El teléfono debe tener al menos 5 caracteres'),

  specialization: z.array(z.string()).optional().default([]),
  certifications: z.any().optional(),
  experience: z.number().int().optional(),
  skillLevel: z
    .enum([
      'APPRENTICE',
      'JUNIOR',
      'INTERMEDIATE',
      'SENIOR',
      'MASTER',
      'SPECIALIST',
    ])
    .default('JUNIOR'),

  status: z
    .enum(['ACTIVE', 'ON_LEAVE', 'INACTIVE', 'TRAINING'])
    .default('ACTIVE'),
  availability: z.boolean().default(true),

  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),

  photo: z.string().optional(),
  documents: z.any().optional(),

  notes: z.string().optional(),
})

export type ElevatorTechnicianInput = z.infer<typeof ElevatorTechnicianSchema>

// Repuesto
export const ElevatorSparePartSchema = z.object({
  partNumber: z
    .string()
    .min(2, 'El número de parte debe tener al menos 2 caracteres'),
  partName: z
    .string()
    .min(2, 'El nombre de la parte debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  category: z.string().min(2, 'La categoría es requerida'),

  manufacturer: z.string().optional(),
  supplier: z.string().optional(),

  compatibleBrands: z.array(z.string()).optional().default([]),
  compatibleModels: z.array(z.string()).optional().default([]),

  currentStock: z.number().int().default(0),
  minStock: z.number().int().default(5),
  maxStock: z.number().int().optional(),
  location: z.string().optional(),

  unitCost: z.number().positive('El costo unitario debe ser mayor a 0'),
  unitPrice: z.number().positive('El precio unitario debe ser mayor a 0'),

  weight: z.number().optional(),
  dimensions: z.string().optional(),
  warranty: z.string().optional(),

  notes: z.string().optional(),
  photo: z.string().optional(),
})

export type ElevatorSparePartInput = z.infer<typeof ElevatorSparePartSchema>

// Orden de trabajo
export const WorkOrderSchema = z.object({
  workOrderNumber: z
    .string()
    .min(3, 'El número de orden debe tener al menos 3 caracteres'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),

  orderType: z
    .enum([
      'MAINTENANCE',
      'REPAIR',
      'INSTALLATION',
      'INSPECTION',
      'MODERNIZATION',
      'EMERGENCY',
    ])
    .default('MAINTENANCE'),
  priority: z
    .enum(['LOW', 'NORMAL', 'HIGH', 'URGENT', 'EMERGENCY'])
    .default('NORMAL'),

  scheduledDate: z.string().optional(),
  startDate: z.string().optional(),
  completedDate: z.string().optional(),
  dueDate: z.string().optional(),

  status: z
    .enum([
      'OPEN',
      'ASSIGNED',
      'IN_PROGRESS',
      'ON_HOLD',
      'COMPLETED',
      'CANCELLED',
      'CLOSED',
    ])
    .default('OPEN'),

  assignedTo: z.array(z.string()).optional().default([]),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),

  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),

  workPerformed: z.string().optional(),
  findings: z.string().optional(),
  resolution: z.string().optional(),

  materials: z.any().optional(),

  photos: z.any().optional(),
  documents: z.any().optional(),
  signature: z.string().optional(),

  clientFeedback: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),

  notes: z.string().optional(),

  elevatorId: z.string().optional(),
  installationId: z.string().optional(),
})

export type WorkOrderInput = z.infer<typeof WorkOrderSchema>
