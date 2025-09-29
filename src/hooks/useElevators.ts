'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Elevator {
  id: string
  serialNumber: string
  model: string
  brand: string
  status: string
  // ... other properties
}

interface ElevatorFilters {
  search?: string
  status?: string
  brand?: string
  page?: number
  limit?: number
}

export function useElevators(filters: ElevatorFilters = {}) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['elevators', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })

      const response = await fetch(`/api/elevators?${params}`)
      if (!response.ok) throw new Error('Error fetching elevators')
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Elevator>) => {
      const response = await fetch('/api/elevators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Error creating elevator')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elevators'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<Elevator>
    }) => {
      const response = await fetch(`/api/elevators/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Error updating elevator')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elevators'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/elevators/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Error deleting elevator')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['elevators'] })
    },
  })

  return {
    elevators: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export function useElevatorStats() {
  return useQuery({
    queryKey: ['elevator-stats'],
    queryFn: async () => {
      const response = await fetch('/api/elevators/stats')
      if (!response.ok) throw new Error('Error fetching stats')
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
