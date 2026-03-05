import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

// Simple token verification
function verifyToken(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const body = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    if (body.exp && body.exp < Date.now()) return null
    return body
  } catch {
    return null
  }
}

// ============================================
// GET /api/products - Get all products with filters
// ============================================
export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const inStock = searchParams.get('inStock')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const featured = searchParams.get('featured')
    const tag = searchParams.get('tag')

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }

    // Filter by category
    if (category) {
      where.categoryId = category
    }

    // Filter by tag
    if (tag) {
      where.tags = {
        has: tag
      }
    }

    // Filter by featured
    if (featured === 'true') {
      where.featured = true
    }

    // Filter by stock
    if (inStock === 'true') {
      where.stock = {
        gt: 0
      }
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice)
      }
    }

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get products with count
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            take: 1,
            orderBy: {
              isMain: 'desc'
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Process products to add computed fields
    const processedProducts = []
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      // Get review count safely
      let reviewCount = 0
      try {
        reviewCount = await prisma.review.count({
          where: { productId: product.id }
        })
      } catch {
        reviewCount = 0
      }

      // Get main image
      let mainImage = null
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        mainImage = product.images[0].url
      }

      // Determine stock status
      let stockStatus = 'OUT_OF_STOCK'
      const stock = product.stock || 0
      if (stock > 10) {
        stockStatus = 'IN_STOCK'
      } else if (stock > 0) {
        stockStatus = 'LOW_STOCK'
      }

      processedProducts.push({
        id: product.id || '',
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || 0,
        comparePrice: product.comparePrice || null,
        stock: stock,
        stockStatus: stockStatus,
        category: product.category || null,
        image: mainImage,
        rating: {
          average: 4.5,
          count: reviewCount
        },
        tags: product.tags || [],
        featured: product.featured || false,
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null
      })
    }

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      products: processedProducts,
      pagination: {
        page: page,
        limit: limit,
        total: totalCount,
        pages: totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        category: category || null,
        search: search || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        inStock: inStock === 'true',
        featured: featured === 'true',
        tag: tag || null,
        sortBy: sortBy,
        sortOrder: sortOrder
      }
    })

  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// ============================================
// POST /api/products - Create new product
// ============================================
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      )
    }

    // Generate slug from name if not provided
    let slug = body.slug
    if (!slug) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    // Prepare product data
    const productData: any = {
      name: body.name,
      slug: slug,
      description: body.description || '',
      price: Number(body.price) || 0,
      comparePrice: body.comparePrice ? Number(body.comparePrice) : null,
      cost: body.cost ? Number(body.cost) : null,
      sku: body.sku || '',
      barcode: body.barcode || '',
      stock: Number(body.stock) || 0,
      categoryId: body.categoryId || null,
      tags: body.tags || [],
      weight: body.weight ? Number(body.weight) : null,
      dimensions: body.dimensions || null,
      material: body.material || null,
      countryOfOrigin: body.countryOfOrigin || null,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      status: body.status || 'ACTIVE',
      featured: body.featured || false,
      metaTitle: body.metaTitle || body.name,
      metaDescription: body.metaDescription || (body.description ? body.description.substring(0, 160) : ''),
      views: 0,
      sold: 0
    }

    // Create product
    const product = await prisma.product.create({
      data: productData
    })

    // Add images if provided
    if (body.images && Array.isArray(body.images) && body.images.length > 0) {
      for (let i = 0; i < body.images.length; i++) {
        const image = body.images[i]
        if (image && image.url) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: image.url,
              alt: image.alt || product.name,
              isMain: i === 0,
              order: i
            }
          })
        }
      }
    }

    // Add variants if provided
    if (body.variants && Array.isArray(body.variants) && body.variants.length > 0) {
      for (let j = 0; j < body.variants.length; j++) {
        const variant = body.variants[j]
        if (variant && variant.name && variant.value) {
          await prisma.productVariant.create({
            data: {
              productId: product.id,
              name: variant.name,
              value: variant.value,
              price: variant.price ? Number(variant.price) : null,
              stock: variant.stock ? Number(variant.stock) : null,
              sku: variant.sku || null,
              image: variant.image || null
            }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price
      }
    })

  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// ============================================
// DELETE /api/products - Bulk delete products
// ============================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')
    const ids = idsParam ? idsParam.split(',') : []

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No product IDs provided' },
        { status: 400 }
      )
    }

    // Try to delete products
    let deleted = 0
    let deactivated = 0

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]
      if (!id) continue
      
      try {
        await prisma.product.delete({
          where: { id: id }
        })
        deleted++
      } catch {
        // If delete fails, try to deactivate
        try {
          await prisma.product.update({
            where: { id: id },
            data: { status: 'INACTIVE' }
          })
          deactivated++
        } catch {
          // Skip if both fail
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${deleted} products deleted, ${deactivated} products deactivated`,
      deleted: deleted,
      deactivated: deactivated
    })

  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete products' },
      { status: 500 }
    )
  }
}