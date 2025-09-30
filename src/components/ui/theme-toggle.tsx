'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from './button'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="h-9 w-9">
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4 transition-all duration-200" />
      case 'dark':
        return <Moon className="h-4 w-4 transition-all duration-200" />
      default:
        return <Monitor className="h-4 w-4 transition-all duration-200" />
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 transition-all duration-200 hover:bg-accent/50 hover:scale-110"
      onClick={cycleTheme}
      title={`Tema actual: ${theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Oscuro'}`}
    >
      {getIcon()}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
