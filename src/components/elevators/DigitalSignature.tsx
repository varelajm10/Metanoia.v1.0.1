'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Pen,
  Trash2,
  Save,
  Download,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
} from 'lucide-react'

interface DigitalSignatureProps {
  onSave: (signatureData: SignatureData) => Promise<void>
  onClear: () => void
  title?: string
  description?: string
  signerName?: string
  signerTitle?: string
  required?: boolean
  loading?: boolean
}

interface SignatureData {
  signature: string
  signerName: string
  signerTitle: string
  signedAt: string
  ipAddress?: string
  userAgent?: string
}

export default function DigitalSignature({
  onSave,
  onClear,
  title = 'Firma Digital',
  description = 'Firme en el área de abajo para completar el proceso',
  signerName = '',
  signerTitle = '',
  required = false,
  loading = false,
}: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [signature, setSignature] = useState<string>('')
  const [signerInfo, setSignerInfo] = useState({
    name: signerName,
    title: signerTitle,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    // Set drawing properties
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setHasSignature(true)
    setError(null)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    // Save signature as data URL
    const canvas = canvasRef.current
    if (canvas) {
      setSignature(canvas.toDataURL())
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    setSignature('')
    setError(null)
    onClear()
  }

  const handleSave = async () => {
    if (!hasSignature) {
      setError('Debe firmar antes de guardar')
      return
    }

    if (!signerInfo.name.trim()) {
      setError('El nombre del firmante es requerido')
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const signatureData: SignatureData = {
        signature,
        signerName: signerInfo.name,
        signerTitle: signerInfo.title,
        signedAt: new Date().toISOString(),
        ipAddress: 'N/A', // Would be set by the server
        userAgent: navigator.userAgent,
      }

      await onSave(signatureData)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error al guardar la firma'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const downloadSignature = () => {
    if (!signature) return

    const link = document.createElement('a')
    link.download = `firma-${signerInfo.name}-${new Date().toISOString().split('T')[0]}.png`
    link.href = signature
    link.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
          {required && <span className="ml-1 text-red-600">*</span>}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Signer Information */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="signerName">Nombre del Firmante *</Label>
            <Input
              id="signerName"
              value={signerInfo.name}
              onChange={e =>
                setSignerInfo(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nombre completo"
              className={error && !signerInfo.name ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signerTitle">Cargo/Título</Label>
            <Input
              id="signerTitle"
              value={signerInfo.title}
              onChange={e =>
                setSignerInfo(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Ingeniero, Técnico, etc."
            />
          </div>
        </div>

        {/* Signature Canvas */}
        <div className="space-y-2">
          <Label>Firma Digital</Label>
          <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
            <canvas
              ref={canvasRef}
              className="h-32 w-full cursor-crosshair rounded border border-gray-200 bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            {!hasSignature && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Pen className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">Firme aquí</p>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Use el mouse para firmar en el área de arriba
          </p>
        </div>

        {/* Signature Preview */}
        {hasSignature && (
          <div className="space-y-2">
            <Label>Vista Previa de la Firma</Label>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <img
                src={signature}
                alt="Firma digital"
                className="h-20 max-w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={clearSignature}
              disabled={!hasSignature || isSaving}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
            <Button
              variant="outline"
              onClick={downloadSignature}
              disabled={!hasSignature}
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </div>

          <Button
            onClick={handleSave}
            disabled={
              !hasSignature || !signerInfo.name.trim() || isSaving || loading
            }
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Firma
              </>
            )}
          </Button>
        </div>

        {/* Signature Info */}
        {hasSignature && (
          <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{signerInfo.name}</span>
            </div>
            {signerInfo.title && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>{signerInfo.title}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Legal Notice */}
        <div className="rounded-lg bg-blue-50 p-3 text-xs text-gray-500">
          <p className="mb-1 font-medium">Aviso Legal:</p>
          <p>
            Al firmar digitalmente, usted confirma que la información es
            verdadera y precisa. Esta firma digital tiene la misma validez legal
            que una firma manuscrita.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
