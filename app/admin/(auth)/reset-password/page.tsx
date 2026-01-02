'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)


  useEffect(() => {
    
      if (!token) {
        setValidatingToken(false)
        return
      }
      const validateToken = async () => {
      try {
        const response = await api.validateResetToken(token)
        if (response.success) {
          setTokenValid(true)
        } else {
          setError(response.message || 'Invalid or expired reset token.')
        }
      } catch (err) {
        setError('Failed to validate reset token. Please try again.')
      } finally {
        setValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!token) {
      setError('Invalid reset token.')
      return
    }

    setLoading(true)

    try {
      const response = await api.resetPassword(token, password)
      
      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        setError(response.message || 'Failed to reset password. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earl-gray px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue mx-auto mb-4"></div>
            <p className="text-dark-choc">Validating reset token...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-earl-gray px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-dark-choc mb-2">Invalid Reset Link</h1>
            <p className="text-dark-choc/60 mb-6">
              {error || 'This password reset link is invalid or has expired.'}
            </p>
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full bg-electric-blue text-white py-3 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-earl-gray px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-dark-choc mb-2">Reset Password</h1>
          <p className="text-dark-choc/60 mb-8">Enter your new password below</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
              Password reset successfully! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-choc mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-choc/60 hover:text-dark-choc transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-dark-choc/60">Must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-choc mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-choc/40" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-10 py-2 border border-dark-choc/20 rounded-lg focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-choc/60 hover:text-dark-choc transition-colors"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-electric-blue text-white py-3 rounded-lg font-medium hover:bg-electric-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : success ? 'Password Reset!' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/admin/login')}
              className="text-sm text-electric-blue hover:text-electric-blue/80 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

