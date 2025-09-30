import { NextResponse } from 'next/server'

export async function GET() {
  try {

    // Datos mock para que el dashboard funcione
    const mockProducts = [
      {
        id: '1',
        name: 'Producto Demo 1',
        description: 'Descripción del producto',
        price: 100,
        stock: 50,
        minStock: 10,
        status: 'ACTIVE',
      },
      {
        id: '2',
        name: 'Producto Demo 2',
        description: 'Otro producto de ejemplo',
        price: 200,
        stock: 25,
        minStock: 5,
        status: 'ACTIVE',
      },
      {
        id: '3',
        name: 'Producto Demo 3',
        description: 'Producto con stock bajo',
        price: 150,
        stock: 3,
        minStock: 10,
        status: 'ACTIVE',
      },
    ]


    return NextResponse.json({
      success: true,
      products: mockProducts,
      total: mockProducts.length,
      message: 'Productos cargados exitosamente',
    })
  } catch (error) {
    console.error('❌ [PRODUCTS-SIMPLE] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        products: [],
        total: 0,
      },
      { status: 500 }
    )
  }
}
