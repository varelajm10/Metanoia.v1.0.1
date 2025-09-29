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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }[]
}

interface ElevatorChartsProps {
  data: {
    elevatorStats: any
    maintenanceStats: any
    inspectionStats: any
    technicianStats: any
    financialStats: any
  }
  onRefresh: () => void
  loading?: boolean
}

export default function ElevatorCharts({
  data,
  onRefresh,
  loading = false,
}: ElevatorChartsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [chartType, setChartType] = useState('bar')

  // Elevator Status Chart
  const elevatorStatusData: ChartData = {
    labels: [
      'Operativos',
      'En Mantenimiento',
      'Fuera de Servicio',
      'En Inspección',
    ],
    datasets: [
      {
        label: 'Ascensores por Estado',
        data: [
          data.elevatorStats.operational || 0,
          data.elevatorStats.underMaintenance || 0,
          data.elevatorStats.outOfService || 0,
          data.elevatorStats.underInspection || 0,
        ],
        backgroundColor: [
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#3B82F6', // Blue
        ],
        borderColor: ['#059669', '#D97706', '#DC2626', '#2563EB'],
        borderWidth: 2,
      },
    ],
  }

  // Maintenance Types Chart
  const maintenanceTypesData: ChartData = {
    labels: ['Preventivo', 'Correctivo', 'Emergencia', 'Inspección'],
    datasets: [
      {
        label: 'Tipos de Mantenimiento',
        data: [
          data.maintenanceStats.preventive || 0,
          data.maintenanceStats.corrective || 0,
          data.maintenanceStats.emergency || 0,
          data.maintenanceStats.inspection || 0,
        ],
        backgroundColor: [
          '#3B82F6', // Blue
          '#8B5CF6', // Purple
          '#EF4444', // Red
          '#10B981', // Green
        ],
      },
    ],
  }

  // Monthly Trends Chart
  const monthlyTrendsData: ChartData = {
    labels: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ],
    datasets: [
      {
        label: 'Mantenimientos',
        data: [12, 15, 18, 14, 16, 20, 22, 19, 17, 21, 18, 16],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
      },
      {
        label: 'Inspecciones',
        data: [8, 10, 12, 9, 11, 14, 16, 13, 12, 15, 13, 11],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
      },
    ],
  }

  // Technician Performance Chart
  const technicianPerformanceData: ChartData = {
    labels: ['Carlos M.', 'María G.', 'Luis R.', 'Pedro M.', 'Ana L.'],
    datasets: [
      {
        label: 'Órdenes Completadas',
        data: [45, 38, 42, 25, 30],
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
        ],
      },
    ],
  }

  // Financial Trends Chart
  const financialTrendsData: ChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ingresos (Miles)',
        data: [120, 135, 148, 142, 156, 168],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
      },
      {
        label: 'Costos (Miles)',
        data: [80, 85, 92, 88, 95, 102],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
      },
    ],
  }

  const renderBarChart = (chartData: ChartData, title: string) => (
    <div className="space-y-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="flex h-64 items-end justify-between space-x-2">
        {chartData.labels.map((label, index) => {
          const value = chartData.datasets[0].data[index]
          const maxValue = Math.max(...chartData.datasets[0].data)
          const height = (value / maxValue) * 200
          const color =
            chartData.datasets[0].backgroundColor?.[index] || '#3B82F6'

          return (
            <div
              key={index}
              className="flex flex-1 flex-col items-center space-y-2"
            >
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${height}px`,
                  backgroundColor: color,
                }}
              ></div>
              <div className="text-center text-xs">
                <div className="font-medium">{value}</div>
                <div className="truncate text-gray-500">{label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderPieChart = (chartData: ChartData, title: string) => {
    const total = chartData.datasets[0].data.reduce(
      (sum, value) => sum + value,
      0
    )

    return (
      <div className="space-y-4">
        <h4 className="font-semibold">{title}</h4>
        <div className="flex items-center justify-center">
          <div className="relative h-48 w-48">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {chartData.labels.map((label, index) => {
                const value = chartData.datasets[0].data[index]
                const percentage = (value / total) * 100
                const startAngle =
                  index === 0
                    ? 0
                    : chartData.labels
                        .slice(0, index)
                        .reduce(
                          (sum, _, i) =>
                            sum + (chartData.datasets[0].data[i] / total) * 360,
                          0
                        )
                const endAngle = startAngle + (percentage / 100) * 360

                const radius = 40
                const centerX = 50
                const centerY = 50

                const startAngleRad = (startAngle - 90) * (Math.PI / 180)
                const endAngleRad = (endAngle - 90) * (Math.PI / 180)

                const x1 = centerX + radius * Math.cos(startAngleRad)
                const y1 = centerY + radius * Math.sin(startAngleRad)
                const x2 = centerX + radius * Math.cos(endAngleRad)
                const y2 = centerY + radius * Math.sin(endAngleRad)

                const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z',
                ].join(' ')

                const color =
                  chartData.datasets[0].backgroundColor?.[index] || '#3B82F6'

                return (
                  <path
                    key={index}
                    d={pathData}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-opacity hover:opacity-80"
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {chartData.labels.map((label, index) => {
            const value = chartData.datasets[0].data[index]
            const percentage = ((value / total) * 100).toFixed(1)
            const color =
              chartData.datasets[0].backgroundColor?.[index] || '#3B82F6'

            return (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{label}</span>
                </div>
                <div className="text-gray-600">
                  {value} ({percentage}%)
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderLineChart = (chartData: ChartData, title: string) => (
    <div className="space-y-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="relative h-64">
        <svg viewBox="0 0 400 200" className="h-full w-full">
          {chartData.datasets.map((dataset, datasetIndex) => {
            const points = dataset.data
              .map((value, index) => {
                const x = (index / (dataset.data.length - 1)) * 380 + 10
                const y = 190 - (value / Math.max(...dataset.data)) * 160
                return `${x},${y}`
              })
              .join(' ')

            return (
              <g key={datasetIndex}>
                <polyline
                  fill="none"
                  stroke={dataset.borderColor}
                  strokeWidth="3"
                  points={points}
                  className="hover:stroke-opacity-80"
                />
                {dataset.data.map((value, index) => {
                  const x = (index / (dataset.data.length - 1)) * 380 + 10
                  const y = 190 - (value / Math.max(...dataset.data)) * 160

                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={dataset.borderColor}
                      className="hover:r-6 transition-all"
                    />
                  )
                })}
              </g>
            )
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-xs text-gray-500">
          {[0, 25, 50, 75, 100].map(value => (
            <div key={value} className="text-right">
              {Math.max(...chartData.datasets.flatMap(d => d.data)) *
                (value / 100)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

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
                <BarChart3 className="h-5 w-5" />
                Gráficos y Visualizaciones
              </CardTitle>
              <CardDescription>
                Análisis visual de datos del módulo de ascensores
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 días</SelectItem>
                  <SelectItem value="30d">30 días</SelectItem>
                  <SelectItem value="90d">90 días</SelectItem>
                  <SelectItem value="1y">1 año</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={onRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                {renderPieChart(elevatorStatusData, 'Estado de Ascensores')}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                {renderBarChart(
                  technicianPerformanceData,
                  'Rendimiento de Técnicos'
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                {renderPieChart(maintenanceTypesData, 'Tipos de Mantenimiento')}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                {renderLineChart(monthlyTrendsData, 'Tendencias Mensuales')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                {renderLineChart(monthlyTrendsData, 'Actividad Mensual')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                {renderLineChart(financialTrendsData, 'Tendencias Financieras')}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Exportar Gráficos</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                PNG
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
