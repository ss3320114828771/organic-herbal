'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  subcategory: string
  price: number
  compareAtPrice?: number
  cost: number
  stock: number
  sold: number
  rating: number
  reviewCount: number
  status: 'active' | 'draft' | 'archived' | 'out-of-stock'
  isNew?: boolean
  isBestseller?: boolean
  isFeatured?: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminProductTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Mock categories
  const categories = [
    'Herbs', 'Spices', 'Oils', 'Teas', 'Capsules', 'Extracts', 'Honey', 'Black Seed'
  ]

  // Mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Product ${i + 1}`,
        sku: `SKU-${1000 + i}`,
        category: categories[i % categories.length],
        subcategory: 'General',
        price: 19.99 + i,
        cost: 9.99 + i,
        stock: Math.floor(Math.random() * 100),
        sold: Math.floor(Math.random() * 500),
        rating: 4.0,
        reviewCount: 10,
        status: i % 5 === 0 ? 'out-of-stock' : 'active',
        tags: ['herbal'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800',
      'out-of-stock': 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || colors.draft
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Products</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total: {products.length} products
            </p>
          </div>

          <Link
            href="/admin/products/add"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Product</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">SKU</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Stock</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.slice(0, 10).map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span>🌿</span>
                    </div>
                    <span className="font-medium text-gray-800">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-sm">{product.sku}</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4 font-semibold">{formatCurrency(product.price)}</td>
                <td className="p-4">
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}