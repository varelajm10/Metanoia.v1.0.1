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
        description:
          'Módulo completo para gestión integral de colegios, estudiantes, docentes, académico y finanzas',
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
        },
        features: [
          {
            id: 'student_management',
            name: 'Gestión de Estudiantes',
            description: 'Registro y gestión completa de estudiantes',
            isEnabled: true,
          },
          {
            id: 'teacher_management',
            name: 'Gestión de Docentes',
            description: 'Administración de docentes y personal académico',
            isEnabled: true,
          },
          {
            id: 'academic_management',
            name: 'Gestión Académica',
            description: 'Grados, secciones, materias, horarios y matrículas',
            isEnabled: true,
          },
          {
            id: 'attendance_tracking',
            name: 'Control de Asistencia',
            description: 'Registro y seguimiento de asistencia estudiantil',
            isEnabled: true,
          },
          {
            id: 'payment_management',
            name: 'Gestión de Pagos',
            description: 'Control de pagos de matrícula, pensión y servicios',
            isEnabled: true,
          },
          {
            id: 'library_management',
            name: 'Gestión de Biblioteca',
            description: 'Catálogo de libros y sistema de préstamos',
            isEnabled: true,
          },
          {
            id: 'transport_management',
            name: 'Gestión de Transporte',
            description: 'Rutas de transporte y asignación de estudiantes',
            isEnabled: true,
          },
          {
            id: 'cafeteria_management',
            name: 'Gestión de Comedor',
            description: 'Menús y planes alimentarios',
            isEnabled: true,
          },
          {
            id: 'disciplinary_tracking',
            name: 'Seguimiento Disciplinario',
            description: 'Registro de incidentes y seguimiento disciplinario',
            isEnabled: true,
          },
          {
            id: 'parent_portal',
            name: 'Portal de Padres',
            description: 'Acceso para padres a información de sus hijos',
            isEnabled: true,
          },
          {
            id: 'grade_book',
            name: 'Libro de Calificaciones',
            description: 'Registro y seguimiento de calificaciones',
            isEnabled: true,
          },
          {
            id: 'reports_analytics',
            name: 'Reportes y Analytics',
            description: 'Reportes académicos, financieros y estadísticas',
            isEnabled: true,
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
      },
      create: {
        key: 'schools',
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
        },
        features: [
          {
            id: 'student_management',
            name: 'Gestión de Estudiantes',
            description: 'Registro y gestión completa de estudiantes',
            isEnabled: true,
          },
          {
            id: 'teacher_management',
            name: 'Gestión de Docentes',
            description: 'Administración de docentes y personal académico',
            isEnabled: true,
          },
          {
            id: 'academic_management',
            name: 'Gestión Académica',
            description: 'Grados, secciones, materias, horarios y matrículas',
            isEnabled: true,
          },
          {
            id: 'attendance_tracking',
            name: 'Control de Asistencia',
            description: 'Registro y seguimiento de asistencia estudiantil',
            isEnabled: true,
          },
          {
            id: 'payment_management',
            name: 'Gestión de Pagos',
            description: 'Control de pagos de matrícula, pensión y servicios',
            isEnabled: true,
          },
          {
            id: 'library_management',
            name: 'Gestión de Biblioteca',
            description: 'Catálogo de libros y sistema de préstamos',
            isEnabled: true,
          },
          {
            id: 'transport_management',
            name: 'Gestión de Transporte',
            description: 'Rutas de transporte y asignación de estudiantes',
            isEnabled: true,
          },
          {
            id: 'cafeteria_management',
            name: 'Gestión de Comedor',
            description: 'Menús y planes alimentarios',
            isEnabled: true,
          },
          {
            id: 'disciplinary_tracking',
            name: 'Seguimiento Disciplinario',
            description: 'Registro de incidentes y seguimiento disciplinario',
            isEnabled: true,
          },
          {
            id: 'parent_portal',
            name: 'Portal de Padres',
            description: 'Acceso para padres a información de sus hijos',
            isEnabled: true,
          },
          {
            id: 'grade_book',
            name: 'Libro de Calificaciones',
            description: 'Registro y seguimiento de calificaciones',
            isEnabled: true,
          },
          {
            id: 'reports_analytics',
            name: 'Reportes y Analytics',
            description: 'Reportes académicos, financieros y estadísticas',
            isEnabled: true,
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
          moduleId: module.id,
        },
      })

      if (!existingTenantModule) {
        await prisma.tenantModule.create({
          data: {
            tenantId: tenant.id,
            moduleId: module.id,
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
    console.log(`   - Funcionalidades: ${module.features?.length || 0}`)
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
  .catch(error => {
    console.error('❌ Error ejecutando script:', error)
    process.exit(1)
  })
