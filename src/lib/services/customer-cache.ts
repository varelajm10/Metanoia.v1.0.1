import { CacheService, CACHE_KEYS, CACHE_TTL } from '@/lib/cache/redis'
import { getCustomers, getCustomerStats } from './customer'
import { CustomerQuery } from '@/lib/validations/customer'

/**
 * Servicio de caché para customers con optimizaciones de performance
 */
export class CustomerCacheService {
  /**
   * Obtener estadísticas de clientes con caché
   */
  static async getCachedStats(tenantId: string) {
    const cacheKey = CACHE_KEYS.CUSTOMER_STATS(tenantId)
    
    // Intentar obtener del caché
    let stats = await CacheService.get(cacheKey)
    
    if (!stats) {
      // Si no está en caché, obtener de la base de datos
      stats = await getCustomerStats(tenantId)
      
      // Guardar en caché
      await CacheService.set(cacheKey, stats, CACHE_TTL.STATS)
    }
    
    return stats
  }

  /**
   * Obtener lista de clientes con caché
   */
  static async getCachedCustomers(query: CustomerQuery, tenantId: string) {
    const cacheKey = CACHE_KEYS.CUSTOMER_LIST(tenantId, query.page, query.limit)
    
    // Intentar obtener del caché
    let result = await CacheService.get(cacheKey)
    
    if (!result) {
      // Si no está en caché, obtener de la base de datos
      result = await getCustomers(query, tenantId)
      
      // Guardar en caché
      await CacheService.set(cacheKey, result, CACHE_TTL.LIST)
    }
    
    return result
  }

  /**
   * Invalidar caché cuando se crea un cliente
   */
  static async onCustomerCreated(tenantId: string) {
    await CacheService.invalidateAllCustomers(tenantId)
  }

  /**
   * Invalidar caché cuando se actualiza un cliente
   */
  static async onCustomerUpdated(tenantId: string) {
    await CacheService.invalidateAllCustomers(tenantId)
  }

  /**
   * Invalidar caché cuando se elimina un cliente
   */
  static async onCustomerDeleted(tenantId: string) {
    await CacheService.invalidateAllCustomers(tenantId)
  }

  /**
   * Invalidar caché cuando se cambia el estado de un cliente
   */
  static async onCustomerStatusChanged(tenantId: string) {
    await CacheService.invalidateAllCustomers(tenantId)
  }
}

