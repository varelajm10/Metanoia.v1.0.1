import Redis from 'ioredis'

// Configuración de Redis para caché
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

// Claves de caché para diferentes tipos de datos
export const CACHE_KEYS = {
  CUSTOMER_STATS: (tenantId: string) => `customer:stats:${tenantId}`,
  CUSTOMER_LIST: (tenantId: string, page: number, limit: number) => 
    `customer:list:${tenantId}:${page}:${limit}`,
  CUSTOMER_SEARCH: (tenantId: string, query: string) => 
    `customer:search:${tenantId}:${query}`,
} as const

// Tiempos de expiración (en segundos)
export const CACHE_TTL = {
  STATS: 300, // 5 minutos
  LIST: 60,  // 1 minuto
  SEARCH: 30, // 30 segundos
} as const

export class CacheService {
  /**
   * Obtener datos del caché
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error getting from cache:', error)
      return null
    }
  }

  /**
   * Guardar datos en el caché
   */
  static async set(key: string, data: any, ttl: number = 300): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  /**
   * Eliminar datos del caché
   */
  static async del(key: string): Promise<void> {
    try {
      await redis.del(key)
    } catch (error) {
      console.error('Error deleting from cache:', error)
    }
  }

  /**
   * Eliminar múltiples claves con patrón
   */
  static async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Error deleting pattern from cache:', error)
    }
  }

  /**
   * Invalidar caché de estadísticas de clientes
   */
  static async invalidateCustomerStats(tenantId: string): Promise<void> {
    await this.delPattern(`customer:stats:${tenantId}*`)
  }

  /**
   * Invalidar caché de lista de clientes
   */
  static async invalidateCustomerList(tenantId: string): Promise<void> {
    await this.delPattern(`customer:list:${tenantId}*`)
  }

  /**
   * Invalidar caché de búsqueda de clientes
   */
  static async invalidateCustomerSearch(tenantId: string): Promise<void> {
    await this.delPattern(`customer:search:${tenantId}*`)
  }

  /**
   * Invalidar todo el caché de clientes
   */
  static async invalidateAllCustomers(tenantId: string): Promise<void> {
    await Promise.all([
      this.invalidateCustomerStats(tenantId),
      this.invalidateCustomerList(tenantId),
      this.invalidateCustomerSearch(tenantId),
    ])
  }
}

export default redis

