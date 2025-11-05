'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import WelcomeBanner from './WelcomeBanner'
import Footer from './Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    // Admin routes use their own layout, no header/footer
    return <>{children}</>
  }

  return (
    <>
      <WelcomeBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
