import { PayrollService } from './payroll'

// Mock del módulo de base de datos
jest.mock('@/lib/db', () => ({
  prisma: {
    employee: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    payroll: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))

import { prisma } from '@/lib/db'

describe('PayrollService', () => {
  let payrollService: PayrollService

  beforeEach(() => {
    jest.clearAllMocks()
    payrollService = new PayrollService()
  })

  describe('createPayroll', () => {
    it('debería crear una nómina exitosamente', async () => {
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        employeeNumber: 'EMP001',
        email: 'juan@empresa.com',
        position: 'Developer',
        department: 'IT',
      }

      const mockPayroll = {
        id: 'pay-1',
        employeeId: 'emp-1',
        period: '2024-01',
        year: 2024,
        month: 1,
        basicSalary: 5000,
        overtimePay: 500,
        bonuses: 200,
        allowances: 100,
        taxes: 500,
        socialSecurity: 250,
        healthInsurance: 150,
        otherDeductions: 50,
        grossSalary: 5800,
        totalDeductions: 950,
        netSalary: 4850,
        status: 'PENDING',
        tenantId: 'tenant-1',
        employee: mockEmployee,
      }

      const createData = {
        employeeId: 'emp-1',
        period: '2024-01',
        basicSalary: 5000,
        overtimePay: 500,
        bonuses: 200,
        allowances: 100,
        taxes: 500,
        socialSecurity: 250,
        healthInsurance: 150,
        otherDeductions: 50,
        tenantId: 'tenant-1',
      }

      // Mock de que el empleado existe
      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      
      // Mock de que no existe nómina previa
      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(null)
      
      // Mock de creación exitosa
      ;(prisma.payroll.create as jest.Mock).mockResolvedValue(mockPayroll)

      const result = await payrollService.createPayroll(createData)

      expect(result).toEqual(mockPayroll)
      expect(prisma.employee.findFirst).toHaveBeenCalledWith({
        where: { id: 'emp-1', tenantId: 'tenant-1' },
      })
      expect(prisma.payroll.findFirst).toHaveBeenCalledWith({
        where: {
          employeeId: 'emp-1',
          period: '2024-01',
          tenantId: 'tenant-1',
        },
      })
      expect(prisma.payroll.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          year: 2024,
          month: 1,
          grossSalary: 5800,
          totalDeductions: 950,
          netSalary: 4850,
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              email: true,
              position: true,
              department: true,
            },
          },
        },
      })
    })

    it('debería lanzar error si el empleado no existe', async () => {
      const createData = {
        employeeId: 'emp-nonexistent',
        period: '2024-01',
        basicSalary: 5000,
        tenantId: 'tenant-1',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(payrollService.createPayroll(createData)).rejects.toThrow(
        'Empleado no encontrado'
      )
    })

    it('debería lanzar error si ya existe nómina para el período', async () => {
      const mockEmployee = { id: 'emp-1', firstName: 'Juan' }
      const existingPayroll = { id: 'pay-existing' }

      const createData = {
        employeeId: 'emp-1',
        period: '2024-01',
        basicSalary: 5000,
        tenantId: 'tenant-1',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(existingPayroll)

      await expect(payrollService.createPayroll(createData)).rejects.toThrow(
        'Ya existe una nómina para este empleado en este período'
      )
    })
  })

  describe('getPayrolls', () => {
    it('debería obtener nóminas con paginación por defecto', async () => {
      const mockPayrolls = [
        {
          id: 'pay-1',
          employeeId: 'emp-1',
          period: '2024-01',
          grossSalary: 5000,
          netSalary: 4500,
          status: 'PENDING',
          employee: {
            id: 'emp-1',
            firstName: 'Juan',
            lastName: 'Pérez',
          },
        },
      ]

      const mockCount = 1

      ;(prisma.payroll.findMany as jest.Mock).mockResolvedValue(mockPayrolls)
      ;(prisma.payroll.count as jest.Mock).mockResolvedValue(mockCount)

      const result = await payrollService.getPayrolls('tenant-1')

      expect(result).toEqual({
        payrolls: mockPayrolls,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      })
      expect(prisma.payroll.findMany).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              position: true,
              department: true,
            },
          },
        },
        orderBy: { period: 'desc' },
        skip: 0,
        take: 10,
      })
    })

    it('debería aplicar filtros correctamente', async () => {
      const options = {
        page: 2,
        limit: 5,
        employeeId: 'emp-1',
        period: '2024-01',
        status: 'PENDING',
        year: 2024,
        month: 1,
      }

      ;(prisma.payroll.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.payroll.count as jest.Mock).mockResolvedValue(0)

      await payrollService.getPayrolls('tenant-1', options)

      expect(prisma.payroll.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          employeeId: 'emp-1',
          period: '2024-01',
          status: 'PENDING',
          year: 2024,
          month: 1,
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              position: true,
              department: true,
            },
          },
        },
        orderBy: { period: 'desc' },
        skip: 5,
        take: 5,
      })
    })
  })

  describe('getPayrollById', () => {
    it('debería obtener una nómina por ID', async () => {
      const mockPayroll = {
        id: 'pay-1',
        employeeId: 'emp-1',
        period: '2024-01',
        grossSalary: 5000,
        employee: {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
          employeeNumber: 'EMP001',
          email: 'juan@empresa.com',
          position: 'Developer',
          department: 'IT',
          hireDate: new Date('2020-01-01'),
        },
      }

      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(mockPayroll)

      const result = await payrollService.getPayrollById('pay-1', 'tenant-1')

      expect(result).toEqual(mockPayroll)
      expect(prisma.payroll.findFirst).toHaveBeenCalledWith({
        where: { id: 'pay-1', tenantId: 'tenant-1' },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              email: true,
              position: true,
              department: true,
              hireDate: true,
            },
          },
        },
      })
    })
  })

  describe('updatePayroll', () => {
    it('debería actualizar una nómina exitosamente', async () => {
      const existingPayroll = {
        id: 'pay-1',
        status: 'PENDING',
        basicSalary: 5000,
        overtimePay: 0,
        bonuses: 0,
        allowances: 0,
        taxes: 500,
        socialSecurity: 250,
        healthInsurance: 150,
        otherDeductions: 0,
      }

      const updateData = {
        basicSalary: 5500,
        bonuses: 200,
      }

      const updatedPayroll = {
        id: 'pay-1',
        ...existingPayroll,
        ...updateData,
        grossSalary: 5700,
        totalDeductions: 900,
        netSalary: 4800,
        employee: {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
        },
      }

      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(existingPayroll)
      ;(prisma.payroll.update as jest.Mock).mockResolvedValue(updatedPayroll)

      const result = await payrollService.updatePayroll('pay-1', updateData, 'tenant-1')

      expect(result).toEqual(updatedPayroll)
      expect(prisma.payroll.update).toHaveBeenCalledWith({
        where: { id: 'pay-1' },
        data: {
          ...updateData,
          grossSalary: 5700,
          totalDeductions: 900,
          netSalary: 4800,
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNumber: true,
              email: true,
              position: true,
              department: true,
            },
          },
        },
      })
    })

    it('debería lanzar error si la nómina no existe', async () => {
      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(
        payrollService.updatePayroll('pay-nonexistent', {}, 'tenant-1')
      ).rejects.toThrow('Nómina no encontrada')
    })

    it('debería lanzar error si la nómina está procesada', async () => {
      const processedPayroll = {
        id: 'pay-1',
        status: 'PROCESSED',
      }

      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(processedPayroll)

      await expect(
        payrollService.updatePayroll('pay-1', {}, 'tenant-1')
      ).rejects.toThrow('No se puede modificar una nómina procesada o pagada')
    })

    it('debería lanzar error si la nómina está pagada', async () => {
      const paidPayroll = {
        id: 'pay-1',
        status: 'PAID',
      }

      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(paidPayroll)

      await expect(
        payrollService.updatePayroll('pay-1', {}, 'tenant-1')
      ).rejects.toThrow('No se puede modificar una nómina procesada o pagada')
    })
  })

  describe('processPayroll', () => {
    it('debería procesar una nómina exitosamente', async () => {
      const pendingPayroll = {
        id: 'pay-1',
        status: 'PENDING',
      }

      const processedPayroll = {
        ...pendingPayroll,
        status: 'PROCESSED',
        processedAt: expect.any(Date),
        processedBy: 'admin-1',
      }

      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(pendingPayroll)
      ;(prisma.payroll.update as jest.Mock).mockResolvedValue(processedPayroll)

      const result = await payrollService.processPayroll('pay-1', 'admin-1', 'tenant-1')

      expect(result).toEqual(processedPayroll)
      expect(prisma.payroll.update).toHaveBeenCalledWith({
        where: { id: 'pay-1' },
        data: {
          status: 'PROCESSED',
          processedAt: expect.any(Date),
          processedBy: 'admin-1',
        },
      })
    })

    it('debería lanzar error si la nómina no existe', async () => {
      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(
        payrollService.processPayroll('pay-nonexistent', 'admin-1', 'tenant-1')
      ).rejects.toThrow('Nómina no encontrada')
    })

    it('debería lanzar error si la nómina no está pendiente', async () => {
      const processedPayroll = {
        id: 'pay-1',
        status: 'PROCESSED',
      }

      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(processedPayroll)

      await expect(
        payrollService.processPayroll('pay-1', 'admin-1', 'tenant-1')
      ).rejects.toThrow('Solo se pueden procesar nóminas pendientes')
    })
  })

  describe('getPayrollStats', () => {
    it('debería obtener estadísticas de nóminas', async () => {
      const mockStats = {
        totalPayrolls: 10,
        totalGrossSalary: { _sum: { grossSalary: 50000 } },
        totalNetSalary: { _sum: { netSalary: 45000 } },
        totalDeductions: { _sum: { totalDeductions: 5000 } },
        payrollsByStatus: [
          { status: 'PENDING', _count: 5 },
          { status: 'PROCESSED', _count: 3 },
          { status: 'PAID', _count: 2 },
        ],
        payrollsByDepartment: [
          {
            employeeId: 'emp-1',
            department: 'IT',
            _sum: { grossSalary: 10000, netSalary: 9000, totalDeductions: 1000 },
            _count: 2,
          },
        ],
      }

      ;(prisma.payroll.count as jest.Mock).mockResolvedValue(mockStats.totalPayrolls)
      ;(prisma.payroll.aggregate as jest.Mock)
        .mockResolvedValueOnce(mockStats.totalGrossSalary)
        .mockResolvedValueOnce(mockStats.totalNetSalary)
        .mockResolvedValueOnce(mockStats.totalDeductions)
      ;(prisma.payroll.groupBy as jest.Mock)
        .mockResolvedValueOnce(mockStats.payrollsByStatus)
        .mockResolvedValueOnce(mockStats.payrollsByDepartment)

      const result = await payrollService.getPayrollStats('tenant-1', 2024, 1)

      expect(result).toEqual({
        totalPayrolls: 10,
        totalGrossSalary: 50000,
        totalNetSalary: 45000,
        totalDeductions: 5000,
        payrollsByStatus: mockStats.payrollsByStatus,
        payrollsByDepartment: mockStats.payrollsByDepartment,
      })
    })

    it('debería usar año y mes actual por defecto', async () => {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth() + 1

      ;(prisma.payroll.count as jest.Mock).mockResolvedValue(0)
      ;(prisma.payroll.aggregate as jest.Mock).mockResolvedValue({ _sum: { grossSalary: 0 } })
      ;(prisma.payroll.groupBy as jest.Mock).mockResolvedValue([])

      await payrollService.getPayrollStats('tenant-1')

      expect(prisma.payroll.count).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          year: currentYear,
        },
      })
    })
  })

  describe('generatePayrollForPeriod', () => {
    it('debería generar nóminas para todos los empleados activos', async () => {
      const mockEmployees = [
        {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
          employeeNumber: 'EMP001',
          salary: 5000,
        },
        {
          id: 'emp-2',
          firstName: 'María',
          lastName: 'García',
          employeeNumber: 'EMP002',
          salary: 6000,
        },
      ]

      const mockPayroll1 = {
        id: 'pay-1',
        employeeId: 'emp-1',
        period: '2024-01',
        year: 2024,
        month: 1,
        basicSalary: 5000,
        grossSalary: 5000,
        totalDeductions: 900,
        netSalary: 4100,
        taxes: 500,
        socialSecurity: 250,
        healthInsurance: 150,
        tenantId: 'tenant-1',
      }

      const mockPayroll2 = {
        id: 'pay-2',
        employeeId: 'emp-2',
        period: '2024-01',
        year: 2024,
        month: 1,
        basicSalary: 6000,
        grossSalary: 6000,
        totalDeductions: 1080,
        netSalary: 4920,
        taxes: 600,
        socialSecurity: 300,
        healthInsurance: 180,
        tenantId: 'tenant-1',
      }

      ;(prisma.employee.findMany as jest.Mock).mockResolvedValue(mockEmployees)
      ;(prisma.payroll.findFirst as jest.Mock)
        .mockResolvedValueOnce(null) // No existe nómina para emp-1
        .mockResolvedValueOnce(null) // No existe nómina para emp-2
      ;(prisma.payroll.create as jest.Mock)
        .mockResolvedValueOnce(mockPayroll1)
        .mockResolvedValueOnce(mockPayroll2)

      const result = await payrollService.generatePayrollForPeriod('tenant-1', '2024-01')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(mockPayroll1)
      expect(result[1]).toEqual(mockPayroll2)

      expect(prisma.employee.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          status: 'ACTIVE',
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeNumber: true,
          salary: true,
        },
      })
    })

    it('debería omitir empleados que ya tienen nómina para el período', async () => {
      const mockEmployees = [
        {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
          employeeNumber: 'EMP001',
          salary: 5000,
        },
      ]

      const existingPayroll = {
        id: 'pay-existing',
        employeeId: 'emp-1',
        period: '2024-01',
      }

      ;(prisma.employee.findMany as jest.Mock).mockResolvedValue(mockEmployees)
      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(existingPayroll)

      const result = await payrollService.generatePayrollForPeriod('tenant-1', '2024-01')

      expect(result).toHaveLength(0)
      expect(prisma.payroll.create).not.toHaveBeenCalled()
    })

    it('debería calcular correctamente las deducciones automáticas', async () => {
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        employeeNumber: 'EMP001',
        salary: 10000, // Salario base
      }

      ;(prisma.employee.findMany as jest.Mock).mockResolvedValue([mockEmployee])
      ;(prisma.payroll.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.payroll.create as jest.Mock).mockImplementation(({ data }) => Promise.resolve(data))

      const result = await payrollService.generatePayrollForPeriod('tenant-1', '2024-01')

      expect(result[0]).toMatchObject({
        basicSalary: 10000,
        grossSalary: 10000,
        taxes: 1000, // 10% del salario base
        socialSecurity: 500, // 5% del salario base
        healthInsurance: 300, // 3% del salario base
        totalDeductions: 1800,
        netSalary: 8200,
      })
    })
  })
})
