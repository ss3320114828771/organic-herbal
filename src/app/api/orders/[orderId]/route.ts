import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// GET /api/orders/[orderId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    
    const order = await mockDb.findById('orders', orderId)

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      order 
    })
  } catch (error) {
    console.error('Error in GET order:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch order' 
    }, { status: 500 })
  }
}

// PUT /api/orders/[orderId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.orderNumber) {
      return NextResponse.json({ 
        error: 'Order number is required' 
      }, { status: 400 })
    }
    
    const order = await mockDb.update('orders', orderId, {
      ...body,
      updatedAt: new Date().toISOString()
    })

    if (!order) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      order 
    })
  } catch (error) {
    console.error('Error in PUT order:', error)
    return NextResponse.json({ 
      error: 'Failed to update order' 
    }, { status: 500 })
  }
}

// DELETE /api/orders/[orderId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    
    const deleted = await mockDb.delete('orders', orderId)

    if (!deleted) {
      return NextResponse.json({ 
        error: 'Order not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Order deleted successfully' 
    })
  } catch (error) {
    console.error('Error in DELETE order:', error)
    return NextResponse.json({ 
      error: 'Failed to delete order' 
    }, { status: 500 })
  }
}