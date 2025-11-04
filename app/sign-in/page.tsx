'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabaseClient'

export default function SignInPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const supabase = createClient()

      if (isSignUp) {
        // Sign up validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }

        // Sign up with Supabase
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
            },
          },
        })

        if (signUpError) {
          setError(signUpError.message)
          setIsLoading(false)
          return
        }

        if (authData.user) {
          // Create user profile in public.users
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              full_name: formData.full_name,
              role: 'customer', // Default role
            })

          if (profileError && profileError.code !== '23505') { // Ignore duplicate key errors
            console.error('Profile creation error:', profileError)
          }

          // Wait for session to be established before redirecting
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Redirect to dashboard or redirect URL
          const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
          
          // Use window.location for reliable redirect (especially on mobile)
          window.location.href = redirectTo
        }
      } else {
        // Sign in with Supabase
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) {
          setError('Invalid email or password')
          setIsLoading(false)
          return
        }

        if (authData.user) {
          // Fetch user role from public.users
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, full_name')
            .eq('id', authData.user.id)
            .single()

          if (userError) {
            console.error('Error fetching user role:', userError)
          }

          // Role-based redirect
          const userRole = userData?.role || 'customer'
          const redirectParam = new URLSearchParams(window.location.search).get('redirect')
          
          let redirectTo = '/dashboard'
          
          if (redirectParam) {
            // Use redirect parameter if provided
            redirectTo = redirectParam
          } else if (userRole === 'admin') {
            // Admins go to admin dashboard
            redirectTo = '/admin'
          } else {
            // Customers go to their dashboard
            redirectTo = '/dashboard'
          }

          // Wait for session to be established before redirecting
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Use window.location for reliable redirect (especially on mobile)
          window.location.href = redirectTo
        }
      }
    } catch (err) {
      console.error('Authentication error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="mx-auto max-w-md">
        <div className="rounded-lg border bg-white p-6 md:p-8 shadow-lg">
          <h1 className="mb-2 text-center text-2xl md:text-3xl font-bold">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="mb-6 text-center text-sm text-muted-foreground">
            {isSignUp
              ? 'Create an account to place orders and track them'
              : 'Sign in to continue to checkout'}
          </p>

          {error && (
            <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="input w-full text-base"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input w-full text-base"
                placeholder="your@email.com"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input w-full text-base"
                placeholder="••••••••"
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="input w-full text-base"
                  placeholder="••••••••"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 py-3 text-base"
            >
              {isLoading
                ? 'Processing...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsSignUp(false)
                    setError('')
                  }}
                  className="text-primary hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setIsSignUp(true)
                    setError('')
                  }}
                  className="text-primary hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
