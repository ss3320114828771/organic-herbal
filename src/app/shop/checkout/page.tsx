'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsProcessing(false)
    router.push('/shop/order-confirmation')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Bismillah */}
        <div className="text-center mb-8">
          <p className="text-green-800 text-2xl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">Checkout</h1>
          <Link href="/shop/cart" className="text-green-600 hover:text-green-700">
            ← Back to Cart
          </Link>
        </div>

        {/* Simple Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          
          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="text"
              placeholder="Address"
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="text"
              placeholder="City"
              className="w-full p-3 border rounded-xl"
            />
          </div>

          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          
          <div className="space-y-3 mb-6">
            <label className="flex items-center space-x-3 p-3 border rounded-xl">
              <input type="radio" name="payment" defaultChecked className="w-4 h-4" />
              <span>💳 Credit Card</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-xl">
              <input type="radio" name="payment" className="w-4 h-4" />
              <span>📱 PayPal</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-xl">
              <input type="radio" name="payment" className="w-4 h-4" />
              <span>💵 Cash on Delivery</span>
            </label>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <h3 className="font-bold mb-2">Order Summary</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>$84.97</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span className="text-green-600">$94.93</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}