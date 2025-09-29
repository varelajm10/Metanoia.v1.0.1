'use client'

import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Settings,
} from 'lucide-react'

interface ModuleStatusIndicatorProps {
  isActive: boolean
  isEnabled: boolean
  isCore?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ModuleStatusIndicator({
  isActive,
  isEnabled,
  isCore = false,
  showLabel = true,
  size = 'md',
}: ModuleStatusIndicatorProps) {
  const getStatus = () => {
    if (isActive && isEnabled) {
      return {
        icon: <CheckCircle className={`${getIconSize()} text-green-500`} />,
        label: 'Activo',
        variant: 'default' as const,
        className: 'bg-green-100 text-green-800 border-green-200',
      }
    } else if (isActive && !isEnabled) {
      return {
        icon: <AlertCircle className={`${getIconSize()} text-yellow-500`} />,
        label: 'Deshabilitado',
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      }
    } else {
      return {
        icon: <XCircle className={`${getIconSize()} text-gray-400`} />,
        label: 'Inactivo',
        variant: 'outline' as const,
        className: 'bg-gray-100 text-gray-600 border-gray-200',
      }
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3'
      case 'md':
        return 'h-4 w-4'
      case 'lg':
        return 'h-5 w-5'
      default:
        return 'h-4 w-4'
    }
  }

  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-1.5 py-0.5'
      case 'md':
        return 'text-xs px-2 py-1'
      case 'lg':
        return 'text-sm px-2.5 py-1'
      default:
        return 'text-xs px-2 py-1'
    }
  }

  const status = getStatus()

  return (
    <div className="flex items-center space-x-2">
      {status.icon}
      {showLabel && (
        <Badge
          variant={status.variant}
          className={`${status.className} ${getBadgeSize()}`}
        >
          {status.label}
        </Badge>
      )}
      {isCore && (
        <Badge variant="destructive" className={`text-xs ${getBadgeSize()}`}>
          Core
        </Badge>
      )}
    </div>
  )
}

interface ModuleHealthIndicatorProps {
  status: 'healthy' | 'warning' | 'error' | 'loading'
  message?: string
  showMessage?: boolean
}

export function ModuleHealthIndicator({
  status,
  message,
  showMessage = false,
}: ModuleHealthIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          label: 'Saludable',
          className: 'text-green-600',
        }
      case 'warning':
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          label: 'Advertencia',
          className: 'text-yellow-600',
        }
      case 'error':
        return {
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          label: 'Error',
          className: 'text-red-600',
        }
      case 'loading':
        return {
          icon: <Clock className="h-4 w-4 animate-spin text-blue-500" />,
          label: 'Cargando',
          className: 'text-blue-600',
        }
      default:
        return {
          icon: <Settings className="h-4 w-4 text-gray-500" />,
          label: 'Desconocido',
          className: 'text-gray-600',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="flex items-center space-x-2">
      {config.icon}
      <span className={`text-sm font-medium ${config.className}`}>
        {config.label}
      </span>
      {showMessage && message && (
        <span className="text-sm text-gray-500">- {message}</span>
      )}
    </div>
  )
}
