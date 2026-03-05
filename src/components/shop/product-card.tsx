'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, quantity?: number) => void
  onAddToWishlist?: (productId: string) => void
  onRemoveFromWishlist?: (productId: string) => void
  onQuickView?: (productId: string) => void
  onCompare?: (productId: string) => void
  variant?: 'default' | 'compact' | 'horizontal' | 'minimal' | 'featured'
  imageSize?: 'sm' | 'md' | 'lg' | 'xl'
  showBadges?: boolean
  showRating?: boolean
  showReviews?: boolean
  showStock?: boolean
  showActions?: boolean
  showCompare?: boolean
  showWishlist?: boolean
  isWishlisted?: boolean
  className?: string
  priority?: boolean
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image?: string
  images?: string[]
  category?: string
  rating?: number
  reviewCount?: number
  stock?: number
  brand?: string
  description?: string
  shortDescription?: string
  tags?: string[]
  isNew?: boolean
  isFeatured?: boolean
  isOnSale?: boolean
  discount?: number
  colors?: string[]
  sizes?: string[]
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onQuickView,
  onCompare,
  variant = 'default',
  imageSize = 'md',
  showBadges = true,
  showRating = true,
  showReviews = true,
  showStock = true,
  showActions = true,
  showCompare = false,
  showWishlist = true,
  isWishlisted = false,
  className = '',
  priority = false
}: ProductCardProps) {
  const [imageError, setImageError] = React.useState(false)
  const [quantity, setQuantity] = React.useState(1)
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const discountPercentage = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0

  const inStock = product.stock === undefined || product.stock > 0
  const lowStock = product.stock !== undefined && product.stock <= 5 && product.stock > 0

  const handleAddToCart = () => {
    setIsAddingToCart(true)
    onAddToCart?.(product, quantity)
    setTimeout(() => setIsAddingToCart(false), 1000)
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      onRemoveFromWishlist?.(product.id)
    } else {
      onAddToWishlist?.(product.id)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const imageDimensions = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96'
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div className={`flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow ${className}`}>
        {/* Image */}
        <Link href={`/products/${product.slug}`} className="flex-shrink-0">
          <div className={`${imageDimensions.sm} bg-gray-100 rounded-lg overflow-hidden`}>
            {product.image && !imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                🖼️
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1">
          <Link href={`/products/${product.slug}`} className="hover:text-green-600">
            <h3 className="font-semibold text-gray-800">{product.name}</h3>
          </Link>
          
          {product.brand && (
            <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAddingToCart}
                className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? '✓ Added' : inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              {showWishlist && (
                <button
                  onClick={handleWishlistToggle}
                  className={`p-2 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
                  }`}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 ${className}`}>
        <Link href={`/products/${product.slug}`} className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            {product.image && !imageError ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                📦
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/products/${product.slug}`} className="hover:text-green-600">
            <h4 className="text-sm font-medium text-gray-800 truncate">{product.name}</h4>
          </Link>
          <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(product.price)}</p>
        </div>

        {showActions && inStock && (
          <button
            onClick={handleAddToCart}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
          >
            Add
          </button>
        )}
      </div>
    )
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <Link
        href={`/products/${product.slug}`}
        className={`block group ${className}`}
      >
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
              📦
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(product.price)}</p>
      </Link>
    )
  }

  // Featured variant
  if (variant === 'featured') {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow ${className}`}>
        <div className="relative">
          <Link href={`/products/${product.slug}`}>
            <div className={`${imageDimensions.lg} bg-gray-100`}>
              {product.image && !imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                  🖼️
                </div>
              )}
            </div>
          </Link>

          {/* Badges */}
          {showBadges && (
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                  New
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          )}

          {/* Wishlist button */}
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow ${
                isWishlisted ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <div className="p-6">
          <Link href={`/products/${product.slug}`} className="hover:text-green-600">
            <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
          </Link>

          {product.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {showRating && product.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                {showReviews && product.reviewCount && (
                  <span className="text-sm text-gray-500">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {showActions && (
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full mt-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block">
        <div className={`${imageDimensions[imageSize]} bg-gray-100`}>
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
              📦
            </div>
          )}
        </div>

        {/* Hover overlay */}
        {isHovered && onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onQuickView(product.id)
            }}
            className="absolute inset-x-4 bottom-4 py-2 bg-white bg-opacity-90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Quick View
          </button>
        )}

        {/* Badges */}
        {showBadges && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded">New</span>
            )}
            {!inStock && (
              <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded">Out of Stock</span>
            )}
            {lowStock && inStock && (
              <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded">Low Stock</span>
            )}
            {discountPercentage > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <Link
            href={`/categories/${product.category.toLowerCase()}`}
            className="text-xs text-gray-500 hover:text-green-600 uppercase tracking-wider"
          >
            {product.category}
          </Link>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`} className="block mt-1">
          <h3 className="text-sm font-medium text-gray-800 hover:text-green-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {showRating && product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-400">
                  {star <= Math.round(product.rating || 0) ? '★' : '☆'}
                </span>
              ))}
            </div>
            {showReviews && product.reviewCount && (
              <span className="text-xs text-gray-500">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {showStock && product.stock !== undefined && (
          <p className={`text-xs mt-2 ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </p>
        )}

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 3).map((color) => (
              <span
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? '✓ Added' : 'Add to Cart'}
            </button>

            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg border transition-colors ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
                }`}
              >
                {isWishlisted ? '❤️' : '🤍'}
              </button>
            )}

            {showCompare && (
              <button
                onClick={() => onCompare?.(product.id)}
                className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-green-600 hover:border-green-200 transition-colors"
                title="Compare"
              >
                🔄
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Product grid card (standard)
export function ProductGridCard({ product, onAddToCart }: { 
  product: Product
  onAddToCart?: (product: Product) => void 
}) {
  return (
    <ProductCard
      product={product}
      onAddToCart={onAddToCart}
      variant="default"
      imageSize="md"
    />
  )
}

// Product list card
export function ProductListCard({ product, onAddToCart }: { 
  product: Product
  onAddToCart?: (product: Product) => void 
}) {
  return (
    <ProductCard
      product={product}
      onAddToCart={onAddToCart}
      variant="horizontal"
      showRating={true}
      showStock={true}
    />
  )
}

// Featured product
export function FeaturedProductCard({ product, onAddToCart }: { 
  product: Product
  onAddToCart?: (product: Product) => void 
}) {
  return (
    <ProductCard
      product={product}
      onAddToCart={onAddToCart}
      variant="featured"
      imageSize="lg"
      showBadges={true}
      showRating={true}
    />
  )
}

// Mini cart product
export function MiniProductCard({ product, onAddToCart }: { 
  product: Product
  onAddToCart?: (product: Product) => void 
}) {
  return (
    <ProductCard
      product={product}
      onAddToCart={onAddToCart}
      variant="compact"
      showActions={true}
    />
  )
}

// Product suggestion
export function SuggestionCard({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      variant="minimal"
      showActions={false}
    />
  )
}

// ==================== HOOK ====================

// Custom hook for product data
export function useProduct(productId: string) {
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const fetchProduct = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockProduct: Product = {
        id: productId,
        name: 'Sample Product',
        slug: 'sample-product',
        price: 49.99,
        originalPrice: 79.99,
        image: '/images/product.jpg',
        category: 'Electronics',
        rating: 4.5,
        reviewCount: 128,
        stock: 15,
        brand: 'BrandName',
        description: 'This is a great product with many features.',
        shortDescription: 'Great product',
        isNew: true,
        isFeatured: true,
        colors: ['Red', 'Blue', 'Green'],
        sizes: ['S', 'M', 'L']
      }
      
      setProduct(mockProduct)
    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProduct()
  }, [productId])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  }
}