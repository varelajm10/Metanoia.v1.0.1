'use client'

import { ReactNode } from 'react'

interface ModuleGridProps {
  children: ReactNode
}

export function ModuleGrid({ children }: ModuleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  )
}
