import { VacationService } from './vacation'

// Mock del módulo de base de datos
jest.mock('@/lib/db', () => ({
  prisma: {
    employee: {
      findFirst: jest.fn(),
    },
    vacation: {
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

describe('VacationService', () => {
  let vacationService: VacationService

  beforeEach(() => {
    jest.clearAllMocks()
    vacationService = new VacationService()
  })

  describe('createVacation', () => {
    it('debería crear una solicitud de vacaciones exitosamente', async () => {
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        status: 'ACTIVE',
      }

      const mockVacation = {
        id: 'vac-1',
        employeeId: 'emp-1',
        type: 'ANNUAL',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-05'),
        days: 5,
        reason: 'Vacaciones familiares',
        status: 'PENDING',
        tenantId: 'tenant-1',
        employee: {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
          employeeNumber: 'EMP001',
          email: 'juan@empresa.com',
          position: 'Developer',
          department: 'IT',
        },
      }

      const createData = {
        employeeId: 'emp-1',
        type: 'ANNUAL',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        reason: 'Vacaciones familiares',
        tenantId: 'tenant-1',
      }

      // Mock de que el empleado existe y está activo
      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      
      // Mock de que no hay conflictos de fechas
      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue([])
      
      // Mock de creación exitosa
      ;(prisma.vacation.create as jest.Mock).mockResolvedValue(mockVacation)

      const result = await vacationService.createVacation(createData)

      expect(result).toEqual(mockVacation)
      expect(prisma.employee.findFirst).toHaveBeenCalledWith({
        where: { id: 'emp-1', tenantId: 'tenant-1' },
      })
      expect(prisma.vacation.findMany).toHaveBeenCalledWith({
        where: {
          employeeId: 'emp-1',
          tenantId: 'tenant-1',
          status: { in: ['PENDING', 'APPROVED'] },
          OR: [
            {
              startDate: { lte: new Date('2024-06-05') },
              endDate: { gte: new Date('2024-06-01') },
            },
          ],
        },
      })
      expect(prisma.vacation.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          days: 5,
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-05'),
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
        type: 'ANNUAL',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        tenantId: 'tenant-1',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(vacationService.createVacation(createData)).rejects.toThrow(
        'Empleado no encontrado'
      )
    })

    it('debería lanzar error si el empleado no está activo', async () => {
      const inactiveEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        status: 'INACTIVE',
      }

      const createData = {
        employeeId: 'emp-1',
        type: 'ANNUAL',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        tenantId: 'tenant-1',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(inactiveEmployee)

      await expect(vacationService.createVacation(createData)).rejects.toThrow(
        'Solo empleados activos pueden solicitar vacaciones'
      )
    })

    it('debería lanzar error si hay conflictos de fechas', async () => {
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        status: 'ACTIVE',
      }

      const conflictingVacation = {
        id: 'vac-conflict',
        startDate: new Date('2024-06-03'),
        endDate: new Date('2024-06-07'),
      }

      const createData = {
        employeeId: 'emp-1',
        type: 'ANNUAL',
        startDate: '2024-06-01',
        endDate: '2024-06-05',
        tenantId: 'tenant-1',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue([conflictingVacation])

      await expect(vacationService.createVacation(createData)).rejects.toThrow(
        'Ya existe una solicitud de vacaciones que se superpone con estas fechas'
      )
    })

    it('debería calcular correctamente los días de vacación', async () => {
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        status: 'ACTIVE',
      }

      const mockVacation = {
        id: 'vac-1',
        days: 10,
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-10'),
      }

      const createData = {
        employeeId: 'emp-1',
        type: 'ANNUAL',
        startDate: '2024-06-01',
        endDate: '2024-06-10',
        tenantId: 'tenant-1',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.vacation.create as jest.Mock).mockImplementation(({ data }) => Promise.resolve({ ...data, id: 'vac-1' }))

      const result = await vacationService.createVacation(createData)

      expect(result.days).toBe(10) // 10 días incluyendo el día final
    })
  })

  describe('getVacations', () => {
    it('debería obtener vacaciones con paginación por defecto', async () => {
      const mockVacations = [
        {
          id: 'vac-1',
          employeeId: 'emp-1',
          type: 'ANNUAL',
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-05'),
          status: 'PENDING',
          employee: {
            id: 'emp-1',
            firstName: 'Juan',
            lastName: 'Pérez',
          },
        },
      ]

      const mockCount = 1

      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue(mockVacations)
      ;(prisma.vacation.count as jest.Mock).mockResolvedValue(mockCount)

      const result = await vacationService.getVacations('tenant-1')

      expect(result).toEqual({
        vacations: mockVacations,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          pages: 1,
        },
      })
      expect(prisma.vacation.findMany).toHaveBeenCalledWith({
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
        orderBy: { requestedAt: 'desc' },
        skip: 0,
        take: 10,
      })
    })

    it('debería aplicar filtros correctamente', async () => {
      const options = {
        page: 2,
        limit: 5,
        employeeId: 'emp-1',
        status: 'APPROVED',
        type: 'ANNUAL',
        startDate: '2024-06-01',
        endDate: '2024-06-30',
      }

      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.vacation.count as jest.Mock).mockResolvedValue(0)

      await vacationService.getVacations('tenant-1', options)

      expect(prisma.vacation.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          employeeId: 'emp-1',
          status: 'APPROVED',
          type: 'ANNUAL',
          OR: [
            {
              startDate: { gte: new Date('2024-06-01') },
              endDate: { lte: new Date('2024-06-30') },
            },
            {
              startDate: { lte: new Date('2024-06-30') },
              endDate: { gte: new Date('2024-06-01') },
            },
          ],
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
        orderBy: { requestedAt: 'desc' },
        skip: 5,
        take: 5,
      })
    })
  })

  describe('getVacationById', () => {
    it('debería obtener una vacación por ID', async () => {
      const mockVacation = {
        id: 'vac-1',
        employeeId: 'emp-1',
        type: 'ANNUAL',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-05'),
        status: 'PENDING',
        employee: {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
          employeeNumber: 'EMP001',
          email: 'juan@empresa.com',
          position: 'Developer',
          department: 'IT',
        },
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(mockVacation)

      const result = await vacationService.getVacationById('vac-1', 'tenant-1')

      expect(result).toEqual(mockVacation)
      expect(prisma.vacation.findFirst).toHaveBeenCalledWith({
        where: { id: 'vac-1', tenantId: 'tenant-1' },
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
  })

  describe('updateVacation', () => {
    it('debería actualizar una vacación exitosamente', async () => {
      const existingVacation = {
        id: 'vac-1',
        status: 'PENDING',
        approvedAt: null,
      }

      const updateData = {
        reason: 'Nueva razón actualizada',
      }

      const updatedVacation = {
        id: 'vac-1',
        ...existingVacation,
        ...updateData,
        employee: {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
        },
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(existingVacation)
      ;(prisma.vacation.update as jest.Mock).mockResolvedValue(updatedVacation)

      const result = await vacationService.updateVacation('vac-1', updateData, 'tenant-1')

      expect(result).toEqual(updatedVacation)
      expect(prisma.vacation.update).toHaveBeenCalledWith({
        where: { id: 'vac-1' },
        data: {
          ...updateData,
          approvedAt: null,
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

    it('debería lanzar error si la vacación no existe', async () => {
      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(
        vacationService.updateVacation('vac-nonexistent', {}, 'tenant-1')
      ).rejects.toThrow('Solicitud de vacaciones no encontrada')
    })

    it('debería lanzar error si intenta cambiar estado de vacación no pendiente', async () => {
      const approvedVacation = {
        id: 'vac-1',
        status: 'APPROVED',
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(approvedVacation)

      await expect(
        vacationService.updateVacation('vac-1', { status: 'REJECTED' }, 'tenant-1')
      ).rejects.toThrow('Solo se pueden modificar solicitudes pendientes')
    })

    it('debería actualizar approvedAt cuando se aprueba', async () => {
      const existingVacation = {
        id: 'vac-1',
        status: 'PENDING',
        approvedAt: null,
      }

      const updateData = {
        status: 'APPROVED',
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(existingVacation)
      ;(prisma.vacation.update as jest.Mock).mockImplementation(({ data }) => Promise.resolve({ ...data, id: 'vac-1' }))

      await vacationService.updateVacation('vac-1', updateData, 'tenant-1')

      expect(prisma.vacation.update).toHaveBeenCalledWith({
        where: { id: 'vac-1' },
        data: {
          ...updateData,
          approvedAt: expect.any(Date),
        },
        include: expect.any(Object),
      })
    })
  })

  describe('approveVacation', () => {
    it('debería aprobar una vacación exitosamente', async () => {
      const pendingVacation = {
        id: 'vac-1',
        status: 'PENDING',
      }

      const approvedVacation = {
        ...pendingVacation,
        status: 'APPROVED',
        approvedAt: expect.any(Date),
        approvedBy: 'admin-1',
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(pendingVacation)
      ;(prisma.vacation.update as jest.Mock).mockResolvedValue(approvedVacation)

      const result = await vacationService.approveVacation('vac-1', 'admin-1', 'tenant-1')

      expect(result).toEqual(approvedVacation)
      expect(prisma.vacation.update).toHaveBeenCalledWith({
        where: { id: 'vac-1' },
        data: {
          status: 'APPROVED',
          approvedAt: expect.any(Date),
          approvedBy: 'admin-1',
        },
      })
    })

    it('debería lanzar error si la vacación no existe', async () => {
      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(
        vacationService.approveVacation('vac-nonexistent', 'admin-1', 'tenant-1')
      ).rejects.toThrow('Solicitud de vacaciones no encontrada')
    })

    it('debería lanzar error si la vacación no está pendiente', async () => {
      const approvedVacation = {
        id: 'vac-1',
        status: 'APPROVED',
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(approvedVacation)

      await expect(
        vacationService.approveVacation('vac-1', 'admin-1', 'tenant-1')
      ).rejects.toThrow('Solo se pueden aprobar solicitudes pendientes')
    })
  })

  describe('rejectVacation', () => {
    it('debería rechazar una vacación exitosamente', async () => {
      const pendingVacation = {
        id: 'vac-1',
        status: 'PENDING',
      }

      const rejectedVacation = {
        ...pendingVacation,
        status: 'REJECTED',
        approvedAt: expect.any(Date),
        approvedBy: 'admin-1',
        rejectionReason: 'No hay personal suficiente',
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(pendingVacation)
      ;(prisma.vacation.update as jest.Mock).mockResolvedValue(rejectedVacation)

      const result = await vacationService.rejectVacation(
        'vac-1',
        'admin-1',
        'No hay personal suficiente',
        'tenant-1'
      )

      expect(result).toEqual(rejectedVacation)
      expect(prisma.vacation.update).toHaveBeenCalledWith({
        where: { id: 'vac-1' },
        data: {
          status: 'REJECTED',
          approvedAt: expect.any(Date),
          approvedBy: 'admin-1',
          rejectionReason: 'No hay personal suficiente',
        },
      })
    })

    it('debería lanzar error si la vacación no existe', async () => {
      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(
        vacationService.rejectVacation('vac-nonexistent', 'admin-1', 'Razón', 'tenant-1')
      ).rejects.toThrow('Solicitud de vacaciones no encontrada')
    })

    it('debería lanzar error si la vacación no está pendiente', async () => {
      const approvedVacation = {
        id: 'vac-1',
        status: 'APPROVED',
      }

      ;(prisma.vacation.findFirst as jest.Mock).mockResolvedValue(approvedVacation)

      await expect(
        vacationService.rejectVacation('vac-1', 'admin-1', 'Razón', 'tenant-1')
      ).rejects.toThrow('Solo se pueden rechazar solicitudes pendientes')
    })
  })

  describe('getVacationStats', () => {
    it('debería obtener estadísticas de vacaciones', async () => {
      const mockStats = {
        totalVacations: 25,
        approvedVacations: 20,
        pendingVacations: 3,
        rejectedVacations: 2,
        vacationsByType: [
          { type: 'ANNUAL', _count: 20, _sum: { days: 100 } },
          { type: 'SICK', _count: 5, _sum: { days: 15 } },
        ],
        vacationsByStatus: [
          { status: 'APPROVED', _count: 20 },
          { status: 'PENDING', _count: 3 },
          { status: 'REJECTED', _count: 2 },
        ],
        totalVacationDays: { _sum: { days: 115 } },
      }

      ;(prisma.vacation.count as jest.Mock)
        .mockResolvedValueOnce(mockStats.totalVacations)
        .mockResolvedValueOnce(mockStats.approvedVacations)
        .mockResolvedValueOnce(mockStats.pendingVacations)
        .mockResolvedValueOnce(mockStats.rejectedVacations)
      ;(prisma.vacation.groupBy as jest.Mock)
        .mockResolvedValueOnce(mockStats.vacationsByType)
        .mockResolvedValueOnce(mockStats.vacationsByStatus)
      ;(prisma.vacation.aggregate as jest.Mock).mockResolvedValue(mockStats.totalVacationDays)

      const result = await vacationService.getVacationStats('tenant-1', 2024)

      expect(result).toEqual({
        totalVacations: 25,
        approvedVacations: 20,
        pendingVacations: 3,
        rejectedVacations: 2,
        vacationsByType: mockStats.vacationsByType,
        vacationsByStatus: mockStats.vacationsByStatus,
        totalVacationDays: 115,
      })
    })

    it('debería usar año actual por defecto', async () => {
      const currentYear = new Date().getFullYear()

      ;(prisma.vacation.count as jest.Mock).mockResolvedValue(0)
      ;(prisma.vacation.groupBy as jest.Mock).mockResolvedValue([])
      ;(prisma.vacation.aggregate as jest.Mock).mockResolvedValue({ _sum: { days: 0 } })

      await vacationService.getVacationStats('tenant-1')

      const expectedWhere = {
        tenantId: 'tenant-1',
        startDate: { gte: new Date(currentYear, 0, 1) },
        endDate: { lte: new Date(currentYear, 11, 31) },
      }

      expect(prisma.vacation.count).toHaveBeenCalledWith({ where: expectedWhere })
    })
  })

  describe('getUpcomingVacations', () => {
    it('debería obtener próximas vacaciones aprobadas', async () => {
      const mockUpcomingVacations = [
        {
          id: 'vac-1',
          employeeId: 'emp-1',
          startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días en el futuro
          status: 'APPROVED',
          employee: {
            id: 'emp-1',
            firstName: 'Juan',
            lastName: 'Pérez',
            employeeNumber: 'EMP001',
            position: 'Developer',
            department: 'IT',
          },
        },
      ]

      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue(mockUpcomingVacations)

      const result = await vacationService.getUpcomingVacations('tenant-1', 30)

      expect(result).toEqual(mockUpcomingVacations)
      expect(prisma.vacation.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          status: 'APPROVED',
          startDate: {
            gte: expect.any(Date),
            lte: expect.any(Date),
          },
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
        orderBy: { startDate: 'asc' },
      })
    })

    it('debería usar 30 días por defecto', async () => {
      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue([])

      await vacationService.getUpcomingVacations('tenant-1')

      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

      expect(prisma.vacation.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          status: 'APPROVED',
          startDate: {
            gte: expect.any(Date),
            lte: endDate,
          },
        },
        include: expect.any(Object),
        orderBy: { startDate: 'asc' },
      })
    })
  })

  describe('getEmployeeVacationBalance', () => {
    it('debería obtener balance de vacaciones de empleado', async () => {
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        employeeNumber: 'EMP001',
      }

      const mockUsedVacations = [
        {
          id: 'vac-1',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-03-05'),
          days: 5,
          status: 'APPROVED',
        },
        {
          id: 'vac-2',
          startDate: new Date('2024-07-15'),
          endDate: new Date('2024-07-20'),
          days: 6,
          status: 'APPROVED',
        },
      ]

      const mockAggregate = {
        _sum: { days: 11 },
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      ;(prisma.vacation.aggregate as jest.Mock).mockResolvedValue(mockAggregate)
      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue(mockUsedVacations)

      const result = await vacationService.getEmployeeVacationBalance('emp-1', 'tenant-1', 2024)

      expect(result).toEqual({
        employee: {
          id: 'emp-1',
          firstName: 'Juan',
          lastName: 'Pérez',
          employeeNumber: 'EMP001',
        },
        year: 2024,
        annualVacationDays: 22,
        usedDays: 11,
        remainingDays: 11,
        usedVacations: mockUsedVacations,
      })
    })

    it('debería lanzar error si el empleado no existe', async () => {
      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(null)

      await expect(
        vacationService.getEmployeeVacationBalance('emp-nonexistent', 'tenant-1', 2024)
      ).rejects.toThrow('Empleado no encontrado')
    })

    it('debería usar año actual por defecto', async () => {
      const currentYear = new Date().getFullYear()
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        employeeNumber: 'EMP001',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      ;(prisma.vacation.aggregate as jest.Mock).mockResolvedValue({ _sum: { days: 0 } })
      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue([])

      const result = await vacationService.getEmployeeVacationBalance('emp-1', 'tenant-1')

      expect(result.year).toBe(currentYear)
    })

    it('debería calcular correctamente los días restantes', async () => {
      const mockEmployee = {
        id: 'emp-1',
        firstName: 'Juan',
        lastName: 'Pérez',
        employeeNumber: 'EMP001',
      }

      ;(prisma.employee.findFirst as jest.Mock).mockResolvedValue(mockEmployee)
      ;(prisma.vacation.aggregate as jest.Mock).mockResolvedValue({ _sum: { days: 5 } })
      ;(prisma.vacation.findMany as jest.Mock).mockResolvedValue([])

      const result = await vacationService.getEmployeeVacationBalance('emp-1', 'tenant-1', 2024)

      expect(result.usedDays).toBe(5)
      expect(result.remainingDays).toBe(17) // 22 - 5 = 17
    })
  })
})
