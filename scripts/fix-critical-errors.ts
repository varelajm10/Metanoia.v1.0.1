import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()

async function fixCriticalErrors() {
  try {
    console.log('🔧 Solucionando errores críticos...')

    // 1. Verificar si el campo 'key' existe en el modelo Module
    console.log('\n📋 Verificando modelo Module...')

    // Leer el esquema actual
    const schemaPath = 'prisma/schema.prisma'
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('✅ Esquema leído correctamente')

    // Verificar si existe el campo 'key' en Module
    const moduleModelMatch = schema.match(/model Module \{([\s\S]*?)\n\}/)
    if (moduleModelMatch) {
      const moduleModel = moduleModelMatch[1]
      if (moduleModel.includes('key')) {
        console.log('✅ Campo "key" existe en Module')
      } else {
        console.log('❌ Campo "key" NO existe en Module')
        console.log('🔧 Necesitamos agregar el campo "key" al modelo Module')
      }
    }

    // 2. Verificar campos faltantes en otros modelos críticos
    console.log('\n📋 Verificando otros modelos críticos...')

    // Verificar Server model
    const serverModelMatch = schema.match(/model Server \{([\s\S]*?)\n\}/)
    if (serverModelMatch) {
      const serverModel = serverModelMatch[1]
      const requiredFields = [
        'country',
        'region',
        'city',
        'timezone',
        'currency',
      ]

      for (const field of requiredFields) {
        if (serverModel.includes(field)) {
          console.log(`✅ Campo "${field}" existe en Server`)
        } else {
          console.log(`❌ Campo "${field}" NO existe en Server`)
        }
      }
    }

    // 3. Verificar si hay problemas con enums
    console.log('\n📋 Verificando enums...')

    const enumMatches = schema.match(/enum \w+ \{([\s\S]*?)\n\}/g)
    if (enumMatches) {
      console.log(`✅ Encontrados ${enumMatches.length} enums`)

      // Verificar enums específicos que están causando problemas
      const problemEnums = [
        'ServerMetricType',
        'ServerAlertType',
        'ServerAlertSeverity',
        'NotificationChannel',
        'NotificationType',
        'MaintenanceType',
        'MaintenanceStatus',
      ]

      for (const enumName of problemEnums) {
        const enumMatch = schema.match(
          new RegExp(`enum ${enumName} \\{([\\s\\S]*?)\\n\\}`)
        )
        if (enumMatch) {
          console.log(`✅ Enum "${enumName}" existe`)
        } else {
          console.log(`❌ Enum "${enumName}" NO existe`)
        }
      }
    }

    // 4. Verificar relaciones faltantes
    console.log('\n📋 Verificando relaciones...')

    // Verificar si User tiene relación con Session
    const userModelMatch = schema.match(/model User \{([\s\S]*?)\n\}/)
    if (userModelMatch) {
      const userModel = userModelMatch[1]
      if (userModel.includes('sessions Session[]')) {
        console.log('✅ Relación sessions existe en User')
      } else {
        console.log('❌ Relación sessions NO existe en User')
      }
    }

    console.log('\n🎯 Resumen de problemas encontrados:')
    console.log('1. Campo "key" faltante en modelo Module')
    console.log('2. Campos geográficos faltantes en modelo Server')
    console.log('3. Enums faltantes para servidores y notificaciones')
    console.log('4. Relaciones faltantes en algunos modelos')

    console.log('\n💡 Recomendaciones:')
    console.log('1. Ejecutar migración de base de datos')
    console.log('2. Actualizar esquemas de validación')
    console.log('3. Corregir imports en componentes')
    console.log('4. Regenerar cliente de Prisma')
  } catch (error) {
    console.error('❌ Error en análisis:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar el script
fixCriticalErrors()
  .then(() => {
    console.log('\n✅ Análisis completado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error en el análisis:', error)
    process.exit(1)
  })
