'use client'

import React from 'react'
import Link from 'next/link'

interface CartSummaryProps {
  items?: CartItem[]
  subtotal?: number
  shipping?: number
  tax?: number
  discount?: number
  total?: number
  currency?: string
  showBreakdown?: boolean
  showActions?: boolean
  checkoutUrl?: string
  continueShoppingUrl?: string
  onCheckout?: () => void
  onApplyCoupon?: (code: string) => void
  onRemoveCoupon?: () => void
  onEstimateShipping?: (zipCode: string) => void
  isLoading?: boolean
  className?: string
  variant?: 'default' | 'compact' | 'checkout'
}

interface CartItem {
  id: string
  price: number
  quantity: number
  discount?: number
}

export default function CartSummary({
  items = [],
  subtotal: propSubtotal,
  shipping: propShipping,
  tax: propTax,
  discount: propDiscount,
  total: propTotal,
  currency = 'USD',
  showBreakdown = true,
  showActions = true,
  checkoutUrl = '/checkout',
  continueShoppingUrl = '/products',
  onCheckout,
  onApplyCoupon,
  onRemoveCoupon,
  onEstimateShipping,
  isLoading = false,
  className = '',
  variant = 'default'
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = React.useState('')
  const [appliedCoupon, setAppliedCoupon] = React.useState('')
  const [zipCode, setZipCode] = React.useState('')
  const [showCouponInput, setShowCouponInput] = React.useState(false)
  const [showShippingEstimate, setShowShippingEstimate] = React.useState(false)
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false)
  const [isEstimatingShipping, setIsEstimatingShipping] = React.useState(false)

  // Calculate totals from items if not provided
  const calculatedSubtotal = items.reduce((sum, item) => {
    const itemDiscount = item.discount || 0
    const itemPrice = item.price * (1 - itemDiscount / 100)
    return sum + itemPrice * item.quantity
  }, 0)

  const subtotal = propSubtotal !== undefined ? propSubtotal : calculatedSubtotal
  const shipping = propShipping !== undefined ? propShipping : (subtotal > 100 ? 0 : 10)
  const tax = propTax !== undefined ? propTax : subtotal * 0.1
  const discount = propDiscount !== undefined ? propDiscount : 0
  const total = propTotal !== undefined ? propTotal : subtotal + shipping + tax - discount

  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !onApplyCoupon) return
    
    setIsApplyingCoupon(true)
    try {
      await onApplyCoupon(couponCode)
      setAppliedCoupon(couponCode)
      setCouponCode('')
      setShowCouponInput(false)
    } catch (error) {
      console.error('Failed to apply coupon')
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon('')
    onRemoveCoupon?.()
  }

  const handleEstimateShipping = async () => {
    if (!zipCode.trim() || !onEstimateShipping) return
    
    setIsEstimatingShipping(true)
    try {
      await onEstimateShipping(zipCode)
    } catch (error) {
      console.error('Failed to estimate shipping')
    } finally {
      setIsEstimatingShipping(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal ({itemCount} items)</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-lg">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {showActions && (
          <button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Checkout'}
          </button>
        )}
      </div>
    )
  }

  // Checkout variant
  if (variant === 'checkout') {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {appliedCoupon && (
          <div className="mt-4 p-2 bg-green-50 rounded-lg flex justify-between items-center">
            <span className="text-sm text-green-700">Coupon: {appliedCoupon}</span>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-700 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cart Summary</h3>
      
      {/* Items count */}
      <div className="text-sm text-gray-600 mb-4">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
      </div>

      {/* Price breakdown */}
      {showBreakdown && (
        <div className="space-y-3 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? 'Free' : formatCurrency(shipping)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-800">Total</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Coupon code */}
      {onApplyCoupon && (
        <div className="mb-4">
          {showCouponInput ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  disabled={isApplyingCoupon}
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || isApplyingCoupon}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isApplyingCoupon ? '...' : 'Apply'}
                </button>
              </div>
              <button
                onClick={() => setShowCouponInput(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : appliedCoupon ? (
            <div className="p-2 bg-green-50 rounded-lg flex justify-between items-center">
              <span className="text-sm text-green-700">Coupon: {appliedCoupon}</span>
              <button
                onClick={handleRemoveCoupon}
                className="text-green-700 hover:text-green-800"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCouponInput(true)}
              className="text-sm text-green-600 hover:text-green-700"
            >
              + Add coupon code
            </button>
          )}
        </div>
      )}

      {/* Shipping estimate */}
      {onEstimateShipping && (
        <div className="mb-4">
          {showShippingEstimate ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="Enter ZIP code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
                  maxLength={10}
                  disabled={isEstimatingShipping}
                />
                <button
                  onClick={handleEstimateShipping}
                  disabled={!zipCode.trim() || isEstimatingShipping}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50"
                >
                  {isEstimatingShipping ? '...' : 'Estimate'}
                </button>
              </div>
              <button
                onClick={() => setShowShippingEstimate(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowShippingEstimate(true)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              📦 Estimate shipping
            </button>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="space-y-3">
          <button
            onClick={onCheckout}
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          <Link
            href={continueShoppingUrl}
            className="block text-center text-sm text-gray-600 hover:text-green-600"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {/* Payment methods */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-2">We accept</p>
        <div className="flex justify-center gap-2">
          <span className="text-xl">💳</span>
          <span className="text-xl">📱</span>
          <span className="text-xl">🏦</span>
        </div>
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Mini cart summary (for dropdown)
export function MiniCartSummary({ items, onCheckout }: { items: CartItem[]; onCheckout?: () => void }) {
  return (
    <CartSummary
      items={items}
      variant="compact"
      showBreakdown={false}
      onCheckout={onCheckout}
    />
  )
}

// Checkout summary (for checkout page)
export function CheckoutSummary({ 
  items,
  onApplyCoupon,
  onRemoveCoupon 
}: { 
  items: CartItem[]
  onApplyCoupon?: (code: string) => void
  onRemoveCoupon?: () => void
}) {
  return (
    <CartSummary
      items={items}
      variant="checkout"
      showActions={false}
      onApplyCoupon={onApplyCoupon}
      onRemoveCoupon={onRemoveCoupon}
    />
  )
}

// Order total (just the total)
export function OrderTotal({ total, currency = 'USD' }: { total: number; currency?: string }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
      <span className="font-semibold text-gray-800">Order Total</span>
      <span className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</span>
    </div>
  )
}

// ==================== HOOK ====================

// Custom hook for cart summary
export function useCartSummary() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [coupon, setCoupon] = React.useState<{ code: string; discount: number } | null>(null)

  const applyCoupon = async (code: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock coupon validation
      if (code.toUpperCase() === 'SAVE10') {
        setCoupon({ code, discount: 10 })
        return { success: true, discount: 10 }
      } else if (code.toUpperCase() === 'SAVE20') {
        setCoupon({ code, discount: 20 })
        return { success: true, discount: 20 }
      } else {
        throw new Error('Invalid coupon code')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeCoupon = () => {
    setCoupon(null)
  }

  const estimateShipping = async (zipCode: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock shipping estimate
      const shippingCost = zipCode.startsWith('9') ? 15 : 10
      return { cost: shippingCost, days: 3 }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    coupon,
    applyCoupon,
    removeCoupon,
    estimateShipping
  }
}