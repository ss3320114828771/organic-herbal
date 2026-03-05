// lib/services/order-service.ts

// Types
export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
}

export interface ShippingAddress {
  name: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'paid' | 'unpaid' | 'refunded' | 'failed'
  paymentMethod: string
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  trackingNumber?: string
  carrier?: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface CreateOrderData {
  userId?: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  paymentMethod: string
  notes?: string
}

export interface UpdateOrderData {
  status?: Order['status']
  paymentStatus?: Order['paymentStatus']
  trackingNumber?: string
  carrier?: string
  notes?: string
}

// Mock database
let orders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    userId: '1',
    items: [
      {
        id: '1',
        productId: 'p1',
        name: 'Product 1',
        price: 29.99,
        quantity: 2,
        image: '/product1.jpg'
      }
    ],
    subtotal: 59.98,
    shipping: 5.00,
    tax: 5.40,
    discount: 0,
    total: 70.38,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'US'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    userId: '2',
    items: [
      {
        id: '2',
        productId: 'p2',
        name: 'Product 2',
        price: 49.99,
        quantity: 1,
        image: '/product2.jpg'
      }
    ],
    subtotal: 49.99,
    shipping: 5.00,
    tax: 4.50,
    discount: 0,
    total: 59.49,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    shippingAddress: {
      name: 'Jane Smith',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'US'
    },
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    createdAt: new Date().toISOString()
  }
]

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${timestamp}${random}`
}

// Calculate order totals
function calculateTotals(items: OrderItem[], discount: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 5.00
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax - discount

  return { subtotal, shipping, tax, total }
}

// Create new order
export async function createOrder(data: CreateOrderData): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'Order must contain at least one item' }
    }

    if (!data.shippingAddress) {
      return { success: false, error: 'Shipping address is required' }
    }

    const { subtotal, shipping, tax, total } = calculateTotals(data.items)

    const newOrder: Order = {
      id: String(orders.length + 1),
      orderNumber: generateOrderNumber(),
      userId: data.userId,
      items: data.items,
      subtotal,
      shipping,
      tax,
      discount: 0,
      total,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress || data.shippingAddress,
      notes: data.notes,
      createdAt: new Date().toISOString()
    }

    orders.push(newOrder)
    
    return { success: true, order: newOrder }
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create order' }
  }
}

// Get order by ID
export async function getOrder(orderId: string): Promise<Order | undefined> {
  return orders.find(o => o.id === orderId)
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  return orders.find(o => o.orderNumber === orderNumber)
}

// Get user orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  return orders.filter(o => o.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Get all orders (admin)
export async function getAllOrders(): Promise<Order[]> {
  return orders.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// Update order
export async function updateOrder(
  orderId: string,
  data: UpdateOrderData
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    const order = orders.find(o => o.id === orderId)
    
    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    Object.assign(order, data, { updatedAt: new Date().toISOString() })
    
    return { success: true, order }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<{ success: boolean; error?: string }> {
  const result = await updateOrder(orderId, { status })
  return { success: result.success, error: result.error }
}

// Update payment status
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: Order['paymentStatus']
): Promise<{ success: boolean; error?: string }> {
  const result = await updateOrder(orderId, { paymentStatus })
  return { success: result.success, error: result.error }
}

// Add tracking info
export async function addTrackingInfo(
  orderId: string,
  trackingNumber: string,
  carrier: string
): Promise<{ success: boolean; error?: string }> {
  const result = await updateOrder(orderId, { 
    trackingNumber, 
    carrier,
    status: 'shipped'
  })
  return { success: result.success, error: result.error }
}

// Cancel order
export async function cancelOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  const order = await getOrder(orderId)
  
  if (!order) {
    return { success: false, error: 'Order not found' }
  }

  if (order.status === 'delivered') {
    return { success: false, error: 'Cannot cancel delivered order' }
  }

  if (order.status === 'cancelled') {
    return { success: false, error: 'Order already cancelled' }
  }

  return updateOrderStatus(orderId, 'cancelled')
}

// Delete order (admin only)
export async function deleteOrder(orderId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const index = orders.findIndex(o => o.id === orderId)
    
    if (index === -1) {
      return { success: false, error: 'Order not found' }
    }

    orders.splice(index, 1)
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Get order statistics
export async function getOrderStats(): Promise<{
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
}> {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const processingOrders = orders.filter(o => o.status === 'processing').length
  const shippedOrders = orders.filter(o => o.status === 'shipped').length
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders
  }
}

// Search orders
export async function searchOrders(query: string): Promise<Order[]> {
  const lowercaseQuery = query.toLowerCase()
  
  return orders.filter(o => 
    o.orderNumber.toLowerCase().includes(lowercaseQuery) ||
    o.shippingAddress.name.toLowerCase().includes(lowercaseQuery) ||
    o.items.some(item => item.name.toLowerCase().includes(lowercaseQuery))
  )
}

// Filter orders by date range
export async function getOrdersByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Order[]> {
  return orders.filter(o => {
    const orderDate = new Date(o.createdAt)
    return orderDate >= startDate && orderDate <= endDate
  })
}

// Example usage
export async function example() {
  // Create order
  const newOrder = await createOrder({
    userId: '1',
    items: [
      {
        id: '1',
        productId: 'p1',
        name: 'Product 1',
        price: 29.99,
        quantity: 2
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'US'
    },
    paymentMethod: 'credit_card'
  })

  if (newOrder.success) {
    console.log('Order created:', newOrder.order?.orderNumber)
  }

  // Get user orders
  const userOrders = await getUserOrders('1')
  console.log('User orders:', userOrders.length)

  // Update order status
  if (newOrder.order) {
    await updateOrderStatus(newOrder.order.id, 'processing')
    await addTrackingInfo(newOrder.order.id, '1Z999AA10123456784', 'UPS')
  }

  // Get stats
  const stats = await getOrderStats()
  console.log('Total revenue:', stats.totalRevenue)

  // Search orders
  const searchResults = await searchOrders('Product')
  console.log('Search results:', searchResults.length)
}