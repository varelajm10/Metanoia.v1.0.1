'use client'

import { useState, useRef } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Camera,
  Upload,
  X,
  Eye,
  Download,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Plus,
} from 'lucide-react'

interface Photo {
  id: string
  file: File
  preview: string
  title: string
  description: string
  category: string
  uploadedAt: string
  size: number
}

interface PhotoUploadProps {
  onUpload: (photos: Photo[]) => Promise<void>
  onRemove: (photoId: string) => void
  photos: Photo[]
  maxPhotos?: number
  maxSize?: number // in MB
  allowedTypes?: string[]
  categories?: string[]
  loading?: boolean
}

export default function PhotoUpload({
  onUpload,
  onRemove,
  photos,
  maxPhotos = 10,
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  categories = ['General', 'Antes', 'Después', 'Problema', 'Solución'],
  loading = false,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
      )
    }

    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(
        `El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`
      )
    }

    return true
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return

    try {
      setIsUploading(true)
      setError(null)

      const newPhotos: Photo[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (photos.length + newPhotos.length >= maxPhotos) {
          throw new Error(`Máximo ${maxPhotos} fotos permitidas`)
        }

        validateFile(file)

        const photo: Photo = {
          id: `photo-${Date.now()}-${i}`,
          file,
          preview: URL.createObjectURL(file),
          title: file.name.split('.')[0],
          description: '',
          category: categories[0],
          uploadedAt: new Date().toISOString(),
          size: file.size,
        }

        newPhotos.push(photo)
      }

      await onUpload(newPhotos)
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Error al cargar las fotos'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const updatePhoto = (photoId: string, updates: Partial<Photo>) => {
    // This would typically update the photo in the parent component
  }

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement('a')
    link.href = photo.preview
    link.download = photo.title
    link.click()
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      General: 'bg-gray-100 text-gray-800',
      Antes: 'bg-blue-100 text-blue-800',
      Después: 'bg-green-100 text-green-800',
      Problema: 'bg-red-100 text-red-800',
      Solución: 'bg-purple-100 text-purple-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Carga de Fotos
          </CardTitle>
          <CardDescription>
            Sube fotos relacionadas con el ascensor, mantenimiento o inspección
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div
            className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Upload className="h-6 w-6 text-gray-600" />
              </div>

              <div>
                <p className="text-lg font-medium">
                  {dragActive
                    ? 'Suelta las fotos aquí'
                    : 'Arrastra fotos aquí o haz clic para seleccionar'}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Máximo {maxPhotos} fotos, {maxSize}MB por foto
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Tipos permitidos:{' '}
                  {allowedTypes
                    .map(type => type.split('/')[1].toUpperCase())
                    .join(', ')}
                </p>
              </div>

              <Button
                onClick={openFileDialog}
                disabled={isUploading || loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isUploading ? 'Subiendo...' : 'Seleccionar Fotos'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photos Grid */}
      {photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Fotos Cargadas ({photos.length}/{maxPhotos})
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {photos.map(photo => (
                <div key={photo.id} className="space-y-3 rounded-lg border p-4">
                  {/* Photo Preview */}
                  <div className="relative">
                    <img
                      src={photo.preview}
                      alt={photo.title}
                      className="h-32 w-full cursor-pointer rounded-lg object-cover"
                      onClick={() => setSelectedPhoto(photo)}
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute right-2 top-2"
                      onClick={() => onRemove(photo.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Photo Info */}
                  <div className="space-y-2">
                    <div>
                      <Label
                        htmlFor={`title-${photo.id}`}
                        className="text-xs font-medium"
                      >
                        Título
                      </Label>
                      <Input
                        id={`title-${photo.id}`}
                        value={photo.title}
                        onChange={e =>
                          updatePhoto(photo.id, { title: e.target.value })
                        }
                        className="text-sm"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`category-${photo.id}`}
                        className="text-xs font-medium"
                      >
                        Categoría
                      </Label>
                      <select
                        id={`category-${photo.id}`}
                        value={photo.category}
                        onChange={e =>
                          updatePhoto(photo.id, { category: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label
                        htmlFor={`description-${photo.id}`}
                        className="text-xs font-medium"
                      >
                        Descripción
                      </Label>
                      <Textarea
                        id={`description-${photo.id}`}
                        value={photo.description}
                        onChange={e =>
                          updatePhoto(photo.id, { description: e.target.value })
                        }
                        rows={2}
                        className="text-sm"
                        placeholder="Descripción de la foto..."
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(photo.size)}</span>
                      <span>
                        {new Date(photo.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(photo.category)}>
                        {photo.category}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPhoto(photo)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] max-w-4xl overflow-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedPhoto.title}</h3>
              <Button variant="outline" onClick={() => setSelectedPhoto(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <img
              src={selectedPhoto.preview}
              alt={selectedPhoto.title}
              className="h-auto w-full rounded-lg"
            />

            <div className="mt-4 space-y-2">
              <p>
                <strong>Categoría:</strong> {selectedPhoto.category}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedPhoto.description}
              </p>
              <p>
                <strong>Tamaño:</strong> {formatFileSize(selectedPhoto.size)}
              </p>
              <p>
                <strong>Subida:</strong>{' '}
                {new Date(selectedPhoto.uploadedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
