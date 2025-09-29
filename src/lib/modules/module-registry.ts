// ========================================
// REGISTRO DE MÓDULOS DEL SISTEMA ERP
// ========================================

export interface ModuleDefinition {
  id: string
  name: string
  displayName: string
  description: string
  version: string
  category:
    | 'CORE'
    | 'BUSINESS'
    | 'FINANCIAL'
    | 'ANALYTICS'
    | 'INTEGRATION'
    | 'CUSTOM'
  isCore: boolean
  icon: string
  color: string
  order: number
  config: ModuleConfig
  features: ModuleFeature[]
  permissions: ModulePermission[]
  routes: ModuleRoute[]
  components: ModuleComponent[]
}

export interface ModuleConfig {
  // Configuración por defecto del módulo
  defaultSettings: Record<string, any>
  customizableFields: CustomField[]
  workflows: WorkflowDefinition[]
  integrations: IntegrationDefinition[]
}

export interface ModuleFeature {
  id: string
  name: string
  description: string
  isEnabled: boolean
  config: Record<string, any>
}

export interface ModulePermission {
  action: string
  roles: string[]
}

export interface ModuleRoute {
  path: string
  component: string
  permission?: string
}

export interface ModuleComponent {
  name: string
  path: string
}

export interface CustomField {
  name: string
  displayName: string
  type:
    | 'TEXT'
    | 'TEXTAREA'
    | 'NUMBER'
    | 'EMAIL'
    | 'PHONE'
    | 'DATE'
    | 'DATETIME'
    | 'BOOLEAN'
    | 'SELECT'
    | 'MULTISELECT'
    | 'FILE'
    | 'IMAGE'
    | 'URL'
    | 'CURRENCY'
    | 'PERCENTAGE'
  isRequired: boolean
  options?: string[]
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: string
  value?: any
  message: string
}

export interface WorkflowDefinition {
  id: string
  name: string
  trigger: string
  conditions: any[]
  actions: any[]
}

export interface IntegrationDefinition {
  id: string
  name: string
  type: string
  config: Record<string, any>
}

// ========================================
// MÓDULOS DISPONIBLES EN EL SISTEMA
// ========================================

