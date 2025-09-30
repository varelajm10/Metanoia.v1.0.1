import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autenticación - Metanoia',
  description: 'Inicia sesión o regístrate en Metanoia',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
