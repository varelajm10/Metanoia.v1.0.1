import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

// Inicializar Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Webhook secret para verificar la firma
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Tipos para los eventos de Stripe
interface StripeInvoice {
  id: string
  customer: string
  subscription?: string
  status: string
  paid: boolean
  amount_paid: number
  amount_due: number
  currency: string
  created: number
  metadata?: Record<string, string>
}

interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  plan?: {
    id: string
    nickname?: string
    amount: number
    currency: string
  }
  metadata?: Record<string, string>
}

interface StripeCustomer {
  id: string
  email?: string
  metadata?: Record<string, string>
}

// Función para verificar la firma del webhook
async function verifyStripeSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )
    return !!event
  } catch (error) {
    console.error('Error verifying Stripe signature:', error)
    return false
  }
}

// Función para obtener el tenant por customer ID de Stripe
async function getTenantByStripeCustomerId(customerId: string) {
  try {
    const tenant = await prisma.tenant.findFirst({
      where: {
        stripeCustomerId: customerId,
      },
    })
    return tenant
  } catch (error) {
    console.error('Error finding tenant by Stripe customer ID:', error)
    return null
  }
}

// Función para actualizar el estado del tenant
async function updateTenantStatus(
  tenantId: string,
  isActive: boolean,
  planId?: string,
  subscriptionId?: string
) {
  try {
    const updateData: any = {
      isActive,
      updatedAt: new Date(),
    }

    if (planId) {
      updateData.planId = planId
    }

    if (subscriptionId) {
      updateData.stripeSubscriptionId = subscriptionId
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: updateData,
    })

  } catch (error) {
    console.error('Error updating tenant status:', error)
    throw error
  }
}

// Función para manejar el evento invoice.paid
async function handleInvoicePaid(invoice: StripeInvoice) {
  try {

    // Buscar el tenant por customer ID
    const tenant = await getTenantByStripeCustomerId(invoice.customer)

    if (!tenant) {
      console.error(`Tenant not found for Stripe customer: ${invoice.customer}`)
      return
    }

    // Obtener información de la suscripción si existe
    let subscription: any = null
    if (invoice.subscription) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          invoice.subscription
        )
        subscription = {
          id: stripeSubscription.id,
          customer:
            typeof stripeSubscription.customer === 'string'
              ? stripeSubscription.customer
              : stripeSubscription.customer.id,
          status: stripeSubscription.status,
          current_period_start: stripeSubscription.current_period_start,
          current_period_end: stripeSubscription.current_period_end,
          plan: stripeSubscription.items.data[0]?.price
            ? {
                id: stripeSubscription.items.data[0].price.id,
                nickname: stripeSubscription.items.data[0].price.nickname,
                amount: stripeSubscription.items.data[0].price.unit_amount || 0,
                currency: stripeSubscription.items.data[0].price.currency,
              }
            : undefined,
          metadata: stripeSubscription.metadata,
        }
      } catch (error) {
        console.error('Error retrieving subscription:', error)
      }
    }

    // Determinar el plan basado en la suscripción o metadata
    let planId = 'basic' // Plan por defecto
    if (subscription?.plan?.id) {
      planId = subscription.plan.id
    } else if (invoice.metadata?.plan) {
      planId = invoice.metadata.plan
    }

    // Activar el tenant
    await updateTenantStatus(tenant.id, true, planId, subscription?.id)

  } catch (error) {
    console.error('Error handling invoice.paid:', error)
    throw error
  }
}

// Función para manejar el evento invoice.payment_failed
async function handleInvoicePaymentFailed(invoice: StripeInvoice) {
  try {

    // Buscar el tenant por customer ID
    const tenant = await getTenantByStripeCustomerId(invoice.customer)

    if (!tenant) {
      console.error(`Tenant not found for Stripe customer: ${invoice.customer}`)
      return
    }

    // Desactivar el tenant temporalmente
    await updateTenantStatus(tenant.id, false)


    // Aquí podrías agregar lógica adicional como:
    // - Enviar email de notificación
    // - Crear ticket de soporte
    // - Programar recordatorio de pago
  } catch (error) {
    console.error('Error handling invoice.payment_failed:', error)
    throw error
  }
}

// Función para manejar el evento customer.subscription.deleted
async function handleSubscriptionDeleted(subscription: StripeSubscription) {
  try {

    // Buscar el tenant por customer ID
    const tenant = await getTenantByStripeCustomerId(subscription.customer)

    if (!tenant) {
      console.error(
        `Tenant not found for Stripe customer: ${subscription.customer}`
      )
      return
    }

    // Desactivar el tenant
    await updateTenantStatus(tenant.id, false)


    // Aquí podrías agregar lógica adicional como:
    // - Enviar email de cancelación
    // - Ofrecer plan de retención
    // - Programar eliminación de datos
  } catch (error) {
    console.error('Error handling customer.subscription.deleted:', error)
    throw error
  }
}

// Función principal para procesar webhooks
async function processWebhook(event: Stripe.Event) {
  try {

    switch (event.type) {
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as StripeInvoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as StripeInvoice)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as StripeSubscription)
        break

      default:
    }
  } catch (error) {
    console.error('Error processing webhook:', error)
    throw error
  }
}

// Handler principal del endpoint
export async function POST(request: NextRequest) {
  try {
    // Obtener el payload y la firma
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      console.error('Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      )
    }

    // Verificar la firma del webhook
    const isValidSignature = await verifyStripeSignature(body, signature)

    if (!isValidSignature) {
      console.error('Invalid Stripe signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Construir el evento de Stripe
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // Procesar el webhook
    await processWebhook(event)


    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)

    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Handler para métodos no permitidos
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
