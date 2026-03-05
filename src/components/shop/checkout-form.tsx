'use client'

import React from 'react'
import Link from 'next/link'

interface CheckoutFormProps {
  onSubmit?: (data: CheckoutFormData) => void
  initialData?: Partial<CheckoutFormData>
  isLoading?: boolean
  className?: string
  showSteps?: boolean
  showPayment?: boolean
  showShipping?: boolean
  showBilling?: boolean
  currentStep?: number
  onStepChange?: (step: number) => void
}

interface CheckoutFormData {
  // Contact
  email: string
  phone: string
  
  // Shipping
  shippingFirstName: string
  shippingLastName: string
  shippingAddress1: string
  shippingAddress2?: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountry: string
  
  // Billing
  billingSameAsShipping: boolean
  billingFirstName: string
  billingLastName: string
  billingAddress1: string
  billingAddress2?: string
  billingCity: string
  billingState: string
  billingZip: string
  billingCountry: string
  
  // Payment
  paymentMethod: 'card' | 'paypal' | 'applepay' | 'googlepay'
  cardNumber?: string
  cardName?: string
  cardExpiry?: string
  cardCvv?: string
  saveCard?: boolean
  
  // Additional
  orderNotes?: string
  marketingEmails?: boolean
  giftWrapping?: boolean
}

