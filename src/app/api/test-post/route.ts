import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [TEST-POST] API POST de prueba...')

    const body = await request.json()
    console.log('📧 [TEST-POST] Datos recibidos:', body)

    return NextResponse.json({
      message: 'API POST de prueba funcionando correctamente',
      receivedData: body,
      timestamp: new Date().toISOString(),
      status: 'success',
    })
  } catch (error) {
    console.error('❌ [TEST-POST] Error en API POST:', error)
    return NextResponse.json(
      {
        error: 'Error en API POST de prueba',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
