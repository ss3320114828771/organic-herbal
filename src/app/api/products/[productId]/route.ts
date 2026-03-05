import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// GET /api/products/[productId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    
    const product = await mockDb.findById('products', productId)

    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error in GET product:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch product' 
    }, { status: 500 })
  }
}

// PUT /api/products/[productId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ 
        error: 'Product name is required' 
      }, { status: 400 })
    }
    
    const product = await mockDb.update('products', productId, {
      ...body,
      updatedAt: new Date().toISOString()
    })

    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      product 
    })
  } catch (error) {
    console.error('Error in PUT product:', error)
    return NextResponse.json({ 
      error: 'Failed to update product' 
    }, { status: 500 })
  }
}

// DELETE /api/products/[productId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params
    
    const deleted = await mockDb.delete('products', productId)

    if (!deleted) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Error in DELETE product:', error)
    return NextResponse.json({ 
      error: 'Failed to delete product' 
    }, { status: 500 })
  }
}