'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Image gallery data with n1.jpeg through n6.jpeg
  const galleryImages = [
    { id: 1, src: '/n1.jpeg', alt: 'Organic Herbal Products Display', category: 'products', title: 'Organic Turmeric Powder' },
    { id: 2, src: '/n2.jpeg', alt: 'Herbal Tea Collection', category: 'teas', title: 'Herbal Tea Collection' },
    { id: 3, src: '/n3.jpeg', alt: 'Natural Herbs', category: 'herbs', title: 'Natural Healing Herbs' },
    { id: 4, src: '/n4.jpeg', alt: 'Ayurvedic Products', category: 'ayurvedic', title: 'Ayurvedic Formulations' },
    { id: 5, src: '/n5.jpeg', alt: 'Essential Oils', category: 'oils', title: 'Pure Essential Oils' },
    { id: 6, src: '/n6.jpeg', alt: 'Herbal Supplements', category: 'supplements', title: 'Herbal Supplements' }
  ]

  // Featured products
  const featuredProducts = [
    { id: 1, name: 'Organic Turmeric Powder', price: 24.99, rating: 4.8, image: '/n1.jpeg' },
    { id: 2, name: 'Ashwagandha Root', price: 34.99, rating: 4.9, image: '/n2.jpeg' },
    { id: 3, name: 'Moringa Leaf Powder', price: 29.99, rating: 4.7, image: '/n3.jpeg' },
    { id: 4, name: 'Holy Basil (Tulsi)', price: 19.99, rating: 4.8, image: '/n4.jpeg' },
    { id: 5, name: 'Triphala Powder', price: 27.99, rating: 4.9, image: '/n5.jpeg' },
    { id: 6, name: 'Brahmi Powder', price: 32.99, rating: 4.6, image: '/n6.jpeg' }
  ]

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Products', icon: '🌿' },
    { id: 'products', name: 'Organic Products', icon: '🌱' },
    { id: 'teas', name: 'Herbal Teas', icon: '🍵' },
    { id: 'herbs', name: 'Natural Herbs', icon: '🌾' },
    { id: 'ayurvedic', name: 'Ayurvedic', icon: '🕉️' },
    { id: 'oils', name: 'Essential Oils', icon: '💧' },
    { id: 'supplements', name: 'Supplements', icon: '💊' }
  ]

  // Filter images based on category
  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + filteredImages.length) % filteredImages.length)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      
      {/* Hero Section with Image Slider */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-900 via-emerald-900 to-teal-900 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/leaf-pattern.png')] bg-repeat"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Bismillah at Top */}
            <div className="inline-block bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/20 mb-8">
              <p className="text-white text-3xl font-arabic animate-glow">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </p>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-green-300 to-emerald-300 bg-clip-text text-transparent">
                Herbal Heaven
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Discover the power of nature with our premium organic herbal products. 
              100% natural, sustainably sourced, and carefully crafted for your wellbeing.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/shop/products"
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold text-lg transform hover:scale-110 transition-all duration-300 hover:shadow-2xl"
              >
                Shop Now
              </Link>
              <Link
                href="/gallery"
                className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white rounded-full font-semibold text-lg transform hover:scale-110 transition-all duration-300 hover:bg-white/30"
              >
                View Gallery
              </Link>
            </div>
          </div>

          {/* Image Gallery Grid - PICS OPTION */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Our Premium Collection</h2>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="group relative cursor-pointer transform hover:scale-105 transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
                    {/* Images uncomment kiya */}
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white text-xl font-bold mb-2">{image.title}</h3>
                        <p className="text-white/80 text-sm">{image.alt}</p>
                        <div className="flex gap-2 mt-3">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs">
                            {categories.find(c => c.id === image.category)?.icon} {image.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-br from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Featured Products
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore our most popular organic herbal products, loved by customers worldwide
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-all duration-500 hover:shadow-2xl"
              >
                <div className="relative aspect-square bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mb-4 overflow-hidden">
                  {/* Product image uncomment kiya */}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Quick view button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xl">🔍</span>
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({product.rating})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-700">${product.price}</span>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            >
              View All Products
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Image Gallery Section - PICS OPTION */}
      <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
            Photo Gallery
          </h2>
          <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
            Browse through our collection of organic herbal products and natural ingredients
          </p>

          {/* Masonry Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(index)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className="relative w-full h-full aspect-square">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4">
                    <p className="text-white font-semibold">{image.title}</p>
                    <p className="text-white/60 text-sm">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal for Image Gallery */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 z-10"
          >
            ✕
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-5xl hover:text-gray-300"
          >
            ‹
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-5xl hover:text-gray-300"
          >
            ›
          </button>

          <div className="max-w-5xl max-h-[80vh] mx-4">
            <div className="relative aspect-video">
              <Image
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].alt}
                width={1200}
                height={800}
                className="object-contain rounded-2xl"
              />
            </div>
            
            <div className="text-center mt-4 text-white">
              <h3 className="text-2xl font-bold mb-2">{filteredImages[selectedImage].title}</h3>
              <p className="text-white/80">{filteredImages[selectedImage].alt}</p>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedImage ? 'w-8 bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Health Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Why Choose Organic?
            </span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover the benefits of switching to organic herbal products
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold mb-2">100% Natural</h3>
              <p className="text-gray-600">No artificial additives or preservatives</p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Rich in Nutrients</h3>
              <p className="text-gray-600">Packed with essential vitamins and minerals</p>
            </div>
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainable</h3>
              <p className="text-gray-600">Environmentally friendly farming practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Note */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-800 py-4">
        <p className="text-center text-white/80 text-sm">
          <span className="text-yellow-400 mr-1">👑</span>
          Administrator: Hafiz Sajid Syed | Email: sajid.syed@gmail.com
        </p>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes glow {
          from { text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #4ade80; }
          to { text-shadow: 0 0 20px #fff, 0 0 30px #86efac, 0 0 40px #4ade80; }
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  )
}