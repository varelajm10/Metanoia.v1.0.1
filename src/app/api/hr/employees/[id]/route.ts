import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { EmployeeService } from '@/lib/services/employee'
import { UpdateEmployeeSchema } from '@/lib/validations/employee'
import { requireAuth } from '@/lib/middleware/auth'

const prisma = new PrismaClient()
const employeeService = new EmployeeService(prisma)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const tenantId = user.tenantId

    const employee = await employeeService.getEmployeeById(params.id, tenantId)

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Empleado no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const tenantId = user.tenantId

    // Verificar permisos de escritura
    if (!['MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: 'No tienes permisos para actualizar empleados',
        },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validar datos de entrada
    const validatedData = UpdateEmployeeSchema.parse(body)

    const employee = await employeeService.updateEmployee(
      params.id,
      validatedData,
      tenantId
    )

    return NextResponse.json({
      success: true,
      data: employee,
    })
  } catch (error) {
    console.error('Error updating employee:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request)
    if (authResult.error) {
      return authResult.error
    }

    const { user } = authResult
    const tenantId = user.tenantId

    // Verificar permisos de eliminación
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos para eliminar empleados' },
        { status: 403 }
      )
    }

    const result = await employeeService.deleteEmployee(params.id, tenantId)

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Empleado eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Error interno del servidor',
      },
      { status: 500 }
    )
  }
}
