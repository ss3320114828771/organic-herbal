'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  stock: number
  maxQuantity: number
  discount?: number
  selected: boolean
}

interface ShippingMethod {
  id: string
  name: string
  price: number
  estimatedDays: string
  icon: string
}

interface Coupon {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
}

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      productId: 'p1',
      name: 'Organic Turmeric Powder',
      price: 24.99,
      quantity: 2,
      image: '/products/turmeric.jpg',
      stock: 156,
      maxQuantity: 10,
      discount: 10,
      selected: true
    },
    {
      id: '2',
      productId: 'p2',
      name: 'Ashwagandha Root',
      price: 34.99,
      quantity: 1,
      image: '/products/ashwagandha.jpg',
      stock: 89,
      maxQuantity: 5,
      discount: 0,
      selected: true
    },
    {
      id: '3',
      productId: 'p3',
      name: 'Moringa Leaf Powder',
      price: 29.99,
      quantity: 1,
      image: '/products/moringa.jpg',
      stock: 45,
      maxQuantity: 8,
      discount: 15,
      selected: false
    }
  ])

  const [shippingMethods] = useState<ShippingMethod[]>([
    { id: 'standard', name: 'Standard Shipping', price: 5.99, estimatedDays: '5-7 business days', icon: '📦' },
    { id: 'express', name: 'Express Shipping', price: 12.99, estimatedDays: '2-3 business days', icon: '⚡' },
    { id: 'overnight', name: 'Overnight Shipping', price: 24.99, estimatedDays: '1 business day', icon: '🚀' },
    { id: 'pickup', name: 'Store Pickup', price: 0, estimatedDays: 'Ready in 2 hours', icon: '🏪' }
  ])

  const [availableCoupons] = useState<Coupon[]>([
    { code: 'WELCOME10', discount: 10, type: 'percentage' },
    { code: 'SAVE20', discount: 20, type: 'percentage' },
    { code: 'FREESHIP', discount: 5.99, type: 'fixed' }
  ])

  const [selectedShipping, setSelectedShipping] = useState('standard')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [giftWrap, setGiftWrap] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 99) return
    
    setIsUpdating(true)
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
    setTimeout(() => setIsUpdating(false), 500)
  }

  const toggleSelectItem = (itemId: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const toggleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected)
    setCartItems(prev =>
      prev.map(item => ({ ...item, selected: !allSelected }))
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  const confirmDelete = (itemId: string) => {
    setItemToDelete(itemId)
    setShowDeleteModal(true)
  }

  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      c => c.code.toLowerCase() === couponCode.toLowerCase()
    )
    
    if (coupon) {
      setAppliedCoupon(coupon)
      setCouponError('')
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  const calculateSubtotal = (): number => {
    return cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateDiscount = (): number => {
    const subtotal = calculateSubtotal()
    if (!appliedCoupon) return 0
    
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.discount) / 100
    } else {
      return appliedCoupon.discount
    }
  }

  const calculateShipping = (): number => {
    const method = shippingMethods.find(m => m.id === selectedShipping)
    return method?.price || 0
  }

  const calculateGiftWrap = (): number => {
    return giftWrap ? 2.99 : 0
  }

  const calculateTax = (subtotal: number): number => {
    return subtotal * 0.08 // 8% tax
  }

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const shipping = calculateShipping()
    const giftWrapFee = calculateGiftWrap()
    const tax = calculateTax(subtotal - discount)
    
    return subtotal - discount + shipping + giftWrapFee + tax
  }

  const selectedCount = cartItems.filter(item => item.selected).length
  const subtotal = calculateSubtotal()
  const discount = calculateDiscount()
  const shipping = calculateShipping()
  const giftWrapFee = calculateGiftWrap()
  const tax = calculateTax(subtotal - discount)
  const total = calculateTotal()

  const shippingMethod = shippingMethods.find(m => m.id === selectedShipping)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: `hsl(${Math.random() * 60 + 80}, 80%, 70%)`,
              borderRadius: '50%',
              animation: `twinkle ${Math.random() * 4 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bismillah */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/80 backdrop-blur-lg px-8 py-4 rounded-2xl border border-green-200 shadow-2xl">
            <p className="text-green-800 text-3xl font-arabic animate-glow">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Shopping Cart
            </span>
          </h1>
          <Link
            href="/shop/products"
            className="px-6 py-3 bg-white/80 backdrop-blur-lg text-green-700 rounded-xl font-semibold hover:bg-white transition-all shadow-lg hover:shadow-xl flex items-center"
          >
            <span className="mr-2">←</span>
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 text-center shadow-2xl border border-green-100">
            <div className="text-8xl mb-6 opacity-50">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
              Explore our collection of organic herbal products.
            </p>
            <Link
              href="/shop/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              <span className="mr-2">🌿</span>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Select All Bar */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 flex items-center justify-between shadow-lg border border-green-100">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cartItems.every(item => item.selected)}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">Select All</span>
                  <span className="text-sm text-gray-500">({cartItems.length} items)</span>
                </label>
                <button
                  onClick={() => {
                    cartItems.forEach(item => {
                      if (item.selected) confirmDelete(item.id)
                    })
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Delete Selected
                </button>
              </div>

              {/* Cart Items List */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-green-100 transition-all ${
                    item.selected ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelectItem(item.id)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />

                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-4xl flex-shrink-0">
                      🌿
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">SKU: {item.productId}</p>
                          {item.discount ? (
                            <div className="mt-2">
                              <span className="text-sm text-gray-400 line-through mr-2">
                                {formatCurrency(item.price)}
                              </span>
                              <span className="text-lg font-bold text-green-700">
                                {formatCurrency(item.price * (1 - item.discount / 100))}
                              </span>
                              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                -{item.discount}%
                              </span>
                            </div>
                          ) : (
                            <p className="text-lg font-bold text-gray-800 mt-2">
                              {formatCurrency(item.price)}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQuantity || isUpdating}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            +
                          </button>
                          <span className="text-xs text-gray-400 ml-2">
                            Max: {item.maxQuantity}
                          </span>
                        </div>
                        <p className="font-bold text-gray-800">
                          {formatCurrency(
                            (item.discount 
                              ? item.price * (1 - item.discount / 100) 
                              : item.price) * item.quantity
                          )}
                        </p>
                      </div>

                      {/* Stock Status */}
                      {item.quantity >= item.stock && (
                        <p className="text-xs text-red-500 mt-2">
                          ⚠️ Only {item.stock} left in stock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Notes */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-green-100">
                <label className="block text-gray-700 font-semibold mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for your order..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-green-100 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

                {/* Selected Items Count */}
                <p className="text-sm text-gray-500 mb-4">
                  {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                </p>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                  </div>

                  {/* Gift Wrap Option */}
                  <label className="flex items-center justify-between p-3 bg-green-50 rounded-xl cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🎁</span>
                      <span className="text-gray-700">Gift Wrap</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">+$2.99</span>
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                  </label>

                  {giftWrap && (
                    <div className="flex justify-between text-gray-600">
                      <span>Gift Wrap Fee</span>
                      <span>{formatCurrency(giftWrapFee)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total</span>
                      <span className="text-green-700">{formatCurrency(total)}</span>
                    </div>
                    <p className="text-xs text-gray-400 text-right mt-1">
                      Including all taxes
                    </p>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Coupon Code
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors uppercase"
                      disabled={!!appliedCoupon}
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={removeCoupon}
                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    ) : (
                      <button
                        onClick={applyCoupon}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm mt-1">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <p className="text-green-600 text-sm mt-1">
                      Coupon applied: {appliedCoupon.code} (
                      {appliedCoupon.type === 'percentage' 
                        ? `${appliedCoupon.discount}% off` 
                        : `${formatCurrency(appliedCoupon.discount)} off`}
                      )
                    </p>
                  )}
                </div>

                {/* Shipping Method */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Shipping Method
                  </label>
                  <div className="space-y-2">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedShipping === method.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShipping === method.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-800">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.estimatedDays}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {method.price === 0 ? 'Free' : formatCurrency(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/shop/checkout"
                  className="block w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl mb-3"
                >
                  Proceed to Checkout
                </Link>

                {/* Payment Methods */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">We accept</p>
                  <div className="flex justify-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <span className="text-2xl">📱</span>
                    <span className="text-2xl">💵</span>
                    <span className="text-2xl">🅿️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {cartItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl mb-3 flex items-center justify-center text-white text-4xl">
                    🌿
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">Product Name</h3>
                  <p className="text-green-700 font-bold">$29.99</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Note */}
        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-green-100">
          <p className="text-gray-600 text-sm text-center">
            <span className="text-yellow-600 mr-1">👑</span>
            Need help with your order? Contact our administrator:{' '}
            <a href="mailto:sajid.syed@gmail.com" className="text-green-700 hover:text-green-800 font-semibold">
              Hafiz Sajid Syed
            </a>
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🗑️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Remove Item</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setItemToDelete(null)
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => itemToDelete && removeItem(itemToDelete)}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}