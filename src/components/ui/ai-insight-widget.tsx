'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Lightbulb,
  Zap,
  Brain,
  ArrowRight
} from 'lucide-react'

interface Insight {
  id: string
  type: 'positive' | 'negative' | 'neutral' | 'suggestion'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  action?: string
}

interface AIInsightWidgetProps {
  insights?: Insight[]
  isLoading?: boolean
}

export function AIInsightWidget({ insights, isLoading }: AIInsightWidgetProps) {
  // Datos de ejemplo para demostración
  const defaultInsights: Insight[] = [
    {
      id: '1',
      type: 'positive',
      title: 'Crecimiento en Ventas',
      description: 'Las ventas han aumentado un 23% esta semana comparado con la anterior',
      impact: 'high',
      action: 'Ver detalles'
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Optimización de Stock',
      description: 'Se recomienda aumentar el stock del producto "Laptop Pro" por alta demanda',
      impact: 'medium',
      action: 'Revisar inventario'
    },
    {
      id: '3',
      type: 'neutral',
      title: 'Análisis de Clientes',
      description: 'Se detectaron 5 nuevos clientes potenciales en la región norte',
      impact: 'medium',
      action: 'Contactar clientes'
    }
  ]

  const currentInsights = insights || defaultInsights

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
    }
  }

  const getImpactBadge = (impact: Insight['impact']) => {
    const variants = {
      high: 'default' as const,
      medium: 'secondary' as const,
      low: 'outline' as const
    }
    
    const colors = {
      high: 'text-red-600 bg-red-50 border-red-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      low: 'text-blue-600 bg-blue-50 border-blue-200'
    }

    return (
      <Badge 
        variant={variants[impact]}
        className={`text-xs ${colors[impact]} dark:bg-opacity-20`}
      >
        {impact === 'high' ? 'Alto' : impact === 'medium' ? 'Medio' : 'Bajo'}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card className="card-modern border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg animate-pulse">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Insights de la Semana
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Análisis inteligente en progreso...
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-6 w-6 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="h-4 w-4 bg-muted rounded mt-1"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-full bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-modern border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
              <Sparkles className="h-6 w-6 text-primary group-hover:animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Insights de la Semana
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Análisis inteligente de tu negocio
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10">
              <Zap className="mr-1 h-3 w-3" />
              IA Activa
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {currentInsights.slice(0, 3).map((insight, index) => (
            <div 
              key={insight.id}
              className="group flex items-start space-x-3 p-3 rounded-lg bg-background/50 hover:bg-accent/20 transition-all duration-200 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-shrink-0 mt-1">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {insight.title}
                  </h4>
                  {getImpactBadge(insight.impact)}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  {insight.description}
                </p>
                {insight.action && (
                  <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                    {insight.action} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Última actualización: hace 2 horas
            </p>
            <Button variant="ghost" size="sm" className="text-xs h-8">
              Ver todos los insights
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
