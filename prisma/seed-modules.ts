// ========================================
// SCRIPT PARA POBLAR MÓDULOS EN LA BASE DE DATOS
// ========================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Definir módulos directamente aquí para evitar problemas de importación
const modules = [
  // ========================================
  // MÓDULOS DE FASE 1 - CRÍTICOS
  // ========================================

  // 1. Módulo de Inventario/Stock
  {
    id: 'inventory',
    name: 'Inventory',
    displayName: 'Inventario y Stock',
    description:
      'Gestión completa de inventario, productos, proveedores y stock',
    version: '1.0.0',
    category: 'BUSINESS' as any,
    isCore: true,
    icon: 'Package',
    color: '#3B82F6',
    order: 1,
    config: {
      defaultSettings: {
        enableBarcodeScanning: true,
        enableLowStockAlerts: true,
        enableStockMovements: true,
        enableSupplierManagement: true,
        enablePurchaseOrders: true,
        enableProductVariants: true,
        enableProductImages: true,
      },
      customizableFields: [],
      workflows: [],
      integrations: [],
    },
    features: [
      {
        id: 'product_management',
        name: 'Gestión de Productos',
        description:
          'Registro y gestión completa de productos con códigos de barras',
        isEnabled: true,
        config: {},
      },
      {
        id: 'stock_management',
        name: 'Control de Stock',
        description: 'Control de inventario en tiempo real con alertas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'supplier_management',
        name: 'Gestión de Proveedores',
        description: 'Administración de proveedores y órdenes de compra',
        isEnabled: true,
        config: {},
      },
      {
        id: 'stock_movements',
        name: 'Movimientos de Stock',
        description: 'Registro de entradas, salidas y ajustes de inventario',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
    ],
  },

  // 2. Módulo de Contabilidad
  {
    id: 'accounting',
    name: 'Accounting',
    displayName: 'Contabilidad',
    description:
      'Sistema contable completo con plan de cuentas y reportes fiscales',
    version: '1.0.0',
    category: 'FINANCIAL' as any,
    isCore: true,
    icon: 'Calculator',
    color: '#10B981',
    order: 2,
    config: {
      defaultSettings: {
        enableChartOfAccounts: true,
        enableJournalEntries: true,
        enableBankReconciliation: true,
        enableTaxManagement: true,
        enableFinancialReports: true,
        enableBalanceSheet: true,
        enableIncomeStatement: true,
      },
      customizableFields: [],
      workflows: [],
      integrations: [],
    },
    features: [
      {
        id: 'chart_of_accounts',
        name: 'Plan de Cuentas',
        description: 'Configuración y gestión del plan de cuentas contable',
        isEnabled: true,
        config: {},
      },
      {
        id: 'journal_entries',
        name: 'Asientos Contables',
        description: 'Registro de asientos contables con validación automática',
        isEnabled: true,
        config: {},
      },
      {
        id: 'bank_reconciliation',
        name: 'Conciliación Bancaria',
        description:
          'Conciliación de cuentas bancarias y control de movimientos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'financial_reports',
        name: 'Reportes Financieros',
        description:
          'Balance general, estado de resultados y reportes fiscales',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['SUPER_ADMIN'] },
    ],
  },

  // 3. Módulo de Ventas
  {
    id: 'sales',
    name: 'Sales',
    displayName: 'Ventas',
    description: 'Gestión completa de ventas, cotizaciones y comisiones',
    version: '1.0.0',
    category: 'BUSINESS' as any,
    isCore: true,
    icon: 'ShoppingCart',
    color: '#F59E0B',
    order: 3,
    config: {
      defaultSettings: {
        enableQuotes: true,
        enableSalesPipeline: true,
        enableCommissions: true,
        enableDiscounts: true,
        enableSalesReports: true,
        enableCustomerManagement: true,
        enableSalespersonManagement: true,
      },
      customizableFields: [],
      workflows: [],
      integrations: [],
    },
    features: [
      {
        id: 'quote_management',
        name: 'Gestión de Cotizaciones',
        description: 'Creación y seguimiento de cotizaciones',
        isEnabled: true,
        config: {},
      },
      {
        id: 'sales_pipeline',
        name: 'Pipeline de Ventas',
        description: 'Seguimiento del proceso de ventas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'commission_management',
        name: 'Gestión de Comisiones',
        description: 'Cálculo y pago de comisiones a vendedores',
        isEnabled: true,
        config: {},
      },
      {
        id: 'discount_management',
        name: 'Gestión de Descuentos',
        description: 'Configuración de descuentos y promociones',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
    ],
  },

  // 4. Módulo de Facturación
  {
    id: 'billing',
    name: 'Billing',
    displayName: 'Facturación',
    description: 'Sistema de facturación electrónica con gestión de pagos',
    version: '1.0.0',
    category: 'FINANCIAL' as any,
    isCore: true,
    icon: 'FileText',
    color: '#EF4444',
    order: 4,
    config: {
      defaultSettings: {
        enableElectronicInvoicing: true,
        enablePaymentTracking: true,
        enableCreditNotes: true,
        enableDebitNotes: true,
        enableInvoiceTemplates: true,
        enableTaxConfiguration: true,
        enablePaymentMethods: true,
      },
      customizableFields: [],
      workflows: [],
      integrations: [],
    },
    features: [
      {
        id: 'invoice_management',
        name: 'Gestión de Facturas',
        description: 'Creación y gestión de facturas electrónicas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'payment_tracking',
        name: 'Seguimiento de Pagos',
        description: 'Control de pagos y métodos de pago',
        isEnabled: true,
        config: {},
      },
      {
        id: 'credit_debit_notes',
        name: 'Notas de Crédito y Débito',
        description: 'Gestión de notas de crédito y débito',
        isEnabled: true,
        config: {},
      },
      {
        id: 'invoice_templates',
        name: 'Plantillas de Factura',
        description: 'Configuración de plantillas personalizadas',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
    ],
  },

  // ========================================
  // MÓDULOS EXISTENTES
  // ========================================

  // Módulo de RRHH (existente)
  {
    id: 'hr',
    name: 'HR',
    displayName: 'Recursos Humanos',
    description:
      'Módulo completo de gestión de recursos humanos, nómina y talento',
    version: '1.0.0',
    category: 'BUSINESS' as any,
    isCore: false,
    icon: 'Users',
    color: '#EC4899',
    order: 8,
    config: {
      defaultSettings: {
        enablePayrollManagement: true,
        enableVacationTracking: true,
        enablePerformanceReviews: true,
        enableTimeTracking: false,
        enableEmployeeSelfService: true,
        enableAttendanceTracking: false,
      },
      customizableFields: [],
      workflows: [],
      integrations: [],
    },
    features: [
      {
        id: 'employee_management',
        name: 'Gestión de Empleados',
        description: 'Registro y gestión completa de empleados',
        isEnabled: true,
        config: {},
      },
      {
        id: 'payroll_management',
        name: 'Gestión de Nómina',
        description: 'Cálculo y gestión de nómina y salarios',
        isEnabled: true,
        config: {},
      },
      {
        id: 'vacation_management',
        name: 'Gestión de Vacaciones',
        description: 'Solicitud y aprobación de vacaciones',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
    ],
  },
]

async function seedModules() {
  console.log('🌱 Iniciando seed de módulos...')

  try {
    console.log(`📦 Encontrados ${modules.length} módulos para poblar`)

    // Poblar cada módulo en la base de datos
    for (const module of modules) {
      console.log(`📝 Poblando módulo: ${module.displayName} (${module.id})`)

      await prisma.module.upsert({
        where: { id: module.id },
        update: {
          name: module.name,
          displayName: module.displayName,
          description: module.description,
          version: module.version,
          category: module.category,
          isCore: module.isCore,
          icon: module.icon,
          color: module.color,
          order: module.order,
          config: JSON.parse(
            JSON.stringify({
              ...module.config,
            })
          ),
          features: JSON.parse(JSON.stringify(module.features)),
          permissions: JSON.parse(JSON.stringify(module.permissions)),
        },
        create: {
          id: module.id,
          name: module.name,
          displayName: module.displayName,
          description: module.description,
          version: module.version,
          key:
            (module as any).key ||
            module.name.toLowerCase().replace(/\s+/g, '-'),
          category: module.category as any,
          isCore: module.isCore,
          icon: module.icon,
          color: module.color,
          order: module.order,
          config: JSON.parse(
            JSON.stringify({
              ...module.config,
            })
          ),
          features: JSON.parse(JSON.stringify(module.features)),
          permissions: JSON.parse(JSON.stringify(module.permissions)),
        },
      })
    }

    console.log('✅ Módulos poblados exitosamente')

    // Obtener el tenant por defecto
    const defaultTenant = await prisma.tenant.findFirst()
    if (!defaultTenant) {
      console.log('⚠️ No se encontró tenant por defecto')
      return
    }

    console.log(`🏢 Activando módulos core para tenant: ${defaultTenant.name}`)

    // Activar módulos core por defecto
    const coreModules = modules.filter(m => m.isCore)
    for (const module of coreModules) {
      console.log(`🔧 Activando módulo core: ${module.displayName}`)

      await prisma.tenantModule.upsert({
        where: {
          tenantId_moduleId: {
            tenantId: defaultTenant.id,
            moduleId: module.id,
          },
        },
        update: {
          isActive: true,
          isEnabled: true,
          config: module.config.defaultSettings,
        },
        create: {
          tenantId: defaultTenant.id,
          moduleId: module.id,
          isActive: true,
          isEnabled: true,
          config: module.config.defaultSettings,
        },
      })
    }

    console.log('✅ Módulos core activados exitosamente')
  } catch (error) {
    console.error('❌ Error poblando módulos:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el seed
seedModules()
  .then(() => {
    console.log('🎉 Seed de módulos completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('💥 Error en seed de módulos:', error)
    process.exit(1)
  })
