'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setIsSubmitted(true)
      setSuccessMessage('Password reset link has been sent to your email!')
      
      // Auto redirect after 5 seconds
      setTimeout(() => {
        router.push('/login')
      }, 5000)

    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float animation-delay-4000"></div>
      </div>

      {/* Stars effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `hsl(${Math.random() * 60 + 300}, 100%, 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
              animation: `pulse ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Bismillah at top */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white/10 backdrop-blur-lg px-6 py-3 rounded-2xl border border-white/20">
            <p className="text-white text-2xl font-arabic animate-glow">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 transform hover:scale-105 transition-all duration-500 box-glow border border-white/20">
          
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">🔐</span>
                </div>
                <h2 className="text-4xl font-bold text-white mb-2 animate-glow">
                  Forgot Password?
                </h2>
                <p className="text-white/80">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                  <p className="text-red-300 text-sm flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                      ✉️
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border-2 border-transparent focus:border-purple-500 focus:outline-none text-white placeholder-white/50 transition-all"
                      placeholder="your@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-white/40 text-sm mt-2">
                    We'll send a reset link to this email
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Send Reset Link
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-8 text-center">
                <Link 
                  href="/login" 
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center group"
                >
                  <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                  Back to Login
                </Link>
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-white/60 text-xs flex items-center">
                  <span className="text-yellow-400 mr-2">🔒</span>
                  For security reasons, reset links expire after 1 hour
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
                <span className="text-5xl">✓</span>
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">
                Check Your Email!
              </h3>
              
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <p className="text-white/90 mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="text-xl font-semibold text-purple-300">
                  {email}
                </p>
              </div>

              <p className="text-white/70 mb-8">
                {successMessage}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-white/60">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Redirecting to login in 5 seconds...</span>
                </div>

                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all"
                >
                  Go to Login Now
                </button>
              </div>

              {/* Didn't receive email */}
              <div className="mt-8 p-4 bg-white/5 rounded-xl">
                <p className="text-white/60 text-sm">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={handleSubmit}
                    className="text-purple-300 hover:text-purple-200 font-semibold"
                  >
                    try again
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Need help? Contact our support at{' '}
            <a href="mailto:support@herbalheaven.com" className="text-purple-300 hover:text-purple-200">
              support@herbalheaven.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}