'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  FileText,
  Save,
  Send,
  Download,
} from 'lucide-react'

interface ChecklistItem {
  id: string
  category: string
  item: string
  description: string
  required: boolean
  status: 'PENDING' | 'PASS' | 'FAIL' | 'N/A'
  notes?: string
  photos?: string[]
  score?: number
}

interface InspectionChecklistProps {
  inspectionId: string
  elevatorId: string
  checklistItems: ChecklistItem[]
  onSave: (data: any) => Promise<void>
  onComplete: (data: any) => Promise<void>
  loading?: boolean
}

export default function InspectionChecklist({
  inspectionId,
  elevatorId,
  checklistItems,
  onSave,
  onComplete,
  loading = false,
}: InspectionChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(checklistItems)
  const [currentCategory, setCurrentCategory] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [overallScore, setOverallScore] = useState<number>(0)

  const categories = Array.from(new Set(items.map(item => item.category)))

  useEffect(() => {
    if (categories.length > 0 && !currentCategory) {
      setCurrentCategory(categories[0])
    }
  }, [categories, currentCategory])

  useEffect(() => {
    calculateOverallScore()
  }, [items])

  const calculateOverallScore = () => {
    const totalItems = items.filter(item => item.status !== 'N/A').length
    const passedItems = items.filter(item => item.status === 'PASS').length
    const score =
      totalItems > 0 ? Math.round((passedItems / totalItems) * 100) : 0
    setOverallScore(score)
  }

  const updateItemStatus = (
    itemId: string,
    status: 'PENDING' | 'PASS' | 'FAIL' | 'N/A'
  ) => {
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, status } : item))
    )
  }

  const updateItemNotes = (itemId: string, notes: string) => {
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, notes } : item))
    )
  }

  const updateItemScore = (itemId: string, score: number) => {
    setItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, score } : item))
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'FAIL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'N/A':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'FAIL':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'N/A':
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'Aprobado'
      case 'FAIL':
        return 'Reprobado'
      case 'N/A':
        return 'N/A'
      default:
        return 'Pendiente'
    }
  }

  const getCategoryProgress = (category: string) => {
    const categoryItems = items.filter(item => item.category === category)
    const completedItems = categoryItems.filter(
      item => item.status !== 'PENDING'
    )
    return {
      total: categoryItems.length,
      completed: completedItems.length,
      percentage:
        categoryItems.length > 0
          ? Math.round((completedItems.length / categoryItems.length) * 100)
          : 0,
    }
  }

  const getOverallProgress = () => {
    const totalItems = items.length
    const completedItems = items.filter(
      item => item.status !== 'PENDING'
    ).length
    return {
      total: totalItems,
      completed: completedItems,
      percentage:
        totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await onSave({
        inspectionId,
        elevatorId,
        items,
        overallScore,
        progress: getOverallProgress(),
      })
    } catch (error) {
      console.error('Error saving checklist:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleComplete = async () => {
    try {
      setIsCompleting(true)
      await onComplete({
        inspectionId,
        elevatorId,
        items,
        overallScore,
        progress: getOverallProgress(),
        completedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error completing inspection:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const currentCategoryItems = items.filter(
    item => item.category === currentCategory
  )
  const progress = getOverallProgress()

  if (loading) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Checklist de Inspección
              </CardTitle>
              <CardDescription>
                Inspección técnica del ascensor - Progreso:{' '}
                {progress.percentage}%
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isCompleting || progress.percentage < 100}
              >
                <Send className="mr-2 h-4 w-4" />
                {isCompleting ? 'Completando...' : 'Completar'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm text-gray-600">
                {progress.completed}/{progress.total} elementos
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Puntuación General</span>
              <div className="text-2xl font-bold text-blue-600">
                {overallScore}/100
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const categoryProgress = getCategoryProgress(category)
              return (
                <Button
                  key={category}
                  variant={currentCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentCategory(category)}
                  className="flex items-center gap-2"
                >
                  <span>{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {categoryProgress.completed}/{categoryProgress.total}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <Card>
        <CardHeader>
          <CardTitle>{currentCategory}</CardTitle>
          <CardDescription>
            {getCategoryProgress(currentCategory).percentage}% completado en
            esta categoría
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {currentCategoryItems.map(item => (
              <div key={item.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h4 className="font-medium">{item.item}</h4>
                      {item.required && (
                        <Badge variant="destructive" className="text-xs">
                          Requerido
                        </Badge>
                      )}
                    </div>
                    <p className="mb-2 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                </div>

                {/* Status Buttons */}
                <div className="mb-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={item.status === 'PASS' ? 'default' : 'outline'}
                    onClick={() => updateItemStatus(item.id, 'PASS')}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Aprobado
                  </Button>
                  <Button
                    size="sm"
                    variant={item.status === 'FAIL' ? 'default' : 'outline'}
                    onClick={() => updateItemStatus(item.id, 'FAIL')}
                    className="flex items-center gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Reprobado
                  </Button>
                  <Button
                    size="sm"
                    variant={item.status === 'N/A' ? 'default' : 'outline'}
                    onClick={() => updateItemStatus(item.id, 'N/A')}
                    className="flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    N/A
                  </Button>
                </div>

                {/* Score Input */}
                {item.status === 'PASS' && (
                  <div className="mb-3">
                    <Label
                      htmlFor={`score-${item.id}`}
                      className="text-sm font-medium"
                    >
                      Puntuación (0-100)
                    </Label>
                    <Input
                      id={`score-${item.id}`}
                      type="number"
                      min="0"
                      max="100"
                      value={item.score || ''}
                      onChange={e =>
                        updateItemScore(item.id, parseInt(e.target.value) || 0)
                      }
                      className="w-24"
                    />
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label
                    htmlFor={`notes-${item.id}`}
                    className="text-sm font-medium"
                  >
                    Notas
                  </Label>
                  <Textarea
                    id={`notes-${item.id}`}
                    value={item.notes || ''}
                    onChange={e => updateItemNotes(item.id, e.target.value)}
                    placeholder="Agregar notas sobre este elemento..."
                    rows={2}
                  />
                </div>

                {/* Photos */}
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-3 w-3" />
                    Agregar Fotos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de la Inspección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {items.filter(item => item.status === 'PASS').length}
              </div>
              <div className="text-sm text-green-600">Aprobados</div>
            </div>
            <div className="rounded-lg bg-red-50 p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {items.filter(item => item.status === 'FAIL').length}
              </div>
              <div className="text-sm text-red-600">Reprobados</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {items.filter(item => item.status === 'N/A').length}
              </div>
              <div className="text-sm text-gray-600">N/A</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