export const AVAILABLE_MODULES: ModuleDefinition[] = [
  {
    id: 'customers',
    name: 'Customers',
    displayName: 'Gestión de Clientes',
    description: 'Módulo básico de gestión de clientes y contactos',
    version: '1.0.0',
    category: 'CORE',
    isCore: true,
    icon: 'Users',
    color: '#3B82F6',
    order: 1,
    config: {
      defaultSettings: {
        enableLeadTracking: true,
        enableCustomerSegmentation: true,
        enableCommunicationHistory: true,
        enableCustomerPortal: false,
      },
      customizableFields: [
        {
          name: 'company_size',
          displayName: 'Tamaño de Empresa',
          type: 'SELECT',
          options: [
            'Pequeña (1-10)',
            'Mediana (11-50)',
            'Grande (51-200)',
            'Corporativa (200+)',
          ],
          isRequired: false,
        },
        {
          name: 'industry',
          displayName: 'Industria',
          type: 'TEXT',
          isRequired: false,
        },
        {
          name: 'annual_revenue',
          displayName: 'Ingresos Anuales',
          type: 'CURRENCY',
          isRequired: false,
        },
        {
          name: 'lead_source',
          displayName: 'Fuente del Lead',
          type: 'SELECT',
          options: [
            'Website',
            'Referido',
            'Redes Sociales',
            'Email Marketing',
            'Evento',
            'Otro',
          ],
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'new_lead_notification',
          name: 'Notificación de Nuevo Lead',
          trigger: 'CREATE',
          conditions: [],
          actions: [
            {
              type: 'email',
              template: 'new_lead',
              recipients: ['sales@company.com'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'mailchimp',
          name: 'Mailchimp',
          type: 'MAILCHIMP',
          config: { apiKey: '', listId: '' },
        },
      ],
    },
    features: [
      {
        id: 'lead_management',
        name: 'Gestión de Leads',
        description: 'Seguimiento y conversión de leads',
        isEnabled: true,
        config: {},
      },
      {
        id: 'customer_segmentation',
        name: 'Segmentación de Clientes',
        description: 'Clasificación automática de clientes',
        isEnabled: true,
        config: {},
      },
      {
        id: 'communication_history',
        name: 'Historial de Comunicaciones',
        description: 'Registro de todas las interacciones con clientes',
        isEnabled: true,
        config: {},
      },
      {
        id: 'customer_portal',
        name: 'Portal del Cliente',
        description:
          'Portal web para que los clientes accedan a su información',
        isEnabled: false,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    ],
    routes: [
      { path: '/customers', component: 'CustomerList', permission: 'read' },
      {
        path: '/customers/new',
        component: 'CustomerForm',
        permission: 'write',
      },
      {
        path: '/customers/:id',
        component: 'CustomerDetail',
        permission: 'read',
      },
      {
        path: '/customers/:id/edit',
        component: 'CustomerForm',
        permission: 'write',
      },
      { path: '/leads', component: 'LeadList', permission: 'read' },
      { path: '/leads/new', component: 'LeadForm', permission: 'write' },
    ],
    components: [
      { name: 'CustomerList', path: '@/modules/crm/components/CustomerList' },
      { name: 'CustomerForm', path: '@/modules/crm/components/CustomerForm' },
      {
        name: 'CustomerDetail',
        path: '@/modules/crm/components/CustomerDetail',
      },
      { name: 'LeadList', path: '@/modules/crm/components/LeadList' },
      { name: 'LeadForm', path: '@/modules/crm/components/LeadForm' },
    ],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    displayName: 'Gestión de Inventario',
    description: 'Control completo de inventario y productos',
    version: '1.0.0',
    category: 'BUSINESS',
    isCore: false,
    icon: 'Package',
    color: '#10B981',
    order: 2,
    config: {
      defaultSettings: {
        enableLowStockAlerts: true,
        enableBarcodeScanning: false,
        enableSerialNumberTracking: false,
        enableBatchTracking: false,
        enableExpirationTracking: false,
      },
      customizableFields: [
        {
          name: 'supplier',
          displayName: 'Proveedor',
          type: 'TEXT',
          isRequired: false,
        },
        {
          name: 'warranty_period',
          displayName: 'Período de Garantía (días)',
          type: 'NUMBER',
          isRequired: false,
        },
        {
          name: 'product_type',
          displayName: 'Tipo de Producto',
          type: 'SELECT',
          options: ['Físico', 'Digital', 'Servicio', 'Licencia'],
          isRequired: false,
        },
        {
          name: 'storage_location',
          displayName: 'Ubicación en Almacén',
          type: 'TEXT',
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'low_stock_alert',
          name: 'Alerta de Stock Bajo',
          trigger: 'UPDATE',
          conditions: [{ field: 'stock', operator: '<=', value: 'minStock' }],
          actions: [
            {
              type: 'email',
              template: 'low_stock',
              recipients: ['inventory@company.com'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'barcode_scanner',
          name: 'Escáner de Códigos de Barras',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
      ],
    },
    features: [
      {
        id: 'stock_tracking',
        name: 'Seguimiento de Stock',
        description: 'Control automático de niveles de inventario',
        isEnabled: true,
        config: {},
      },
      {
        id: 'barcode_scanning',
        name: 'Escaneo de Códigos de Barras',
        description: 'Integración con lectores de códigos de barras',
        isEnabled: false,
        config: {},
      },
      {
        id: 'serial_number_tracking',
        name: 'Seguimiento de Números de Serie',
        description: 'Control individual de productos por número de serie',
        isEnabled: false,
        config: {},
      },
      {
        id: 'batch_tracking',
        name: 'Seguimiento por Lotes',
        description: 'Control de productos por lotes de producción',
        isEnabled: false,
        config: {},
      },
      {
        id: 'expiration_tracking',
        name: 'Seguimiento de Expiración',
        description: 'Control de fechas de vencimiento de productos',
        isEnabled: false,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      {
        action: 'stock_adjustment',
        roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      },
    ],
    routes: [
      { path: '/products', component: 'ProductList', permission: 'read' },
      { path: '/products/new', component: 'ProductForm', permission: 'write' },
      { path: '/products/:id', component: 'ProductDetail', permission: 'read' },
      {
        path: '/products/:id/edit',
        component: 'ProductForm',
        permission: 'write',
      },
      {
        path: '/inventory/stock',
        component: 'StockManagement',
        permission: 'read',
      },
      {
        path: '/inventory/categories',
        component: 'CategoryManagement',
        permission: 'write',
      },
      {
        path: '/inventory/brands',
        component: 'BrandManagement',
        permission: 'write',
      },
    ],
    components: [
      {
        name: 'ProductList',
        path: '@/modules/inventory/components/ProductList',
      },
      {
        name: 'ProductForm',
        path: '@/modules/inventory/components/ProductForm',
      },
      {
        name: 'ProductDetail',
        path: '@/modules/inventory/components/ProductDetail',
      },
      {
        name: 'StockManagement',
        path: '@/modules/inventory/components/StockManagement',
      },
      {
        name: 'CategoryManagement',
        path: '@/modules/inventory/components/CategoryManagement',
      },
      {
        name: 'BrandManagement',
        path: '@/modules/inventory/components/BrandManagement',
      },
    ],
  },
  {
    id: 'accounting',
    name: 'Accounting',
    displayName: 'Contabilidad',
    description: 'Módulo completo de contabilidad y facturación',
    version: '1.0.0',
    category: 'FINANCIAL',
    isCore: false,
    icon: 'Calculator',
    color: '#F59E0B',
    order: 3,
    config: {
      defaultSettings: {
        enableTaxCalculation: true,
        enableMultiCurrency: false,
        enableInvoiceTemplates: true,
        enableRecurringInvoices: false,
        enablePaymentReminders: true,
      },
      customizableFields: [
        {
          name: 'tax_id',
          displayName: 'RFC/ID Fiscal',
          type: 'TEXT',
          isRequired: true,
        },
        {
          name: 'payment_terms',
          displayName: 'Términos de Pago',
          type: 'SELECT',
          options: [
            'Net 15',
            'Net 30',
            'Net 60',
            'Due on Receipt',
            '2/10 Net 30',
          ],
          isRequired: false,
        },
        {
          name: 'credit_limit',
          displayName: 'Límite de Crédito',
          type: 'CURRENCY',
          isRequired: false,
        },
        {
          name: 'billing_address',
          displayName: 'Dirección de Facturación',
          type: 'TEXTAREA',
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'invoice_overdue_reminder',
          name: 'Recordatorio de Factura Vencida',
          trigger: 'SCHEDULED',
          conditions: [
            { field: 'dueDate', operator: '<', value: 'today' },
            { field: 'status', operator: '=', value: 'SENT' },
          ],
          actions: [
            {
              type: 'email',
              template: 'invoice_overdue',
              recipients: ['customer.email'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'stripe',
          name: 'Stripe',
          type: 'STRIPE',
          config: { apiKey: '', webhookSecret: '' },
        },
        {
          id: 'paypal',
          name: 'PayPal',
          type: 'PAYPAL',
          config: { clientId: '', clientSecret: '' },
        },
      ],
    },
    features: [
      {
        id: 'invoice_generation',
        name: 'Generación de Facturas',
        description: 'Creación automática de facturas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'payment_tracking',
        name: 'Seguimiento de Pagos',
        description: 'Control de pagos y cobranza',
        isEnabled: true,
        config: {},
      },
      {
        id: 'recurring_invoices',
        name: 'Facturas Recurrentes',
        description: 'Generación automática de facturas periódicas',
        isEnabled: false,
        config: {},
      },
      {
        id: 'multi_currency',
        name: 'Multi-Moneda',
        description: 'Soporte para múltiples monedas',
        isEnabled: false,
        config: {},
      },
      {
        id: 'tax_management',
        name: 'Gestión de Impuestos',
        description: 'Cálculo automático de impuestos',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      {
        action: 'payment_register',
        roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      },
    ],
    routes: [
      { path: '/invoices', component: 'InvoiceList', permission: 'read' },
      { path: '/invoices/new', component: 'InvoiceForm', permission: 'write' },
      { path: '/invoices/:id', component: 'InvoiceDetail', permission: 'read' },
      {
        path: '/invoices/:id/edit',
        component: 'InvoiceForm',
        permission: 'write',
      },
      {
        path: '/reports/financial',
        component: 'FinancialReports',
        permission: 'read',
      },
      { path: '/payments', component: 'PaymentList', permission: 'read' },
    ],
    components: [
      {
        name: 'InvoiceList',
        path: '@/modules/accounting/components/InvoiceList',
      },
      {
        name: 'InvoiceForm',
        path: '@/modules/accounting/components/InvoiceForm',
      },
      {
        name: 'InvoiceDetail',
        path: '@/modules/accounting/components/InvoiceDetail',
      },
      {
        name: 'FinancialReports',
        path: '@/modules/accounting/components/FinancialReports',
      },
      {
        name: 'PaymentList',
        path: '@/modules/accounting/components/PaymentList',
      },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    displayName: 'Gestión de Ventas',
    description: 'Módulo completo de gestión de ventas y órdenes',
    version: '1.0.0',
    category: 'BUSINESS',
    isCore: false,
    icon: 'ShoppingCart',
    color: '#8B5CF6',
    order: 4,
    config: {
      defaultSettings: {
        enableOrderTracking: true,
        enableShippingIntegration: false,
        enableSalesForecasting: false,
        enableCommissionTracking: false,
      },
      customizableFields: [
        {
          name: 'sales_rep',
          displayName: 'Representante de Ventas',
          type: 'TEXT',
          isRequired: false,
        },
        {
          name: 'sales_channel',
          displayName: 'Canal de Venta',
          type: 'SELECT',
          options: ['Online', 'Tienda Física', 'Teléfono', 'Email', 'Referido'],
          isRequired: false,
        },
        {
          name: 'priority',
          displayName: 'Prioridad',
          type: 'SELECT',
          options: ['Baja', 'Media', 'Alta', 'Urgente'],
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'order_confirmation',
          name: 'Confirmación de Orden',
          trigger: 'CREATE',
          conditions: [],
          actions: [
            {
              type: 'email',
              template: 'order_confirmation',
              recipients: ['customer.email'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'shipping_carrier',
          name: 'Transportista',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
      ],
    },
    features: [
      {
        id: 'order_management',
        name: 'Gestión de Órdenes',
        description: 'Control completo del proceso de ventas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'order_tracking',
        name: 'Seguimiento de Órdenes',
        description: 'Seguimiento del estado de las órdenes',
        isEnabled: true,
        config: {},
      },
      {
        id: 'shipping_integration',
        name: 'Integración de Envíos',
        description: 'Integración con servicios de envío',
        isEnabled: false,
        config: {},
      },
      {
        id: 'sales_forecasting',
        name: 'Pronóstico de Ventas',
        description: 'Predicción de ventas basada en datos históricos',
        isEnabled: false,
        config: {},
      },
      {
        id: 'commission_tracking',
        name: 'Seguimiento de Comisiones',
        description: 'Cálculo y seguimiento de comisiones de ventas',
        isEnabled: false,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'status_change', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    ],
    routes: [
      { path: '/orders', component: 'OrderList', permission: 'read' },
      { path: '/orders/new', component: 'OrderForm', permission: 'write' },
      { path: '/orders/:id', component: 'OrderDetail', permission: 'read' },
      { path: '/orders/:id/edit', component: 'OrderForm', permission: 'write' },
      { path: '/sales/reports', component: 'SalesReports', permission: 'read' },
    ],
    components: [
      { name: 'OrderList', path: '@/modules/sales/components/OrderList' },
      { name: 'OrderForm', path: '@/modules/sales/components/OrderForm' },
      { name: 'OrderDetail', path: '@/modules/sales/components/OrderDetail' },
      { name: 'SalesReports', path: '@/modules/sales/components/SalesReports' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    displayName: 'Análisis y Reportes',
    description: 'Módulo de análisis de datos y generación de reportes',
    version: '1.0.0',
    category: 'ANALYTICS',
    isCore: false,
    icon: 'BarChart3',
    color: '#EF4444',
    order: 5,
    config: {
      defaultSettings: {
        enableRealTimeDashboards: true,
        enableCustomReports: true,
        enableDataExport: true,
        enableScheduledReports: false,
      },
      customizableFields: [
        {
          name: 'report_frequency',
          displayName: 'Frecuencia de Reportes',
          type: 'SELECT',
          options: ['Diario', 'Semanal', 'Mensual', 'Trimestral', 'Anual'],
          isRequired: false,
        },
        {
          name: 'dashboard_layout',
          displayName: 'Diseño del Dashboard',
          type: 'SELECT',
          options: ['Compacto', 'Estándar', 'Extendido'],
          isRequired: false,
        },
      ],
      workflows: [],
      integrations: [
        {
          id: 'google_analytics',
          name: 'Google Analytics',
          type: 'CUSTOM_API',
          config: { trackingId: '', apiKey: '' },
        },
      ],
    },
    features: [
      {
        id: 'real_time_dashboards',
        name: 'Dashboards en Tiempo Real',
        description: 'Visualización de datos en tiempo real',
        isEnabled: true,
        config: {},
      },
      {
        id: 'custom_reports',
        name: 'Reportes Personalizados',
        description: 'Creación de reportes personalizados',
        isEnabled: true,
        config: {},
      },
      {
        id: 'data_export',
        name: 'Exportación de Datos',
        description: 'Exportación de datos en múltiples formatos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'scheduled_reports',
        name: 'Reportes Programados',
        description: 'Envío automático de reportes por email',
        isEnabled: false,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    ],
    routes: [
      {
        path: '/analytics/dashboard',
        component: 'AnalyticsDashboard',
        permission: 'read',
      },
      {
        path: '/analytics/reports',
        component: 'ReportsList',
        permission: 'read',
      },
      {
        path: '/analytics/reports/new',
        component: 'ReportBuilder',
        permission: 'write',
      },
      {
        path: '/analytics/reports/:id',
        component: 'ReportDetail',
        permission: 'read',
      },
    ],
    components: [
      {
        name: 'AnalyticsDashboard',
        path: '@/modules/analytics/components/AnalyticsDashboard',
      },
      {
        name: 'ReportsList',
        path: '@/modules/analytics/components/ReportsList',
      },
      {
        name: 'ReportBuilder',
        path: '@/modules/analytics/components/ReportBuilder',
      },
      {
        name: 'ReportDetail',
        path: '@/modules/analytics/components/ReportDetail',
      },
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    displayName: 'CRM Avanzado',
    description:
      'Módulo avanzado de gestión de relaciones con clientes y leads',
    version: '1.0.0',
    category: 'BUSINESS',
    isCore: false,
    icon: 'UserCheck',
    color: '#8B5CF6',
    order: 6,
    config: {
      defaultSettings: {
        enableLeadScoring: true,
        enableSalesPipeline: true,
        enableCustomerJourney: true,
        enableMarketingAutomation: false,
      },
      customizableFields: [
        {
          name: 'lead_score',
          displayName: 'Puntuación del Lead',
          type: 'NUMBER',
          isRequired: false,
        },
        {
          name: 'sales_stage',
          displayName: 'Etapa de Venta',
          type: 'SELECT',
          options: [
            'Prospecto',
            'Calificado',
            'Propuesta',
            'Negociación',
            'Cerrado',
          ],
          isRequired: false,
        },
        {
          name: 'lead_source',
          displayName: 'Fuente del Lead',
          type: 'SELECT',
          options: [
            'Website',
            'Referido',
            'Redes Sociales',
            'Email Marketing',
            'Evento',
            'Cold Call',
          ],
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'lead_scoring',
          name: 'Puntuación Automática de Leads',
          trigger: 'UPDATE',
          conditions: [{ field: 'email', operator: 'exists', value: true }],
          actions: [
            { type: 'update_field', field: 'lead_score', value: 'calculated' },
          ],
        },
      ],
      integrations: [
        {
          id: 'hubspot',
          name: 'HubSpot',
          type: 'HUBSPOT',
          config: { apiKey: '', portalId: '' },
        },
      ],
    },
    features: [
      {
        id: 'lead_scoring',
        name: 'Puntuación de Leads',
        description: 'Sistema automático de puntuación de leads',
        isEnabled: true,
        config: {},
      },
      {
        id: 'sales_pipeline',
        name: 'Pipeline de Ventas',
        description: 'Gestión visual del pipeline de ventas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'customer_journey',
        name: 'Customer Journey',
        description: 'Mapeo del recorrido del cliente',
        isEnabled: true,
        config: {},
      },
      {
        id: 'marketing_automation',
        name: 'Automatización de Marketing',
        description: 'Campañas automáticas de marketing',
        isEnabled: false,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    ],
    routes: [
      { path: '/crm/leads', component: 'LeadList', permission: 'read' },
      { path: '/crm/pipeline', component: 'SalesPipeline', permission: 'read' },
      {
        path: '/crm/journey',
        component: 'CustomerJourney',
        permission: 'read',
      },
    ],
    components: [
      { name: 'LeadList', path: '@/modules/crm/components/LeadList' },
      { name: 'SalesPipeline', path: '@/modules/crm/components/SalesPipeline' },
      {
        name: 'CustomerJourney',
        path: '@/modules/crm/components/CustomerJourney',
      },
    ],
  },
  {
    id: 'foreign_trade',
    name: 'ForeignTrade',
    displayName: 'Comercio Exterior',
    description:
      'Módulo especializado en gestión de comercio exterior e importaciones',
    version: '1.0.0',
    category: 'BUSINESS',
    isCore: false,
    icon: 'Globe',
    color: '#06B6D4',
    order: 7,
    config: {
      defaultSettings: {
        enableCustomsTracking: true,
        enableDocumentManagement: true,
        enableComplianceMonitoring: true,
        enableCurrencyExchange: false,
      },
      customizableFields: [
        {
          name: 'incoterm',
          displayName: 'Incoterm',
          type: 'SELECT',
          options: [
            'EXW',
            'FCA',
            'CPT',
            'CIP',
            'DAP',
            'DPU',
            'DDP',
            'FAS',
            'FOB',
            'CFR',
            'CIF',
          ],
          isRequired: true,
        },
        {
          name: 'country_origin',
          displayName: 'País de Origen',
          type: 'TEXT',
          isRequired: true,
        },
        {
          name: 'hs_code',
          displayName: 'Código HS',
          type: 'TEXT',
          isRequired: true,
        },
        {
          name: 'customs_value',
          displayName: 'Valor en Aduana',
          type: 'CURRENCY',
          isRequired: true,
        },
      ],
      workflows: [
        {
          id: 'customs_alert',
          name: 'Alerta de Aduana',
          trigger: 'CREATE',
          conditions: [{ field: 'customs_value', operator: '>', value: 10000 }],
          actions: [
            {
              type: 'email',
              template: 'customs_alert',
              recipients: ['customs@company.com'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'customs_api',
          name: 'API de Aduanas',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
      ],
    },
    features: [
      {
        id: 'customs_tracking',
        name: 'Seguimiento Aduanero',
        description: 'Seguimiento de envíos en aduanas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'document_management',
        name: 'Gestión de Documentos',
        description: 'Gestión de documentos de comercio exterior',
        isEnabled: true,
        config: {},
      },
      {
        id: 'compliance_monitoring',
        name: 'Monitoreo de Cumplimiento',
        description: 'Verificación de cumplimiento normativo',
        isEnabled: true,
        config: {},
      },
      {
        id: 'currency_exchange',
        name: 'Cambio de Moneda',
        description: 'Conversión automática de monedas',
        isEnabled: false,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    ],
    routes: [
      {
        path: '/foreign-trade/shipments',
        component: 'ShipmentList',
        permission: 'read',
      },
      {
        path: '/foreign-trade/documents',
        component: 'DocumentList',
        permission: 'read',
      },
      {
        path: '/foreign-trade/compliance',
        component: 'ComplianceDashboard',
        permission: 'read',
      },
    ],
    components: [
      {
        name: 'ShipmentList',
        path: '@/modules/foreign-trade/components/ShipmentList',
      },
      {
        name: 'DocumentList',
        path: '@/modules/foreign-trade/components/DocumentList',
      },
      {
        name: 'ComplianceDashboard',
        path: '@/modules/foreign-trade/components/ComplianceDashboard',
      },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    displayName: 'Recursos Humanos',
    description:
      'Módulo completo de gestión de recursos humanos, nómina y talento',
    version: '1.0.0',
    category: 'BUSINESS',
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
      customizableFields: [
        {
          name: 'employee_id',
          displayName: 'ID de Empleado',
          type: 'TEXT',
          isRequired: true,
        },
        {
          name: 'department',
          displayName: 'Departamento',
          type: 'SELECT',
          options: [
            'Administración',
            'Ventas',
            'Marketing',
            'Desarrollo',
            'Soporte',
            'Finanzas',
            'RRHH',
          ],
          isRequired: true,
        },
        {
          name: 'position',
          displayName: 'Cargo',
          type: 'TEXT',
          isRequired: true,
        },
        {
          name: 'employment_type',
          displayName: 'Tipo de Contrato',
          type: 'SELECT',
          options: [
            'Tiempo Completo',
            'Medio Tiempo',
            'Por Contrato',
            'Temporal',
            'Practicante',
          ],
          isRequired: true,
        },
        {
          name: 'manager_id',
          displayName: 'Jefe Directo',
          type: 'TEXT',
          isRequired: false,
        },
        {
          name: 'emergency_contact',
          displayName: 'Contacto de Emergencia',
          type: 'TEXT',
          isRequired: false,
        },
        {
          name: 'skills',
          displayName: 'Habilidades',
          type: 'MULTISELECT',
          options: [
            'JavaScript',
            'Python',
            'React',
            'Node.js',
            'SQL',
            'Project Management',
            'Design',
            'Marketing',
          ],
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'new_employee_welcome',
          name: 'Bienvenida a Nuevo Empleado',
          trigger: 'CREATE',
          conditions: [],
          actions: [
            {
              type: 'email',
              template: 'welcome_employee',
              recipients: ['employee.email'],
            },
            {
              type: 'email',
              template: 'notify_hr',
              recipients: ['hr@company.com'],
            },
          ],
        },
        {
          id: 'vacation_approval',
          name: 'Aprobación de Vacaciones',
          trigger: 'UPDATE',
          conditions: [{ field: 'status', operator: '=', value: 'APPROVED' }],
          actions: [
            {
              type: 'email',
              template: 'vacation_approved',
              recipients: ['employee.email'],
            },
          ],
        },
        {
          id: 'payroll_reminder',
          name: 'Recordatorio de Nómina',
          trigger: 'SCHEDULED',
          conditions: [],
          actions: [
            {
              type: 'email',
              template: 'payroll_reminder',
              recipients: ['hr@company.com', 'finance@company.com'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'payroll_system',
          name: 'Sistema de Nómina',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
        {
          id: 'time_tracking',
          name: 'Sistema de Tiempo',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
      ],
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
      {
        id: 'performance_reviews',
        name: 'Evaluaciones de Desempeño',
        description: 'Sistema de evaluaciones y reviews',
        isEnabled: true,
        config: {},
      },
      {
        id: 'time_tracking',
        name: 'Control de Tiempo',
        description: 'Registro de horas trabajadas',
        isEnabled: false,
        config: {},
      },
      {
        id: 'attendance_tracking',
        name: 'Control de Asistencia',
        description: 'Registro de asistencia y ausencias',
        isEnabled: false,
        config: {},
      },
      {
        id: 'employee_self_service',
        name: 'Portal del Empleado',
        description: 'Portal para que empleados gestionen su información',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'payroll_manage', roles: ['ADMIN', 'SUPER_ADMIN'] },
      {
        action: 'vacation_approve',
        roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      },
    ],
    routes: [
      { path: '/hr/employees', component: 'EmployeeList', permission: 'read' },
      {
        path: '/hr/employees/new',
        component: 'EmployeeForm',
        permission: 'write',
      },
      {
        path: '/hr/employees/:id',
        component: 'EmployeeDetail',
        permission: 'read',
      },
      {
        path: '/hr/employees/:id/edit',
        component: 'EmployeeForm',
        permission: 'write',
      },
      { path: '/hr/payroll', component: 'PayrollList', permission: 'read' },
      {
        path: '/hr/payroll/new',
        component: 'PayrollForm',
        permission: 'payroll_manage',
      },
      { path: '/hr/vacations', component: 'VacationList', permission: 'read' },
      {
        path: '/hr/vacations/new',
        component: 'VacationForm',
        permission: 'write',
      },
      {
        path: '/hr/performance',
        component: 'PerformanceList',
        permission: 'read',
      },
      { path: '/hr/reports', component: 'HRReports', permission: 'read' },
    ],
    components: [
      { name: 'EmployeeList', path: '@/modules/hr/components/EmployeeList' },
      { name: 'EmployeeForm', path: '@/modules/hr/components/EmployeeForm' },
      {
        name: 'EmployeeDetail',
        path: '@/modules/hr/components/EmployeeDetail',
      },
      { name: 'PayrollList', path: '@/modules/hr/components/PayrollList' },
      { name: 'PayrollForm', path: '@/modules/hr/components/PayrollForm' },
      { name: 'VacationList', path: '@/modules/hr/components/VacationList' },
      { name: 'VacationForm', path: '@/modules/hr/components/VacationForm' },
      {
        name: 'PerformanceList',
        path: '@/modules/hr/components/PerformanceList',
      },
      { name: 'HRReports', path: '@/modules/hr/components/HRReports' },
    ],
  },
  {
    id: 'elevators',
    name: 'Elevators',
    displayName: 'Gestión de Ascensores',
    description:
      'Módulo especializado para gestión de ascensores, mantenimiento e inspecciones',
    version: '1.0.0',
    category: 'BUSINESS',
    isCore: false,
    icon: 'Building2',
    color: '#8B5CF6',
    order: 9,
    config: {
      defaultSettings: {
        enableMaintenanceScheduling: true,
        enableInspectionTracking: true,
        enableDigitalSignatures: true,
        enablePhotoUpload: true,
        enableQRCodeGeneration: true,
        enableGPSLocation: false,
        enableRealTimeNotifications: true,
        enableMaintenanceContracts: true,
        enableSparePartsInventory: true,
        enableWorkOrderManagement: true,
      },
      customizableFields: [
        {
          name: 'elevator_brand',
          displayName: 'Marca del Ascensor',
          type: 'SELECT',
          options: [
            'Otis',
            'Schindler',
            'KONE',
            'ThyssenKrupp',
            'Mitsubishi',
            'Fujitec',
            'Hyundai',
            'Otra',
          ],
          isRequired: true,
        },
        {
          name: 'elevator_capacity',
          displayName: 'Capacidad (kg)',
          type: 'NUMBER',
          isRequired: true,
        },
        {
          name: 'elevator_floors',
          displayName: 'Número de Pisos',
          type: 'NUMBER',
          isRequired: true,
        },
        {
          name: 'elevator_speed',
          displayName: 'Velocidad (m/s)',
          type: 'NUMBER',
          isRequired: true,
        },
        {
          name: 'installation_date',
          displayName: 'Fecha de Instalación',
          type: 'DATE',
          isRequired: false,
        },
        {
          name: 'last_inspection',
          displayName: 'Última Inspección',
          type: 'DATE',
          isRequired: false,
        },
        {
          name: 'next_inspection',
          displayName: 'Próxima Inspección',
          type: 'DATE',
          isRequired: false,
        },
        {
          name: 'building_address',
          displayName: 'Dirección del Edificio',
          type: 'TEXTAREA',
          isRequired: true,
        },
        {
          name: 'client_contact',
          displayName: 'Contacto del Cliente',
          type: 'TEXT',
          isRequired: false,
        },
        {
          name: 'emergency_contact',
          displayName: 'Contacto de Emergencia',
          type: 'TEXT',
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'maintenance_reminder',
          name: 'Recordatorio de Mantenimiento',
          trigger: 'SCHEDULED',
          conditions: [
            { field: 'nextMaintenance', operator: '<=', value: '7 days' },
          ],
          actions: [
            {
              type: 'email',
              template: 'maintenance_reminder',
              recipients: ['technician.email'],
            },
            {
              type: 'notification',
              template: 'maintenance_reminder',
              recipients: ['client.email'],
            },
          ],
        },
        {
          id: 'inspection_due',
          name: 'Inspección Vencida',
          trigger: 'SCHEDULED',
          conditions: [
            { field: 'nextInspection', operator: '<=', value: 'today' },
          ],
          actions: [
            {
              type: 'email',
              template: 'inspection_due',
              recipients: ['inspector.email'],
            },
            {
              type: 'notification',
              template: 'inspection_due',
              recipients: ['admin.email'],
            },
          ],
        },
        {
          id: 'emergency_alert',
          name: 'Alerta de Emergencia',
          trigger: 'UPDATE',
          conditions: [
            { field: 'status', operator: '=', value: 'EMERGENCY_STOP' },
          ],
          actions: [
            {
              type: 'email',
              template: 'emergency_alert',
              recipients: ['emergency@company.com'],
            },
            {
              type: 'sms',
              template: 'emergency_alert',
              recipients: ['+1234567890'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'elevator_monitoring',
          name: 'Sistema de Monitoreo',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
        {
          id: 'qr_code_generator',
          name: 'Generador de Códigos QR',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
      ],
    },
    features: [
      {
        id: 'elevator_management',
        name: 'Gestión de Ascensores',
        description: 'Registro y gestión completa de ascensores',
        isEnabled: true,
        config: {},
      },
      {
        id: 'maintenance_scheduling',
        name: 'Programación de Mantenimientos',
        description: 'Calendario y programación de mantenimientos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'inspection_tracking',
        name: 'Seguimiento de Inspecciones',
        description: 'Control de inspecciones y certificaciones',
        isEnabled: true,
        config: {},
      },
      {
        id: 'digital_signatures',
        name: 'Firmas Digitales',
        description: 'Sistema de firmas digitales para reportes',
        isEnabled: true,
        config: {},
      },
      {
        id: 'photo_upload',
        name: 'Carga de Fotos',
        description: 'Sistema de carga y gestión de fotos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'qr_code_generation',
        name: 'Códigos QR',
        description: 'Generación de códigos QR para ascensores',
        isEnabled: true,
        config: {},
      },
      {
        id: 'gps_location',
        name: 'Ubicación GPS',
        description: 'Seguimiento de ubicación GPS',
        isEnabled: false,
        config: {},
      },
      {
        id: 'real_time_notifications',
        name: 'Notificaciones en Tiempo Real',
        description: 'Sistema de notificaciones en tiempo real',
        isEnabled: true,
        config: {},
      },
      {
        id: 'maintenance_contracts',
        name: 'Contratos de Mantenimiento',
        description: 'Gestión de contratos de mantenimiento',
        isEnabled: true,
        config: {},
      },
      {
        id: 'spare_parts_inventory',
        name: 'Inventario de Repuestos',
        description: 'Control de inventario de repuestos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'work_order_management',
        name: 'Gestión de Órdenes de Trabajo',
        description: 'Sistema de órdenes de trabajo',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'export', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      {
        action: 'maintenance_manage',
        roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      },
      {
        action: 'inspection_manage',
        roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      },
      { action: 'contract_manage', roles: ['ADMIN', 'SUPER_ADMIN'] },
    ],
    routes: [
      {
        path: '/elevators',
        component: 'ElevatorDashboard',
        permission: 'read',
      },
      {
        path: '/elevators/list',
        component: 'ElevatorList',
        permission: 'read',
      },
      {
        path: '/elevators/new',
        component: 'ElevatorForm',
        permission: 'write',
      },
      {
        path: '/elevators/:id',
        component: 'ElevatorDetail',
        permission: 'read',
      },
      {
        path: '/elevators/:id/edit',
        component: 'ElevatorForm',
        permission: 'write',
      },
      {
        path: '/elevators/clients',
        component: 'ClientList',
        permission: 'read',
      },
      {
        path: '/elevators/clients/new',
        component: 'ClientForm',
        permission: 'write',
      },
      {
        path: '/elevators/installations',
        component: 'InstallationList',
        permission: 'read',
      },
      {
        path: '/elevators/maintenance',
        component: 'MaintenanceList',
        permission: 'read',
      },
      {
        path: '/elevators/inspections',
        component: 'InspectionList',
        permission: 'read',
      },
      {
        path: '/elevators/technicians',
        component: 'TechnicianList',
        permission: 'read',
      },
      {
        path: '/elevators/spare-parts',
        component: 'SparePartList',
        permission: 'read',
      },
      {
        path: '/elevators/work-orders',
        component: 'WorkOrderList',
        permission: 'read',
      },
      {
        path: '/elevators/reports',
        component: 'ElevatorReports',
        permission: 'read',
      },
    ],
    components: [
      { name: 'ElevatorDashboard', path: '@/app/dashboard/elevators/page' },
      { name: 'ElevatorList', path: '@/app/dashboard/elevators/list/page' },
      { name: 'ElevatorForm', path: '@/components/elevators/ElevatorForm' },
      { name: 'ElevatorDetail', path: '@/components/elevators/ElevatorDetail' },
      { name: 'ClientList', path: '@/app/dashboard/elevators/clients/page' },
      { name: 'ClientForm', path: '@/components/elevators/ClientForm' },
      {
        name: 'InstallationList',
        path: '@/app/dashboard/elevators/installations/page',
      },
      {
        name: 'MaintenanceList',
        path: '@/app/dashboard/elevators/maintenance/page',
      },
      {
        name: 'InspectionList',
        path: '@/app/dashboard/elevators/inspections/page',
      },
      {
        name: 'TechnicianList',
        path: '@/app/dashboard/elevators/technicians/page',
      },
      {
        name: 'SparePartList',
        path: '@/app/dashboard/elevators/spare-parts/page',
      },
      {
        name: 'WorkOrderList',
        path: '@/app/dashboard/elevators/work-orders/page',
      },
      {
        name: 'ElevatorReports',
        path: '@/app/dashboard/elevators/reports/page',
      },
    ],
  },
  {
    id: 'servers',
    name: 'Servers',
    displayName: 'Gestión de Servidores',
    description: 'Módulo para gestión de infraestructura de servidores y redes',
    version: '1.0.0',
    category: 'INTEGRATION',
    isCore: false,
    icon: 'Server',
    color: '#F59E0B',
    order: 10,
    config: {
      defaultSettings: {
        enableServerMonitoring: true,
        enableNetworkMonitoring: true,
        enableBackupManagement: true,
        enableSecurityScanning: false,
      },
      customizableFields: [
        {
          name: 'server_type',
          displayName: 'Tipo de Servidor',
          type: 'SELECT',
          options: ['Web', 'Database', 'Application', 'File', 'Mail', 'DNS'],
          isRequired: true,
        },
        {
          name: 'operating_system',
          displayName: 'Sistema Operativo',
          type: 'SELECT',
          options: [
            'Windows Server',
            'Linux',
            'Ubuntu',
            'CentOS',
            'Debian',
            'FreeBSD',
          ],
          isRequired: true,
        },
        {
          name: 'ip_address',
          displayName: 'Dirección IP',
          type: 'TEXT',
          isRequired: true,
        },
        {
          name: 'location',
          displayName: 'Ubicación',
          type: 'TEXT',
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'server_down_alert',
          name: 'Alerta de Servidor Caído',
          trigger: 'MONITOR',
          conditions: [{ field: 'status', operator: '=', value: 'down' }],
          actions: [
            {
              type: 'email',
              template: 'server_down',
              recipients: ['admin@company.com'],
            },
            {
              type: 'sms',
              template: 'server_down',
              recipients: ['+1234567890'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'nagios',
          name: 'Nagios',
          type: 'NAGIOS',
          config: { apiEndpoint: '', username: '', password: '' },
        },
        {
          id: 'zabbix',
          name: 'Zabbix',
          type: 'ZABBIX',
          config: { apiEndpoint: '', apiKey: '' },
        },
      ],
    },
    features: [
      {
        id: 'server_monitoring',
        name: 'Monitoreo de Servidores',
        description: 'Monitoreo en tiempo real de servidores',
        isEnabled: true,
        config: {},
      },
      {
        id: 'network_monitoring',
        name: 'Monitoreo de Red',
        description: 'Monitoreo de infraestructura de red',
        isEnabled: true,
        config: {},
      },
      {
        id: 'backup_management',
        name: 'Gestión de Respaldos',
        description: 'Gestión automática de respaldos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'security_scanning',
        name: 'Escaneo de Seguridad',
        description: 'Escaneo automático de vulnerabilidades',
        isEnabled: false,
        config: {},
      },
    ],
    permissions: [
      { action: 'read', roles: ['USER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'write', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
      { action: 'delete', roles: ['ADMIN', 'SUPER_ADMIN'] },
      { action: 'monitor', roles: ['MANAGER', 'ADMIN', 'SUPER_ADMIN'] },
    ],
    routes: [
      { path: '/servers/list', component: 'ServerList', permission: 'read' },
      {
        path: '/servers/monitoring',
        component: 'ServerMonitoring',
        permission: 'monitor',
      },
      {
        path: '/servers/backups',
        component: 'BackupManagement',
        permission: 'read',
      },
    ],
    components: [
      { name: 'ServerList', path: '@/modules/servers/components/ServerList' },
      {
        name: 'ServerMonitoring',
        path: '@/modules/servers/components/ServerMonitoring',
      },
      {
        name: 'BackupManagement',
        path: '@/modules/servers/components/BackupManagement',
      },
    ],
  },
  {
    id: 'schools',
    name: 'Schools',
    displayName: 'Gestión de Colegios',
    description:
      'Módulo completo para gestión integral de colegios, estudiantes, docentes, académico y finanzas',
    version: '1.0.0',
    category: 'BUSINESS',
    isCore: false,
    icon: 'GraduationCap',
    color: '#10B981',
    order: 10,
    config: {
      defaultSettings: {
        enableStudentManagement: true,
        enableTeacherManagement: true,
        enableAcademicManagement: true,
        enableAttendanceTracking: true,
        enablePaymentManagement: true,
        enableLibraryManagement: true,
        enableTransportManagement: true,
        enableCafeteriaManagement: true,
        enableDisciplinaryTracking: true,
        enableParentPortal: true,
        enableGradeBook: true,
        enableReportCards: true,
        enableNotifications: true,
        enableMultiLanguage: false,
        enableCustomFields: true,
      },
      customizableFields: [
        {
          name: 'student_code_format',
          displayName: 'Formato de Código de Estudiante',
          type: 'SELECT',
          options: ['AAA-###', 'YYYY-AAA-###', 'GRADE-###', 'CUSTOM'],
          isRequired: true,
        },
        {
          name: 'academic_year_start',
          displayName: 'Inicio del Año Académico',
          type: 'DATE',
          isRequired: true,
        },
        {
          name: 'academic_year_end',
          displayName: 'Fin del Año Académico',
          type: 'DATE',
          isRequired: true,
        },
        {
          name: 'max_students_per_section',
          displayName: 'Máximo de Estudiantes por Sección',
          type: 'NUMBER',
          isRequired: true,
        },
        {
          name: 'attendance_threshold',
          displayName: 'Umbral de Asistencia (%)',
          type: 'NUMBER',
          isRequired: true,
        },
        {
          name: 'payment_due_day',
          displayName: 'Día de Vencimiento de Pagos',
          type: 'NUMBER',
          isRequired: true,
        },
        {
          name: 'library_loan_days',
          displayName: 'Días de Préstamo de Biblioteca',
          type: 'NUMBER',
          isRequired: true,
        },
        {
          name: 'transport_routes',
          displayName: 'Rutas de Transporte',
          type: 'TEXTAREA',
          isRequired: false,
        },
        {
          name: 'cafeteria_menus',
          displayName: 'Menús de Comedor',
          type: 'TEXTAREA',
          isRequired: false,
        },
        {
          name: 'disciplinary_levels',
          displayName: 'Niveles Disciplinarios',
          type: 'TEXTAREA',
          isRequired: false,
        },
      ],
      workflows: [
        {
          id: 'attendance_alert',
          name: 'Alerta de Asistencia',
          trigger: 'SCHEDULED',
          conditions: [
            { field: 'attendanceRate', operator: '<', value: '80' },
          ],
          actions: [
            {
              type: 'email',
              template: 'attendance_alert',
              recipients: ['parent.email'],
            },
            {
              type: 'notification',
              template: 'attendance_alert',
              recipients: ['teacher.email'],
            },
          ],
        },
        {
          id: 'payment_reminder',
          name: 'Recordatorio de Pago',
          trigger: 'SCHEDULED',
          conditions: [
            { field: 'paymentDueDate', operator: '<=', value: '7 days' },
          ],
          actions: [
            {
              type: 'email',
              template: 'payment_reminder',
              recipients: ['parent.email'],
            },
            {
              type: 'sms',
              template: 'payment_reminder',
              recipients: ['parent.phone'],
            },
          ],
        },
        {
          id: 'library_overdue',
          name: 'Libro Vencido',
          trigger: 'SCHEDULED',
          conditions: [
            { field: 'returnDate', operator: '<', value: 'today' },
          ],
          actions: [
            {
              type: 'email',
              template: 'library_overdue',
              recipients: ['student.email'],
            },
            {
              type: 'notification',
              template: 'library_overdue',
              recipients: ['librarian.email'],
            },
          ],
        },
        {
          id: 'disciplinary_escalation',
          name: 'Escalación Disciplinaria',
          trigger: 'UPDATE',
          conditions: [
            { field: 'disciplinaryCount', operator: '>=', value: '3' },
          ],
          actions: [
            {
              type: 'email',
              template: 'disciplinary_escalation',
              recipients: ['principal.email'],
            },
            {
              type: 'notification',
              template: 'disciplinary_escalation',
              recipients: ['parent.email'],
            },
          ],
        },
      ],
      integrations: [
        {
          id: 'parent_portal',
          name: 'Portal de Padres',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
        {
          id: 'grade_book',
          name: 'Libro de Calificaciones',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
        {
          id: 'attendance_system',
          name: 'Sistema de Asistencia',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
        {
          id: 'payment_gateway',
          name: 'Pasarela de Pagos',
          type: 'CUSTOM_API',
          config: { apiEndpoint: '', apiKey: '' },
        },
      ],
    },
    features: [
      {
        id: 'student_management',
        name: 'Gestión de Estudiantes',
        description: 'Registro y gestión completa de estudiantes',
        isEnabled: true,
        config: {},
      },
      {
        id: 'teacher_management',
        name: 'Gestión de Docentes',
        description: 'Administración de docentes y personal académico',
        isEnabled: true,
        config: {},
      },
      {
        id: 'academic_management',
        name: 'Gestión Académica',
        description: 'Grados, secciones, materias, horarios y matrículas',
        isEnabled: true,
        config: {},
      },
      {
        id: 'attendance_tracking',
        name: 'Control de Asistencia',
        description: 'Registro y seguimiento de asistencia estudiantil',
        isEnabled: true,
        config: {},
      },
      {
        id: 'payment_management',
        name: 'Gestión de Pagos',
        description: 'Control de pagos de matrícula, pensión y servicios',
        isEnabled: true,
        config: {},
      },
      {
        id: 'library_management',
        name: 'Gestión de Biblioteca',
        description: 'Catálogo de libros y sistema de préstamos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'transport_management',
        name: 'Gestión de Transporte',
        description: 'Rutas de transporte y asignación de estudiantes',
        isEnabled: true,
        config: {},
      },
      {
        id: 'cafeteria_management',
        name: 'Gestión de Comedor',
        description: 'Menús y planes alimentarios',
        isEnabled: true,
        config: {},
      },
      {
        id: 'disciplinary_tracking',
        name: 'Seguimiento Disciplinario',
        description: 'Registro de incidentes y seguimiento disciplinario',
        isEnabled: true,
        config: {},
      },
      {
        id: 'parent_portal',
        name: 'Portal de Padres',
        description: 'Acceso para padres a información de sus hijos',
        isEnabled: true,
        config: {},
      },
      {
        id: 'grade_book',
        name: 'Libro de Calificaciones',
        description: 'Registro y seguimiento de calificaciones',
        isEnabled: true,
        config: {},
      },
      {
        id: 'reports_analytics',
        name: 'Reportes y Analytics',
        description: 'Reportes académicos, financieros y estadísticas',
        isEnabled: true,
        config: {},
      },
    ],
    permissions: [
      {
        action: 'read',
        roles: ['admin', 'teacher', 'staff', 'parent'],
      },
      {
        action: 'create',
        roles: ['admin', 'teacher', 'staff'],
      },
      {
        action: 'update',
        roles: ['admin', 'teacher', 'staff'],
      },
      {
        action: 'delete',
        roles: ['admin'],
      },
      {
        action: 'manage_grades',
        roles: ['admin', 'teacher'],
      },
      {
        action: 'manage_attendance',
        roles: ['admin', 'teacher', 'staff'],
      },
      {
        action: 'manage_payments',
        roles: ['admin', 'staff'],
      },
      {
        action: 'view_reports',
        roles: ['admin', 'teacher', 'staff'],
      },
    ],
    routes: [
      {
        name: 'Dashboard',
        path: '/schools',
        component: 'SchoolDashboard',
        permission: 'read',
      },
      {
        name: 'Estudiantes',
        path: '/schools/students',
        component: 'StudentList',
        permission: 'read',
      },
      {
        name: 'Nuevo Estudiante',
        path: '/schools/students/new',
        component: 'StudentForm',
        permission: 'create',
      },
      {
        name: 'Detalle Estudiante',
        path: '/schools/students/:id',
        component: 'StudentDetail',
        permission: 'read',
      },
      {
        name: 'Editar Estudiante',
        path: '/schools/students/:id/edit',
        component: 'StudentForm',
        permission: 'update',
      },
      {
        name: 'Docentes',
        path: '/schools/teachers',
        component: 'TeacherList',
        permission: 'read',
      },
      {
        name: 'Nuevo Docente',
        path: '/schools/teachers/new',
        component: 'TeacherForm',
        permission: 'create',
      },
      {
        name: 'Detalle Docente',
        path: '/schools/teachers/:id',
        component: 'TeacherDetail',
        permission: 'read',
      },
      {
        name: 'Editar Docente',
        path: '/schools/teachers/:id/edit',
        component: 'TeacherForm',
        permission: 'update',
      },
      {
        name: 'Gestión Académica',
        path: '/schools/academic',
        component: 'AcademicManagement',
        permission: 'read',
      },
      {
        name: 'Asistencia',
        path: '/schools/attendance',
        component: 'AttendanceManagement',
        permission: 'manage_attendance',
      },
      {
        name: 'Pagos',
        path: '/schools/payments',
        component: 'PaymentManagement',
        permission: 'manage_payments',
      },
      {
        name: 'Biblioteca',
        path: '/schools/library',
        component: 'LibraryManagement',
        permission: 'read',
      },
      {
        name: 'Transporte',
        path: '/schools/transport',
        component: 'TransportManagement',
        permission: 'read',
      },
      {
        name: 'Comedor',
        path: '/schools/cafeteria',
        component: 'CafeteriaManagement',
        permission: 'read',
      },
      {
        name: 'Disciplina',
        path: '/schools/discipline',
        component: 'DisciplinaryManagement',
        permission: 'read',
      },
      {
        name: 'Reportes',
        path: '/schools/reports',
        component: 'SchoolReports',
        permission: 'view_reports',
      },
    ],
    components: [
      { name: 'SchoolDashboard', path: '@/app/dashboard/schools/page' },
      { name: 'StudentList', path: '@/app/dashboard/schools/students/page' },
      { name: 'StudentForm', path: '@/components/schools/StudentForm' },
      { name: 'StudentDetail', path: '@/components/schools/StudentDetail' },
      { name: 'TeacherList', path: '@/app/dashboard/schools/teachers/page' },
      { name: 'TeacherForm', path: '@/components/schools/TeacherForm' },
      { name: 'TeacherDetail', path: '@/components/schools/TeacherDetail' },
      { name: 'AcademicManagement', path: '@/app/dashboard/schools/academic/page' },
      { name: 'AttendanceManagement', path: '@/app/dashboard/schools/attendance/page' },
      { name: 'PaymentManagement', path: '@/app/dashboard/schools/payments/page' },
      { name: 'LibraryManagement', path: '@/app/dashboard/schools/library/page' },
      { name: 'TransportManagement', path: '@/app/dashboard/schools/transport/page' },
      { name: 'CafeteriaManagement', path: '@/app/dashboard/schools/cafeteria/page' },
      { name: 'DisciplinaryManagement', path: '@/app/dashboard/schools/discipline/page' },
      { name: 'SchoolReports', path: '@/app/dashboard/schools/reports/page' },
    ],
  },
]

// ========================================
// UTILIDADES DEL REGISTRO DE MÓDULOS
// ========================================

export class ModuleRegistry {
  /**
   * Obtener todos los módulos disponibles
   */
  static getAllModules(): ModuleDefinition[] {
    return AVAILABLE_MODULES.sort((a, b) => a.order - b.order)
  }

  /**
   * Obtener módulo por ID
   */
  static getModuleById(id: string): ModuleDefinition | undefined {
    return AVAILABLE_MODULES.find(module => module.id === id)
  }

  /**
   * Obtener módulos por categoría
   */
  static getModulesByCategory(category: string): ModuleDefinition[] {
    return AVAILABLE_MODULES.filter(module => module.category === category)
  }

  /**
   * Obtener módulos core
   */
  static getCoreModules(): ModuleDefinition[] {
    return AVAILABLE_MODULES.filter(module => module.isCore)
  }

  /**
   * Obtener módulos opcionales
   */
  static getOptionalModules(): ModuleDefinition[] {
    return AVAILABLE_MODULES.filter(module => !module.isCore)
  }

  /**
   * Verificar si un módulo existe
   */
  static moduleExists(id: string): boolean {
    return AVAILABLE_MODULES.some(module => module.id === id)
  }

  /**
   * Obtener rutas de un módulo
   */
  static getModuleRoutes(moduleId: string): ModuleRoute[] {
    const module = this.getModuleById(moduleId)
    return module?.routes || []
  }

  /**
   * Obtener permisos de un módulo
   */
  static getModulePermissions(moduleId: string): ModulePermission[] {
    const module = this.getModuleById(moduleId)
    return module?.permissions || []
  }

  /**
   * Verificar si un rol tiene permiso en un módulo
   */
  static hasPermission(
    moduleId: string,
    action: string,
    role: string
  ): boolean {
    const permissions = this.getModulePermissions(moduleId)
    const permission = permissions.find(p => p.action === action)
    return permission?.roles.includes(role) || false
  }

  /**
   * Obtener configuración por defecto de un módulo
   */
  static getModuleDefaultConfig(moduleId: string): Record<string, any> {
    const module = this.getModuleById(moduleId)
    return module?.config.defaultSettings || {}
  }

  /**
   * Obtener campos personalizables de un módulo
   */
  static getModuleCustomFields(moduleId: string): CustomField[] {
    const module = this.getModuleById(moduleId)
    return module?.config.customizableFields || []
  }
}
