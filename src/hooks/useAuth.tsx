'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser } from '@/types/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('[useAuth] Enviando petición de login...');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log(`[useAuth] Respuesta recibida con status: ${response.status}`);

      if (response.ok) {
        console.log('[useAuth] La respuesta fue exitosa (status 200). Parseando JSON...');
        const data = await response.json()
        console.log('[useAuth] JSON parseado. Datos recibidos:', data);

        console.log('[useAuth] Estableciendo usuario en el estado...');
        setUser(data.user)
        console.log('[useAuth] Usuario establecido en el estado.');

        // Redirigir según el rol del usuario
        console.log(`[useAuth] Verificando rol del usuario: ${data.user.role}`);
        if (data.user.role === 'SUPER_ADMIN') {
          console.log('[useAuth] Usuario es SUPER_ADMIN. Redirigiendo a /dashboard/admin...');
          router.push('/dashboard/admin')
          console.log('[useAuth] Redirección a /dashboard/admin ejecutada.');
        } else {
          console.log('[useAuth] Usuario no es SUPER_ADMIN. Redirigiendo a /dashboard...');
          router.push('/dashboard')
          console.log('[useAuth] Redirección a /dashboard ejecutada.');
        }
        return true
      } else {
        console.error('[useAuth] La respuesta de la API no fue exitosa.');
        const error = await response.json()
        console.error('Error de login:', error)
        return false
      }
    } catch (error) {
      console.error('🔥🔥🔥 [useAuth] Error catastrófico en el bloque try/catch:', error);
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      console.error('Error de logout:', error)
    } finally {
      setUser(null)
      router.push('/login')
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
