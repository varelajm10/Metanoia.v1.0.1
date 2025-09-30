/**
 * Configuración de Stripe para Metanoia ERP
 * Maneja la integración con Stripe para pagos y suscripciones
 */

import Stripe from 'stripe'

// Configuración de Stripe
export const stripeConfig = {
  // Claves de API
  secretKey: process.env.STRIPE_SECRET_KEY!,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,

  // Configuración de la aplicación
  appName: 'Metanoia ERP',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://metanoia.click',

  // Configuración de webhooks
  webhookEndpoint: '/api/webhooks/stripe',

  // Configuración de planes
  plans: {
    BASIC: {
      id: 'price_basic_monthly',
      name: 'Plan Básico',
      price: 29.99,
      currency: 'usd',
      interval: 'month',
      features: ['Hasta 5 usuarios', '10 servidores', '100GB almacenamiento'],
    },
    STANDARD: {
      id: 'price_standard_monthly',
      name: 'Plan Estándar',
      price: 79.99,
      currency: 'usd',
      interval: 'month',
      features: ['Hasta 25 usuarios', '50 servidores', '500GB almacenamiento'],
    },
    PREMIUM: {
      id: 'price_premium_monthly',
      name: 'Plan Premium',
      price: 199.99,
      currency: 'usd',
      interval: 'month',
      features: [
        'Usuarios ilimitados',
        'Servidores ilimitados',
        '1TB almacenamiento',
      ],
    },
    ENTERPRISE: {
      id: 'price_enterprise_monthly',
      name: 'Plan Enterprise',
      price: 499.99,
      currency: 'usd',
      interval: 'month',
      features: ['Todo incluido', 'Soporte prioritario', 'Personalización'],
    },
  },
}

// Inicializar cliente de Stripe
export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2023-10-16',
  appInfo: {
    name: stripeConfig.appName,
    url: stripeConfig.appUrl,
  },
})

// Función para obtener el plan por ID
export function getPlanById(planId: string) {
  return Object.values(stripeConfig.plans).find(plan => plan.id === planId)
}

// Función para obtener el plan por nombre
export function getPlanByName(planName: string) {
  return Object.values(stripeConfig.plans).find(
    plan => plan.name.toLowerCase() === planName.toLowerCase()
  )
}

// Función para validar la configuración de Stripe
export function validateStripeConfig(): boolean {
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('Missing required Stripe environment variables:', missingVars)
    return false
  }

  return true
}

// Función para crear un customer en Stripe
export async function createStripeCustomer(tenantData: {
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
}) {
  try {
    const customer = await stripe.customers.create({
      name: tenantData.name,
      email: tenantData.email,
      phone: tenantData.phone,
      address: tenantData.address
        ? {
            line1: tenantData.address,
            city: tenantData.city,
            country: tenantData.country,
          }
        : undefined,
      metadata: {
        tenant_name: tenantData.name,
        created_via: 'metanoia_erp',
      },
    })

    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw error
  }
}

// Función para crear una suscripción en Stripe
export async function createStripeSubscription(
  customerId: string,
  planId: string,
  trialDays?: number
) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      trial_period_days: trialDays,
      metadata: {
        created_via: 'metanoia_erp',
      },
    })

    return subscription
  } catch (error) {
    console.error('Error creating Stripe subscription:', error)
    throw error
  }
}

// Función para cancelar una suscripción
export async function cancelStripeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling Stripe subscription:', error)
    throw error
  }
}

// Función para obtener información de una suscripción
export async function getStripeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving Stripe subscription:', error)
    throw error
  }
}

// Función para obtener información de un customer
export async function getStripeCustomer(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId)
    return customer
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error)
    throw error
  }
}
