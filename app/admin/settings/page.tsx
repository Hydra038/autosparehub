'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (updateError) throw updateError

      setMessage('Password updated successfully!')
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      // Optional: Redirect after success
      setTimeout(() => {
        router.push('/admin')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your admin account settings
        </p>
      </div>

      {/* Change Password Section */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Update your admin account password. Make sure to use a strong password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your current password"
              disabled={isLoading}
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter new password (min. 8 characters)"
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Re-enter new password"
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>

          {/* Password Requirements */}
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mix of letters, numbers, and special characters recommended
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Avoid common or easily guessable passwords
              </li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm text-green-800">{message}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Additional Settings (Future) */}
      <div className="mt-6 rounded-lg border bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-medium">Administrator</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Type:</span>
            <span className="font-medium">Admin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
