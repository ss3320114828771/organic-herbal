// app/api/products/[productId]/route.ts

import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

interface Params {
  params: {
    productId: string
  }
}

// Simple token verification
function verifyToken(token: string): any {
  // Mock implementation - in production, use proper JWT verification
  if (token === 'mock-token' || token === 'admin-token') {
    return { 
      id: '1', 
      role: token === 'admin-token' ? 'admin' : 'user' 
    }
  }
  return null
}

// GET /api/products/[productId] - Get single product
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const productId = params.productId
    
    // Optional authentication
    const token = request.headers.get('authorization')?.split(' ')[1]
    const user = token ? verifyToken(token) : null

    // Find product by ID
    const product = await mockDb.findById('products', productId)

    if (!product) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      product,
      user: user ? { id: user.id, role: user.role } : null
    })
  } catch (error) {
    console.error('Error in GET product by ID:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch product' 
    }, { status: 500 })
  }
}

// PUT /api/products/[productId] - Update product
export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const productId = params.productId

    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1]
    const user = token ? verifyToken(token) : null
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized - Valid token required' 
      }, { status: 401 })
    }

    // Check if product exists
    const existingProduct = await mockDb.findById('products', productId)
    if (!existingProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    const body = await request.json()
    
    // Validate fields
    if (body.name !== undefined && body.name.trim() === '') {
      return NextResponse.json({ 
        error: 'Product name cannot be empty' 
      }, { status: 400 })
    }
    
    if (body.price !== undefined && (isNaN(Number(body.price)) || Number(body.price) < 0)) {
      return NextResponse.json({ 
        error: 'Price must be a positive number' 
      }, { status: 400 })
    }

    if (body.stock !== undefined && (isNaN(Number(body.stock)) || Number(body.stock) < 0)) {
      return NextResponse.json({ 
        error: 'Stock must be a positive number' 
      }, { status: 400 })
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.price !== undefined) updateData.price = Number(body.price)
    if (body.description !== undefined) updateData.description = body.description
    if (body.stock !== undefined) updateData.stock = Number(body.stock)

    // Update product
    const updatedProduct = await mockDb.update('products', productId, updateData)

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT product:', error)
    return NextResponse.json({ 
      error: 'Failed to update product' 
    }, { status: 500 })
  }
}

// PATCH /api/products/[productId] - Partially update product
export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const productId = params.productId

    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1]
    const user = token ? verifyToken(token) : null
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized - Valid token required' 
      }, { status: 401 })
    }

    // Check if product exists
    const existingProduct = await mockDb.findById('products', productId)
    if (!existingProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    const body = await request.json()
    
    // Validate fields if provided
    if (body.price !== undefined && (isNaN(Number(body.price)) || Number(body.price) < 0)) {
      return NextResponse.json({ 
        error: 'Price must be a positive number' 
      }, { status: 400 })
    }

    if (body.stock !== undefined && (isNaN(Number(body.stock)) || Number(body.stock) < 0)) {
      return NextResponse.json({ 
        error: 'Stock must be a positive number' 
      }, { status: 400 })
    }

    // Prepare update data (only provided fields)
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.price !== undefined) updateData.price = Number(body.price)
    if (body.description !== undefined) updateData.description = body.description
    if (body.stock !== undefined) updateData.stock = Number(body.stock)

    // Update product
    const updatedProduct = await mockDb.update('products', productId, updateData)

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error in PATCH product:', error)
    return NextResponse.json({ 
      error: 'Failed to update product' 
    }, { status: 500 })
  }
}

// DELETE /api/products/[productId] - Delete product
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const productId = params.productId

    // Verify authentication
    const token = request.headers.get('authorization')?.split(' ')[1]
    const user = token ? verifyToken(token) : null
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized - Valid token required' 
      }, { status: 401 })
    }

    // Check if user is admin (optional - based on your requirements)
    if (user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Admin access required to delete products' 
      }, { status: 403 })
    }

    // Check if product exists
    const existingProduct = await mockDb.findById('products', productId)
    if (!existingProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    // Delete product
    const deleted = await mockDb.delete('products', productId)

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