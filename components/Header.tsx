'use client'

import Link from 'next/link'
import { useState } from 'react'
import CartIcon from './CartIcon'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between gap-2 py-3 md:py-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary text-white">
              <svg
                className="h-5 w-5 md:h-6 md:w-6"
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
            <span className="text-lg md:text-xl font-bold">Autospare Hub</span>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/account" className="p-2 hover:text-primary">
              <svg
                className="h-5 w-5 md:h-6 md:w-6"
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 border-t py-3 text-sm">
          <Link href="/products" className="font-medium hover:text-primary whitespace-nowrap">
            All Parts
          </Link>
          <Link href="/products?category=engine-parts" className="hover:text-primary whitespace-nowrap">
            Engine Parts
          </Link>
          <Link href="/products?category=brakes" className="hover:text-primary whitespace-nowrap">
            Brakes
          </Link>
          <Link href="/products?category=suspension" className="hover:text-primary whitespace-nowrap">
            Suspension
          </Link>
          <Link href="/products?category=electrical" className="hover:text-primary whitespace-nowrap">
            Electrical
          </Link>
          <Link href="/products?category=body-parts" className="hover:text-primary whitespace-nowrap">
            Body Parts
          </Link>
          <Link href="/categories" className="hover:text-primary whitespace-nowrap">
            More Categories
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-2">
            <Link
              href="/products"
              className="block px-4 py-3 font-medium hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Parts
            </Link>
            <Link
              href="/products?category=engine-parts"
              className="block px-4 py-3 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Engine Parts
            </Link>
            <Link
              href="/products?category=brakes"
              className="block px-4 py-3 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Brakes
            </Link>
            <Link
              href="/products?category=suspension"
              className="block px-4 py-3 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Suspension
            </Link>
            <Link
              href="/products?category=electrical"
              className="block px-4 py-3 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Electrical
            </Link>
            <Link
              href="/products?category=body-parts"
              className="block px-4 py-3 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Body Parts
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-3 hover:bg-gray-50 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              More Categories
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
