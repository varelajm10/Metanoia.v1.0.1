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
import { Building2, Package, CheckCircle, ArrowRight, Info } from 'lucide-react'

interface BusinessTemplate {
  id: string
  name: string
  description: string
  industry: string
  templateModules: Array<{
    module: {
      id: string
      name: string
      displayName: string
      description: string
      category: string
      isCore: boolean
    }
    order: number
    config: Record<string, any>
  }>
}

interface ModuleTemplatesProps {
  templates: BusinessTemplate[]
  onApply: (templateId: string) => void
}

export function ModuleTemplates({ templates, onApply }: ModuleTemplatesProps) {
  const [applyingTemplate, setApplyingTemplate] = useState<string | null>(null)

  const handleApplyTemplate = async (templateId: string) => {
    setApplyingTemplate(templateId)
    try {
      await onApply(templateId)
    } finally {
      setApplyingTemplate(null)
    }
  }

  const getIndustryIcon = (industry: string) => {
    switch (industry?.toLowerCase()) {
      case 'retail':
        return '🛍️'
      case 'manufacturing':
        return '🏭'
      case 'services':
        return '💼'
      case 'healthcare':
        return '🏥'
      case 'education':
        return '🎓'
      case 'technology':
        return '💻'
      default:
        return '🏢'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CORE':
        return 'bg-red-100 text-red-800'
      case 'BUSINESS':
        return 'bg-blue-100 text-blue-800'
      case 'FINANCIAL':
        return 'bg-yellow-100 text-yellow-800'
      case 'ANALYTICS':
        return 'bg-purple-100 text-purple-800'
      case 'INTEGRATION':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold">
            No hay templates disponibles
          </h3>
          <p className="text-center text-gray-600">
            Los templates de negocio estarán disponibles próximamente
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map(template => (
        <Card key={template.id} className="transition-shadow hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">
                  {getIndustryIcon(template.industry)}
                </div>
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </div>
              </div>
            </div>

            {template.industry && (
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  <Building2 className="mr-1 h-3 w-3" />
                  {template.industry}
                </Badge>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Módulos incluidos ({template.templateModules.length}):
              </h4>
              <div className="space-y-2">
                {template.templateModules.slice(0, 4).map(templateModule => (
                  <div
                    key={templateModule.module.id}
                    className="flex items-center space-x-2"
                  >
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {templateModule.module.displayName}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getCategoryColor(templateModule.module.category)}`}
                    >
                      {templateModule.module.category}
                    </Badge>
                  </div>
                ))}
                {template.templateModules.length > 4 && (
                  <div className="text-xs text-gray-500">
                    +{template.templateModules.length - 4} módulos más
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Configuración automática</span>
              </div>
              <Button
                onClick={() => handleApplyTemplate(template.id)}
                disabled={applyingTemplate === template.id}
                className="text-sm"
              >
                {applyingTemplate === template.id ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    Aplicar Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
