'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoginPage = pathname === '/login'
  const isRegisterPage = pathname === '/register'
  const isForgotPasswordPage = pathname === '/forgot-password'
  const isResetPasswordPage = pathname === '/reset-password'

  const getCurrentStep = () => {
    if (isLoginPage) return 1
    if (isRegisterPage) return 2
    if (isForgotPasswordPage) return 3
    if (isResetPasswordPage) return 4
    return 0
  }

  const currentStep = getCurrentStep()

  const steps = [
    { number: 1, name: 'Login', path: '/login', icon: '🔑' },
    { number: 2, name: 'Register', path: '/register', icon: '📝' },
    { number: 3, name: 'Forgot Password', path: '/forgot-password', icon: '❓' },
    { number: 4, name: 'Reset Password', path: '/reset-password', icon: '🔄' },
  ]

  if (!mounted) return null

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-900/90 to-teal-900/90"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 blur-3xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl group-hover:scale-110 transition-transform">🌿</span>
                  </div>
                </div>
                <span className="text-white font-bold text-xl hidden sm:block">
                  Herbal Heaven
                </span>
              </Link>

              {/* Right Side Links */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Shop
                </Link>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Progress Steps (shown only on auth pages) */}
        {currentStep > 0 && (
          <div className="max-w-3xl mx-auto px-4 mt-8">
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute top-5 left-0 w-full h-1 bg-white/20 rounded-full"></div>
              
              {/* Active Progress */}
              <div
                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const stepNumber = index + 1
                  const isActive = stepNumber <= currentStep
                  const isCurrent = stepNumber === currentStep

                  return (
                    <div key={step.path} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                            : 'bg-white/20 text-white/60'
                        } ${isCurrent ? 'scale-110 ring-4 ring-white/30' : ''}`}
                      >
                        {isActive ? step.icon : step.number}
                      </div>
                      <span
                        className={`mt-2 text-sm font-medium ${
                          isActive ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="py-8">
          {children}
        </main>

        {/* Footer for Auth Pages */}
        <footer className="mt-auto py-6">
          <div className="max-w-7xl mx-auto px-4">
            {/* Bismillah in Footer */}
            <div className="text-center mb-4">
              <p className="text-white/40 text-sm font-arabic">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/about" className="text-white/40 hover:text-white/60 transition-colors">
                About Us
              </Link>
              <Link href="/privacy" className="text-white/40 hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/40 hover:text-white/60 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-white/40 hover:text-white/60 transition-colors">
                Contact Support
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center mt-4">
              <p className="text-white/30 text-xs">
                © {new Date().getFullYear()} Herbal Heaven. All rights reserved.
              </p>
              <p className="text-white/20 text-xs mt-1">
                Administered by Hafiz Sajid Syed
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}