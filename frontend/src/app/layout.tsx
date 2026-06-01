import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'

export const metadata: Metadata = {
  title: 'Margadarshak AI',
  description: 'Next-generation AI-powered traffic management platform for smart cities. Real-time monitoring, predictive analytics, and intelligent emergency response coordination.',
  keywords: ['AI', 'traffic', 'digital twin', 'smart city', 'urban mobility', 'predictive analytics'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white antialiased">
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  )
}
