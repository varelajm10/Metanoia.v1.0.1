import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider } from '@/hooks/useAuth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Matias 1.0.1 - Sistema ERP SaaS',
  description: 'Sistema ERP SaaS modular con arquitectura multi-tenant',
  keywords: [
    'ERP',
    'SaaS',
    'multi-tenant',
    'CRM',
    'Inventario',
    'Contabilidad',
  ],
  authors: [{ name: 'Metanoia Team' }],
  creator: 'Metanoia',
  publisher: 'Metanoia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://metanoia.click'),
  openGraph: {
    title: 'Matias 1.0.1 - Sistema ERP SaaS',
    description: 'Sistema ERP SaaS modular con arquitectura multi-tenant',
    url: 'https://metanoia.click',
    siteName: 'Metanoia',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matias 1.0.1 - Sistema ERP SaaS',
    description: 'Sistema ERP SaaS modular con arquitectura multi-tenant',
    creator: '@metanoia',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
