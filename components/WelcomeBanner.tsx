'use client'

import { useEffect, useState } from 'react'

export default function WelcomeBanner() {
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  if (!user) return null

  return (
    <div className="bg-gradient-to-r from-primary to-blue-600 py-3 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">Welcome back, </span>
            <span className="font-semibold">{user.full_name}</span>
          </div>
          <div className="text-sm opacity-90">{user.email}</div>
        </div>
      </div>
    </div>
  )
}
