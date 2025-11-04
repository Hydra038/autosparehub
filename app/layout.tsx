import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WelcomeBanner from '@/components/WelcomeBanner'

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
          <WelcomeBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
