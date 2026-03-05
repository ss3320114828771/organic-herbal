'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  company: {
    name: string
    website: string
    phone: string
    taxId: string
  }
  accountType: 'individual' | 'business' | 'enterprise'
  preferences: {
    marketingEmails: boolean
    newsletter: boolean
    termsAccepted: boolean
    privacyPolicyAccepted: boolean
    twoFactorEnabled: boolean
  }
  security: {
    securityQuestion: string
    securityAnswer: string
    recoveryEmail: string
    recoveryPhone: string
  }
  captchaToken?: string
}

interface RegisterFormProps {
  onSubmit?: (data: RegisterFormData) => Promise<void>
  userType?: 'customer' | 'vendor' | 'affiliate' | 'admin'
  redirectUrl?: string
}

export default function RegisterForm({ 
  onSubmit,
  userType = 'customer',
  redirectUrl = '/dashboard'
}: RegisterFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    company: {
      name: '',
      website: '',
      phone: '',
      taxId: ''
    },
    accountType: 'individual',
    preferences: {
      marketingEmails: false,
      newsletter: true,
      termsAccepted: false,
      privacyPolicyAccepted: false,
      twoFactorEnabled: false
    },
    security: {
      securityQuestion: '',
      securityAnswer: '',
      recoveryEmail: '',
      recoveryPhone: ''
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [resendDisabled, setResendDisabled] = useState(false)

  // Mock data
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'UAE',
    'Saudi Arabia',
    'Pakistan',
    'India',
    'Singapore',
    'Malaysia',
    'Indonesia'
  ]

  const securityQuestions = [
    'What was your first pet\'s name?',
    'What was your mother\'s maiden name?',
    'What city were you born in?',
    'What was your first car?',
    'What elementary school did you attend?',
    'What is your favorite book?',
    'What is your favorite movie?',
    'What is your favorite food?'
  ]

  const accountTypes = [
    { value: 'individual', label: 'Individual', description: 'Personal account for individual users' },
    { value: 'business', label: 'Business', description: 'Company or organization account' },
    { value: 'enterprise', label: 'Enterprise', description: 'Large organization with multiple users' }
  ]

  const userTypes = {
    customer: 'Customer',
    vendor: 'Vendor/Seller',
    affiliate: 'Affiliate Partner',
    admin: 'Administrator'
  }

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      const feedback: string[] = []
      let strength = 0

      // Length check
      if (formData.password.length >= 8) {
        strength += 25
      } else {
        feedback.push('At least 8 characters')
      }

      // Uppercase check
      if (/[A-Z]/.test(formData.password)) {
        strength += 25
      } else {
        feedback.push('At least one uppercase letter')
      }

      // Lowercase check
      if (/[a-z]/.test(formData.password)) {
        strength += 25
      } else {
        feedback.push('At least one lowercase letter')
      }

      // Number check
      if (/[0-9]/.test(formData.password)) {
        strength += 15
      } else {
        feedback.push('At least one number')
      }

      // Special character check
      if (/[^A-Za-z0-9]/.test(formData.password)) {
        strength += 10
      } else {
        feedback.push('At least one special character')
      }

      setPasswordStrength(strength)
      setPasswordFeedback(feedback)
    } else {
      setPasswordStrength(0)
      setPasswordFeedback([])
    }
  }, [formData.password])

  // Resend cooldown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setResendDisabled(false)
    }
  }, [countdown])

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Account Information
        if (!formData.email) {
          newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
          newErrors.password = 'Password is required'
        } else if (passwordStrength < 50) {
          newErrors.password = 'Password is too weak'
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
        break

      case 2: // Personal Information
        if (!formData.firstName) newErrors.firstName = 'First name is required'
        if (!formData.lastName) newErrors.lastName = 'Last name is required'
        
        if (formData.phone && !/^[\d\s-+()]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Phone number is invalid'
        }
        break

      case 3: // Address & Preferences
        if (formData.address.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.address.zipCode)) {
          newErrors['address.zipCode'] = 'ZIP code is invalid'
        }
        break

      case 4: // Terms & Security
        if (!formData.preferences.termsAccepted) {
          newErrors.terms = 'You must accept the Terms and Conditions'
        }
        if (!formData.preferences.privacyPolicyAccepted) {
          newErrors.privacy = 'You must accept the Privacy Policy'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(4)) {
      setCurrentStep(4)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Registration data:', formData)
      
      // Show success message or redirect
      router.push(redirectUrl)
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleResendVerification = async () => {
    setResendDisabled(true)
    setCountdown(60)
    
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Verification email resent')
    } catch (error) {
      console.error('Error resending verification:', error)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return 'Weak'
    if (passwordStrength < 75) return 'Medium'
    return 'Strong'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create Account
            </h1>
          </Link>
          <p className="mt-2 text-gray-600">
            Join as {userTypes[userType as keyof typeof userTypes] || 'a member'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 ${
                  currentStep >= step 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step ? '✓' : step}
                </div>
                <span className="text-xs text-gray-500">
                  {step === 1 && 'Account'}
                  {step === 2 && 'Personal'}
                  {step === 3 && 'Details'}
                  {step === 4 && 'Review'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
            <div 
              className="absolute top-0 left-0 h-1 bg-green-600 transition-all duration-300"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            
            {/* Error Summary */}
            {errors.submit && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-200' 
                        : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                        errors.password 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      {passwordFeedback.length > 0 && (
                        <ul className="text-xs text-gray-500 list-disc list-inside">
                          {passwordFeedback.map((feedback, index) => (
                            <li key={index}>{feedback}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 pr-12 ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Account Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Account Type *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {accountTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.accountType === type.value
                            ? 'border-green-600 bg-green-50 ring-2 ring-green-600 ring-opacity-20'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="accountType"
                          value={type.value}
                          checked={formData.accountType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <p className="font-medium text-gray-800">{type.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.firstName 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.lastName 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                      }`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.phone 
                          ? 'border-red-300 focus:ring-red-200' 
                          : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Company Information (for business/enterprise accounts) */}
                {(formData.accountType === 'business' || formData.accountType === 'enterprise') && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="company.name" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company.name"
                          name="company.name"
                          value={formData.company.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="Acme Inc."
                        />
                      </div>

                      <div>
                        <label htmlFor="company.website" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Website
                        </label>
                        <input
                          type="url"
                          id="company.website"
                          name="company.website"
                          value={formData.company.website}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="https://acme.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="company.phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Company Phone
                        </label>
                        <input
                          type="tel"
                          id="company.phone"
                          name="company.phone"
                          value={formData.company.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="+1 (555) 987-6543"
                        />
                      </div>

                      <div>
                        <label htmlFor="company.taxId" className="block text-sm font-medium text-gray-700 mb-2">
                          Tax ID / VAT Number
                        </label>
                        <input
                          type="text"
                          id="company.taxId"
                          name="company.taxId"
                          value={formData.company.taxId}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="12-3456789"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Address & Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Address & Preferences</h2>
                
                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Address</h3>
                  
                  <div>
                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="NY"
                      />
                    </div>

                    <div>
                      <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="address.zipCode"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors['address.zipCode'] 
                            ? 'border-red-300 focus:ring-red-200' 
                            : 'border-gray-200 focus:ring-green-200 focus:border-green-400'
                        }`}
                        placeholder="10001"
                      />
                      {errors['address.zipCode'] && (
                        <p className="mt-1 text-sm text-red-600">{errors['address.zipCode']}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        id="address.country"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      >
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security Questions */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Security Questions</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="security.securityQuestion" className="block text-sm font-medium text-gray-700 mb-2">
                        Security Question
                      </label>
                      <select
                        id="security.securityQuestion"
                        name="security.securityQuestion"
                        value={formData.security.securityQuestion}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                      >
                        <option value="">Select a question</option>
                        {securityQuestions.map((question, index) => (
                          <option key={index} value={question}>{question}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="security.securityAnswer" className="block text-sm font-medium text-gray-700 mb-2">
                        Answer
                      </label>
                      <input
                        type="text"
                        id="security.securityAnswer"
                        name="security.securityAnswer"
                        value={formData.security.securityAnswer}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                        placeholder="Your answer"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="security.recoveryEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Recovery Email
                        </label>
                        <input
                          type="email"
                          id="security.recoveryEmail"
                          name="security.recoveryEmail"
                          value={formData.security.recoveryEmail}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="backup@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="security.recoveryPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Recovery Phone
                        </label>
                        <input
                          type="tel"
                          id="security.recoveryPhone"
                          name="security.recoveryPhone"
                          value={formData.security.recoveryPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                          placeholder="+1 (555) 999-8888"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Preferences</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="preferences.marketingEmails"
                        checked={formData.preferences.marketingEmails}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <span className="text-gray-700">Send me marketing emails</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="preferences.newsletter"
                        checked={formData.preferences.newsletter}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <span className="text-gray-700">Subscribe to newsletter</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="preferences.twoFactorEnabled"
                        checked={formData.preferences.twoFactorEnabled}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <span className="text-gray-700">Enable two-factor authentication</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Review Your Information</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                  {/* Account Summary */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Account Details</h3>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-gray-500">Email:</dt>
                        <dd className="text-gray-900 font-medium">{formData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Account Type:</dt>
                        <dd className="text-gray-900 font-medium capitalize">{formData.accountType}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Personal Summary */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-gray-500">Name:</dt>
                        <dd className="text-gray-900">{formData.firstName} {formData.lastName}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Phone:</dt>
                        <dd className="text-gray-900">{formData.phone || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Date of Birth:</dt>
                        <dd className="text-gray-900">{formData.dateOfBirth || 'Not provided'}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Gender:</dt>
                        <dd className="text-gray-900 capitalize">{formData.gender.replace(/-/g, ' ')}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Address Summary */}
                  {(formData.address.street || formData.address.city) && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Address</h3>
                      <p className="text-sm text-gray-900">
                        {formData.address.street}<br />
                        {formData.address.city && `${formData.address.city}, `}{formData.address.state} {formData.address.zipCode}<br />
                        {formData.address.country}
                      </p>
                    </div>
                  )}

                  {/* Company Summary (if applicable) */}
                  {formData.company.name && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-3">Company</h3>
                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-gray-500">Company Name:</dt>
                          <dd className="text-gray-900">{formData.company.name}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Website:</dt>
                          <dd className="text-gray-900">{formData.company.website || 'Not provided'}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Tax ID:</dt>
                          <dd className="text-gray-900">{formData.company.taxId || 'Not provided'}</dd>
                        </div>
                      </dl>
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Please Review</h3>
                    <p className="text-sm text-yellow-700">
                      By creating an account, you agree to our Terms and Conditions and Privacy Policy. 
                      Please confirm your acceptance below.
                    </p>
                  </div>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="preferences.termsAccepted"
                      checked={formData.preferences.termsAccepted}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 rounded mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      I have read and agree to the{' '}
                      <Link href="/terms" className="text-green-600 hover:text-green-700">
                        Terms and Conditions
                      </Link>
                      {' '}*
                    </span>
                  </label>
                  {errors.terms && (
                    <p className="text-sm text-red-600">{errors.terms}</p>
                  )}

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="preferences.privacyPolicyAccepted"
                      checked={formData.preferences.privacyPolicyAccepted}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 rounded mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      I have read and agree to the{' '}
                      <Link href="/privacy" className="text-green-600 hover:text-green-700">
                        Privacy Policy
                      </Link>
                      {' '}*
                    </span>
                  </label>
                  {errors.privacy && (
                    <p className="text-sm text-red-600">{errors.privacy}</p>
                  )}
                </div>

                {/* Email Verification Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Verify your email</h4>
                      <p className="text-sm text-blue-600 mt-1">
                        We'll send a verification link to {formData.email || 'your email address'}. 
                        Please check your inbox and verify your email to complete registration.
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendDisabled}
                        className="mt-3 text-sm text-blue-600 hover:text-blue-700 disabled:text-blue-300 disabled:cursor-not-allowed"
                      >
                        {resendDisabled 
                          ? `Resend available in ${countdown}s` 
                          : 'Resend verification email'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="px-6 py-3 text-gray-600 hover:text-gray-800"
                >
                  Already have an account?
                </Link>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Social Registration (Optional) */}
            {currentStep === 1 && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">G</span>
                    <span className="ml-2 text-sm text-gray-600">Google</span>
                  </button>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">f</span>
                    <span className="ml-2 text-sm text-gray-600">Facebook</span>
                  </button>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">𝕏</span>
                    <span className="ml-2 text-sm text-gray-600">Twitter</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-700 mx-2">
            Privacy Policy
          </Link>
          •
          <Link href="/terms" className="hover:text-gray-700 mx-2">
            Terms of Service
          </Link>
          •
          <Link href="/contact" className="hover:text-gray-700 mx-2">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}