'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeTerms: false,
    newsletter: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Animation states
  useEffect(() => {
    setMounted(true)
  }, [])

  // Validation functions
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    return phone === '' || re.test(phone)
  }

  const checkPasswordStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 8) strength++
    if (/[A-Z]/.test(pass)) strength++
    if (/[a-z]/.test(pass)) strength++
    if (/[0-9]/.test(pass)) strength++
    if (/[^A-Za-z0-9]/.test(pass)) strength++
    setPasswordStrength(strength)
  }

  const getStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-gray-500'
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-500'
      case 4: return 'bg-green-500'
      case 5: return 'bg-emerald-500'
      default: return 'bg-gray-500'
    }
  }

  const getStrengthText = () => {
    switch(passwordStrength) {
      case 0: return 'Very Weak'
      case 1: return 'Weak'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Strong'
      case 5: return 'Very Strong'
      default: return 'Enter password'
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Password strength check
    if (name === 'password') {
      checkPasswordStrength(value)
    }

    // Clear error when user types
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name.trim()) {
      setError('Full name is required')
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (passwordStrength < 3) {
      setError('Please choose a stronger password')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Please enter a valid phone number')
      return
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the Terms and Conditions')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          newsletter: formData.newsletter
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess(true)
      
      // Store email for verification page if needed
      sessionStorage.setItem('registeredEmail', formData.email)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-3000"></div>
        
        {/* Herbal Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/leaf-pattern.png')] bg-repeat opacity-5"></div>
      </div>

      {/* Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `hsl(${Math.random() * 60 + 280}, 100%, 70%)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${Math.random() * 20 + 5}px currentColor`,
              animation: `pulse ${Math.random() * 4 + 2}s infinite`,
              opacity: Math.random() * 0.6 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-10">
        
        {/* Bismillah at Top */}
        <div className="text-center mb-8 transform hover:scale-105 transition-all duration-500">
          <div className="inline-block bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/20 shadow-2xl">
            <p className="text-white text-3xl font-arabic animate-glow">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Main Register Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 transform hover:scale-[1.02] transition-all duration-500 box-glow border border-white/20 shadow-2xl">
          
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="relative w-28 h-28 mx-auto mb-4 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full animate-spin-slow opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-5xl transform group-hover:scale-110 transition-transform">🌱</span>
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-glow">
                    Join Herbal Heaven
                  </span>
                </h2>
                <p className="text-white/80">
                  Create your account and start your natural wellness journey
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-white font-semibold text-sm">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl group-focus-within:text-purple-400 transition-colors">
                      👤
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 border-2 border-transparent focus:border-purple-500 focus:outline-none text-white placeholder-white/50 transition-all duration-300"
                      placeholder="John Doe"
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-white font-semibold text-sm">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl group-focus-within:text-purple-400 transition-colors">
                      ✉️
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 border-2 border-transparent focus:border-purple-500 focus:outline-none text-white placeholder-white/50 transition-all duration-300"
                      placeholder="your@email.com"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Phone (Optional) */}
                <div className="space-y-2">
                  <label className="block text-white font-semibold text-sm">
                    Phone Number <span className="text-white/40">(Optional)</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl group-focus-within:text-purple-400 transition-colors">
                      📞
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/20 border-2 border-transparent focus:border-purple-500 focus:outline-none text-white placeholder-white/50 transition-all duration-300"
                      placeholder="+1 (555) 123-4567"
                      disabled={isLoading}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-white font-semibold text-sm">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl group-focus-within:text-purple-400 transition-colors">
                      🔒
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/20 border-2 border-transparent focus:border-purple-500 focus:outline-none text-white placeholder-white/50 transition-all duration-300"
                      placeholder="••••••••"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex space-x-1 flex-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                i < passwordStrength ? getStrengthColor() : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-white/60 text-xs ml-2">
                          {getStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-white font-semibold text-sm">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 text-xl group-focus-within:text-purple-400 transition-colors">
                      🔒
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-4 rounded-xl bg-white/20 border-2 focus:outline-none text-white placeholder-white/50 transition-all duration-300 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-500'
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-green-500'
                          : 'border-transparent focus:border-purple-500'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-green-400 text-sm mt-1 flex items-center">
                      <span className="mr-1">✓</span> Passwords match
                    </p>
                  )}
                </div>

                {/* Terms and Newsletter */}
                <div className="space-y-4 pt-4">
                  {/* Terms Agreement */}
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`flex-shrink-0 w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center mt-0.5 ${
                      formData.agreeTerms 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500' 
                        : 'border-white/30 group-hover:border-white/50'
                    }`}>
                      {formData.agreeTerms && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="ml-3 text-white/80 group-hover:text-white transition-colors text-sm">
                      I agree to the{' '}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300 font-semibold">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300 font-semibold">
                        Privacy Policy
                      </Link>
                      <span className="text-red-400 ml-1">*</span>
                    </span>
                  </label>

                  {/* Newsletter Subscription */}
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`flex-shrink-0 w-5 h-5 border-2 rounded-md transition-all duration-300 flex items-center justify-center ${
                      formData.newsletter 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500' 
                        : 'border-white/30 group-hover:border-white/50'
                    }`}>
                      {formData.newsletter && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="ml-3 text-white/80 group-hover:text-white transition-colors text-sm">
                      Subscribe to our newsletter for exclusive offers and health tips
                    </span>
                  </label>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Create Account
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  )}
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-white/70">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-25"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full flex items-center justify-center">
                  <span className="text-6xl animate-bounce">✓</span>
                </div>
              </div>
              
              <h3 className="text-4xl font-bold text-white mb-4 animate-glow">
                Registration Successful!
              </h3>
              
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <p className="text-white/90 mb-4 text-lg">
                  Welcome to Herbal Heaven, <span className="font-bold text-purple-300">{formData.name}</span>!
                </p>
                <p className="text-white/80">
                  We've sent a verification email to:
                </p>
                <p className="text-xl font-semibold text-purple-300 mt-2">
                  {formData.email}
                </p>
              </div>

              <p className="text-white/70 mb-8">
                Please check your email to verify your account. You'll be redirected to login in 3 seconds.
              </p>

              <div className="flex items-center justify-center space-x-2 text-white/60 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Redirecting to login...</span>
              </div>

              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all transform hover:scale-105"
              >
                Go to Login Now
              </button>

              {/* Next Steps */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <span className="text-3xl block mb-2">📧</span>
                  <h4 className="text-white font-semibold">Verify Email</h4>
                  <p className="text-white/40 text-sm">Click the link in your email</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <span className="text-3xl block mb-2">👤</span>
                  <h4 className="text-white font-semibold">Complete Profile</h4>
                  <p className="text-white/40 text-sm">Add your preferences</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <span className="text-3xl block mb-2">🌿</span>
                  <h4 className="text-white font-semibold">Start Shopping</h4>
                  <p className="text-white/40 text-sm">Explore our products</p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Note */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/60 text-xs text-center">
              <span className="text-yellow-400 mr-1">👑</span>
              Administrator: Hafiz Sajid Syed | Email: sajid.syed@gmail.com
            </p>
          </div>

          {/* Security Badges */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-white/40 text-xs">
            <span className="flex items-center">
              <span className="mr-1">🔒</span> 256-bit SSL
            </span>
            <span className="flex items-center">
              <span className="mr-1">🛡️</span> GDPR Compliant
            </span>
            <span className="flex items-center">
              <span className="mr-1">✓</span> Verified Secure
            </span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-x-6">
          <Link href="/about" className="text-white/40 hover:text-white/60 transition-colors text-sm">
            About Us
          </Link>
          <Link href="/contact" className="text-white/40 hover:text-white/60 transition-colors text-sm">
            Contact
          </Link>
          <Link href="/faq" className="text-white/40 hover:text-white/60 transition-colors text-sm">
            FAQ
          </Link>
        </div>
      </div>

      {/* Custom Animations CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes glow {
          from { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #a855f7; }
          to { text-shadow: 0 0 20px #fff, 0 0 30px #ec4899, 0 0 40px #a855f7; }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}