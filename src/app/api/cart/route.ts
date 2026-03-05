import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      cart: { items: [], total: 0 }
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to get cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item added',
      item: body
    })
    
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Cart cleared' 
    })
    
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}