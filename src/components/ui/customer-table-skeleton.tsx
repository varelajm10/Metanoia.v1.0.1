import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function CustomerTableSkeleton() {
  return (
    <Card className="card-enhanced">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Generar 6 filas de skeleton para simular la tabla */}
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar skeleton */}
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    {/* Nombre del cliente */}
                    <Skeleton className="h-5 w-32" />
                    {/* Email */}
                    <Skeleton className="h-4 w-40" />
                    {/* Teléfono */}
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right space-y-1">
                    {/* Estadísticas */}
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  {/* Badge de estado */}
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <div className="flex items-center space-x-2">
                    {/* Botones de acción */}
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>

              {/* Información adicional en grid */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                {/* Email info */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                {/* Teléfono info */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                {/* Ubicación info */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>

                {/* Fecha de registro */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
