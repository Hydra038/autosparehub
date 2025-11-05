import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Autospare Hub - Quality Car Parts for All Makes and Models',
  description: 'Shop quality car spare parts, accessories, and components for all vehicle makes and models. Fast delivery across the UK.',
  keywords: 'car parts, spare parts, auto parts, vehicle parts, car accessories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <ConditionalLayout>{children}</ConditionalLayout>
        </div>
      </body>
    </html>
  )
}
