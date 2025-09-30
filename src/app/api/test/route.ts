import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {

    return NextResponse.json({
      message: 'API de prueba funcionando correctamente',
      timestamp: new Date().toISOString(),
      status: 'success',
    })
  } catch (error) {
    console.error('❌ [TEST] Error en API de prueba:', error)
    return NextResponse.json(
      {
        error: 'Error en API de prueba',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    )
  }
}
