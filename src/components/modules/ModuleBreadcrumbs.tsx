'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useDynamicRouter } from '@/hooks/useDynamicRouter'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  Calculator,
  BarChart3,
  Settings,
} from 'lucide-react'

export function ModuleBreadcrumbs() {
  const pathname = usePathname()
  const { getBreadcrumbs } = useDynamicRouter()

  const breadcrumbs = getBreadcrumbs(pathname)

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="h-4 w-4" />
      case 'Package':
        return <Package className="h-4 w-4" />
      case 'ShoppingCart':
        return <ShoppingCart className="h-4 w-4" />
      case 'Calculator':
        return <Calculator className="h-4 w-4" />
      case 'BarChart3':
        return <BarChart3 className="h-4 w-4" />
      case 'Settings':
        return <Settings className="h-4 w-4" />
      default:
        return <Home className="h-4 w-4" />
    }
  }

  if (breadcrumbs.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.path} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {breadcrumb.current ? (
                <BreadcrumbPage className="flex items-center space-x-1">
                  {breadcrumb.icon && getIcon(breadcrumb.icon)}
                  <span>{breadcrumb.label}</span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={breadcrumb.path}
                    className="flex items-center space-x-1"
                  >
                    {breadcrumb.icon && getIcon(breadcrumb.icon)}
                    <span>{breadcrumb.label}</span>
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
