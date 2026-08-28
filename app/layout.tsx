import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OrganEase | Transplant coordination, simplified',
  description: 'A clinical coordination portal for discovering compatible organs and moving urgent transfers forward.',
  generator: 'OrganEase',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f7fa',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
