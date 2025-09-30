import { PrismaClient } from '@prisma/client'
import {
  ChartOfAccounts,
  JournalEntry,
  BankReconciliation,
  Tax,
  ChartOfAccountsFilters,
  JournalEntryFilters,
  BankReconciliationFilters,
  TaxFilters,
} from '@/lib/validations/accounting'

const prisma = new PrismaClient()

export class AccountingService {
  // ========================================
  // PLAN DE CUENTAS
  // ========================================

  /**
   * Obtiene el plan de cuentas con filtros y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de cuentas y información de paginación
   */
  static async getChartOfAccounts(
    tenantId: string,
    filters: ChartOfAccountsFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters.parentId) {
      where.parentId = filters.parentId
    }

    const [accounts, total] = await Promise.all([
      prisma.chartOfAccounts.findMany({
        where,
        include: {
          parent: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          children: {
            select: {
              id: true,
              code: true,
              name: true,
              type: true,
            },
          },
          _count: {
            select: {
              journalEntryLines: true,
            },
          },
        },
        orderBy: { code: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.chartOfAccounts.count({ where }),
    ])

    return { accounts, total, page, limit, pages: Math.ceil(total / limit) }
  }

  /**
   * Obtiene una cuenta por su ID
   * @param id - ID de la cuenta
   * @param tenantId - ID del tenant
   * @returns Promise con la cuenta y sus relaciones
   */
  static async getAccountById(id: string, tenantId: string) {
    return prisma.chartOfAccounts.findFirst({
      where: { id, tenantId },
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
          },
        },
        journalEntryLines: {
          include: {
            journalEntry: {
              select: {
                id: true,
                entryNumber: true,
                date: true,
                description: true,
                isPosted: true,
              },
            },
          },
          orderBy: {
            journalEntry: { createdAt: 'desc' },
          },
          take: 10,
        },
      },
    })
  }

  /**
   * Crea una nueva cuenta en el plan de cuentas
   * @param data - Datos de la cuenta a crear
   * @param tenantId - ID del tenant
   * @returns Promise con la cuenta creada
   * @throws Error si el código ya existe o la cuenta padre no existe
   */
  static async createAccount(data: ChartOfAccounts, tenantId: string) {
    // Verificar código único
    const existingAccount = await prisma.chartOfAccounts.findFirst({
      where: { code: data.code, tenantId },
    })

    if (existingAccount) {
      throw new Error('Ya existe una cuenta con ese código')
    }

    // Verificar que la cuenta padre existe si se especifica
    if (data.parentId) {
      const parentAccount = await prisma.chartOfAccounts.findFirst({
        where: { id: data.parentId, tenantId },
      })

      if (!parentAccount) {
        throw new Error('La cuenta padre no existe')
      }
    }

    return prisma.chartOfAccounts.create({
      data: { ...data, tenantId },
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
          },
        },
      },
    })
  }

  /**
   * Actualiza una cuenta existente
   * @param id - ID de la cuenta a actualizar
   * @param data - Datos a actualizar
   * @param tenantId - ID del tenant
   * @returns Promise con la cuenta actualizada
   * @throws Error si la cuenta no existe o el código ya existe
   */
  static async updateAccount(
    id: string,
    data: Partial<ChartOfAccounts>,
    tenantId: string
  ) {
    const existingAccount = await prisma.chartOfAccounts.findFirst({
      where: { id, tenantId },
    })

    if (!existingAccount) {
      throw new Error('Cuenta no encontrada')
    }

    // Verificar código único si se está cambiando
    if (data.code && data.code !== existingAccount.code) {
      const codeExists = await prisma.chartOfAccounts.findFirst({
        where: { code: data.code, tenantId, id: { not: id } },
      })
      if (codeExists) {
        throw new Error('Ya existe una cuenta con ese código')
      }
    }

    return prisma.chartOfAccounts.update({
      where: { id },
      data,
      include: {
        parent: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
        children: {
          select: {
            id: true,
            code: true,
            name: true,
            type: true,
          },
        },
      },
    })
  }

  /**
   * Elimina una cuenta del plan de cuentas
   * @param id - ID de la cuenta a eliminar
   * @param tenantId - ID del tenant
   * @returns Promise con la cuenta eliminada
   * @throws Error si la cuenta no existe, tiene movimientos contables o cuentas hijas
   */
  static async deleteAccount(id: string, tenantId: string) {
    const existingAccount = await prisma.chartOfAccounts.findFirst({
      where: { id, tenantId },
    })

    if (!existingAccount) {
      throw new Error('Cuenta no encontrada')
    }

    // Verificar si tiene movimientos contables
    const hasMovements = await prisma.journalEntryLine.findFirst({
      where: { accountId: id },
    })

    if (hasMovements) {
      throw new Error(
        'No se puede eliminar la cuenta porque tiene movimientos contables'
      )
    }

    // Verificar si tiene cuentas hijas
    const hasChildren = await prisma.chartOfAccounts.findFirst({
      where: { parentId: id },
    })

    if (hasChildren) {
      throw new Error(
        'No se puede eliminar la cuenta porque tiene cuentas hijas'
      )
    }

    return prisma.chartOfAccounts.delete({ where: { id } })
  }

  // ========================================
  // ASIENTOS CONTABLES
  // ========================================

  /**
   * Obtiene asientos contables con filtros y paginación
   * @param tenantId - ID del tenant
   * @param filters - Filtros de búsqueda
   * @param page - Página actual
   * @param limit - Límite de resultados por página
   * @returns Promise con lista de asientos y información de paginación
   */
  static async getJournalEntries(
    tenantId: string,
    filters: JournalEntryFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { entryNumber: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { reference: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.isPosted !== undefined) {
      where.isPosted = filters.isPosted
    }

    if (filters.startDate || filters.endDate) {
      where.date = {}
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate)
      }
    }

    if (filters.accountId) {
      where.journalEntryLines = {
        some: { accountId: filters.accountId },
      }
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          journalEntryLines: {
            include: {
              account: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.journalEntry.count({ where }),
    ])

    return { entries, total, page, limit, pages: Math.ceil(total / limit) }
  }

  /**
   * Obtiene un asiento contable por su ID
   * @param id - ID del asiento
   * @param tenantId - ID del tenant
   * @returns Promise con el asiento y sus líneas
   */
  static async getJournalEntryById(id: string, tenantId: string) {
    return prisma.journalEntry.findFirst({
      where: { id, tenantId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        journalEntryLines: {
          include: {
            account: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Crea un nuevo asiento contable
   * @param data - Datos del asiento a crear
   * @param tenantId - ID del tenant
   * @param userId - ID del usuario que crea el asiento
   * @returns Promise con el asiento creado
   * @throws Error si el débito total no es igual al crédito total o las cuentas no existen
   */
  static async createJournalEntry(
    data: JournalEntry,
    tenantId: string,
    userId: string
  ) {
    // Validar que el débito total sea igual al crédito total
    const totalDebit = data.lines.reduce((sum, line) => sum + line.debit, 0)
    const totalCredit = data.lines.reduce((sum, line) => sum + line.credit, 0)

    if (totalDebit !== totalCredit) {
      throw new Error('El débito total debe ser igual al crédito total')
    }

    // Verificar que todas las cuentas existen
    const accountIds = data.lines.map(line => line.accountId)
    const accounts = await prisma.chartOfAccounts.findMany({
      where: { id: { in: accountIds }, tenantId, isActive: true },
    })

    if (accounts.length !== accountIds.length) {
      throw new Error('Una o más cuentas no existen o están inactivas')
    }

    // Generar número de asiento
    const entryCount = await prisma.journalEntry.count({
      where: { tenantId },
    })
    const entryNumber = `JE-${String(entryCount + 1).padStart(6, '0')}`

    return prisma.journalEntry.create({
      data: {
        entryNumber,
        date: new Date(data.date),
        description: data.description,
        reference: data.reference,
        totalDebit: totalDebit,
        totalCredit: totalCredit,
        tenantId,
        userId,
        journalEntryLines: {
          create: data.lines.map(line => ({
            accountId: line.accountId,
            debit: line.debit,
            credit: line.credit,
            description: line.description,
            reference: line.reference,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        journalEntryLines: {
          include: {
            account: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Contabiliza un asiento (lo marca como contabilizado)
   * @param id - ID del asiento
   * @param tenantId - ID del tenant
   * @returns Promise con el asiento contabilizado
   * @throws Error si el asiento no existe o ya está contabilizado
   */
  static async postJournalEntry(id: string, tenantId: string) {
    const entry = await prisma.journalEntry.findFirst({
      where: { id, tenantId, isPosted: false },
    })

    if (!entry) {
      throw new Error('Asiento no encontrado o ya está contabilizado')
    }

    return prisma.journalEntry.update({
      where: { id },
      data: {
        isPosted: true,
        postedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        journalEntryLines: {
          include: {
            account: {
              select: {
                id: true,
                code: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    })
  }

  // ========================================
  // CONCILIACIÓN BANCARIA
  // ========================================

  static async getBankReconciliations(
    tenantId: string,
    filters: BankReconciliationFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.bankAccount) {
      where.bankAccount = { contains: filters.bankAccount, mode: 'insensitive' }
    }

    if (filters.reconciled !== undefined) {
      where.reconciled = filters.reconciled
    }

    if (filters.startDate || filters.endDate) {
      where.statementDate = {}
      if (filters.startDate) {
        where.statementDate.gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        where.statementDate.lte = new Date(filters.endDate)
      }
    }

    const [reconciliations, total] = await Promise.all([
      prisma.bankReconciliation.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          reconciliationItems: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.bankReconciliation.count({ where }),
    ])

    return {
      reconciliations,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    }
  }

  static async createBankReconciliation(
    data: BankReconciliation,
    tenantId: string,
    userId: string
  ) {
    return prisma.bankReconciliation.create({
      data: {
        ...data,
        statementDate: new Date(data.statementDate),
        tenantId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        reconciliationItems: true,
      },
    })
  }

  // ========================================
  // IMPUESTOS
  // ========================================

  static async getTaxes(
    tenantId: string,
    filters: TaxFilters = {},
    page = 1,
    limit = 10
  ) {
    const where: any = { tenantId }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.type) {
      where.type = filters.type
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    const [taxes, total] = await Promise.all([
      prisma.tax.findMany({
        where,
        include: {
          _count: {
            select: {
              taxTransactions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.tax.count({ where }),
    ])

    return { taxes, total, page, limit, pages: Math.ceil(total / limit) }
  }

  static async createTax(data: Tax, tenantId: string) {
    // Verificar nombre único
    const existingTax = await prisma.tax.findFirst({
      where: { name: data.name, tenantId },
    })

    if (existingTax) {
      throw new Error('Ya existe un impuesto con ese nombre')
    }

    return prisma.tax.create({
      data: { ...data, tenantId },
      include: {
        _count: {
          select: {
            taxTransactions: true,
          },
        },
      },
    })
  }

  // ========================================
  // DASHBOARD
  // ========================================

  /**
   * Obtiene estadísticas del dashboard de contabilidad
   * @param tenantId - ID del tenant
   * @returns Promise con estadísticas completas del módulo de contabilidad
   */
  static async getDashboardStats(tenantId: string) {
    const [
      totalAccounts,
      activeAccounts,
      totalJournalEntries,
      postedJournalEntries,
      totalReconciliations,
      reconciledReconciliations,
      totalTaxes,
      activeTaxes,
    ] = await Promise.all([
      prisma.chartOfAccounts.count({ where: { tenantId } }),
      prisma.chartOfAccounts.count({ where: { tenantId, isActive: true } }),
      prisma.journalEntry.count({ where: { tenantId } }),
      prisma.journalEntry.count({ where: { tenantId, isPosted: true } }),
      prisma.bankReconciliation.count({ where: { tenantId } }),
      prisma.bankReconciliation.count({
        where: { tenantId, reconciled: true },
      }),
      prisma.tax.count({ where: { tenantId } }),
      prisma.tax.count({ where: { tenantId, isActive: true } }),
    ])

    return {
      totalAccounts,
      activeAccounts,
      totalJournalEntries,
      postedJournalEntries,
      totalReconciliations,
      reconciledReconciliations,
      totalTaxes,
      activeTaxes,
    }
  }
}
