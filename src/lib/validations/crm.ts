import { z } from 'zod'

// Lead Schema
export const LeadSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  jobTitle: z.string().optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
  source: z
    .enum([
      'WEBSITE',
      'REFERRAL',
      'SOCIAL_MEDIA',
      'EMAIL_MARKETING',
      'EVENT',
      'COLD_CALL',
      'ADVERTISEMENT',
      'PARTNER',
      'OTHER',
    ])
    .default('WEBSITE'),
  status: z
    .enum([
      'NEW',
      'CONTACTED',
      'QUALIFIED',
      'PROPOSAL_SENT',
      'NEGOTIATING',
      'CLOSED_WON',
      'CLOSED_LOST',
      'NURTURING',
    ])
    .default('NEW'),
  score: z.number().min(0).max(100).default(0),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  notes: z.string().optional().or(z.literal('')),
  assignedTo: z.string().optional().or(z.literal('')),
  lastContact: z.string().optional().or(z.literal('')),
  nextFollowUp: z.string().optional().or(z.literal('')),
})

// Opportunity Schema
export const OpportunitySchema = z.object({
  name: z.string().min(1, 'El nombre de la oportunidad es requerido'),
  description: z.string().optional().or(z.literal('')),
  value: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number().min(0, 'El valor debe ser positivo')
  ),
  stage: z
    .enum([
      'PROSPECTING',
      'QUALIFICATION',
      'PROPOSAL',
      'NEGOTIATION',
      'CLOSED_WON',
      'CLOSED_LOST',
    ])
    .default('PROSPECTING'),
  probability: z.number().min(0).max(100).default(10),
  closeDate: z.string().optional().or(z.literal('')),
  leadId: z.string().min(1, 'Debe seleccionar un lead'),
  assignedTo: z.string().optional().or(z.literal('')),
})

// Contact Schema
export const ContactSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional().or(z.literal('')),
  mobile: z.string().optional().or(z.literal('')),
  jobTitle: z.string().optional().or(z.literal('')),
  department: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  industry: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  type: z
    .enum(['CUSTOMER', 'PROSPECT', 'PARTNER', 'VENDOR', 'COMPETITOR'])
    .default('CUSTOMER'),
  source: z
    .enum([
      'WEBSITE',
      'REFERRAL',
      'SOCIAL_MEDIA',
      'EMAIL_MARKETING',
      'EVENT',
      'COLD_CALL',
      'ADVERTISEMENT',
      'PARTNER',
      'OTHER',
    ])
    .default('WEBSITE'),
  lastContact: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

// Communication Schema
export const CommunicationSchema = z.object({
  type: z.enum([
    'EMAIL',
    'PHONE_CALL',
    'MEETING',
    'DEMO',
    'PRESENTATION',
    'PROPOSAL',
    'FOLLOW_UP',
    'NURTURING',
  ]),
  subject: z.string().optional().or(z.literal('')),
  content: z.string().min(1, 'El contenido es requerido'),
  direction: z.enum(['INBOUND', 'OUTBOUND']),
  status: z
    .enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'])
    .default('COMPLETED'),
  scheduledAt: z.string().optional().or(z.literal('')),
  completedAt: z.string().optional().or(z.literal('')),
  duration: z.number().min(0).optional(),
  leadId: z.string().optional().or(z.literal('')),
  opportunityId: z.string().optional().or(z.literal('')),
  contactId: z.string().optional().or(z.literal('')),
  assignedTo: z.string().optional().or(z.literal('')),
})

// Deal Schema
export const DealSchema = z.object({
  name: z.string().min(1, 'El nombre del deal es requerido'),
  description: z.string().optional().or(z.literal('')),
  value: z.preprocess(
    val => (val === '' ? undefined : Number(val)),
    z.number().min(0, 'El valor debe ser positivo')
  ),
  status: z
    .enum(['ACTIVE', 'CLOSED_WON', 'CLOSED_LOST', 'CANCELLED'])
    .default('ACTIVE'),
  closedDate: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  opportunityId: z.string().min(1, 'Debe seleccionar una oportunidad'),
  notes: z.string().optional().or(z.literal('')),
})

// Type exports - Comentados para evitar duplicación
// export type CreateLeadInput = z.infer<typeof LeadSchema>
// export type UpdateLeadInput = Partial<CreateLeadInput>

// export type CreateOpportunityInput = z.infer<typeof OpportunitySchema>
export type UpdateOpportunityInput = any

