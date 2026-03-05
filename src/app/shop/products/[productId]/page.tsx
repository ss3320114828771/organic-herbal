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
  images: string[]
  category: string
  subcategory?: string
  tags: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  quantityAvailable: number
  sku: string
  weight?: string
  origin?: string
  benefits: string[]
  ingredients?: string[]
  howToUse?: string
  warnings?: string[]
  reviews: Review[]
  relatedProducts: string[]
}

interface Review {
  id: string
  userName: string
  rating: number
  date: string
  title: string
  comment: string
  verified: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.productId as string
  const [mounted, setMounted] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [showEnquiryModal, setShowEnquiryModal] = useState(false)
  const [enquiryMessage, setEnquiryMessage] = useState('')
  const [addedToCart, setAddedToCart] = useState(false)
  const [addedToWishlist, setAddedToWishlist] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    setLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockProduct: Product = {
        id: productId,
        name: 'Organic Turmeric Powder',
        description: 'Premium quality organic turmeric powder sourced from sustainable farms. Known for its anti-inflammatory properties and rich golden color. Perfect for cooking, golden milk, and wellness routines.',
        price: 24.99,
        compareAtPrice: 34.99,
        images: [
          '/products/turmeric-1.jpg',
          '/products/turmeric-2.jpg',
          '/products/turmeric-3.jpg',
          '/products/turmeric-4.jpg'
        ],
        category: 'Spices',
        subcategory: 'Powders',
        tags: ['organic', 'turmeric', 'anti-inflammatory', 'halal'],
        rating: 4.8,
        reviewCount: 127,
        inStock: true,
        quantityAvailable: 45,
        sku: 'SP-ORG-TUR-001',
        weight: '250g',
        origin: 'India',
        benefits: [
          'Anti-inflammatory properties',
          'Rich in antioxidants',
          'Supports joint health',
          'Boosts immunity',
          '100% organic & halal certified'
        ],
        ingredients: ['100% Organic Turmeric Powder'],
        howToUse: 'Add 1 tsp to curries, smoothies, or warm milk. For best results, consume with black pepper to enhance absorption.',
        warnings: [
          'Consult healthcare provider before use if pregnant or nursing',
          'Store in a cool, dry place away from direct sunlight'
        ],
        reviews: [
          {
            id: '1',
            userName: 'Ahmed Khan',
            rating: 5,
            date: '2024-01-10T10:30:00Z',
            title: 'Excellent quality!',
            comment: 'Very fresh and aromatic. The color is beautiful and it tastes great in my golden milk.',
            verified: true
          },
          {
            id: '2',
            userName: 'Fatima Ali',
            rating: 4,
            date: '2024-01-05T14:20:00Z',
            title: 'Good product',
            comment: 'Quality is good, packaging could be better. But overall satisfied.',
            verified: true
          }
        ],
        relatedProducts: ['2', '3', '4']
      }
      setProduct(mockProduct)
      setLoading(false)
    }, 1000)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleQuantityChange = (change: number) => {
    if (!product) return
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.quantityAvailable) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    setAddedToCart(true)
    // API call to add to cart
    setTimeout(() => {
      setAddedToCart(false)
      router.push('/shop/cart')
    }, 1500)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Will redirect to checkout after adding to cart
    setTimeout(() => {
      router.push('/shop/checkout')
    }, 1600)
  }

  const handleAddToWishlist = () => {
    setAddedToWishlist(!addedToWishlist)
    // API call to add/remove from wishlist
  }

  const handleSubmitEnquiry = () => {
    setShowEnquiryModal(false)
    // API call to submit enquiry
    alert('Enquiry submitted successfully! We will get back to you soon.')
    setEnquiryMessage('')
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-400 text-xl">★</span>)
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-400 text-xl">½</span>)
      } else {
        stars.push(<span key={i} className="text-gray-300 text-xl">★</span>)
      }
    }
    return stars
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Continue Shopping
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
            <Link href={`/shop/category/${product.category.toLowerCase()}`} className="hover:text-green-600 transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Product Main Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                {/* Image placeholder - replace with actual Image component */}
                <div className="text-9xl text-green-600">🌿</div>
              </div>
              
              {/* Thumbnail Grid */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg overflow-hidden flex items-center justify-center transition-all
                      ${selectedImage === index ? 'ring-2 ring-green-500 scale-95' : 'hover:scale-95'}`}
                  >
                    <span className="text-2xl text-green-500">🌿</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.compareAtPrice && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                    Sale
                  </span>
                )}
                {product.origin && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                    {product.origin}
                  </span>
                )}
                {!product.inStock && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">
                    Out of Stock
                  </span>
                )}
                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm font-semibold rounded-full">
                  Halal Certified
                </span>
              </div>

              {/* Title & Rating */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
                {product.inStock ? (
                  <span className="text-green-600 text-sm flex items-center ml-auto">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    In Stock ({product.quantityAvailable})
                  </span>
                ) : (
                  <span className="text-red-600 text-sm flex items-center ml-auto">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-700">
                    {formatCurrency(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Benefits List */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Key Benefits:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-2 text-center min-w-[60px]">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.quantityAvailable}
                      className="px-4 py-2 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 ml-3">
                    Max: {product.quantityAvailable}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || addedToCart}
                    className={`flex-1 min-w-[200px] px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                      ${product.inStock 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {addedToCart ? (
                      <>
                        <span>✓</span>
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <span>🛒</span>
                        Add to Cart
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className={`flex-1 min-w-[200px] px-6 py-3 rounded-xl font-semibold transition-all
                      ${product.inStock 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Buy Now
                  </button>
                  
                  <button
                    onClick={handleAddToWishlist}
                    className={`px-4 py-3 rounded-xl border-2 transition-all
                      ${addedToWishlist 
                        ? 'border-red-500 text-red-500 bg-red-50' 
                        : 'border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500'}`}
                  >
                    {addedToWishlist ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Additional Actions */}
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => setShowEnquiryModal(true)}
                    className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                  >
                    <span>📧</span>
                    Product Enquiry
                  </button>
                  <button className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1">
                    <span>📋</span>
                    Add to Compare
                  </button>
                  <button className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1">
                    <span>↗️</span>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 mb-8">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {['description', 'ingredients', 'how to use', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize whitespace-nowrap transition-all
                  ${activeTab === tab 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <p className="text-gray-600">{product.description}</p>
                <h4 className="font-semibold text-gray-800 mt-4">Product Highlights:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>100% organic and naturally grown</li>
                  <li>Halal certified by recognized authorities</li>
                  <li>No artificial additives or preservatives</li>
                  <li>Sustainably sourced from trusted farmers</li>
                  <li>Packaged in eco-friendly materials</li>
                </ul>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Ingredients:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {product.ingredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
                
                {product.warnings && (
                  <>
                    <h4 className="font-semibold text-gray-800 mt-4">Warnings:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {product.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === 'how to use' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">How to Use:</h4>
                <p className="text-gray-600">{product.howToUse}</p>
                
                <h4 className="font-semibold text-gray-800 mt-4">Storage Instructions:</h4>
                <p className="text-gray-600">Store in a cool, dry place away from direct sunlight. Keep container tightly closed when not in use.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800">{product.rating}</div>
                    <div className="flex items-center justify-center mt-2">
                      {renderStars(product.rating)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</div>
                  </div>
                  
                  <button className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                    Write a Review
                  </button>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold text-gray-800">{review.userName}</span>
                          {review.verified && (
                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <h5 className="font-semibold text-gray-800 mb-1">{review.title}</h5>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <Link
                key={item}
                href={`/shop/products/${item}`}
                className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 hover:shadow-lg transition-all"
              >
                <div className="aspect-square mb-3 flex items-center justify-center">
                  <span className="text-4xl group-hover:scale-110 transition-transform">🌿</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
                  Related Product {item}
                </h3>
                <p className="text-green-700 font-bold">$24.99</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Product Enquiry</h3>
            <p className="text-gray-600 mb-4">
              Ask us anything about {product.name}
            </p>
            
            <textarea
              value={enquiryMessage}
              onChange={(e) => setEnquiryMessage(e.target.value)}
              placeholder="Type your question here..."
              rows={5}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEnquiry}
                disabled={!enquiryMessage.trim()}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Enquiry
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Admin: Hafiz Sajid Syed
            </p>
          </div>
        </div>
      )}
    </div>
  )
}