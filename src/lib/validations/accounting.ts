import { z } from 'zod'

// Esquemas de validación para el módulo de contabilidad

// Plan de cuentas
export const chartOfAccountsSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'], {
    errorMap: () => ({ message: 'Tipo de cuenta inválido' }),
  }),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
})

export const updateChartOfAccountsSchema = chartOfAccountsSchema.partial()

// Asiento contable
export const journalEntrySchema = z.object({
  date: z.string().datetime('Fecha inválida'),
  description: z.string().min(1, 'La descripción es requerida'),
  reference: z.string().optional(),
  lines: z.array(z.object({
    accountId: z.string().min(1, 'La cuenta es requerida'),
    debit: z.number().min(0, 'El débito no puede ser negativo').default(0),
    credit: z.number().min(0, 'El crédito no puede ser negativo').default(0),
    description: z.string().optional(),
    reference: z.string().optional(),
  })).min(2, 'Debe incluir al menos 2 líneas'),
})

export const updateJournalEntrySchema = z.object({
  date: z.string().datetime().optional(),
  description: z.string().min(1).optional(),
  reference: z.string().optional(),
  isPosted: z.boolean().optional(),
})

// Línea de asiento contable
export const journalEntryLineSchema = z.object({
  accountId: z.string().min(1, 'La cuenta es requerida'),
  debit: z.number().min(0, 'El débito no puede ser negativo').default(0),
  credit: z.number().min(0, 'El crédito no puede ser negativo').default(0),
  description: z.string().optional(),
  reference: z.string().optional(),
})

// Balance general
export const balanceSheetSchema = z.object({
  date: z.string().datetime('Fecha inválida'),
  assets: z.number().min(0, 'Los activos no pueden ser negativos'),
  liabilities: z.number().min(0, 'Los pasivos no pueden ser negativos'),
  equity: z.number().min(0, 'El patrimonio no puede ser negativo'),
})

// Estado de resultados
export const incomeStatementSchema = z.object({
  date: z.string().datetime('Fecha inválida'),
  revenue: z.number().min(0, 'Los ingresos no pueden ser negativos'),
  expenses: z.number().min(0, 'Los gastos no pueden ser negativos'),
  netIncome: z.number(),
})

// Conciliación bancaria
export const bankReconciliationSchema = z.object({
  bankAccount: z.string().min(1, 'La cuenta bancaria es requerida'),
  statementDate: z.string().datetime('Fecha inválida'),
  statementBalance: z.number(),
  bookBalance: z.number(),
  notes: z.string().optional(),
})

export const updateBankReconciliationSchema = z.object({
  reconciled: z.boolean().optional(),
  notes: z.string().optional(),
})

// Item de conciliación bancaria
export const bankReconciliationItemSchema = z.object({
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'FEE', 'INTEREST', 'ADJUSTMENT'], {
    errorMap: () => ({ message: 'Tipo de item inválido' }),
  }),
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().min(1, 'La descripción es requerida'),
  reference: z.string().optional(),
  isMatched: z.boolean().default(false),
})

// Impuesto
export const taxSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  rate: z.number().min(0).max(100, 'La tasa debe estar entre 0 y 100'),
  type: z.enum(['SALES_TAX', 'INCOME_TAX', 'PAYROLL_TAX', 'PROPERTY_TAX', 'OTHER'], {
    errorMap: () => ({ message: 'Tipo de impuesto inválido' }),
  }),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
})

export const updateTaxSchema = taxSchema.partial()

// Transacción de impuesto
export const taxTransactionSchema = z.object({
  taxId: z.string().min(1, 'El impuesto es requerido'),
  amount: z.number().positive('El monto debe ser positivo'),
  taxAmount: z.number().positive('El monto del impuesto debe ser positivo'),
  date: z.string().datetime('Fecha inválida'),
  description: z.string().optional(),
  reference: z.string().optional(),
})

// Filtros para plan de cuentas
export const chartOfAccountsFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']).optional(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional(),
})

// Filtros para asientos contables
export const journalEntryFiltersSchema = z.object({
  search: z.string().optional(),
  isPosted: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  accountId: z.string().optional(),
})

// Filtros para conciliación bancaria
export const bankReconciliationFiltersSchema = z.object({
  bankAccount: z.string().optional(),
  reconciled: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Filtros para impuestos
export const taxFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['SALES_TAX', 'INCOME_TAX', 'PAYROLL_TAX', 'PROPERTY_TAX', 'OTHER']).optional(),
  isActive: z.boolean().optional(),
})

// Tipos TypeScript
export type ChartOfAccounts = z.infer<typeof chartOfAccountsSchema>
export type UpdateChartOfAccounts = z.infer<typeof updateChartOfAccountsSchema>
export type JournalEntry = z.infer<typeof journalEntrySchema>
export type UpdateJournalEntry = z.infer<typeof updateJournalEntrySchema>
export type JournalEntryLine = z.infer<typeof journalEntryLineSchema>
export type BalanceSheet = z.infer<typeof balanceSheetSchema>
export type IncomeStatement = z.infer<typeof incomeStatementSchema>
export type BankReconciliation = z.infer<typeof bankReconciliationSchema>
export type UpdateBankReconciliation = z.infer<typeof updateBankReconciliationSchema>
export type BankReconciliationItem = z.infer<typeof bankReconciliationItemSchema>
export type Tax = z.infer<typeof taxSchema>
export type UpdateTax = z.infer<typeof updateTaxSchema>
export type TaxTransaction = z.infer<typeof taxTransactionSchema>
export type ChartOfAccountsFilters = z.infer<typeof chartOfAccountsFiltersSchema>
export type JournalEntryFilters = z.infer<typeof journalEntryFiltersSchema>
export type BankReconciliationFilters = z.infer<typeof bankReconciliationFiltersSchema>
export type TaxFilters = z.infer<typeof taxFiltersSchema>
