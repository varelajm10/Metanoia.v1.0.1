#!/usr/bin/env tsx

/**
 * Script para aplicar índices de performance a la base de datos
 * Ejecutar: npm run apply-indexes
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function applyPerformanceIndexes() {
  console.log('🚀 Aplicando índices de performance...')
  
  try {
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../prisma/migrations/20241220000000_add_performance_indexes/migration.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Dividir en statements individuales
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📊 Ejecutando ${statements.length} statements de índices...`)
    
    // Ejecutar cada statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`⏳ Ejecutando statement ${i + 1}/${statements.length}...`)
          await prisma.$executeRawUnsafe(statement)
          console.log(`✅ Statement ${i + 1} ejecutado exitosamente`)
        } catch (error) {
          console.warn(`⚠️  Error en statement ${i + 1}:`, error)
          // Continuar con el siguiente statement
        }
      }
    }
    
    console.log('🎉 Índices de performance aplicados exitosamente!')
    
    // Verificar índices creados
    const indexes = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `
    
    console.log('📋 Índices creados:')
    console.table(indexes)
    
  } catch (error) {
    console.error('❌ Error aplicando índices:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  applyPerformanceIndexes()
    .then(() => {
      console.log('✅ Script completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error en script:', error)
      process.exit(1)
    })
}

export { applyPerformanceIndexes }

