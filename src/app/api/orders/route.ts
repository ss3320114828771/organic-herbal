import { NextResponse } from 'next/server'

// Mock orders data
let orders: any[] = [
  {
    id: '1',
    orderNumber: 'ORD-2401-0001',
    userId: 'user1',
    status: 'PENDING',
    total: 299.99,
    items: [
      { productId: 'p1', name: 'Product 1', quantity: 2, price: 99.99 }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    orderNumber: 'ORD-2401-0002',
    userId: 'user1',
    status: 'SHIPPED',
    total: 149.99,
    items: [
      { productId: 'p2', name: 'Product 2', quantity: 1, price: 149.99 }
    ],
    createdAt: new Date().toISOString()
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let filteredOrders = orders
    
    if (userId) {
      filteredOrders = orders.filter(o => o.userId === userId)
    }

    return NextResponse.json({
      success: true,
      orders: filteredOrders
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newOrder = {
      id: (orders.length + 1).toString(),
      orderNumber: `ORD-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    }
    
    orders.push(newOrder)

    return NextResponse.json({
      success: true,
      order: newOrder
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (id) {
      orders = orders.filter(o => o.id !== id)
    } else {
      orders = []
    }

    return NextResponse.json({
      success: true,
      message: 'Orders deleted'
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete orders' },
      { status: 500 }
    )
  }
}