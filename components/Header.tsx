'use client'

import Link from 'next/link'
import CartIcon from './CartIcon'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold">Autospare Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/account" className="hover:text-primary">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            <CartIcon />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 border-t py-3 text-sm">
          <Link href="/products" className="font-medium hover:text-primary">
            All Parts
          </Link>
          <Link href="/products?category=engine-parts" className="hover:text-primary">
            Engine Parts
          </Link>
          <Link href="/products?category=brakes" className="hover:text-primary">
            Brakes
          </Link>
          <Link href="/products?category=suspension" className="hover:text-primary">
            Suspension
          </Link>
          <Link href="/products?category=electrical" className="hover:text-primary">
            Electrical
          </Link>
          <Link href="/products?category=body-parts" className="hover:text-primary">
            Body Parts
          </Link>
          <Link href="/categories" className="hover:text-primary">
            More Categories
          </Link>
        </nav>
      </div>
    </header>
  )
}
