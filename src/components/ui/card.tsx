'use client'

import React from 'react'

// Simple Card component
export default function Card({ 
  children,
  title,
  className = ''
}: any) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>}
      {children}
    </div>
  )
}

// Simple Product Card
export function ProductCard({ product, onAddToCart }: any) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
      )}
      <h4 className="font-medium text-gray-800">{product.name}</h4>
      <p className="text-lg font-bold text-green-600 mt-1">${product.price}</p>
      <button
        onClick={() => onAddToCart?.(product.id)}
        className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Add to Cart
      </button>
    </Card>
  )
}

// Simple Profile Card
export function ProfileCard({ user, onFollow }: any) {
  return (
    <Card className="text-center">
      <div className="w-20 h-20 rounded-full bg-green-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          user.name?.charAt(0) || 'U'
        )}
      </div>
      <h4 className="font-semibold text-gray-800">{user.name}</h4>
      <p className="text-sm text-gray-500 mt-1">{user.email}</p>
      {onFollow && (
        <button
          onClick={onFollow}
          className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Follow
        </button>
      )}
    </Card>
  )
}

// Simple Stats Card
export function StatsCard({ title, value, icon }: any) {
  return (
    <Card className="text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </Card>
  )
}

// Simple Card Group
export function CardGroup({ children }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  )
}