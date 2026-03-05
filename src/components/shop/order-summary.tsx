'use client'

import React from 'react'
import Link from 'next/link'

interface OrderSummaryProps {
  order: Order
  onTrackOrder?: (orderId: string) => void
  onViewDetails?: (orderId: string) => void
  onReorder?: (orderId: string) => void
  onContactSupport?: (orderId: string) => void
  onDownloadInvoice?: (orderId: string) => void
  className?: string
  variant?: 'default' | 'compact' | 'detailed' | 'minimal'
  showActions?: boolean
  showItems?: boolean
  showTimeline?: boolean
  showPayment?: boolean
  showShipping?: boolean
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'paid' | 'unpaid' | 'refunded' | 'failed'
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled' | 'cancelled'
  
  // Customer
  customerName: string
  customerEmail: string
  customerPhone?: string
  
  // Shipping
  shippingAddress: {
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  
  // Billing
  billingAddress?: {
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  
  // Payment
  paymentMethod: string
  paymentDetails?: {
    cardLast4?: string
    cardBrand?: string
    transactionId?: string
  }
  
  // Items
  items: OrderItem[]
  
  // Totals
  subtotal: number
  shippingCost: number
  taxAmount: number
  discountAmount?: number
  discountCode?: string
  total: number
  currency?: string
  
  // Timeline
  timeline?: OrderTimelineEvent[]
  
  // Tracking
  trackingNumber?: string
  trackingUrl?: string
  carrier?: string
  estimatedDelivery?: string
  
  // Notes
  notes?: string
  customerNote?: string
}

interface OrderItem {
  id: string
  productId: string
  name: string
  sku?: string
  image?: string
  quantity: number
  price: number
  total: number
  variant?: string
  size?: string
  color?: string
}

interface OrderTimelineEvent {
  date: string
  status: string
  description: string
  location?: string
}

export default function OrderSummary({
  order,
  onTrackOrder,
  onViewDetails,
  onReorder,
  onContactSupport,
  onDownloadInvoice,
  className = '',
  variant = 'default',
  showActions = true,
  showItems = true,
  showTimeline = false,
  showPayment = true,
  showShipping = true
}: OrderSummaryProps) {
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order.currency || 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700',
      paid: 'bg-green-100 text-green-700',
      unpaid: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      unfulfilled: 'bg-gray-100 text-gray-700',
      partially_fulfilled: 'bg-yellow-100 text-yellow-700',
      fulfilled: 'bg-green-100 text-green-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '📦',
      delivered: '✅',
      cancelled: '❌',
      refunded: '💰',
      paid: '💳',
      unpaid: '⚠️',
      failed: '❌'
    }
    return icons[status] || '📋'
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex justify-between items-start mb-3">
          <div>
            <Link
              href={`/orders/${order.id}`}
              className="text-sm font-medium text-gray-800 hover:text-green-600"
            >
              Order #{order.orderNumber}
            </Link>
            <p className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</p>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{order.items.length} items</span>
          <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => onViewDetails?.(order.id)}
              className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              View
            </button>
            {order.status === 'delivered' && (
              <button
                onClick={() => onReorder?.(order.id)}
                className="flex-1 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Reorder
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`flex justify-between items-center ${className}`}>
        <div>
          <p className="font-medium text-gray-800">Order #{order.orderNumber}</p>
          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
          <p className={`text-xs mt-1 ${getStatusColor(order.status)}`}>{order.status}</p>
        </div>
      </div>
    )
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Order #{order.orderNumber}</h2>
              <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.date)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 text-sm rounded-full ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)} {order.status}
              </span>
              {order.paymentStatus && (
                <span className={`px-3 py-1.5 text-sm rounded-full ${getStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Customer</h3>
              <p className="text-gray-800">{order.customerName}</p>
              <p className="text-sm text-gray-500">{order.customerEmail}</p>
              {order.customerPhone && (
                <p className="text-sm text-gray-500">{order.customerPhone}</p>
              )}
            </div>

            {showShipping && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                <p className="text-gray-800">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 && (
                  <p className="text-sm text-gray-500">{order.shippingAddress.address2}</p>
                )}
                <p className="text-sm text-gray-500">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p className="text-sm text-gray-500">{order.shippingAddress.country}</p>
              </div>
            )}
          </div>

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <span className="text-lg">📦</span>
                <span className="font-medium">Tracking Information</span>
              </div>
              <p className="text-sm text-blue-600">
                Carrier: {order.carrier} • Tracking: {order.trackingNumber}
              </p>
              {order.estimatedDelivery && (
                <p className="text-sm text-blue-600 mt-1">
                  Estimated Delivery: {formatDate(order.estimatedDelivery)}
                </p>
              )}
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Track Package →
                </a>
              )}
            </div>
          )}

          {/* Items */}
          {showItems && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Items ({order.items.length})</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          {(item.variant || item.size || item.color) && (
                            <p className="text-xs text-gray-400 mt-1">
                              {item.variant} {item.size} {item.color}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatCurrency(item.price)}
                          </p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(order.taxAmount)}</span>
              </div>
              {order.discountAmount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.discountCode && `(${order.discountCode})`}</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {showPayment && order.paymentMethod && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Information</h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="text-gray-800">{order.paymentMethod}</p>
                  {order.paymentDetails?.cardLast4 && (
                    <p className="text-sm text-gray-500">
                      •••• {order.paymentDetails.cardLast4}
                      {order.paymentDetails.cardBrand && ` (${order.paymentDetails.cardBrand})`}
                    </p>
                  )}
                  {order.paymentDetails?.transactionId && (
                    <p className="text-xs text-gray-400 mt-1">
                      Transaction: {order.paymentDetails.transactionId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Customer Note */}
          {order.customerNote && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Note</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {order.customerNote}
              </p>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
              {order.status === 'shipped' && onTrackOrder && (
                <button
                  onClick={() => onTrackOrder(order.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Track Order
                </button>
              )}
              {onDownloadInvoice && (
                <button
                  onClick={() => onDownloadInvoice(order.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Download Invoice
                </button>
              )}
              {onReorder && (
                <button
                  onClick={() => onReorder(order.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Reorder
                </button>
              )}
              {onContactSupport && (
                <button
                  onClick={() => onContactSupport(order.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Contact Support
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link
            href={`/orders/${order.id}`}
            className="text-lg font-semibold text-gray-800 hover:text-green-600"
          >
            Order #{order.orderNumber}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{formatDate(order.date)}</p>
        </div>
        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      {/* Items Preview */}
      {showItems && (
        <div className="mb-4">
          <div className="flex -space-x-2">
            {order.items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="w-10 h-10 bg-gray-100 rounded-full border-2 border-white overflow-hidden"
                title={item.name}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    📦
                  </div>
                )}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{order.items.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Items</span>
          <span className="text-gray-900">{order.items.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total</span>
          <span className="font-semibold text-gray-900">{formatCurrency(order.total)}</span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onViewDetails?.(order.id)}
            className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            View Details
          </button>
          {order.status === 'delivered' && (
            <button
              onClick={() => onReorder?.(order.id)}
              className="flex-1 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Reorder
            </button>
          )}
          {order.status === 'shipped' && onTrackOrder && (
            <button
              onClick={() => onTrackOrder(order.id)}
              className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Track
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Order card (for order history)
export function OrderCard({ order, onView }: { order: Order; onView?: (id: string) => void }) {
  return (
    <OrderSummary
      order={order}
      variant="compact"
      onViewDetails={onView}
    />
  )
}

// Detailed order view (for order details page)
export function DetailedOrderView({ order, onTrack, onReorder }: { 
  order: Order
  onTrack?: (id: string) => void
  onReorder?: (id: string) => void
}) {
  return (
    <OrderSummary
      order={order}
      variant="detailed"
      onTrackOrder={onTrack}
      onReorder={onReorder}
      onDownloadInvoice={(id) => console.log('Download invoice:', id)}
      onContactSupport={(id) => console.log('Contact support:', id)}
    />
  )
}

// Order timeline
export function OrderTimeline({ events }: { events: OrderTimelineEvent[] }) {
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex gap-3">
          <div className="relative">
            <div className="w-3 h-3 mt-1.5 rounded-full bg-green-600"></div>
            {index < events.length - 1 && (
              <div className="absolute top-4 left-1.5 w-0.5 h-12 bg-gray-200 -translate-x-1/2"></div>
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="font-medium text-gray-800">{event.status}</p>
            <p className="text-sm text-gray-600">{event.description}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span>{new Date(event.date).toLocaleString()}</span>
              {event.location && (
                <>
                  <span>•</span>
                  <span>{event.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Order status badge
export function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700'
  }

  const icons: Record<string, string> = {
    pending: '⏳',
    processing: '⚙️',
    shipped: '📦',
    delivered: '✅',
    cancelled: '❌',
    refunded: '💰'
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${colors[status]}`}>
      <span>{icons[status]}</span>
      <span className="capitalize">{status}</span>
    </span>
  )
}

// ==================== HOOK ====================

// Custom hook for order data
export function useOrder(orderId: string) {
  const [order, setOrder] = React.useState<Order | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchOrder = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock order data
      const mockOrder: Order = {
        id: orderId,
        orderNumber: 'ORD-12345',
        date: new Date().toISOString(),
        status: 'delivered',
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        shippingAddress: {
          name: 'John Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US'
        },
        items: [
          {
            id: '1',
            productId: 'prod-1',
            name: 'Product 1',
            quantity: 2,
            price: 29.99,
            total: 59.98
          }
        ],
        subtotal: 59.98,
        shippingCost: 5.00,
        taxAmount: 5.40,
        total: 70.38,
        currency: 'USD',
        paymentMethod: 'Credit Card',
        trackingNumber: '1Z999AA10123456784'
      }
      
      setOrder(mockOrder)
    } catch (err) {
      setError('Failed to load order')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchOrder()
  }, [orderId])

  return {
    order,
    loading,
    error,
    refetch: fetchOrder
  }
}