'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ModernSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  className?: string
}

const ModernSwitch = React.forwardRef<HTMLButtonElement, ModernSwitchProps>(
  ({ 
    checked, 
    onCheckedChange, 
    disabled = false, 
    size = 'md',
    variant = 'default',
    className,
    ...props 
  }, ref) => {
    const sizeClasses = {
      sm: 'h-5 w-9',
      md: 'h-6 w-11',
      lg: 'h-7 w-12'
    }

    const thumbSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    }

    const variantClasses = {
      default: checked 
        ? 'bg-primary hover:bg-primary/90' 
        : 'bg-muted hover:bg-muted/80',
      success: checked 
        ? 'bg-success hover:bg-success/90' 
        : 'bg-muted hover:bg-muted/80',
      warning: checked 
        ? 'bg-warning hover:bg-warning/90' 
        : 'bg-muted hover:bg-muted/80',
      destructive: checked 
        ? 'bg-destructive hover:bg-destructive/90' 
        : 'bg-muted hover:bg-muted/80'
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        disabled={disabled}
        className={cn(
          'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        onClick={() => onCheckedChange(!checked)}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
            thumbSizeClasses[size],
            checked 
              ? size === 'sm' ? 'translate-x-4' : size === 'md' ? 'translate-x-5' : 'translate-x-5'
              : 'translate-x-0'
          )}
        />
      </button>
    )
  }
)

ModernSwitch.displayName = 'ModernSwitch'

export { ModernSwitch }
