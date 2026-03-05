'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Animation states
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate email
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate password
    if (!formData.password) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }

      // Store user data in localStorage/session based on rememberMe
      if (formData.rememberMe) {
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        sessionStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()

    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Demo login for testing
  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setFormData({
      email: role === 'admin' ? 'admin@herbalheaven.com' : 'user@herbalheaven.com',
      password: 'password123',
      rememberMe: false
    })
    
    // Auto submit after a brief delay
    setTimeout(() => {
      const form = document.querySelector('form')
      if (form) form.requestSubmit()
    }, 500)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>

      {/* Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${Math.random() * 20 + 5}px currentColor`,
              animation: `pulse ${Math.random() * 4 + 2}s infinite`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Bismillah at Top */}
        <div className="text-center mb-8 transform hover:scale-105 transition-all duration-500">
          <div className="inline-block bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/20 shadow-2xl">
            <p className="text-white text-3xl font-arabic animate-glow">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 transform hover:scale-[1.02] transition-all duration-500 box-glow border border-white/20 shadow-2xl">
          
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4 group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full animate-spin-slow opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-4xl transform group-hover:scale-110 transition-transform">🌿</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent animate-glow">
                Welcome Back
              </span>
            </h2>
            <p className="text-white/80">
              Sign in to continue to Herbal Heaven
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm animate-shake">
              <p className="text-red-300 text-sm flex items-center">
                <span className="mr-2 text-xl">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl group-focus-within:text-green-400 transition-colors">
                  ✉️
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 border-2 border-transparent focus:border-green-500 focus:outline-none text-white placeholder-white/50 transition-all duration-300 group-focus-within:bg-white/30"
                  placeholder="your@email.com"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-focus-within:opacity-20 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-white font-semibold text-sm">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl group-focus-within:text-green-400 transition-colors">
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/20 border-2 border-transparent focus:border-green-500 focus:outline-none text-white placeholder-white/50 transition-all duration-300"
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-focus-within:opacity-20 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center mr-3 ${
                  formData.rememberMe 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500' 
                    : 'border-white/30 group-hover:border-white/50'
                }`}>
                  {formData.rememberMe && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors text-sm">
                  Remember me
                </span>
              </label>

              <Link 
                href="/forgot-password" 
                className="text-white/70 hover:text-white transition-colors text-sm font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              )}
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/50">Demo Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleDemoLogin('user')}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                <span className="block text-sm font-semibold">Demo User</span>
                <span className="text-xs text-white/60">user@demo.com</span>
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white rounded-xl transition-all duration-300 transform hover:scale-105 border border-purple-500/30"
              >
                <span className="block text-sm font-semibold">Demo Admin</span>
                <span className="text-xs text-white/60">admin@demo.com</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-white/70">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-green-400 hover:text-green-300 font-semibold transition-colors hover:underline"
              >
                Sign up now
              </Link>
            </p>
          </div>

          {/* Admin Note */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/60 text-xs text-center">
              <span className="text-yellow-400 mr-1">👑</span>
              Administrator: Hafiz Sajid Syed
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-white/40 text-xs">
            <span className="flex items-center">
              <span className="mr-1">🔒</span> SSL Secure
            </span>
            <span className="flex items-center">
              <span className="mr-1">🛡️</span> Encrypted
            </span>
            <span className="flex items-center">
              <span className="mr-1">✓</span> Verified
            </span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-x-6">
          <Link href="/privacy" className="text-white/40 hover:text-white/60 transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-white/40 hover:text-white/60 transition-colors text-sm">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-white/40 hover:text-white/60 transition-colors text-sm">
            Contact Support
          </Link>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}