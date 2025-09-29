'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDynamicRouter } from '@/hooks/useDynamicRouter'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  ChevronDown,
  ChevronRight,
  Users,
  Package,
  ShoppingCart,
  Calculator,
  BarChart3,
  Settings,
} from 'lucide-react'

export function ModuleNavigation() {
  const { navigation, categorizedMenu, loading } = useDynamicRouter()
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({})

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
        return <Settings className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CORE':
        return 'text-red-600'
      case 'BUSINESS':
        return 'text-blue-600'
      case 'FINANCIAL':
        return 'text-yellow-600'
      case 'ANALYTICS':
        return 'text-purple-600'
      case 'INTEGRATION':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const isRouteActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="mb-2 h-8 rounded bg-gray-200"></div>
            <div className="ml-4 space-y-1">
              <div className="h-6 rounded bg-gray-100"></div>
              <div className="h-6 rounded bg-gray-100"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <nav className="space-y-2">
      {Object.entries(categorizedMenu).map(([category, modules]) => (
        <Collapsible
          key={category}
          open={expandedCategories[category] ?? true}
          onOpenChange={() => toggleCategory(category)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto w-full justify-between p-2"
            >
              <div className="flex items-center space-x-2">
                <span className={getCategoryColor(category)}>
                  {getCategoryIcon(category)}
                </span>
                <span className="text-sm font-medium">{category}</span>
                <Badge variant="secondary" className="text-xs">
                  {modules.length}
                </Badge>
              </div>
              {(expandedCategories[category] ?? true) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="ml-6 space-y-1">
            {modules.map(module => (
              <div key={module.id} className="space-y-1">
                <div className="flex items-center space-x-2 px-2 py-1">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: module.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {module.label}
                  </span>
                </div>

                <div className="ml-5 space-y-1">
                  {module.routes.map((route: any) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                        isRouteActive(route.path)
                          ? 'bg-blue-100 font-medium text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </nav>
  )
}
