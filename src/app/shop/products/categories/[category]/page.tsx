'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  image: string
  category: string
  subcategory: string
  rating: number
  reviewCount: number
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
  origin?: string
}

interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
  subcategories: string[]
}

interface FilterState {
  priceRange: [number, number]
  inStock: boolean
  rating: number | null
  sortBy: 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating'
  subcategories: string[]
  origins: string[]
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 200],
    inStock: false,
    rating: null,
    sortBy: 'popular',
    subcategories: [],
    origins: []
  })

  // Available filter options (would come from API)
  const availableSubcategories = [
    'Powders',
    'Capsules',
    'Teas',
    'Oils',
    'Extracts',
    'Whole Herbs'
  ]
  
  const availableOrigins = [
    'India',
    'China',
    'Egypt',
    'Morocco',
    'USA',
    'Turkey'
  ]

  useEffect(() => {
    setMounted(true)
    fetchCategoryData()
  }, [category])

  useEffect(() => {
    if (mounted) {
      fetchProducts()
    }
  }, [category, filters, currentPage])

  const fetchCategoryData = async () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockCategory: Category = {
        id: category,
        name: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: `Explore our premium collection of ${category.split('-').join(' ')}. Sourced from the finest farms and certified organic.`,
        image: '/categories/herbs.jpg',
        productCount: 156,
        subcategories: ['Powders', 'Capsules', 'Teas', 'Oils', 'Extracts']
      }
      setCategoryInfo(mockCategory)
    }, 500)
  }

  const fetchProducts = async () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        name: `${['Organic', 'Premium', 'Pure'][i % 3]} ${['Turmeric', 'Ashwagandha', 'Moringa', 'Neem', 'Brahmi', 'Amla'][i % 6]} ${['Powder', 'Capsules', 'Extract'][i % 3]}`,
        description: 'High-quality organic herb with numerous health benefits.',
        price: 14.99 + (i * 5),
        compareAtPrice: i % 3 === 0 ? 24.99 + (i * 5) : undefined,
        image: '/products/placeholder.jpg',
        category: category,
        subcategory: availableSubcategories[i % availableSubcategories.length],
        rating: 3.5 + (i % 3),
        reviewCount: 10 + (i * 5),
        inStock: i % 4 !== 0,
        isNew: i % 5 === 0,
        isBestseller: i % 7 === 0,
        origin: availableOrigins[i % availableOrigins.length]
      }))
      
      // Apply filters (mock filtering)
      let filteredProducts = [...mockProducts]
      
      // Price range filter
      filteredProducts = filteredProducts.filter(p => 
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      )
      
      // In stock filter
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(p => p.inStock)
      }
      
      // Rating filter
      if (filters.rating) {
        filteredProducts = filteredProducts.filter(p => p.rating >= (filters.rating || 0))
      }
      
      // Subcategory filter
      if (filters.subcategories.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          filters.subcategories.includes(p.subcategory)
        )
      }
      
      // Origin filter
      if (filters.origins.length > 0) {
        filteredProducts = filteredProducts.filter(p => 
          p.origin && filters.origins.includes(p.origin)
        )
      }
      
      // Apply sorting
      switch(filters.sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          // In real app, sort by date
          filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
          break
        default: // popular
          filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
      }
      
      setProducts(filteredProducts)
      setTotalPages(Math.ceil(filteredProducts.length / 12))
      setLoading(false)
    }, 1000)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSubcategoryToggle = (subcategory: string) => {
    setFilters(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory]
    }))
    setCurrentPage(1)
  }

  const handleOriginToggle = (origin: string) => {
    setFilters(prev => ({
      ...prev,
      origins: prev.origins.includes(origin)
        ? prev.origins.filter(o => o !== origin)
        : [...prev.origins, origin]
    }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 200],
      inStock: false,
      rating: null,
      sortBy: 'popular',
      subcategories: [],
      origins: []
    })
    setCurrentPage(1)
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-400">★</span>)
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-400">½</span>)
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>)
      }
    }
    return stars
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (!categoryInfo && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Bismillah */}
        <div className="text-center mb-8">
          <p className="text-green-800 text-2xl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
            <span>/</span>
            <Link href="/shop/categories" className="hover:text-green-600 transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium capitalize">{category}</span>
          </nav>
        </div>

        {/* Category Header */}
        {categoryInfo && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-100 rounded-full -ml-24 -mb-24 opacity-50"></div>
            
            <div className="relative">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 capitalize">
                {categoryInfo.name}
              </h1>
              <p className="text-gray-600 max-w-3xl mb-4">{categoryInfo.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {categoryInfo.productCount} Products
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {categoryInfo.subcategories.length} Subcategories
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="w-full px-6 py-3 bg-white text-gray-700 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <span>⚙️</span>
            Filters & Sorting
          </button>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Clear All
                </button>
              </div>

              {/* Sort By */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                    className="w-1/2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                    className="w-1/2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-600">In Stock Only</span>
                </label>
              </div>

              {/* Rating */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleFilterChange('rating', rating)}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <span className="flex items-center gap-1">
                        {renderStars(rating)}
                        <span className="text-gray-500 text-sm ml-1">& up</span>
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === null}
                      onChange={() => handleFilterChange('rating', null)}
                      className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-600">Any Rating</span>
                  </label>
                </div>
              </div>

              {/* Subcategories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Subcategories</h3>
                <div className="space-y-2">
                  {availableSubcategories.map((subcategory) => (
                    <label key={subcategory} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.subcategories.includes(subcategory)}
                        onChange={() => handleSubcategoryToggle(subcategory)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-600">{subcategory}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Origin</h3>
                <div className="space-y-2">
                  {availableOrigins.map((origin) => (
                    <label key={origin} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.origins.includes(origin)}
                        onChange={() => handleOriginToggle(origin)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-600">{origin}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or browse all products.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Showing <span className="font-semibold">{products.length}</span> products
                  </p>
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice((currentPage - 1) * 12, currentPage * 12).map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/products/${product.id}`}
                      className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all"
                    >
                      {/* Product Badges */}
                      <div className="relative">
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                          {product.isNew && (
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                              New
                            </span>
                          )}
                          {product.isBestseller && (
                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                              Bestseller
                            </span>
                          )}
                          {product.compareAtPrice && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                              Sale
                            </span>
                          )}
                        </div>
                        
                        {/* Product Image */}
                        <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                          <span className="text-6xl group-hover:scale-110 transition-transform">
                            {product.category === 'herbs' ? '🌿' : '🌱'}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{product.subcategory}</span>
                          {product.origin && (
                            <span className="text-xs text-green-600">{product.origin}</span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(product.rating)}
                          <span className="text-sm text-gray-500 ml-1">
                            ({product.reviewCount})
                          </span>
                        </div>
                        
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-bold text-green-700">
                            {formatCurrency(product.price)}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          {product.inStock ? (
                            <span className="text-xs text-green-600 flex items-center">
                              <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs text-red-600 flex items-center">
                              <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
                              Out of Stock
                            </span>
                          )}
                          
                          <button 
                            onClick={(e) => {
                              e.preventDefault()
                              // Add to cart functionality
                            }}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl transition-colors ${
                          currentPage === page
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white text-gray-600 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Category Features */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🌿</div>
            <h4 className="font-semibold text-gray-800 text-sm">100% Organic</h4>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <h4 className="font-semibold text-gray-800 text-sm">Halal Certified</h4>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🚚</div>
            <h4 className="font-semibold text-gray-800 text-sm">Free Shipping</h4>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💯</div>
            <h4 className="font-semibold text-gray-800 text-sm">Quality Guaranteed</h4>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Same filter content as desktop */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Sort By</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                    className="w-1/2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                    className="w-1/2 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-600">In Stock Only</span>
                </label>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-rating"
                        checked={filters.rating === rating}
                        onChange={() => handleFilterChange('rating', rating)}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <span className="flex items-center gap-1">
                        {renderStars(rating)}
                        <span className="text-gray-500 text-sm ml-1">& up</span>
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-rating"
                      checked={filters.rating === null}
                      onChange={() => handleFilterChange('rating', null)}
                      className="w-5 h-5 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-600">Any Rating</span>
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Subcategories</h3>
                <div className="space-y-2">
                  {availableSubcategories.map((subcategory) => (
                    <label key={subcategory} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.subcategories.includes(subcategory)}
                        onChange={() => handleSubcategoryToggle(subcategory)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-600">{subcategory}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 mb-3">Origin</h3>
                <div className="space-y-2">
                  {availableOrigins.map((origin) => (
                    <label key={origin} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.origins.includes(origin)}
                        onChange={() => handleOriginToggle(origin)}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-gray-600">{origin}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                Admin: Hafiz Sajid Syed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}