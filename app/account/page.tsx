'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    
    if (!storedUser) {
      router.push('/sign-in?redirect=/dashboard')
    } else {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      <p className="mt-4 text-muted-foreground">Redirecting...</p>
    </div>
  )
}