export type CreateContactInput = z.infer<typeof ContactSchema>
export type UpdateContactInput = Partial<CreateContactInput>

export type CreateCommunicationInput = z.infer<typeof CommunicationSchema>
export type UpdateCommunicationInput = Partial<CreateCommunicationInput>

export type CreateDealInput = z.infer<typeof DealSchema>
export type UpdateDealInput = Partial<CreateDealInput>

// Utility functions for formatting
export const formatLeadSource = (source: string) => {
  const sources: { [key: string]: string } = {
    WEBSITE: 'Sitio Web',
    REFERRAL: 'Referido',
    SOCIAL_MEDIA: 'Redes Sociales',
    EMAIL_MARKETING: 'Email Marketing',
    EVENT: 'Evento',
    COLD_CALL: 'Llamada Fría',
    ADVERTISEMENT: 'Publicidad',
    PARTNER: 'Socio',
    OTHER: 'Otro',
  }
  return sources[source] || source
}

export const formatLeadStatus = (status: string) => {
  const statuses: { [key: string]: string } = {
    NEW: 'Nuevo',
    CONTACTED: 'Contactado',
    QUALIFIED: 'Calificado',
    PROPOSAL_SENT: 'Propuesta Enviada',
    NEGOTIATING: 'Negociando',
    CLOSED_WON: 'Cerrado Ganado',
    CLOSED_LOST: 'Cerrado Perdido',
    NURTURING: 'Nutrición',
  }
  return statuses[status] || status
}

export const formatLeadPriority = (priority: string) => {
  const priorities: { [key: string]: string } = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    URGENT: 'Urgente',
  }
  return priorities[priority] || priority
}

export const formatOpportunityStage = (stage: string) => {
  const stages: { [key: string]: string } = {
    PROSPECTING: 'Prospección',
    QUALIFICATION: 'Calificación',
    PROPOSAL: 'Propuesta',
    NEGOTIATION: 'Negociación',
    CLOSED_WON: 'Cerrado Ganado',
    CLOSED_LOST: 'Cerrado Perdido',
  }
  return stages[stage] || stage
}

export const formatCommunicationType = (type: string) => {
  const types: { [key: string]: string } = {
    EMAIL: 'Email',
    PHONE_CALL: 'Llamada',
    MEETING: 'Reunión',
    DEMO: 'Demo',
    PRESENTATION: 'Presentación',
    PROPOSAL: 'Propuesta',
    FOLLOW_UP: 'Seguimiento',
    NURTURING: 'Nutrición',
  }
  return types[type] || type
}

export const formatCommunicationDirection = (direction: string) => {
  const directions: { [key: string]: string } = {
    INBOUND: 'Entrante',
    OUTBOUND: 'Saliente',
  }
  return directions[direction] || direction
}

export const getPriorityColor = (priority: string) => {
  const colors: { [key: string]: string } = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}

export const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    NEW: 'bg-blue-100 text-blue-800',
    CONTACTED: 'bg-yellow-100 text-yellow-800',
    QUALIFIED: 'bg-green-100 text-green-800',
    PROPOSAL_SENT: 'bg-purple-100 text-purple-800',
    NEGOTIATING: 'bg-orange-100 text-orange-800',
    CLOSED_WON: 'bg-green-100 text-green-800',
    CLOSED_LOST: 'bg-red-100 text-red-800',
    NURTURING: 'bg-indigo-100 text-indigo-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getStageColor = (stage: string) => {
  const colors: { [key: string]: string } = {
    PROSPECTING: 'bg-blue-100 text-blue-800',
    QUALIFICATION: 'bg-yellow-100 text-yellow-800',
    PROPOSAL: 'bg-purple-100 text-purple-800',
    NEGOTIATION: 'bg-orange-100 text-orange-800',
    CLOSED_WON: 'bg-green-100 text-green-800',
    CLOSED_LOST: 'bg-red-100 text-red-800',
  }
  return colors[stage] || 'bg-gray-100 text-gray-800'
}

// Additional schemas for compatibility
export const CreateLeadSchema = LeadSchema
export const UpdateLeadSchema = LeadSchema.partial()
export type CreateLeadInput = any
export type UpdateLeadInput = any

export const CreateOpportunitySchema = OpportunitySchema
export type CreateOpportunityInput = any

// Alias functions for compatibility
export const formatSource = formatLeadSource
export const formatStatus = formatLeadStatus
