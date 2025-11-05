'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { useState } from 'react'

interface AdminLogoutButtonProps {
  fullWidth?: boolean
}

export default function AdminLogoutButton({ fullWidth = false }: AdminLogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut()
      router.push('/sign-in')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''}`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      {isLoading ? 'Signing out...' : 'Logout'}
    </button>
  )
}
