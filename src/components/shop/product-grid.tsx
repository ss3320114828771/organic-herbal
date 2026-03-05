'use client'

import React from 'react'

interface Product {
  id: string
  name: string
  price: number
  image?: string
}

interface ProductGridProps {
  products?: Product[]
}

export default function ProductGrid({ products = [] }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg p-4">
          <div className="bg-gray-200 h-48 mb-2"></div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-green-600">${product.price}</p>
          <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )
}