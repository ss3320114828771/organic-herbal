'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  total: number
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  items: OrderItem[]
  shippingAddress: {
    fullName: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockOrder: Order = {
        id: orderId,
        orderNumber: `ORD-${orderId.slice(0, 8).toUpperCase()}`,
        date: '2024-01-15T10:30:00Z',
        status: 'processing',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        subtotal: 84.97,
        shipping: 5.99,
        tax: 6.80,
        discount: 0,
        total: 97.76,
        items: [
          {
            id: '1',
            name: 'Organic Turmeric Powder',
            price: 24.99,
            quantity: 2,
            image: '/products/turmeric.jpg',
            total: 49.98
          },
          {
            id: '2',
            name: 'Ashwagandha Root',
            price: 34.99,
            quantity: 1,
            image: '/products/ashwagandha.jpg',
            total: 34.99
          }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          address1: '123 Main Street',
          address2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States',
          phone: '+1 (555) 123-4567'
        },
        trackingNumber: 'TRK123456789',
        estimatedDelivery: '2024-01-20T18:00:00Z'
      }
      setOrder(mockOrder)
      setLoading(false)
    }, 1000)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'delivered': return 'bg-green-500/20 text-green-700'
      case 'shipped': return 'bg-blue-500/20 text-blue-700'
      case 'processing': return 'bg-yellow-500/20 text-yellow-700'
      case 'pending': return 'bg-orange-500/20 text-orange-700'
      case 'cancelled': return 'bg-red-500/20 text-red-700'
      default: return 'bg-gray-500/20 text-gray-700'
    }
  }

  const getPaymentStatusColor = (status: string): string => {
    switch(status) {
      case 'paid': return 'bg-green-500/20 text-green-700'
      case 'pending': return 'bg-yellow-500/20 text-yellow-700'
      case 'failed': return 'bg-red-500/20 text-red-700'
      case 'refunded': return 'bg-purple-500/20 text-purple-700'
      default: return 'bg-gray-500/20 text-gray-700'
    }
  }

  const getStatusIcon = (status: string): string => {
    switch(status) {
      case 'delivered': return '✅'
      case 'shipped': return '🚚'
      case 'processing': return '⚙️'
      case 'pending': return '⏳'
      case 'cancelled': return '❌'
      default: return '📦'
    }
  }

  const handleCancelOrder = () => {
    setShowCancelModal(false)
    // API call to cancel order
    alert('Order cancellation request submitted')
  }

  const handleTrackOrder = () => {
    window.open(`https://tracking.example.com/${order?.trackingNumber}`, '_blank')
  }

  const handleReorder = () => {
    router.push('/shop/cart')
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have access.</p>
          <Link
            href="/shop/orders"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bismillah */}
        <div className="text-center mb-8">
          <p className="text-green-800 text-2xl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <Link
              href="/shop/orders"
              className="text-green-600 hover:text-green-700 inline-flex items-center mb-2"
            >
              <span className="mr-2">←</span>
              Back to Orders
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Order {order.orderNumber}
            </h1>
            <p className="text-gray-500 mt-1">Placed on {formatDate(order.date)}</p>
          </div>

          {/* Status Badges */}
          <div className="flex gap-3">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
              <span>{getStatusIcon(order.status)}</span>
              <span className="capitalize">{order.status}</span>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
              Payment: {order.paymentStatus}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {order.status === 'processing' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Cancel Order
            </button>
          )}
          {order.trackingNumber && (
            <button
              onClick={handleTrackOrder}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Track Order
            </button>
          )}
          <button
            onClick={handleReorder}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Reorder
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Print Invoice
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                      🌿
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
                      <p className="text-sm text-gray-500">each</p>
                    </div>
                    
                    <div className="text-right border-l pl-4">
                      <p className="font-bold text-green-700">{formatCurrency(item.total)}</p>
                      <p className="text-sm text-gray-500">total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
              
              <div className="space-y-2">
                <p className="font-semibold text-gray-800">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && (
                  <p className="text-gray-600">{order.shippingAddress.address2}</p>
                )}
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-600">{order.shippingAddress.country}</p>
                <p className="text-gray-600 mt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tracking Information</h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-mono text-gray-800">{order.trackingNumber}</p>
                  </div>
                  {order.estimatedDelivery && (
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="text-gray-800">{formatDate(order.estimatedDelivery)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-700">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-2">Payment Method</p>
                <p className="font-medium text-gray-800">{order.paymentMethod}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Payment Status: <span className={`inline-block px-2 py-1 rounded-full text-xs ml-2 ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500 mb-2">Order Notes</p>
                  <p className="text-gray-700 text-sm">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Need Help */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="font-bold text-green-800 mb-3">Need Help?</h3>
              <p className="text-sm text-green-700 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <Link
                href="/contact"
                className="inline-block w-full px-4 py-3 bg-green-600 text-white text-center rounded-xl hover:bg-green-700 transition-colors"
              >
                Contact Support
              </Link>
              <p className="text-xs text-green-600 text-center mt-3">
                Admin: Hafiz Sajid Syed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel order {order.orderNumber}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                No, Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}