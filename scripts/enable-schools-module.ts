import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enableSchoolsModule() {
  try {
    console.log('🎓 Habilitando módulo de Colegios...')

    // 1. Crear o actualizar el módulo en la base de datos
    const module = await prisma.module.upsert({
      where: { key: 'schools' },
      update: {
        key: 'schools',
        name: 'Schools',
        displayName: 'Gestión de Colegios',
        description: 'Módulo completo para gestión integral de colegios, estudiantes, docentes, académico y finanzas',
        version: '1.0.0',
        category: 'BUSINESS',
        isCore: false,
        icon: 'GraduationCap',
        color: '#10B981',
        order: 10,
        isActive: true,
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
      create: {
        key: 'schools',
        name: 'Schools',
        displayName: 'Gestión de Colegios',
        description: 'Módulo completo para gestión integral de colegios, estudiantes, docentes, académico y finanzas',
        version: '1.0.0',
        category: 'BUSINESS',
        isCore: false,
        icon: 'GraduationCap',
        color: '#10B981',
        order: 10,
        isActive: true,
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
    })

    console.log('✅ Módulo de Colegios creado/actualizado:', module.id)

    // 2. Habilitar el módulo para todos los tenants existentes
    const tenants = await prisma.tenant.findMany()
    console.log(`📋 Encontrados ${tenants.length} tenants`)

    for (const tenant of tenants) {
      // Verificar si el módulo ya está habilitado para este tenant
      const existingTenantModule = await prisma.tenantModule.findFirst({
        where: {
          tenantId: tenant.id,
          moduleId: 'schools',
        },
      })

      if (!existingTenantModule) {
        await prisma.tenantModule.create({
          data: {
            tenantId: tenant.id,
            moduleId: 'schools',
            isEnabled: true,
            config: {
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
            enabledAt: new Date(),
            enabledBy: 'system',
          },
        })
        console.log(`✅ Módulo habilitado para tenant: ${tenant.name}`)
      } else {
        console.log(`ℹ️ Módulo ya habilitado para tenant: ${tenant.name}`)
      }
    }

    console.log('🎉 ¡Módulo de Colegios habilitado exitosamente!')
    console.log('📊 Resumen:')
    console.log(`   - Módulo: ${module.displayName}`)
    console.log(`   - Versión: ${module.version}`)
    console.log(`   - Categoría: ${module.category}`)
    console.log(`   - Tenants habilitados: ${tenants.length}`)
    console.log(`   - Funcionalidades: ${module.features.length}`)
    console.log(`   - Rutas: ${module.routes.length}`)
    console.log(`   - Componentes: ${module.components.length}`)

  } catch (error) {
    console.error('❌ Error habilitando módulo de Colegios:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
enableSchoolsModule()
  .then(() => {
    console.log('✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error ejecutando script:', error)
    process.exit(1)
  })
