'use client'

import { useState } from 'react'
import Link from 'next/link'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
  }
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  paymentMethod: string
  total: number
  items: OrderItem[]
  shippingAddress: {
    address: string
    city: string
    state: string
    zip: string
    country: string
  }
  trackingNumber?: string
  notes?: string
}

export default function AdminOrderTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState<Order['status']>('pending')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Mock data - replace with actual API call
  useState(() => {
    setTimeout(() => {
      const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
        id: (i + 1).toString(),
        orderNumber: `ORD-${String(1000 + i).padStart(4, '0')}`,
        customer: {
          name: ['John Doe', 'Jane Smith', 'Ahmed Khan', 'Fatima Ali', 'Omar Hassan'][i % 5],
          email: `customer${i + 1}@example.com`,
          phone: `+1 (555) ${String(100 + i).slice(1)}-${String(2000 + i).slice(2)}`
        },
        date: new Date(Date.now() - i * 86400000).toISOString(),
        status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][i % 5] as Order['status'],
        paymentStatus: ['paid', 'pending', 'failed', 'refunded'][i % 4] as Order['paymentStatus'],
        paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery'][i % 4],
        total: 25.99 + (i * 15),
        items: [
          {
            id: '1',
            name: 'Organic Turmeric Powder',
            quantity: 2,
            price: 24.99,
            total: 49.98
          },
          {
            id: '2',
            name: 'Ashwagandha Root',
            quantity: 1,
            price: 34.99,
            total: 34.99
          }
        ],
        shippingAddress: {
          address: `${123 + i} Main Street`,
          city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][i % 5],
          state: ['NY', 'CA', 'IL', 'TX', 'AZ'][i % 5],
          zip: `${10000 + i}`,
          country: 'United States'
        },
        trackingNumber: i % 3 === 0 ? `TRK${String(100000 + i)}` : undefined,
        notes: i % 4 === 0 ? 'Customer requested gift wrapping' : undefined
      }))
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  })

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    // Date filter
    let matchesDate = true
    const orderDate = new Date(order.date)
    const now = new Date()
    if (dateFilter === 'today') {
      matchesDate = orderDate.toDateString() === now.toDateString()
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7))
      matchesDate = orderDate >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
      matchesDate = orderDate >= monthAgo
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(currentOrders.map(o => o.id))
    }
  }

  // Select single order
  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  // Bulk actions
  const handleBulkStatusUpdate = (status: Order['status']) => {
    // API call to update status
    setOrders(prev =>
      prev.map(order =>
        selectedOrders.includes(order.id) ? { ...order, status } : order
      )
    )
    setSelectedOrders([])
    alert(`Updated ${selectedOrders.length} orders to ${status}`)
  }

  const handleBulkDelete = () => {
    setShowDeleteModal(false)
    // API call to delete orders
    setOrders(prev => prev.filter(order => !selectedOrders.includes(order.id)))
    setSelectedOrders([])
    alert(`Deleted ${selectedOrders.length} orders`)
  }

  // Export functions
  const exportToCSV = () => {
    const headers = ['Order #', 'Customer', 'Email', 'Date', 'Status', 'Payment', 'Total', 'Tracking']
    const rows = filteredOrders.map(order => [
      order.orderNumber,
      order.customer.name,
      order.customer.email,
      new Date(order.date).toLocaleDateString(),
      order.status,
      order.paymentStatus,
      `$${order.total.toFixed(2)}`,
      order.trackingNumber || 'N/A'
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const exportToPDF = () => {
    // PDF export logic would go here
    alert('PDF export coming soon!')
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Orders</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total: {filteredOrders.length} orders
              {selectedOrders.length > 0 && ` (${selectedOrders.length} selected)`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <span>🔍</span>
              Filters
            </button>
            
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>📥</span>
              Export
            </button>

            {selectedOrders.length > 0 && (
              <>
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search orders by number, customer, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setDateFilter('all')
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Order #</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Customer</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Payment</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Total</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleSelectOrder(order.id)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                </td>
                <td className="p-4">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-green-600 hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-800">{order.customer.name}</p>
                    <p className="text-sm text-gray-500">{order.customer.email}</p>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-gray-800">{new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.date).toLocaleTimeString()}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{order.paymentMethod}</p>
                </td>
                <td className="p-4 font-semibold text-gray-800">
                  {formatCurrency(order.total)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowDetailsModal(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setNewStatus(order.status)
                        setShowStatusModal(true)
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Update Status"
                    >
                      ✏️
                    </button>
                    {order.trackingNumber && (
                      <button
                        onClick={() => window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank')}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Track Order"
                      >
                        🚚
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
        </p>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Export Orders</h3>
            
            <div className="space-y-4 mb-6">
              <button
                onClick={exportToCSV}
                className="w-full p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-left"
              >
                <p className="font-semibold">Export as CSV</p>
                <p className="text-sm text-green-600">Download for Excel, Google Sheets</p>
              </button>
              
              <button
                onClick={exportToPDF}
                className="w-full p-4 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors text-left"
              >
                <p className="font-semibold">Export as PDF</p>
                <p className="text-sm text-red-600">Download as PDF document</p>
              </button>
            </div>

            <button
              onClick={() => setShowExportModal(false)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="font-bold text-gray-800">{selectedOrder.orderNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-bold text-gray-800">{new Date(selectedOrder.date).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Payment</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                  {selectedOrder.paymentStatus}
                </span>
                <p className="text-xs text-gray-500 mt-1">{selectedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Customer Information</h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-medium text-gray-800">{selectedOrder.customer.name}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Shipping Address</h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
              <div className="bg-gray-50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left text-sm">Product</th>
                      <th className="p-3 text-left text-sm">Qty</th>
                      <th className="p-3 text-left text-sm">Price</th>
                      <th className="p-3 text-left text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{formatCurrency(item.price)}</td>
                        <td className="p-3 font-medium">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td colSpan={3} className="p-3 text-right font-medium">Total:</td>
                      <td className="p-3 font-bold text-green-700">{formatCurrency(selectedOrder.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Tracking Info */}
            {selectedOrder.trackingNumber && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Tracking Information</h4>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-mono font-medium">{selectedOrder.trackingNumber}</p>
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Order Notes</h4>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-700">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {selectedOrder ? 'Update Order Status' : 'Bulk Update Status'}
            </h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as Order['status'])}
              className="w-full p-3 border border-gray-200 rounded-xl mb-6"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (selectedOrder) {
                    // Update single order
                    setOrders(prev =>
                      prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o)
                    )
                  } else {
                    // Bulk update
                    handleBulkStatusUpdate(newStatus)
                  }
                  setShowStatusModal(false)
                  setSelectedOrder(null)
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setSelectedOrder(null)
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedOrders.length} selected order{selectedOrders.length > 1 ? 's' : ''}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleBulkDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}