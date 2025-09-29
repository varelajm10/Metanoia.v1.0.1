import { NextRequest, NextResponse } from 'next/server'
import { SchoolAttendancePaymentsService } from '@/lib/services/school-attendance-payments'
import { SchoolPaymentSchema } from '@/lib/validations/school'

// GET /api/schools/payments - Obtener pagos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const studentId = searchParams.get('studentId') || undefined
    const paymentType = searchParams.get('paymentType') || undefined
    const status = searchParams.get('status') || undefined
    const academicYear = searchParams.get('academicYear') || new Date().getFullYear().toString()
    const month = searchParams.get('month') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    const result = await SchoolAttendancePaymentsService.getPayments(tenantId, {
      page,
      limit,
      studentId,
      paymentType,
      status,
      academicYear,
      month,
      startDate,
      endDate,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener pagos',
      },
      { status: 500 }
    )
  }
}

// POST /api/schools/payments - Crear nuevo pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const searchParams = request.nextUrl.searchParams
    const tenantId = searchParams.get('tenantId') || 'demo-tenant'

    // Validar datos de entrada
    const validatedData = SchoolPaymentSchema.parse(body)

    const payment = await SchoolAttendancePaymentsService.createPayment({
      ...validatedData,
      tenantId,
    })

    return NextResponse.json({
      success: true,
      data: payment,
      message: 'Pago creado exitosamente',
    })
  } catch (error: any) {
    console.error('Error creating payment:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear pago',
      },
      { status: 500 }
    )
  }
}
