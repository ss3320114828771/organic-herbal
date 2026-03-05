import { NextResponse } from 'next/server'

// Mock orders data
const orders: any = {
  'ORD-001': {
    id: 'ORD-001',
    userId: 'user-123',
    status: 'PENDING',
    total: 299.99,
    items: [
      { productId: 'P1', name: 'Product 1', quantity: 2, price: 99.99 }
    ],
    createdAt: new Date().toISOString()
  },
  'ORD-002': {
    id: 'ORD-002',
    userId: 'user-123',
    status: 'SHIPPED',
    total: 149.99,
    items: [
      { productId: 'P2', name: 'Product 2', quantity: 1, price: 149.99 }
    ],
    createdAt: new Date().toISOString()
  }
}

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    
    const order = orders[orderId]
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: order
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    const body = await request.json()
    
    if (!orders[orderId]) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Update order
    orders[orderId] = {
      ...orders[orderId],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      order: orders[orderId]
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    
    if (!orders[orderId]) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    delete orders[orderId]

    return NextResponse.json({
      success: true,
      message: 'Order deleted'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}