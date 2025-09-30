#!/usr/bin/env tsx

/**
 * Script de monitoreo de memoria para detectar memory leaks
 * Ejecutar: npm run monitor-memory
 */

import { performance } from 'perf_hooks'

interface MemoryStats {
  timestamp: Date
  rss: number
  heapUsed: number
  heapTotal: number
  external: number
  arrayBuffers: number
}

class MemoryMonitor {
  private stats: MemoryStats[] = []
  private intervalId: NodeJS.Timeout | null = null
  private startTime: number = 0

  start(intervalMs: number = 5000) {
    console.log('🔍 Iniciando monitoreo de memoria...')
    this.startTime = performance.now()
    
    this.intervalId = setInterval(() => {
      this.recordMemoryStats()
    }, intervalMs)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
    const endTime = performance.now()
    const duration = (endTime - this.startTime) / 1000
    
    console.log(`\n📊 Resumen de monitoreo (${duration.toFixed(2)}s):`)
    this.printSummary()
  }

  private recordMemoryStats() {
    const memUsage = process.memoryUsage()
    
    const stats: MemoryStats = {
      timestamp: new Date(),
      rss: memUsage.rss,
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      arrayBuffers: memUsage.arrayBuffers,
    }
    
    this.stats.push(stats)
    
    // Mostrar stats actuales
    console.log(`\n⏰ ${stats.timestamp.toISOString()}`)
    console.log(`📈 RSS: ${this.formatBytes(stats.rss)}`)
    console.log(`🧠 Heap Used: ${this.formatBytes(stats.heapUsed)}`)
    console.log(`🧠 Heap Total: ${this.formatBytes(stats.heapTotal)}`)
    console.log(`🔗 External: ${this.formatBytes(stats.external)}`)
    console.log(`📦 Array Buffers: ${this.formatBytes(stats.arrayBuffers)}`)
    
    // Detectar posibles memory leaks
    this.detectMemoryLeaks()
  }

  private detectMemoryLeaks() {
    if (this.stats.length < 3) return
    
    const recent = this.stats.slice(-3)
    const heapGrowth = recent[2].heapUsed - recent[0].heapUsed
    const rssGrowth = recent[2].rss - recent[0].rss
    
    // Si el heap crece más de 50MB en 3 mediciones
    if (heapGrowth > 50 * 1024 * 1024) {
      console.warn(`⚠️  POSIBLE MEMORY LEAK: Heap creció ${this.formatBytes(heapGrowth)} en 3 mediciones`)
    }
    
    // Si RSS crece más de 100MB en 3 mediciones
    if (rssGrowth > 100 * 1024 * 1024) {
      console.warn(`⚠️  POSIBLE MEMORY LEAK: RSS creció ${this.formatBytes(rssGrowth)} en 3 mediciones`)
    }
    
    // Si el heap está cerca del límite
    if (recent[2].heapUsed > 3 * 1024 * 1024 * 1024) { // 3GB
      console.warn(`⚠️  MEMORIA ALTA: Heap usado ${this.formatBytes(recent[2].heapUsed)}`)
    }
  }

  private printSummary() {
    if (this.stats.length === 0) return
    
    const first = this.stats[0]
    const last = this.stats[this.stats.length - 1]
    
    console.log(`📊 Estadísticas de memoria:`)
    console.log(`   RSS inicial: ${this.formatBytes(first.rss)}`)
    console.log(`   RSS final: ${this.formatBytes(last.rss)}`)
    console.log(`   Crecimiento RSS: ${this.formatBytes(last.rss - first.rss)}`)
    console.log(`   Heap inicial: ${this.formatBytes(first.heapUsed)}`)
    console.log(`   Heap final: ${this.formatBytes(last.heapUsed)}`)
    console.log(`   Crecimiento Heap: ${this.formatBytes(last.heapUsed - first.heapUsed)}`)
    
    // Calcular tasa de crecimiento
    const duration = (last.timestamp.getTime() - first.timestamp.getTime()) / 1000
    const heapGrowthRate = (last.heapUsed - first.heapUsed) / duration
    const rssGrowthRate = (last.rss - first.rss) / duration
    
    console.log(`\n📈 Tasas de crecimiento:`)
    console.log(`   Heap: ${this.formatBytes(heapGrowthRate)}/s`)
    console.log(`   RSS: ${this.formatBytes(rssGrowthRate)}/s`)
    
    // Recomendaciones
    if (heapGrowthRate > 1024 * 1024) { // 1MB/s
      console.log(`\n💡 RECOMENDACIÓN: Implementar garbage collection más frecuente`)
    }
    
    if (last.heapUsed > 2 * 1024 * 1024 * 1024) { // 2GB
      console.log(`\n💡 RECOMENDACIÓN: Considerar aumentar --max-old-space-size`)
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }
}

// Función principal
async function main() {
  const monitor = new MemoryMonitor()
  
  // Capturar señales para limpiar
  process.on('SIGINT', () => {
    console.log('\n🛑 Deteniendo monitoreo...')
    monitor.stop()
    process.exit(0)
  })
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Deteniendo monitoreo...')
    monitor.stop()
    process.exit(0)
  })
  
  // Iniciar monitoreo
  monitor.start(5000) // Cada 5 segundos
  
  console.log('🔍 Monitoreo de memoria iniciado. Presiona Ctrl+C para detener.')
  console.log('📊 Se mostrarán estadísticas cada 5 segundos.')
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error)
}

export { MemoryMonitor }

