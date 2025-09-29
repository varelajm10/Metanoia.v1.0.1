'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Settings,
  CheckCircle,
  XCircle,
  Info,
  Users,
  Package,
  ShoppingCart,
  Calculator,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react'

interface Module {
  id: string
  name: string
  displayName: string
  description: string
  version: string
  category: string
  isCore: boolean
  icon: string
  color: string
  order: number
  tenantConfig?: {
    isActive: boolean
    isEnabled: boolean
    config: Record<string, any>
    customFields: Record<string, any>
    features: Record<string, boolean>
    permissions: Record<string, string[]>
  }
  isActive?: boolean
  isEnabled?: boolean
  features?: Array<{
    id: string
    name: string
    description: string
    isEnabled: boolean
  }>
}

interface ModuleCardProps {
  module: Module
  onToggle: (moduleId: string, isActive: boolean) => void
  showToggle?: boolean
}

export function ModuleCard({
  module,
  onToggle,
  showToggle = true,
}: ModuleCardProps) {
  const [isToggling, setIsToggling] = useState(false)

  const isActive = module.isActive || module.tenantConfig?.isActive || false
  const isEnabled = module.isEnabled || module.tenantConfig?.isEnabled || false

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CORE':
        return <Users className="h-4 w-4" />
      case 'BUSINESS':
        return <ShoppingCart className="h-4 w-4" />
      case 'FINANCIAL':
        return <Calculator className="h-4 w-4" />
      case 'ANALYTICS':
        return <BarChart3 className="h-4 w-4" />
      case 'INTEGRATION':
        return <SettingsIcon className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CORE':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'BUSINESS':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'FINANCIAL':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ANALYTICS':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'INTEGRATION':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = () => {
    if (isActive && isEnabled) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (isActive && !isEnabled) {
      return <XCircle className="h-5 w-5 text-yellow-500" />
    } else {
      return <XCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    if (isActive && isEnabled) {
      return 'Activo'
    } else if (isActive && !isEnabled) {
      return 'Deshabilitado'
    } else {
      return 'Inactivo'
    }
  }

  const getStatusColor = () => {
    if (isActive && isEnabled) {
      return 'text-green-600'
    } else if (isActive && !isEnabled) {
      return 'text-yellow-600'
    } else {
      return 'text-gray-500'
    }
  }

  const handleToggle = async () => {
    if (isToggling) return

    setIsToggling(true)
    try {
      await onToggle(module.id, !isActive)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isActive ? 'border-2 border-blue-200' : 'border border-gray-200'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-lg"
              style={{ backgroundColor: module.color + '20' }}
            >
              <span className="text-2xl">
                {getCategoryIcon(module.category)}
              </span>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{module.displayName}</CardTitle>
              <CardDescription className="text-sm">
                {module.description}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={`text-xs ${getCategoryColor(module.category)}`}
            >
              {getCategoryIcon(module.category)}
              <span className="ml-1">{module.category}</span>
            </Badge>

            {module.isCore && (
              <Badge variant="destructive" className="text-xs">
                Core
              </Badge>
            )}

            <Badge variant="secondary" className="text-xs">
              v{module.version}
            </Badge>
          </div>

          {showToggle && (
            <div className="flex items-center space-x-2">
              <Switch
                checked={isActive}
                onCheckedChange={handleToggle}
                disabled={isToggling || module.isCore}
              />
              <span className="text-sm text-gray-600">
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      {isActive && module.features && module.features.length > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Características:
            </h4>
            <div className="space-y-1">
              {module.features.slice(0, 3).map(feature => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      feature.isEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm text-gray-600">{feature.name}</span>
                </div>
              ))}
              {module.features.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{module.features.length - 3} características más
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}

      {isActive && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>Configuración disponible</span>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              <Settings className="mr-1 h-3 w-3" />
              Configurar
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