export default function CheckoutForm({
  onSubmit,
  initialData,
  isLoading = false,
  className = '',
  showSteps = true,
  showPayment = true,
  showShipping = true,
  showBilling = true,
  currentStep = 1,
  onStepChange
}: CheckoutFormProps) {
  const [formData, setFormData] = React.useState<CheckoutFormData>({
    email: '',
    phone: '',
    shippingFirstName: '',
    shippingLastName: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'US',
    billingSameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    saveCard: false,
    orderNotes: '',
    marketingEmails: false,
    giftWrapping: false,
    ...initialData
  })

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})
  const [step, setStep] = React.useState(currentStep)

  React.useEffect(() => {
    setStep(currentStep)
  }, [currentStep])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const handleBillingSameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFormData(prev => ({
      ...prev,
      billingSameAsShipping: checked,
      ...(checked ? {
        billingFirstName: prev.shippingFirstName,
        billingLastName: prev.shippingLastName,
        billingAddress1: prev.shippingAddress1,
        billingAddress2: prev.shippingAddress2,
        billingCity: prev.shippingCity,
        billingState: prev.shippingState,
        billingZip: prev.shippingZip,
        billingCountry: prev.shippingCountry
      } : {})
    }))
  }

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNumber === 1) {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email address'
      }
      
      if (formData.phone && !/^[\d\s-+()]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number'
      }
    }

    if (stepNumber === 2) {
      if (!formData.shippingFirstName) {
        newErrors.shippingFirstName = 'First name is required'
      }
      if (!formData.shippingLastName) {
        newErrors.shippingLastName = 'Last name is required'
      }
      if (!formData.shippingAddress1) {
        newErrors.shippingAddress1 = 'Address is required'
      }
      if (!formData.shippingCity) {
        newErrors.shippingCity = 'City is required'
      }
      if (!formData.shippingState) {
        newErrors.shippingState = 'State is required'
      }
      if (!formData.shippingZip) {
        newErrors.shippingZip = 'ZIP code is required'
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.shippingZip)) {
        newErrors.shippingZip = 'Invalid ZIP code'
      }
    }

    if (stepNumber === 3) {
      if (!formData.billingSameAsShipping) {
        if (!formData.billingFirstName) {
          newErrors.billingFirstName = 'First name is required'
        }
        if (!formData.billingLastName) {
          newErrors.billingLastName = 'Last name is required'
        }
        if (!formData.billingAddress1) {
          newErrors.billingAddress1 = 'Address is required'
        }
        if (!formData.billingCity) {
          newErrors.billingCity = 'City is required'
        }
        if (!formData.billingState) {
          newErrors.billingState = 'State is required'
        }
        if (!formData.billingZip) {
          newErrors.billingZip = 'ZIP code is required'
        }
      }
    }

    if (stepNumber === 4 && showPayment) {
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber) {
          newErrors.cardNumber = 'Card number is required'
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
          newErrors.cardNumber = 'Invalid card number'
        }
        if (!formData.cardName) {
          newErrors.cardName = 'Name on card is required'
        }
        if (!formData.cardExpiry) {
          newErrors.cardExpiry = 'Expiry date is required'
        } else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
          newErrors.cardExpiry = 'Invalid format (MM/YY)'
        }
        if (!formData.cardCvv) {
          newErrors.cardCvv = 'CVV is required'
        } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
          newErrors.cardCvv = 'Invalid CVV'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      const nextStep = step + 1
      setStep(nextStep)
      onStepChange?.(nextStep)
      window.scrollTo(0, 0)
    }
  }

  const handleBack = () => {
    const prevStep = step - 1
    setStep(prevStep)
    onStepChange?.(prevStep)
    window.scrollTo(0, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(step)) {
      onSubmit?.(formData)
    }
  }

  const getInputClass = (fieldName: string) => {
    const hasError = errors[fieldName] && touched[fieldName]
    return `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-300 focus:ring-red-200'
        : 'border-gray-200 focus:ring-green-200'
    }`
  }

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' }
  ]

  const states = {
    US: [
      { code: 'AL', name: 'Alabama' },
      { code: 'AK', name: 'Alaska' },
      { code: 'AZ', name: 'Arizona' },
      { code: 'AR', name: 'Arkansas' },
      { code: 'CA', name: 'California' },
      { code: 'CO', name: 'Colorado' },
      { code: 'CT', name: 'Connecticut' },
      { code: 'DE', name: 'Delaware' },
      { code: 'FL', name: 'Florida' },
      { code: 'GA', name: 'Georgia' },
      { code: 'HI', name: 'Hawaii' },
      { code: 'ID', name: 'Idaho' },
      { code: 'IL', name: 'Illinois' },
      { code: 'IN', name: 'Indiana' },
      { code: 'IA', name: 'Iowa' },
      { code: 'KS', name: 'Kansas' },
      { code: 'KY', name: 'Kentucky' },
      { code: 'LA', name: 'Louisiana' },
      { code: 'ME', name: 'Maine' },
      { code: 'MD', name: 'Maryland' },
      { code: 'MA', name: 'Massachusetts' },
      { code: 'MI', name: 'Michigan' },
      { code: 'MN', name: 'Minnesota' },
      { code: 'MS', name: 'Mississippi' },
      { code: 'MO', name: 'Missouri' },
      { code: 'MT', name: 'Montana' },
      { code: 'NE', name: 'Nebraska' },
      { code: 'NV', name: 'Nevada' },
      { code: 'NH', name: 'New Hampshire' },
      { code: 'NJ', name: 'New Jersey' },
      { code: 'NM', name: 'New Mexico' },
      { code: 'NY', name: 'New York' },
      { code: 'NC', name: 'North Carolina' },
      { code: 'ND', name: 'North Dakota' },
      { code: 'OH', name: 'Ohio' },
      { code: 'OK', name: 'Oklahoma' },
      { code: 'OR', name: 'Oregon' },
      { code: 'PA', name: 'Pennsylvania' },
      { code: 'RI', name: 'Rhode Island' },
      { code: 'SC', name: 'South Carolina' },
      { code: 'SD', name: 'South Dakota' },
      { code: 'TN', name: 'Tennessee' },
      { code: 'TX', name: 'Texas' },
      { code: 'UT', name: 'Utah' },
      { code: 'VT', name: 'Vermont' },
      { code: 'VA', name: 'Virginia' },
      { code: 'WA', name: 'Washington' },
      { code: 'WV', name: 'West Virginia' },
      { code: 'WI', name: 'Wisconsin' },
      { code: 'WY', name: 'Wyoming' }
    ]
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData(prev => ({ ...prev, cardNumber: formatted }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value)
    setFormData(prev => ({ ...prev, cardExpiry: formatted }))
  }

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: 'Contact' },
      { number: 2, label: 'Shipping' },
      { number: 3, label: 'Billing' }
    ]
    if (showPayment) {
      steps.push({ number: 4, label: 'Payment' })
    }

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((s) => (
            <div key={s.number} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-medium ${
                  s.number === step
                    ? 'bg-green-600 text-white'
                    : s.number < step
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s.number < step ? '✓' : s.number}
              </div>
              <div className={`text-xs mt-1 ${
                s.number === step ? 'text-green-600 font-medium' : 'text-gray-500'
              }`}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-green-600 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {showSteps && renderStepIndicator()}

      {/* Step 1: Contact Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass('email')}
              placeholder="you@example.com"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass('phone')}
              placeholder="(555) 123-4567"
            />
            {errors.phone && touched.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="marketingEmails"
              checked={formData.marketingEmails}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 rounded"
            />
            <label className="text-sm text-gray-600">
              Email me with news and offers
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Shipping Information */}
      {step === 2 && showShipping && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Shipping Address</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="shippingFirstName"
                value={formData.shippingFirstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('shippingFirstName')}
                placeholder="John"
              />
              {errors.shippingFirstName && touched.shippingFirstName && (
                <p className="mt-1 text-sm text-red-600">{errors.shippingFirstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="shippingLastName"
                value={formData.shippingLastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('shippingLastName')}
                placeholder="Doe"
              />
              {errors.shippingLastName && touched.shippingLastName && (
                <p className="mt-1 text-sm text-red-600">{errors.shippingLastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              name="shippingAddress1"
              value={formData.shippingAddress1}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClass('shippingAddress1')}
              placeholder="123 Main St"
            />
            {errors.shippingAddress1 && touched.shippingAddress1 && (
              <p className="mt-1 text-sm text-red-600">{errors.shippingAddress1}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2 (optional)
            </label>
            <input
              type="text"
              name="shippingAddress2"
              value={formData.shippingAddress2}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="Apt 4B"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="shippingCity"
                value={formData.shippingCity}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('shippingCity')}
                placeholder="New York"
              />
              {errors.shippingCity && touched.shippingCity && (
                <p className="mt-1 text-sm text-red-600">{errors.shippingCity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                name="shippingState"
                value={formData.shippingState}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('shippingState')}
              >
                <option value="">Select state</option>
                {states.US.map(state => (
                  <option key={state.code} value={state.code}>{state.name}</option>
                ))}
              </select>
              {errors.shippingState && touched.shippingState && (
                <p className="mt-1 text-sm text-red-600">{errors.shippingState}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                name="shippingZip"
                value={formData.shippingZip}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('shippingZip')}
                placeholder="10001"
                maxLength={10}
              />
              {errors.shippingZip && touched.shippingZip && (
                <p className="mt-1 text-sm text-red-600">{errors.shippingZip}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                name="shippingCountry"
                value={formData.shippingCountry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              name="giftWrapping"
              checked={formData.giftWrapping}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 rounded"
            />
            <label className="text-sm text-gray-600">
              This order is a gift (add gift wrapping for $5)
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Billing Information */}
      {step === 3 && showBilling && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Billing Address</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="billingSameAsShipping"
              checked={formData.billingSameAsShipping}
              onChange={handleBillingSameChange}
              className="w-4 h-4 text-green-600 rounded"
            />
            <label className="text-sm text-gray-600">
              Same as shipping address
            </label>
          </div>

          {!formData.billingSameAsShipping && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="billingFirstName"
                    value={formData.billingFirstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('billingFirstName')}
                    placeholder="John"
                  />
                  {errors.billingFirstName && touched.billingFirstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingFirstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="billingLastName"
                    value={formData.billingLastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('billingLastName')}
                    placeholder="Doe"
                  />
                  {errors.billingLastName && touched.billingLastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingLastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  name="billingAddress1"
                  value={formData.billingAddress1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('billingAddress1')}
                  placeholder="123 Main St"
                />
                {errors.billingAddress1 && touched.billingAddress1 && (
                  <p className="mt-1 text-sm text-red-600">{errors.billingAddress1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (optional)
                </label>
                <input
                  type="text"
                  name="billingAddress2"
                  value={formData.billingAddress2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('billingCity')}
                    placeholder="New York"
                  />
                  {errors.billingCity && touched.billingCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingCity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    name="billingState"
                    value={formData.billingState}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('billingState')}
                  >
                    <option value="">Select state</option>
                    {states.US.map(state => (
                      <option key={state.code} value={state.code}>{state.name}</option>
                    ))}
                  </select>
                  {errors.billingState && touched.billingState && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingState}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="billingZip"
                    value={formData.billingZip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('billingZip')}
                    placeholder="10001"
                    maxLength={10}
                  />
                  {errors.billingZip && touched.billingZip && (
                    <p className="mt-1 text-sm text-red-600">{errors.billingZip}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Payment Information */}
      {step === 4 && showPayment && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-lg mr-2">💳</span>
              <span className="font-medium">Credit / Debit Card</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleChange}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-lg mr-2">📱</span>
              <span className="font-medium">PayPal</span>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="applepay"
                checked={formData.paymentMethod === 'applepay'}
                onChange={handleChange}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-lg mr-2">🍎</span>
              <span className="font-medium">Apple Pay</span>
            </label>
          </div>

          {formData.paymentMethod === 'card' && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  onBlur={handleBlur}
                  className={getInputClass('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && touched.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card *
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('cardName')}
                  placeholder="John Doe"
                />
                {errors.cardName && touched.cardName && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleExpiryChange}
                    onBlur={handleBlur}
                    className={getInputClass('cardExpiry')}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.cardExpiry && touched.cardExpiry && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClass('cardCvv')}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cardCvv && touched.cardCvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardCvv}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="saveCard"
                  checked={formData.saveCard}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <label className="text-sm text-gray-600">
                  Save card for future purchases
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Notes */}
      {step === 4 && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Notes (optional)
          </label>
          <textarea
            name="orderNotes"
            value={formData.orderNotes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
            placeholder="Any special instructions for your order?"
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
        ) : (
          <div></div>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        )}
      </div>
    </form>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Guest checkout form
export function GuestCheckoutForm({ onSubmit }: { onSubmit?: (data: CheckoutFormData) => void }) {
  return (
    <CheckoutForm
      onSubmit={onSubmit}
      showSteps={true}
      showPayment={true}
      showShipping={true}
      showBilling={true}
    />
  )
}

// Quick checkout (no account creation)
export function QuickCheckoutForm({ onSubmit }: { onSubmit?: (data: CheckoutFormData) => void }) {
  return (
    <CheckoutForm
      onSubmit={onSubmit}
      showSteps={false}
      showPayment={true}
      showShipping={true}
      showBilling={true}
      currentStep={4}
    />
  )
}

// Express checkout (single page)
export function ExpressCheckoutForm({ onSubmit }: { onSubmit?: (data: CheckoutFormData) => void }) {
  return (
    <CheckoutForm
      onSubmit={onSubmit}
      showSteps={false}
      showPayment={true}
      showShipping={true}
      showBilling={true}
      currentStep={4}
    />
  )
}

// Billing only form
export function BillingForm({ onSubmit }: { onSubmit?: (data: Partial<CheckoutFormData>) => void }) {
  const [formData, setFormData] = React.useState<Partial<CheckoutFormData>>({
    billingFirstName: '',
    billingLastName: '',
    billingAddress1: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'US'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Billing Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.billingFirstName}
          onChange={(e) => setFormData({ ...formData, billingFirstName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.billingLastName}
          onChange={(e) => setFormData({ ...formData, billingLastName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
      </div>
      <input
        type="text"
        placeholder="Address"
        value={formData.billingAddress1}
        onChange={(e) => setFormData({ ...formData, billingAddress1: e.target.value })}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="City"
          value={formData.billingCity}
          onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
        <input
          type="text"
          placeholder="State"
          value={formData.billingState}
          onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="ZIP Code"
          value={formData.billingZip}
          onChange={(e) => setFormData({ ...formData, billingZip: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
        <select
          value={formData.billingCountry}
          onChange={(e) => setFormData({ ...formData, billingCountry: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Continue
      </button>
    </form>
  )
}