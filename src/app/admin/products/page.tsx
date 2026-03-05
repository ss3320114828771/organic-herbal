'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminProductsPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for products
  const products = [
    {
      id: 'PRD-001',
      name: 'Organic Turmeric Powder',
      category: 'Spices',
      price: 24.99,
      cost: 12.50,
      stock: 156,
      sold: 1234,
      rating: 4.8,
      reviews: 234,
      status: 'active',
      image: '/products/turmeric.jpg',
      description: 'Pure organic turmeric powder from sustainable farms',
      ingredients: '100% Organic Turmeric',
      benefits: ['Anti-inflammatory', 'Antioxidant rich', 'Immune support'],
      expiryDate: '2025-12-31',
      sku: 'TUR-001-ORG',
      tags: ['organic', 'spice', 'turmeric', 'anti-inflammatory'],
      variants: [
        { size: '100g', price: 24.99, stock: 50 },
        { size: '250g', price: 49.99, stock: 75 },
        { size: '500g', price: 89.99, stock: 31 }
      ]
    },
    {
      id: 'PRD-002',
      name: 'Ashwagandha Root',
      category: 'Adaptogens',
      price: 34.99,
      cost: 18.75,
      stock: 89,
      sold: 856,
      rating: 4.9,
      reviews: 178,
      status: 'active',
      image: '/products/ashwagandha.jpg',
      description: 'Premium ashwagandha root for stress relief',
      ingredients: 'Organic Ashwagandha Root Powder',
      benefits: ['Stress relief', 'Energy boost', 'Better sleep'],
      expiryDate: '2025-06-30',
      sku: 'ASH-002-ORG',
      tags: ['adaptogen', 'stress', 'energy', 'organic'],
      variants: [
        { size: '100g', price: 34.99, stock: 45 },
        { size: '250g', price: 64.99, stock: 32 },
        { size: '500g', price: 119.99, stock: 12 }
      ]
    },
    {
      id: 'PRD-003',
      name: 'Moringa Leaf Powder',
      category: 'Superfoods',
      price: 29.99,
      cost: 14.25,
      stock: 45,
      sold: 567,
      rating: 4.7,
      reviews: 145,
      status: 'active',
      image: '/products/moringa.jpg',
      description: 'Nutrient-dense moringa leaf powder',
      ingredients: '100% Organic Moringa Leaves',
      benefits: ['Nutrient dense', 'Energy booster', 'Antioxidant'],
      expiryDate: '2025-03-31',
      sku: 'MOR-003-ORG',
      tags: ['superfood', 'nutrient', 'energy', 'organic'],
      variants: [
        { size: '100g', price: 29.99, stock: 23 },
        { size: '250g', price: 54.99, stock: 15 },
        { size: '500g', price: 99.99, stock: 7 }
      ]
    },
    {
      id: 'PRD-004',
      name: 'Holy Basil (Tulsi)',
      category: 'Herbs',
      price: 19.99,
      cost: 9.99,
      stock: 23,
      sold: 345,
      rating: 4.6,
      reviews: 89,
      status: 'low-stock',
      image: '/products/tulsi.jpg',
      description: 'Sacred holy basil for wellness',
      ingredients: 'Organic Holy Basil Leaves',
      benefits: ['Stress relief', 'Immunity support', 'Respiratory health'],
      expiryDate: '2024-12-31',
      sku: 'TUL-004-ORG',
      tags: ['herb', 'stress', 'immunity', 'ayurvedic'],
      variants: [
        { size: '100g', price: 19.99, stock: 15 },
        { size: '250g', price: 39.99, stock: 8 }
      ]
    },
    {
      id: 'PRD-005',
      name: 'Triphala Powder',
      category: 'Ayurvedic',
      price: 27.99,
      cost: 13.99,
      stock: 0,
      sold: 678,
      rating: 4.8,
      reviews: 156,
      status: 'out-of-stock',
      image: '/products/triphala.jpg',
      description: 'Traditional Ayurvedic formulation',
      ingredients: 'Amalaki, Bibhitaki, Haritaki',
      benefits: ['Digestive health', 'Detoxification', 'Regularity'],
      expiryDate: '2024-08-31',
      sku: 'TRI-005-ORG',
      tags: ['ayurvedic', 'digestive', 'detox', 'traditional'],
      variants: [
        { size: '100g', price: 27.99, stock: 0 },
        { size: '250g', price: 52.99, stock: 0 }
      ]
    },
    {
      id: 'PRD-006',
      name: 'Brahmi Powder',
      category: 'Brain Health',
      price: 32.99,
      cost: 16.50,
      stock: 67,
      sold: 432,
      rating: 4.7,
      reviews: 112,
      status: 'active',
      image: '/products/brahmi.jpg',
      description: 'Cognitive enhancement herb',
      ingredients: 'Organic Bacopa Monnieri',
      benefits: ['Memory boost', 'Mental clarity', 'Focus'],
      expiryDate: '2025-09-30',
      sku: 'BRA-006-ORG',
      tags: ['brain', 'memory', 'focus', 'cognitive'],
      variants: [
        { size: '100g', price: 32.99, stock: 34 },
        { size: '250g', price: 59.99, stock: 23 },
        { size: '500g', price: 109.99, stock: 10 }
      ]
    },
    {
      id: 'PRD-007',
      name: 'Neem Powder',
      category: 'Herbs',
      price: 22.99,
      cost: 11.50,
      stock: 12,
      sold: 234,
      rating: 4.5,
      reviews: 67,
      status: 'low-stock',
      image: '/products/neem.jpg',
      description: 'Purifying and cleansing herb',
      ingredients: 'Organic Neem Leaves',
      benefits: ['Blood purification', 'Skin health', 'Immune support'],
      expiryDate: '2024-11-30',
      sku: 'NEM-007-ORG',
      tags: ['herb', 'purifying', 'skin', 'immune'],
      variants: [
        { size: '100g', price: 22.99, stock: 8 },
        { size: '250g', price: 42.99, stock: 4 }
      ]
    },
    {
      id: 'PRD-008',
      name: 'Guduchi Powder',
      category: 'Ayurvedic',
      price: 36.99,
      cost: 18.50,
      stock: 34,
      sold: 198,
      rating: 4.9,
      reviews: 76,
      status: 'active',
      image: '/products/guduchi.jpg',
      description: 'Immunity boosting herb',
      ingredients: 'Organic Tinospora Cordifolia',
      benefits: ['Immunity booster', 'Antioxidant', 'Anti-aging'],
      expiryDate: '2025-07-31',
      sku: 'GUD-008-ORG',
      tags: ['ayurvedic', 'immunity', 'anti-aging', 'rasayana'],
      variants: [
        { size: '100g', price: 36.99, stock: 20 },
        { size: '250g', price: 69.99, stock: 14 }
      ]
    }
  ]

  // Calculate statistics
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.status === 'low-stock').length,
    outOfStock: products.filter(p => p.status === 'out-of-stock').length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    totalCost: products.reduce((sum, p) => sum + (p.cost * p.stock), 0),
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
    averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length,
  }

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))]

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    
    let matchesStock = true
    if (stockFilter === 'in-stock') {
      matchesStock = product.stock > 10
    } else if (stockFilter === 'low-stock') {
      matchesStock = product.stock > 0 && product.stock <= 10
    } else if (stockFilter === 'out-of-stock') {
      matchesStock = product.stock === 0
    }
    
    return matchesSearch && matchesCategory && matchesStock
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.id.localeCompare(a.id)
    } else if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name)
    } else if (sortBy === 'price-low') {
      return a.price - b.price
    } else if (sortBy === 'price-high') {
      return b.price - a.price
    } else if (sortBy === 'stock-low') {
      return a.stock - b.stock
    } else if (sortBy === 'stock-high') {
      return b.stock - a.stock
    } else if (sortBy === 'rating') {
      return b.rating - a.rating
    } else if (sortBy === 'popular') {
      return b.sold - a.sold
    }
    return 0
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'low-stock': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'out-of-stock': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return '✅'
      case 'low-stock': return '⚠️'
      case 'out-of-stock': return '❌'
      default: return '❓'
    }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const toggleAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action ${action} on products:`, selectedProducts)
    // Implement bulk actions
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Deleting product:', productId)
      // Implement delete
    }
  }

  const handleDuplicateProduct = (product: any) => {
    console.log('Duplicating product:', product)
    // Implement duplicate
  }

  const profitMargin = (price: number, cost: number) => {
    return ((price - cost) / price * 100).toFixed(1)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      
      {/* Bismillah at Top */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white/10 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/20">
          <p className="text-white text-2xl font-arabic animate-glow">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <span className="mr-3">🌿</span>
            Products Management
          </h1>
          <p className="text-white/60">
            Manage your product catalog, inventory, and pricing
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center"
          >
            <span className="mr-2">+</span>
            Add New Product
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
            <span className="mr-2">📥</span>
            Import
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center">
            <span className="mr-2">📤</span>
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              <p className="text-green-400 text-sm mt-2">
                <span className="text-green-400">↑</span> +3 this month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Inventory Value</p>
              <p className="text-3xl font-bold text-white mt-1">${stats.totalValue.toLocaleString()}</p>
              <p className="text-yellow-400 text-sm mt-2">
                Cost: ${stats.totalCost.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Total Sold</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.totalSold.toLocaleString()}</p>
              <p className="text-blue-400 text-sm mt-2">
                Avg Rating: {stats.averageRating.toFixed(1)} ⭐
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/60 text-sm">Stock Status</p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.lowStock + stats.outOfStock}
              </p>
              <p className="text-red-400 text-sm mt-2">
                {stats.lowStock} low | {stats.outOfStock} out
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Active', count: stats.active, color: 'green', icon: '✅' },
          { label: 'Low Stock', count: stats.lowStock, color: 'yellow', icon: '⚠️' },
          { label: 'Out of Stock', count: stats.outOfStock, color: 'red', icon: '❌' },
          { label: 'Categories', count: categories.length - 1, color: 'purple', icon: '📑' },
          { label: 'Avg Margin', count: `${((stats.totalValue - stats.totalCost) / stats.totalValue * 100).toFixed(1)}%`, color: 'blue', icon: '📈' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-${stat.color}-500/10 backdrop-blur-lg rounded-xl p-4 border border-${stat.color}-500/20`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-${stat.color}-400 font-bold text-xl`}>{stat.count}</span>
            </div>
            <p className={`text-${stat.color}-400 text-sm mt-2`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="col-span-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search products by name, ID, SKU, category or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900">
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Stock Status</option>
              <option value="in-stock">In Stock (&gt;10)</option>
              <option value="low-stock">Low Stock (1-10)</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Additional Filters */}
        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <span className="text-white/60 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="stock-low">Stock (Low to High)</option>
              <option value="stock-high">Stock (High to Low)</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-white/60 text-sm">
                  {selectedProducts.length} selected
                </span>
                <select
                  onChange={(e) => handleBulkAction(e.target.value)}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Bulk Actions</option>
                  <option value="activate">Activate Products</option>
                  <option value="deactivate">Deactivate Products</option>
                  <option value="update-price">Update Price</option>
                  <option value="update-stock">Update Stock</option>
                  <option value="export">Export Selected</option>
                  <option value="delete">Delete Selected</option>
                </select>
              </div>
            )}

            {/* View Toggle */}
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center ${
                  viewMode === 'table' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="mr-1">📋</span> Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="mr-1">📊</span> Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={toggleAllProducts}
                      className="rounded border-white/30 bg-white/10"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">ID / SKU</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Profit</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                        className="rounded border-white/30 bg-white/10"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                          🌿
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-white/40 text-xs">{product.description.substring(0, 30)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-mono text-sm">{product.id}</p>
                      <p className="text-white/40 text-xs">{product.sku}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">${product.price.toFixed(2)}</p>
                      <p className="text-white/40 text-xs">Cost: ${product.cost.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-bold ${
                        product.stock > 10 ? 'text-green-400' :
                        product.stock > 0 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {product.stock} units
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getStatusColor(product.status)}`}>
                        <span>{getStatusIcon(product.status)}</span>
                        <span>{product.status.replace('-', ' ').toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">⭐</span>
                        <span className="text-white">{product.rating}</span>
                        <span className="text-white/40 text-xs ml-1">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-green-400 font-bold">
                        {profitMargin(product.price, product.cost)}%
                      </p>
                      <p className="text-white/40 text-xs">
                        ${(product.price - product.cost).toFixed(2)} margin
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDuplicateProduct(product)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          🗑️
                        </button>
                        <button 
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                          title="View Details"
                        >
                          👁️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-white/5 flex justify-between items-center">
            <p className="text-white/60 text-sm">
              Showing {sortedProducts.length} of {products.length} products
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Previous
              </button>
              <span className="px-3 py-1 bg-purple-500 text-white rounded-lg">1</span>
              <button className="px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 hover:shadow-2xl group"
            >
              {/* Product Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl">
                  🌿
                </div>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                  className="rounded border-white/30 bg-white/10"
                />
              </div>

              {/* Product Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                <p className="text-white/40 text-sm mb-2">{product.id} | {product.sku}</p>
                <p className="text-white/60 text-sm line-clamp-2">{product.description}</p>
              </div>

              {/* Category and Status */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/60 text-sm bg-white/10 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${getStatusColor(product.status)}`}>
                  <span>{getStatusIcon(product.status)}</span>
                  <span>{product.status.replace('-', ' ')}</span>
                </span>
              </div>

              {/* Pricing and Stock */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-white/40 text-xs">Price</p>
                  <p className="text-white font-bold text-xl">${product.price.toFixed(2)}</p>
                  <p className="text-green-400 text-xs">+{profitMargin(product.price, product.cost)}%</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs">Stock</p>
                  <p className={`font-bold text-xl ${
                    product.stock > 10 ? 'text-green-400' :
                    product.stock > 0 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {product.stock}
                  </p>
                  <p className="text-white/40 text-xs">units</p>
                </div>
              </div>

              {/* Rating and Sales */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span className="text-white">{product.rating}</span>
                  <span className="text-white/40 text-xs ml-1">({product.reviews})</span>
                </div>
                <div className="text-white/60 text-sm">
                  {product.sold} sold
                </div>
              </div>

              {/* Variants Preview */}
              {product.variants && (
                <div className="mb-4">
                  <p className="text-white/40 text-xs mb-2">Variants:</p>
                  <div className="flex flex-wrap gap-1">
                    {product.variants.map((variant, idx) => (
                      <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">
                        {variant.size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-xs bg-white/5 px-2 py-1 rounded text-white/60">
                    #{tag}
                  </span>
                ))}
                {product.tags.length > 3 && (
                  <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/60">
                    +{product.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Expiry Date */}
              <div className="text-white/40 text-xs mb-4">
                Expires: {new Date(product.expiryDate).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Edit Product"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDuplicateProduct(product)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Duplicate"
                >
                  📋
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Delete"
                >
                  🗑️
                </button>
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="View Details"
                >
                  👁️
                </button>
                <button 
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors" 
                  title="Edit Inventory"
                >
                  📦
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingProduct(null)
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Product Form - Simplified */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter product name"
                    defaultValue={editingProduct?.name}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500">
                    <option>Spices</option>
                    <option>Adaptogens</option>
                    <option>Superfoods</option>
                    <option>Herbs</option>
                    <option>Ayurvedic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    defaultValue={editingProduct?.price}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    defaultValue={editingProduct?.cost}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">Stock</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    defaultValue={editingProduct?.stock}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">SKU</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter SKU"
                    defaultValue={editingProduct?.sku}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    placeholder="Enter product description"
                    defaultValue={editingProduct?.description}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingProduct(null)
                }}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-colors">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Footer Note */}
      <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
        <p className="text-white/60 text-sm text-center">
          <span className="text-yellow-400 mr-1">👑</span>
          Admin: Hafiz Sajid Syed | Total Products: {products.length} | Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  )
}