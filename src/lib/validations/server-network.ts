import { z } from 'zod'

// Schema para configuración de red
export const NetworkConfigSchema = z.object({
  serverId: z.string().min(1, 'Debe seleccionar un servidor'),

  // Configuración básica de red
  publicIP: z.string().ip().optional().or(z.literal('')),
  privateIP: z.string().ip('IP privada inválida'),
  gateway: z.string().ip().optional().or(z.literal('')),
  subnet: z.string().optional().or(z.literal('')),
  dnsServers: z.array(z.string().ip()).default([]),
  bandwidth: z.string().optional().or(z.literal('')),
  connectionType: z
    .enum(['DEDICATED', 'SHARED', 'CLOUD', 'HYBRID', 'VIRTUAL'])
    .default('DEDICATED'),

  // Información del proveedor
  isp: z.string().optional().or(z.literal('')),
  contractNumber: z.string().optional().or(z.literal('')),
  contractEndDate: z.string().optional().or(z.literal('')),

  // Configuración avanzada
  vlan: z.string().optional().or(z.literal('')),
  routingTable: z.any().optional(),
  firewallRules: z.any().optional(),
})

// Schema para métricas de red
export const NetworkMetricSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  metricType: z.enum([
    'BANDWIDTH_IN',
    'BANDWIDTH_OUT',
    'LATENCY',
    'PACKET_LOSS',
    'JITTER',
    'THROUGHPUT',
    'CONNECTIONS',
    'DNS_RESPONSE_TIME',
  ]),
  value: z.number().min(0, 'El valor debe ser mayor o igual a 0'),
  unit: z.string().optional().or(z.literal('')),
  timestamp: z.string().optional(),
  source: z.string().optional().or(z.literal('')),
  additionalData: z.any().optional(),
})

// Schema para alertas de conectividad
export const ConnectivityAlertSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  type: z.enum([
    'CONNECTIVITY_LOST',
    'HIGH_LATENCY',
    'PACKET_LOSS',
    'BANDWIDTH_EXCEEDED',
    'DNS_FAILURE',
    'ROUTING_ISSUE',
  ]),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().min(1, 'La descripción es requerida').max(1000),
  threshold: z.number().optional(),
  actualValue: z.number().optional(),
  isActive: z.boolean().default(true),
})

// Schema para configuración de DNS
export const DnsConfigSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  primaryDns: z.string().ip('IP de DNS primario inválida'),
  secondaryDns: z.string().ip().optional().or(z.literal('')),
  searchDomains: z.array(z.string()).default([]),
  dnsSuffix: z.string().optional().or(z.literal('')),
  isCustom: z.boolean().default(false),
})

// Schema para configuración de routing
export const RoutingConfigSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  routes: z
    .array(
      z.object({
        destination: z.string(),
        gateway: z.string().ip(),
        netmask: z.string().optional(),
        metric: z.number().min(0).optional(),
        interface: z.string().optional(),
      })
    )
    .default([]),
  defaultGateway: z.string().ip(),
  isStatic: z.boolean().default(true),
})

// Schema para configuración de firewall
export const FirewallConfigSchema = z.object({
  serverId: z.string().min(1, 'ID de servidor requerido'),
  rules: z
    .array(
      z.object({
        name: z.string(),
        action: z.enum(['ALLOW', 'DENY', 'REJECT']),
        protocol: z.enum(['TCP', 'UDP', 'ICMP', 'ALL']),
        sourceIP: z.string().optional(),
        destinationIP: z.string().optional(),
        sourcePort: z.string().optional(),
        destinationPort: z.string().optional(),
        direction: z.enum(['INBOUND', 'OUTBOUND', 'BOTH']),
        priority: z.number().min(0).default(100),
        isActive: z.boolean().default(true),
      })
    )
    .default([]),
  defaultPolicy: z.enum(['ALLOW', 'DENY']).default('DENY'),
})

// Schemas de actualización (parciales)
export const UpdateNetworkConfigSchema = NetworkConfigSchema.partial()
export const UpdateConnectivityAlertSchema = ConnectivityAlertSchema.partial()
export const UpdateDnsConfigSchema = DnsConfigSchema.partial()
export const UpdateRoutingConfigSchema = RoutingConfigSchema.partial()
export const UpdateFirewallConfigSchema = FirewallConfigSchema.partial()

