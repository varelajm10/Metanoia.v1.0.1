'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface MaintenanceRecord {
  id: string
  recordNumber: string
  maintenanceType: string
  status: string
  // ... other properties
}

interface MaintenanceFilters {
  search?: string
  status?: string
  maintenanceType?: string
  elevatorId?: string
  page?: number
  limit?: number
}

export function useMaintenanceRecords(filters: MaintenanceFilters = {}) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['maintenance-records', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })

      const response = await fetch(
        `/api/elevators/maintenance/records?${params}`
      )
      if (!response.ok) throw new Error('Error fetching maintenance records')
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: async (data: Partial<MaintenanceRecord>) => {
      const response = await fetch('/api/elevators/maintenance/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Error creating maintenance record')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-records'] })
    },
  })

  return {
    records: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}

export function useMaintenanceStats() {
  return useQuery({
    queryKey: ['maintenance-stats'],
    queryFn: async () => {
      const response = await fetch('/api/elevators/maintenance/stats')
      if (!response.ok) throw new Error('Error fetching maintenance stats')
      return response.json()
    },
    staleTime: 2 * 60 * 1000,
  })
}
