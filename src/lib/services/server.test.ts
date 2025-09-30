// Mock del módulo de base de datos
jest.mock('@/lib/db', () => ({
  prisma: {
    server: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    serverClient: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    serverAlert: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    serverMetric: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))

// Importar las funciones después del mock
import { ServerService } from './server'
import { prisma } from '@/lib/db'

describe('ServerService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createServer', () => {
    it('debería crear un servidor exitosamente con datos válidos', async () => {
      const mockServerData = {
        name: 'Test Server',
        hostname: 'test-server',
        ipAddress: '192.168.1.100',
        type: 'WEB',
        status: 'ONLINE',
        clientId: 'client-1',
        cost: 1000,
        installationDate: '2024-01-01',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-02-15',
      }

      const mockCreatedServer = {
        id: 'server-1',
        ...mockServerData,
        tenantId: 'tenant-1',
        installationDate: new Date('2024-01-01'),
        lastMaintenance: new Date('2024-01-15'),
        nextMaintenance: new Date('2024-02-15'),
        client: { id: 'client-1', companyName: 'Test Company' },
        alerts: [],
        metrics: [],
      }

      prisma.server.create.mockResolvedValue(mockCreatedServer)

      const result = await ServerService.createServer(mockServerData, 'tenant-1')

      expect(prisma.server.create).toHaveBeenCalledWith({
        data: {
          ...mockServerData,
          tenantId: 'tenant-1',
          installationDate: new Date('2024-01-01'),
          lastMaintenance: new Date('2024-01-15'),
          nextMaintenance: new Date('2024-02-15'),
        },
        include: {
          client: true,
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      })
      expect(result).toEqual(mockCreatedServer)
    })

    it('debería crear un servidor sin fechas opcionales', async () => {
      const mockServerData = {
        name: 'Test Server',
        hostname: 'test-server',
        ipAddress: '192.168.1.100',
        type: 'WEB',
        status: 'ONLINE',
        clientId: 'client-1',
        cost: 1000,
      }

      const mockCreatedServer = {
        id: 'server-1',
        ...mockServerData,
        tenantId: 'tenant-1',
        installationDate: null,
        lastMaintenance: null,
        nextMaintenance: null,
        client: { id: 'client-1', companyName: 'Test Company' },
        alerts: [],
        metrics: [],
      }

      prisma.server.create.mockResolvedValue(mockCreatedServer)

      const result = await ServerService.createServer(mockServerData, 'tenant-1')

      expect(prisma.server.create).toHaveBeenCalledWith({
        data: {
          ...mockServerData,
          tenantId: 'tenant-1',
          installationDate: null,
          lastMaintenance: null,
          nextMaintenance: null,
        },
        include: {
          client: true,
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      })
      expect(result).toEqual(mockCreatedServer)
    })

    it('debería manejar errores de base de datos', async () => {
      const mockServerData = {
        name: 'Test Server',
        hostname: 'test-server',
        ipAddress: '192.168.1.100',
        type: 'WEB',
        status: 'ONLINE',
        clientId: 'client-1',
        cost: 1000,
      }

      const dbError = new Error('Database connection failed')
      prisma.server.create.mockRejectedValue(dbError)

      await expect(ServerService.createServer(mockServerData, 'tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('getServers', () => {
    it('debería obtener servidores con parámetros por defecto', async () => {
      const mockServers = [
        {
          id: 'server-1',
          name: 'Test Server 1',
          status: 'ONLINE',
          client: { id: 'client-1', companyName: 'Test Company' },
          alerts: [],
          metrics: [],
        },
      ]

      prisma.server.findMany.mockResolvedValue(mockServers)
      prisma.server.count.mockResolvedValue(1)

      const result = await ServerService.getServers('tenant-1')

      expect(prisma.server.findMany).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        skip: 0,
        take: 20,
        include: {
          client: true,
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual({
        servers: mockServers,
        total: 1,
        page: 1,
        totalPages: 1,
      })
    })

    it('debería obtener servidores con filtros de búsqueda', async () => {
      const mockServers = []
      prisma.server.findMany.mockResolvedValue(mockServers)
      prisma.server.count.mockResolvedValue(0)

      const result = await ServerService.getServers('tenant-1', {
        page: 2,
        limit: 10,
        search: 'test',
        status: 'ONLINE',
        clientId: 'client-1',
      })

      expect(prisma.server.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { hostname: { contains: 'test', mode: 'insensitive' } },
            { ipAddress: { contains: 'test', mode: 'insensitive' } },
            { client: { companyName: { contains: 'test', mode: 'insensitive' } } },
          ],
          status: 'ONLINE',
          clientId: 'client-1',
        },
        skip: 10,
        take: 10,
        include: {
          client: true,
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      expect(result.totalPages).toBe(0)
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.server.findMany.mockRejectedValue(dbError)

      await expect(ServerService.getServers('tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('getServerById', () => {
    it('debería obtener un servidor por ID exitosamente', async () => {
      const mockServer = {
        id: 'server-1',
        name: 'Test Server',
        status: 'ONLINE',
        client: { id: 'client-1', companyName: 'Test Company' },
        alerts: [],
        metrics: [],
      }

      prisma.server.findFirst.mockResolvedValue(mockServer)

      const result = await ServerService.getServerById('server-1', 'tenant-1')

      expect(prisma.server.findFirst).toHaveBeenCalledWith({
        where: { id: 'server-1', tenantId: 'tenant-1' },
        include: {
          client: true,
          alerts: {
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
          },
        },
      })
      expect(result).toEqual(mockServer)
    })

    it('debería retornar null si el servidor no existe', async () => {
      prisma.server.findFirst.mockResolvedValue(null)

      const result = await ServerService.getServerById('nonexistent', 'tenant-1')

      expect(result).toBeNull()
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.server.findFirst.mockRejectedValue(dbError)

      await expect(ServerService.getServerById('server-1', 'tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('updateServer', () => {
    it('debería actualizar un servidor exitosamente', async () => {
      const updateData = {
        name: 'Updated Server',
        status: 'OFFLINE',
        installationDate: '2024-01-01',
      }

      const mockUpdatedServer = {
        id: 'server-1',
        name: 'Updated Server',
        status: 'OFFLINE',
        installationDate: new Date('2024-01-01'),
        client: { id: 'client-1', companyName: 'Test Company' },
        alerts: [],
        metrics: [],
      }

      prisma.server.update.mockResolvedValue(mockUpdatedServer)

      const result = await ServerService.updateServer('server-1', updateData, 'tenant-1')

      expect(prisma.server.update).toHaveBeenCalledWith({
        where: { id: 'server-1', tenantId: 'tenant-1' },
        data: {
          ...updateData,
          installationDate: new Date('2024-01-01'),
          lastMaintenance: undefined,
          nextMaintenance: undefined,
        },
        include: {
          client: true,
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      })
      expect(result).toEqual(mockUpdatedServer)
    })

    it('debería actualizar servidor sin fechas opcionales', async () => {
      const updateData = {
        name: 'Updated Server',
        status: 'ONLINE',
      }

      const mockUpdatedServer = {
        id: 'server-1',
        ...updateData,
        client: { id: 'client-1', companyName: 'Test Company' },
        alerts: [],
        metrics: [],
      }

      prisma.server.update.mockResolvedValue(mockUpdatedServer)

      const result = await ServerService.updateServer('server-1', updateData, 'tenant-1')

      expect(prisma.server.update).toHaveBeenCalledWith({
        where: { id: 'server-1', tenantId: 'tenant-1' },
        data: {
          ...updateData,
          installationDate: undefined,
          lastMaintenance: undefined,
          nextMaintenance: undefined,
        },
        include: {
          client: true,
          alerts: {
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
          },
          metrics: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      })
      expect(result).toEqual(mockUpdatedServer)
    })

    it('debería manejar errores de base de datos', async () => {
      const updateData = { name: 'Updated Server' }
      const dbError = new Error('Database connection failed')
      prisma.server.update.mockRejectedValue(dbError)

      await expect(ServerService.updateServer('server-1', updateData, 'tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('deleteServer', () => {
    it('debería eliminar un servidor exitosamente', async () => {
      const mockDeletedServer = {
        id: 'server-1',
        name: 'Test Server',
        status: 'ONLINE',
      }

      prisma.server.delete.mockResolvedValue(mockDeletedServer)

      const result = await ServerService.deleteServer('server-1', 'tenant-1')

      expect(prisma.server.delete).toHaveBeenCalledWith({
        where: { id: 'server-1', tenantId: 'tenant-1' },
      })
      expect(result).toEqual(mockDeletedServer)
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.server.delete.mockRejectedValue(dbError)

      await expect(ServerService.deleteServer('server-1', 'tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('getServerStats', () => {
    it('debería obtener estadísticas completas del dashboard', async () => {
      const mockStats = {
        totalServers: 10,
        onlineServers: 8,
        offlineServers: 1,
        maintenanceServers: 1,
        warningServers: 0,
        totalClients: 5,
        activeClients: 4,
        totalRevenue: { _sum: { cost: 10000 } },
        recentAlerts: 3,
        serversByType: [
          { type: 'WEB', _count: { type: 5 } },
          { type: 'DB', _count: { type: 3 } },
          { type: 'API', _count: { type: 2 } },
        ],
        serversByClient: [
          { clientId: 'client-1', _count: { clientId: 3 } },
          { clientId: 'client-2', _count: { clientId: 2 } },
        ],
        clientsWithServers: [
          {
            id: 'client-1',
            companyName: 'Test Company',
            servers: [
              { id: 'server-1', name: 'Server 1', status: 'ONLINE' },
              { id: 'server-2', name: 'Server 2', status: 'ONLINE' },
            ],
          },
        ],
      }

      // Mock todas las consultas en paralelo
      prisma.server.count
        .mockResolvedValueOnce(10) // totalServers
        .mockResolvedValueOnce(8) // onlineServers
        .mockResolvedValueOnce(1) // offlineServers
        .mockResolvedValueOnce(1) // maintenanceServers
        .mockResolvedValueOnce(0) // warningServers

      prisma.serverClient.count
        .mockResolvedValueOnce(5) // totalClients
        .mockResolvedValueOnce(4) // activeClients

      prisma.server.aggregate.mockResolvedValue(mockStats.totalRevenue)
      prisma.serverAlert.count.mockResolvedValue(3)
      prisma.server.groupBy
        .mockResolvedValueOnce(mockStats.serversByType)
        .mockResolvedValueOnce(mockStats.serversByClient)

      prisma.serverClient.findMany.mockResolvedValue(mockStats.clientsWithServers)

      const result = await ServerService.getServerStats('tenant-1')

      expect(result).toEqual({
        totalServers: 10,
        onlineServers: 8,
        offlineServers: 1,
        maintenanceServers: 1,
        warningServers: 0,
        totalClients: 5,
        activeClients: 4,
        totalRevenue: 10000,
        recentAlerts: 3,
        serversByType: mockStats.serversByType,
        serversByClient: mockStats.serversByClient,
        clientsWithServers: mockStats.clientsWithServers,
      })
    })

    it('debería manejar caso cuando no hay ingresos', async () => {
      const mockStats = {
        totalServers: 0,
        onlineServers: 0,
        offlineServers: 0,
        maintenanceServers: 0,
        warningServers: 0,
        totalClients: 0,
        activeClients: 0,
        totalRevenue: { _sum: { cost: null } },
        recentAlerts: 0,
        serversByType: [],
        serversByClient: [],
        clientsWithServers: [],
      }

      prisma.server.count.mockResolvedValue(0)
      prisma.serverClient.count.mockResolvedValue(0)
      prisma.server.aggregate.mockResolvedValue({ _sum: { cost: null } })
      prisma.serverAlert.count.mockResolvedValue(0)
      prisma.server.groupBy.mockResolvedValue([])
      prisma.serverClient.findMany.mockResolvedValue([])

      const result = await ServerService.getServerStats('tenant-1')

      expect(result.totalRevenue).toBe(0)
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.server.count.mockRejectedValue(dbError)

      await expect(ServerService.getServerStats('tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('getServerMetrics', () => {
    it('debería obtener métricas con parámetros por defecto', async () => {
      const mockMetrics = [
        {
          id: 'metric-1',
          serverId: 'server-1',
          metricType: 'CPU',
          value: 85.5,
          timestamp: new Date('2024-01-01T10:00:00Z'),
        },
      ]

      prisma.serverMetric.findMany.mockResolvedValue(mockMetrics)

      const result = await ServerService.getServerMetrics('server-1', 'tenant-1')

      expect(prisma.serverMetric.findMany).toHaveBeenCalledWith({
        where: {
          serverId: 'server-1',
          tenantId: 'tenant-1',
          timestamp: {
            gte: expect.any(Date),
          },
        },
        orderBy: { timestamp: 'asc' },
      })
      expect(result).toEqual(mockMetrics)
    })

    it('debería obtener métricas con filtros específicos', async () => {
      const mockMetrics = []
      prisma.serverMetric.findMany.mockResolvedValue(mockMetrics)

      const result = await ServerService.getServerMetrics('server-1', 'tenant-1', {
        metricType: 'CPU',
        hours: 12,
      })

      expect(prisma.serverMetric.findMany).toHaveBeenCalledWith({
        where: {
          serverId: 'server-1',
          tenantId: 'tenant-1',
          timestamp: {
            gte: expect.any(Date),
          },
          metricType: 'CPU',
        },
        orderBy: { timestamp: 'asc' },
      })
      expect(result).toEqual(mockMetrics)
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.serverMetric.findMany.mockRejectedValue(dbError)

      await expect(ServerService.getServerMetrics('server-1', 'tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('createServerAlert', () => {
    it('debería crear una alerta exitosamente', async () => {
      const alertData = {
        type: 'HIGH_CPU',
        severity: 'WARNING',
        message: 'CPU usage is high',
        status: 'ACTIVE',
      }

      const mockAlert = {
        id: 'alert-1',
        ...alertData,
        serverId: 'server-1',
        tenantId: 'tenant-1',
        createdAt: new Date(),
      }

      prisma.serverAlert.create.mockResolvedValue(mockAlert)

      const result = await ServerService.createServerAlert(alertData, 'server-1', 'tenant-1')

      expect(prisma.serverAlert.create).toHaveBeenCalledWith({
        data: {
          ...alertData,
          serverId: 'server-1',
          tenantId: 'tenant-1',
        },
      })
      expect(result).toEqual(mockAlert)
    })

    it('debería manejar errores de base de datos', async () => {
      const alertData = {
        type: 'HIGH_CPU',
        severity: 'WARNING',
        message: 'CPU usage is high',
        status: 'ACTIVE',
      }

      const dbError = new Error('Database connection failed')
      prisma.serverAlert.create.mockRejectedValue(dbError)

      await expect(ServerService.createServerAlert(alertData, 'server-1', 'tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('getServerAlerts', () => {
    it('debería obtener alertas con parámetros por defecto', async () => {
      const mockAlerts = [
        {
          id: 'alert-1',
          type: 'HIGH_CPU',
          severity: 'WARNING',
          message: 'CPU usage is high',
          status: 'ACTIVE',
          server: {
            id: 'server-1',
            name: 'Test Server',
            client: { id: 'client-1', companyName: 'Test Company' },
          },
        },
      ]

      prisma.serverAlert.findMany.mockResolvedValue(mockAlerts)
      prisma.serverAlert.count.mockResolvedValue(1)

      const result = await ServerService.getServerAlerts('tenant-1')

      expect(prisma.serverAlert.findMany).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        skip: 0,
        take: 20,
        include: {
          server: {
            include: {
              client: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      expect(result).toEqual({
        alerts: mockAlerts,
        total: 1,
        page: 1,
        totalPages: 1,
      })
    })

    it('debería obtener alertas con filtros específicos', async () => {
      const mockAlerts = []
      prisma.serverAlert.findMany.mockResolvedValue(mockAlerts)
      prisma.serverAlert.count.mockResolvedValue(0)

      const result = await ServerService.getServerAlerts('tenant-1', {
        page: 2,
        limit: 10,
        status: 'ACTIVE',
        severity: 'CRITICAL',
        serverId: 'server-1',
      })

      expect(prisma.serverAlert.findMany).toHaveBeenCalledWith({
        where: {
          tenantId: 'tenant-1',
          status: 'ACTIVE',
          severity: 'CRITICAL',
          serverId: 'server-1',
        },
        skip: 10,
        take: 10,
        include: {
          server: {
            include: {
              client: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
      expect(result.totalPages).toBe(0)
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.serverAlert.findMany.mockRejectedValue(dbError)

      await expect(ServerService.getServerAlerts('tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('acknowledgeAlert', () => {
    it('debería reconocer una alerta exitosamente', async () => {
      const mockUpdatedAlert = {
        id: 'alert-1',
        type: 'HIGH_CPU',
        severity: 'WARNING',
        message: 'CPU usage is high',
        status: 'ACKNOWLEDGED',
        acknowledged: true,
      }

      prisma.serverAlert.update.mockResolvedValue(mockUpdatedAlert)

      const result = await ServerService.acknowledgeAlert('alert-1', 'tenant-1')

      expect(prisma.serverAlert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1', tenantId: 'tenant-1' },
        data: {
          acknowledged: true,
          status: 'ACKNOWLEDGED',
        },
      })
      expect(result).toEqual(mockUpdatedAlert)
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.serverAlert.update.mockRejectedValue(dbError)

      await expect(ServerService.acknowledgeAlert('alert-1', 'tenant-1')).rejects.toThrow('Database connection failed')
    })
  })

  describe('resolveAlert', () => {
    it('debería resolver una alerta exitosamente', async () => {
      const mockResolvedAlert = {
        id: 'alert-1',
        type: 'HIGH_CPU',
        severity: 'WARNING',
        message: 'CPU usage is high',
        status: 'RESOLVED',
        resolvedAt: new Date('2024-01-01T10:00:00Z'),
        resolvedBy: 'user-1',
      }

      prisma.serverAlert.update.mockResolvedValue(mockResolvedAlert)

      const result = await ServerService.resolveAlert('alert-1', 'tenant-1', 'user-1')

      expect(prisma.serverAlert.update).toHaveBeenCalledWith({
        where: { id: 'alert-1', tenantId: 'tenant-1' },
        data: {
          status: 'RESOLVED',
          resolvedAt: expect.any(Date),
          resolvedBy: 'user-1',
        },
      })
      expect(result).toEqual(mockResolvedAlert)
    })

    it('debería manejar errores de base de datos', async () => {
      const dbError = new Error('Database connection failed')
      prisma.serverAlert.update.mockRejectedValue(dbError)

      await expect(ServerService.resolveAlert('alert-1', 'tenant-1', 'user-1')).rejects.toThrow('Database connection failed')
    })
  })
})