// Schemas de consulta
export const NetworkQuerySchema = z.object({
  serverId: z.string().optional(),
  connectionType: z
    .enum(['DEDICATED', 'SHARED', 'CLOUD', 'HYBRID', 'VIRTUAL'])
    .optional(),
  metricType: z
    .enum([
      'BANDWIDTH_IN',
      'BANDWIDTH_OUT',
      'LATENCY',
      'PACKET_LOSS',
      'JITTER',
      'THROUGHPUT',
      'CONNECTIONS',
      'DNS_RESPONSE_TIME',
    ])
    .optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  threshold: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['timestamp', 'value', 'serverId']).default('timestamp'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Type exports
export type CreateNetworkConfigInput = z.infer<typeof NetworkConfigSchema>
export type UpdateNetworkConfigInput = z.infer<typeof UpdateNetworkConfigSchema>
export type CreateNetworkMetricInput = z.infer<typeof NetworkMetricSchema>
export type CreateConnectivityAlertInput = z.infer<
  typeof ConnectivityAlertSchema
>
export type UpdateConnectivityAlertInput = z.infer<
  typeof UpdateConnectivityAlertSchema
>
export type CreateDnsConfigInput = z.infer<typeof DnsConfigSchema>
export type UpdateDnsConfigInput = z.infer<typeof UpdateDnsConfigSchema>
export type CreateRoutingConfigInput = z.infer<typeof RoutingConfigSchema>
export type UpdateRoutingConfigInput = z.infer<typeof UpdateRoutingConfigSchema>
export type CreateFirewallConfigInput = z.infer<typeof FirewallConfigSchema>
export type UpdateFirewallConfigInput = z.infer<
  typeof UpdateFirewallConfigSchema
>
export type NetworkQuery = z.infer<typeof NetworkQuerySchema>

// Utility functions para formateo
export const formatConnectionType = (type: string) => {
  const types: { [key: string]: string } = {
    DEDICATED: 'Dedicado',
    SHARED: 'Compartido',
    CLOUD: 'Nube',
    HYBRID: 'Híbrido',
    VIRTUAL: 'Virtual',
  }
  return types[type] || type
}

export const formatNetworkMetricType = (type: string) => {
  const types: { [key: string]: string } = {
    BANDWIDTH_IN: 'Ancho de Banda Entrada',
    BANDWIDTH_OUT: 'Ancho de Banda Salida',
    LATENCY: 'Latencia',
    PACKET_LOSS: 'Pérdida de Paquetes',
    JITTER: 'Jitter',
    THROUGHPUT: 'Throughput',
    CONNECTIONS: 'Conexiones',
    DNS_RESPONSE_TIME: 'Tiempo de Respuesta DNS',
  }
  return types[type] || type
}

export const formatConnectivityAlertType = (type: string) => {
  const types: { [key: string]: string } = {
    CONNECTIVITY_LOST: 'Conectividad Perdida',
    HIGH_LATENCY: 'Alta Latencia',
    PACKET_LOSS: 'Pérdida de Paquetes',
    BANDWIDTH_EXCEEDED: 'Ancho de Banda Excedido',
    DNS_FAILURE: 'Falla de DNS',
    ROUTING_ISSUE: 'Problema de Enrutamiento',
  }
  return types[type] || type
}

export const formatFirewallAction = (action: string) => {
  const actions: { [key: string]: string } = {
    ALLOW: 'Permitir',
    DENY: 'Denegar',
    REJECT: 'Rechazar',
  }
  return actions[action] || action
}

export const formatFirewallProtocol = (protocol: string) => {
  const protocols: { [key: string]: string } = {
    TCP: 'TCP',
    UDP: 'UDP',
    ICMP: 'ICMP',
    ALL: 'Todos',
  }
  return protocols[protocol] || protocol
}

export const formatFirewallDirection = (direction: string) => {
  const directions: { [key: string]: string } = {
    INBOUND: 'Entrada',
    OUTBOUND: 'Salida',
    BOTH: 'Ambos',
  }
  return directions[direction] || direction
}

// Funciones para colores
export const getConnectionTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    DEDICATED: 'bg-green-100 text-green-800',
    SHARED: 'bg-yellow-100 text-yellow-800',
    CLOUD: 'bg-blue-100 text-blue-800',
    HYBRID: 'bg-purple-100 text-purple-800',
    VIRTUAL: 'bg-gray-100 text-gray-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getNetworkMetricTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    BANDWIDTH_IN: 'bg-blue-100 text-blue-800',
    BANDWIDTH_OUT: 'bg-green-100 text-green-800',
    LATENCY: 'bg-orange-100 text-orange-800',
    PACKET_LOSS: 'bg-red-100 text-red-800',
    JITTER: 'bg-purple-100 text-purple-800',
    THROUGHPUT: 'bg-cyan-100 text-cyan-800',
    CONNECTIONS: 'bg-indigo-100 text-indigo-800',
    DNS_RESPONSE_TIME: 'bg-pink-100 text-pink-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getConnectivityAlertTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    CONNECTIVITY_LOST: 'bg-red-100 text-red-800',
    HIGH_LATENCY: 'bg-orange-100 text-orange-800',
    PACKET_LOSS: 'bg-red-100 text-red-800',
    BANDWIDTH_EXCEEDED: 'bg-yellow-100 text-yellow-800',
    DNS_FAILURE: 'bg-purple-100 text-purple-800',
    ROUTING_ISSUE: 'bg-blue-100 text-blue-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getFirewallActionColor = (action: string) => {
  const colors: { [key: string]: string } = {
    ALLOW: 'bg-green-100 text-green-800',
    DENY: 'bg-red-100 text-red-800',
    REJECT: 'bg-orange-100 text-orange-800',
  }
  return colors[action] || 'bg-gray-100 text-gray-800'
}

// Funciones de validación
export const validateBandwidth = (bandwidth: string): boolean => {
  const bandwidthRegex = /^\d+(\.\d+)?\s*(Mbps|Gbps|Kbps|bps)$/i
  return bandwidthRegex.test(bandwidth)
}

export const validateSubnet = (subnet: string): boolean => {
  const subnetRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/(?:[0-9]|[1-2][0-9]|3[0-2])$/
  return subnetRegex.test(subnet)
}

export const validateVlan = (vlan: string): boolean => {
  const vlanNumber = parseInt(vlan)
  return vlanNumber >= 1 && vlanNumber <= 4094
}

export const validatePort = (port: string): boolean => {
  const portNumber = parseInt(port)
  return portNumber >= 1 && portNumber <= 65535
}

export const formatBandwidth = (
  value: number,
  unit: string = 'Mbps'
): string => {
  if (unit === 'bps') {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(2)} Gbps`
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} Mbps`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} Kbps`
    } else {
      return `${value} bps`
    }
  }
  return `${value} ${unit}`
}

export const formatLatency = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} s`
  }
  return `${value.toFixed(0)} ms`
}

