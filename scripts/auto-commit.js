#!/usr/bin/env node

/**
 * 🤖 Script de Commit Automático - Metanoia V1.0.2
 *
 * Este script hace commit automático cada 30 minutos
 * para mantener el código respaldado constantemente.
 *
 * Uso: node scripts/auto-commit.js
 *
 * Características:
 * - Commit automático cada 30 minutos
 * - Mensajes descriptivos con timestamp
 * - Solo commitea si hay cambios
 * - Logs detallados de actividad
 * - Manejo de errores
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configuración
const CONFIG = {
  INTERVAL_MINUTES: 30,
  COMMIT_PREFIX: '🤖 Auto-commit',
  LOG_FILE: 'scripts/auto-commit.log',
  MAX_LOG_SIZE: 1024 * 1024, // 1MB
}

class AutoCommit {
  constructor() {
    this.isRunning = false
    this.intervalId = null
    this.startTime = new Date()
    this.commitCount = 0
    this.errorCount = 0
  }

  /**
   * Log con timestamp
   */
  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${level}] ${message}`

    console.log(logMessage)

    // Escribir a archivo de log
    try {
      fs.appendFileSync(CONFIG.LOG_FILE, logMessage + '\n')
    } catch (error) {
      console.error('Error writing to log file:', error.message)
    }
  }

  /**
   * Verificar si hay cambios pendientes
   */
  hasChanges() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      return status.trim().length > 0
    } catch (error) {
      this.log(`Error checking git status: ${error.message}`, 'ERROR')
      return false
    }
  }

  /**
   * Obtener estadísticas de cambios
   */
  getChangeStats() {
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      const lines = status
        .trim()
        .split('\n')
        .filter(line => line.length > 0)

      const stats = {
        total: lines.length,
        added: lines.filter(line => line.startsWith('A')).length,
        modified: lines.filter(line => line.startsWith('M')).length,
        deleted: lines.filter(line => line.startsWith('D')).length,
        untracked: lines.filter(line => line.startsWith('??')).length,
      }

      return stats
    } catch (error) {
      this.log(`Error getting change stats: ${error.message}`, 'ERROR')
      return { total: 0, added: 0, modified: 0, deleted: 0, untracked: 0 }
    }
  }

  /**
   * Generar mensaje de commit descriptivo
   */
  generateCommitMessage() {
    const timestamp = new Date().toLocaleString('es-ES', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    const stats = this.getChangeStats()
    const uptime = this.getUptime()

    let message = `${CONFIG.COMMIT_PREFIX} - ${timestamp}\n\n`
    message += `📊 Estadísticas:\n`
    message += `- Archivos modificados: ${stats.modified}\n`
    message += `- Archivos nuevos: ${stats.added}\n`
    message += `- Archivos eliminados: ${stats.deleted}\n`
    message += `- Archivos sin seguimiento: ${stats.untracked}\n`
    message += `- Total de cambios: ${stats.total}\n\n`
    message += `⏱️ Tiempo de ejecución: ${uptime}\n`
    message += `🔄 Commits realizados: ${this.commitCount}\n`
    message += `❌ Errores: ${this.errorCount}\n\n`
    message += `🤖 Commit automático generado por el sistema`

    return message
  }

  /**
   * Obtener tiempo de ejecución
   */
  getUptime() {
    const now = new Date()
    const diff = now - this.startTime
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${hours}h ${minutes}m ${seconds}s`
  }

  /**
   * Ejecutar commit automático
   */
  async executeCommit() {
    try {
      this.log('🔍 Verificando cambios...')

      if (!this.hasChanges()) {
        this.log('✅ No hay cambios pendientes, saltando commit')
        return
      }

      const stats = this.getChangeStats()
      this.log(
        `📊 Encontrados ${stats.total} cambios: +${stats.added} ~${stats.modified} -${stats.deleted} ?${stats.untracked}`
      )

      // Agregar todos los cambios
      this.log('📁 Agregando archivos al staging...')
      execSync('git add .', { stdio: 'pipe' })

      // Generar mensaje de commit
      const commitMessage = this.generateCommitMessage()

      // Crear commit
      this.log('💾 Creando commit...')
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' })

      this.commitCount++
      this.log(`✅ Commit #${this.commitCount} creado exitosamente`)

      // Intentar push si hay remote configurado
      try {
        this.log('🚀 Intentando push a GitHub...')
        execSync('git push origin main', { stdio: 'pipe' })
        this.log('✅ Push exitoso a GitHub')
      } catch (pushError) {
        this.log(`⚠️ Push falló: ${pushError.message}`, 'WARN')
        this.log(
          '💡 El commit se guardó localmente, se sincronizará en el próximo push exitoso'
        )
      }
    } catch (error) {
      this.errorCount++
      this.log(`❌ Error en commit automático: ${error.message}`, 'ERROR')
      this.log(`📊 Errores totales: ${this.errorCount}`, 'ERROR')
    }
  }

  /**
   * Iniciar el proceso de commit automático
   */
  start() {
    if (this.isRunning) {
      this.log('⚠️ El proceso ya está ejecutándose', 'WARN')
      return
    }

    this.isRunning = true
    this.log('🚀 Iniciando commit automático cada 30 minutos...')
    this.log(`📁 Directorio de trabajo: ${process.cwd()}`)
    this.log(`⏰ Intervalo: ${CONFIG.INTERVAL_MINUTES} minutos`)
    this.log(`📝 Log file: ${CONFIG.LOG_FILE}`)

    // Ejecutar commit inmediatamente
    this.executeCommit()

    // Programar commits cada 30 minutos
    this.intervalId = setInterval(
      () => {
        this.executeCommit()
      },
      CONFIG.INTERVAL_MINUTES * 60 * 1000
    )

    this.log('✅ Commit automático iniciado exitosamente')
  }

  /**
   * Detener el proceso
   */
  stop() {
    if (!this.isRunning) {
      this.log('⚠️ El proceso no está ejecutándose', 'WARN')
      return
    }

    this.isRunning = false

    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }

    const uptime = this.getUptime()
    this.log(`🛑 Commit automático detenido`)
    this.log(`📊 Resumen final:`)
    this.log(`- Tiempo de ejecución: ${uptime}`)
    this.log(`- Commits realizados: ${this.commitCount}`)
    this.log(`- Errores: ${this.errorCount}`)
  }

  /**
   * Mostrar estado actual
   */
  status() {
    const uptime = this.getUptime()
    this.log(`📊 Estado del commit automático:`)
    this.log(`- Ejecutándose: ${this.isRunning ? 'Sí' : 'No'}`)
    this.log(`- Tiempo de ejecución: ${uptime}`)
    this.log(`- Commits realizados: ${this.commitCount}`)
    this.log(`- Errores: ${this.errorCount}`)
    this.log(`- Próximo commit en: ${CONFIG.INTERVAL_MINUTES} minutos`)
  }
}

// Manejo de señales para detener el proceso
process.on('SIGINT', () => {
  console.log('\n🛑 Recibida señal SIGINT, deteniendo commit automático...')
  if (global.autoCommit) {
    global.autoCommit.stop()
  }
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Recibida señal SIGTERM, deteniendo commit automático...')
  if (global.autoCommit) {
    global.autoCommit.stop()
  }
  process.exit(0)
})

// Crear instancia global
const autoCommit = new AutoCommit()
global.autoCommit = autoCommit

// Iniciar el proceso
autoCommit.start()

// Mostrar ayuda
console.log('\n🤖 COMMIT AUTOMÁTICO - METANOIA V1.0.2')
console.log('=====================================')
console.log('📝 El script está ejecutándose en segundo plano')
console.log('⏰ Hace commit automático cada 30 minutos')
console.log('📊 Presiona Ctrl+C para detener')
console.log('📁 Logs guardados en: scripts/auto-commit.log')
console.log('=====================================\n')
