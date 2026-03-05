import { NextResponse } from 'next/server'
import { mockDb } from '@/lib/db'

// Simple token verification
function verifyToken(token: string): any {
  // Mock implementation - in production, use proper JWT verification
  if (token === 'mock-token' || token === 'admin-token') {
    return { id: '1', role: token === 'admin-token' ? 'admin' : 'user' }
  }
  return null
}

export async function GET(request: Request) {
  try {
    // Optional authentication for products list
    const token = request.headers.get('authorization')?.split(' ')[1]
    const user = token ? verifyToken(token) : null

    // Get all products from mockDb
    const products = await mockDb.find('products')
    
    return NextResponse.json({ 
      success: true, 
      products,
      user: user ? { id: user.id, role: user.role } : null
    })
  } catch (error) {
    console.error('Error in GET:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch products' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Verify authentication for creating products
    const token = request.headers.get('authorization')?.split(' ')[1]
    const user = token ? verifyToken(token) : null
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized - Valid token required' 
      }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ 
        error: 'Product name is required' 
      }, { status: 400 })
    }
    
    if (body.price === undefined || body.price === null) {
      return NextResponse.json({ 
        error: 'Product price is required' 
      }, { status: 400 })
    }

    if (isNaN(Number(body.price)) || Number(body.price) < 0) {
      return NextResponse.json({ 
        error: 'Price must be a positive number' 
      }, { status: 400 })
    }

    // Create new product in mockDb
    const newProduct = await mockDb.create('products', {
      name: body.name,
      price: Number(body.price),
      description: body.description || '',
      stock: body.stock ? Number(body.stock) : 0,
      userId: user.id,
      createdAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      product: newProduct 
    }, { status: 201 })
  } catch (error) {
    console.error('Error in POST:', error)
    return NextResponse.json({ 
      error: 'Failed to create product' 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Verify authentication for updating products
    const token = request.headers.get('authorization')?.split(' ')[1]
    const user = token ? verifyToken(token) : null
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Unauthorized - Valid token required' 
      }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await mockDb.findById('products', body.id)
    if (!existingProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    // Validate price if provided
    if (body.price !== undefined && (isNaN(Number(body.price)) || Number(body.price) < 0)) {
      return NextResponse.json({ 
        error: 'Price must be a positive number' 
      }, { status: 400 })
    }

    // Update product in mockDb
    const updatedProduct = await mockDb.update('products', body.id, {
      name: body.name || existingProduct.name,
      price: body.price !== undefined ? Number(body.price) : existingProduct.price,
      description: body.description !== undefined ? body.description : existingProduct.description,
      stock: body.stock !== undefined ? Number(body.stock) : existingProduct.stock,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct 
    })
  } catch (error) {
    console.error('Error in PUT:', error)
    return NextResponse.json({ 
      error: 'Failed to update product' 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Verify authentication for deleting products
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
        error: 'Forbidden - Admin access required' 
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ 
        error: 'Product ID is required' 
      }, { status: 400 })
    }

    // Check if product exists
    const existingProduct = await mockDb.findById('products', id)
    if (!existingProduct) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 })
    }

    // Delete product from mockDb
    const deleted = await mockDb.delete('products', id)

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Error in DELETE:', error)
    return NextResponse.json({ 
      error: 'Failed to delete product' 
    }, { status: 500 })
  }
}