export const formatPacketLoss = (value: number): string => {
  return `${value.toFixed(2)}%`
}

export const formatThroughput = (
  value: number,
  unit: string = 'Mbps'
): string => {
  return `${value.toFixed(2)} ${unit}`
}

export const formatConnections = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

export const getNetworkHealthScore = (metrics: {
  latency?: number
  packetLoss?: number
  bandwidthUtilization?: number
  dnsResponseTime?: number
}): number => {
  let score = 100

  // Penalizar latencia alta
  if (metrics.latency !== undefined) {
    if (metrics.latency > 500) score -= 40
    else if (metrics.latency > 200) score -= 20
    else if (metrics.latency > 100) score -= 10
  }

  // Penalizar pérdida de paquetes
  if (metrics.packetLoss !== undefined) {
    if (metrics.packetLoss > 5) score -= 50
    else if (metrics.packetLoss > 2) score -= 30
    else if (metrics.packetLoss > 1) score -= 15
  }

  // Penalizar utilización alta de ancho de banda
  if (metrics.bandwidthUtilization !== undefined) {
    if (metrics.bandwidthUtilization > 95) score -= 30
    else if (metrics.bandwidthUtilization > 85) score -= 20
    else if (metrics.bandwidthUtilization > 75) score -= 10
  }

  // Penalizar tiempo de respuesta DNS alto
  if (metrics.dnsResponseTime !== undefined) {
    if (metrics.dnsResponseTime > 1000) score -= 20
    else if (metrics.dnsResponseTime > 500) score -= 10
  }

  return Math.max(0, score)
}

export const getNetworkHealthStatus = (score: number): string => {
  if (score >= 90) return 'EXCELLENT'
  if (score >= 80) return 'GOOD'
  if (score >= 60) return 'FAIR'
  if (score >= 40) return 'POOR'
  return 'CRITICAL'
}

export const getNetworkHealthStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    EXCELLENT: 'bg-green-100 text-green-800',
    GOOD: 'bg-blue-100 text-blue-800',
    FAIR: 'bg-yellow-100 text-yellow-800',
    POOR: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const calculateNetworkUtilization = (
  currentBandwidth: number,
  maxBandwidth: number
): number => {
  if (maxBandwidth <= 0) return 0
  return Math.min(100, (currentBandwidth / maxBandwidth) * 100)
}

export const formatNetworkUtilization = (utilization: number): string => {
  return `${utilization.toFixed(1)}%`
}

export const getUtilizationColor = (utilization: number): string => {
  if (utilization >= 90) return 'text-red-600'
  if (utilization >= 75) return 'text-orange-600'
  if (utilization >= 50) return 'text-yellow-600'
  return 'text-green-600'
}
