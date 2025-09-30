#!/usr/bin/env ts-node

/**
 * Script para analizar y aplicar índices compuestos en el schema de Prisma
 * Optimiza las búsquedas multi-tenant más comunes
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

interface ModelInfo {
  name: string
  hasTenantId: boolean
  hasCreatedAt: boolean
  hasUpdatedAt: boolean
  hasStatus?: boolean
  hasType?: boolean
  hasUserId?: boolean
  hasCustomerId?: boolean
  hasProductId?: boolean
  hasOrderId?: boolean
  hasInvoiceId?: boolean
  hasSupplierId?: boolean
  hasEmployeeId?: boolean
  hasServerId?: boolean
  hasElevatorId?: boolean
  hasStudentId?: boolean
  hasTeacherId?: boolean
  hasParentId?: boolean
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const schemaPath = join(__dirname, '..', 'prisma', 'schema.prisma')

function analyzeSchema(): ModelInfo[] {
  const schema = readFileSync(schemaPath, 'utf-8')
  const models: ModelInfo[] = []

  const modelRegex = /^model\s+(\w+)\s*\{/gm
  let match

  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1]
    const modelStart = match.index
    const nextModelMatch = modelRegex.exec(schema)
    const modelEnd = nextModelMatch ? nextModelMatch.index : schema.length
    modelRegex.lastIndex = modelStart // Reset for next iteration

    const modelContent = schema.substring(modelStart, modelEnd)

    const modelInfo: ModelInfo = {
      name: modelName,
      hasTenantId: /tenantId\s+String/.test(modelContent),
      hasCreatedAt: /createdAt\s+DateTime/.test(modelContent),
      hasUpdatedAt: /updatedAt\s+DateTime/.test(modelContent),
      hasStatus: /status\s+\w+Status/.test(modelContent),
      hasType: /type\s+\w+Type/.test(modelContent),
      hasUserId: /userId\s+String/.test(modelContent),
      hasCustomerId: /customerId\s+String/.test(modelContent),
      hasProductId: /productId\s+String/.test(modelContent),
      hasOrderId: /orderId\s+String/.test(modelContent),
      hasInvoiceId: /invoiceId\s+String/.test(modelContent),
      hasSupplierId: /supplierId\s+String/.test(modelContent),
      hasEmployeeId: /employeeId\s+String/.test(modelContent),
      hasServerId: /serverId\s+String/.test(modelContent),
      hasElevatorId: /elevatorId\s+String/.test(modelContent),
      hasStudentId: /studentId\s+String/.test(modelContent),
      hasTeacherId: /teacherId\s+String/.test(modelContent),
      hasParentId: /parentId\s+String/.test(modelContent),
    }

    models.push(modelInfo)
  }

  return models
}

function generateIndexes(models: ModelInfo[]): string[] {
  const indexes: string[] = []

  models.forEach(model => {
    if (!model.hasTenantId) return

    const modelName = model.name
    const modelIndexes: string[] = []

    // Índice básico para tenantId + createdAt (más común)
    if (model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, createdAt])`)
    }

    // Índices específicos según el tipo de modelo
    if (
      modelName.includes('Order') ||
      modelName.includes('Invoice') ||
      modelName.includes('Sale')
    ) {
      if (model.hasStatus) {
        modelIndexes.push(`@@index([tenantId, status, createdAt])`)
      }
      if (model.hasCustomerId) {
        modelIndexes.push(`@@index([tenantId, customerId, createdAt])`)
      }
    }

    if (modelName.includes('Product') || modelName.includes('Inventory')) {
      if (model.hasType) {
        modelIndexes.push(`@@index([tenantId, type, createdAt])`)
      }
    }

    if (modelName.includes('User') || modelName.includes('Employee')) {
      if (model.hasStatus) {
        modelIndexes.push(`@@index([tenantId, status, createdAt])`)
      }
    }

    if (modelName.includes('Server') || modelName.includes('Elevator')) {
      if (model.hasStatus) {
        modelIndexes.push(`@@index([tenantId, status, createdAt])`)
      }
      if (model.hasType) {
        modelIndexes.push(`@@index([tenantId, type, createdAt])`)
      }
    }

    if (modelName.includes('School')) {
      if (model.hasStudentId) {
        modelIndexes.push(`@@index([tenantId, studentId, createdAt])`)
      }
      if (model.hasTeacherId) {
        modelIndexes.push(`@@index([tenantId, teacherId, createdAt])`)
      }
      if (model.hasParentId) {
        modelIndexes.push(`@@index([tenantId, parentId, createdAt])`)
      }
    }

    // Índices para relaciones específicas
    if (model.hasUserId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, userId, createdAt])`)
    }

    if (model.hasCustomerId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, customerId, createdAt])`)
    }

    if (model.hasProductId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, productId, createdAt])`)
    }

    if (model.hasOrderId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, orderId, createdAt])`)
    }

    if (model.hasInvoiceId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, invoiceId, createdAt])`)
    }

    if (model.hasSupplierId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, supplierId, createdAt])`)
    }

    if (model.hasEmployeeId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, employeeId, createdAt])`)
    }

    if (model.hasServerId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, serverId, createdAt])`)
    }

    if (model.hasElevatorId && model.hasCreatedAt) {
      modelIndexes.push(`@@index([tenantId, elevatorId, createdAt])`)
    }

    // Eliminar duplicados
    const uniqueIndexes = [...new Set(modelIndexes)]

    if (uniqueIndexes.length > 0) {
      indexes.push(`// ${modelName} indexes:`)
      uniqueIndexes.forEach(index => {
        indexes.push(`  ${index}`)
      })
      indexes.push('')
    }
  })

  return indexes
}

function main() {
  console.log('🔍 Analizando schema de Prisma...')

  const models = analyzeSchema()
  const tenantModels = models.filter(m => m.hasTenantId)

  console.log(`📊 Encontrados ${models.length} modelos totales`)
  console.log(`🏢 Encontrados ${tenantModels.length} modelos con tenantId`)

  console.log('\n📋 Modelos con tenantId:')
  tenantModels.forEach(model => {
    console.log(
      `  - ${model.name} (createdAt: ${model.hasCreatedAt ? '✅' : '❌'})`
    )
  })

  console.log('\n🔧 Generando índices compuestos...')
  const indexes = generateIndexes(tenantModels)

  console.log('\n📝 Índices recomendados:')
  console.log(indexes.join('\n'))

  console.log('\n✅ Análisis completado')
}

// Ejecutar si es el módulo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { analyzeSchema, generateIndexes }
