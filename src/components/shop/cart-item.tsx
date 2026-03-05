'use client'

import React from 'react'
import Link from 'next/link'

interface CartItemProps {
  item: CartItem
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
  onMoveToWishlist?: (id: string) => void
  onSaveForLater?: (id: string) => void
  editable?: boolean
  showActions?: boolean
  showPrice?: boolean
  showSubtotal?: boolean
  showDiscount?: boolean
  showShipping?: boolean
  variant?: 'default' | 'compact' | 'minimal'
  className?: string
}

interface CartItem {
  id: string
  productId: string
  name: string
  slug?: string
  price: number
  originalPrice?: number
  quantity: number
  image?: string
  sku?: string
  variant?: string
  size?: string
  color?: string
  inStock?: boolean
  maxQuantity?: number
  discount?: number
  shipping?: {
    free?: boolean
    estimated?: string
  }
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  onSaveForLater,
  editable = true,
  showActions = true,
  showPrice = true,
  showSubtotal = true,
  showDiscount = true,
  showShipping = false,
  variant = 'default',
  className = ''
}: CartItemProps) {
  const [quantity, setQuantity] = React.useState(item.quantity)
  const [isRemoving, setIsRemoving] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const maxQty = item.maxQuantity || 99
  const inStock = item.inStock !== false
  const hasDiscount = item.discount ? item.discount > 0 : false
  const discountAmount = hasDiscount ? (item.price * (item.discount || 0)) / 100 : 0
  const finalPrice = item.price - discountAmount
  const subtotal = finalPrice * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxQty) return
    setQuantity(newQuantity)
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  const handleRemove = () => {
    if (showConfirm) {
      setIsRemoving(true)
      setTimeout(() => {
        if (onRemove) {
          onRemove(item.id)
        }
      }, 300)
    } else {
      setShowConfirm(true)
    }
  }

  const handleCancelRemove = () => {
    setShowConfirm(false)
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-2 ${className}`}>
        {/* Image */}
        <Link href={`/products/${item.slug || item.productId}`} className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                📦
              </div>
            )}
          </div>
        </Link>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${item.slug || item.productId}`}
            className="text-sm font-medium text-gray-800 hover:text-green-600 truncate block"
          >
            {item.name}
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-gray-900">
              ${finalPrice.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">
              x {quantity}
            </span>
          </div>
        </div>

        {/* Actions */}
        {editable && (
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Remove item"
          >
            ✕
          </button>
        )}
      </div>
    )
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-4 py-3 ${className}`}>
        <div className="flex-1 flex items-center gap-3">
          {item.image && (
            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
          )}
          <div>
            <p className="font-medium text-gray-800">{item.name}</p>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
        </div>
        <div className="font-semibold text-gray-900">
          ${finalPrice.toFixed(2)}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`relative flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg ${
        isRemoving ? 'opacity-0' : ''
      } ${className}`}
    >
      {/* Image */}
      <Link href={`/products/${item.slug || item.productId}`} className="sm:w-24 sm:h-24 flex-shrink-0">
        <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
              📦
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          {/* Left side */}
          <div className="flex-1">
            <Link
              href={`/products/${item.slug || item.productId}`}
              className="text-base font-semibold text-gray-800 hover:text-green-600"
            >
              {item.name}
            </Link>

            {/* Variant details */}
            {(item.variant || item.size || item.color) && (
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                {item.variant && <span>Variant: {item.variant}</span>}
                {item.size && <span>Size: {item.size}</span>}
                {item.color && (
                  <span className="flex items-center gap-1">
                    Color: {item.color}
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.color.toLowerCase() }}
                    />
                  </span>
                )}
              </div>
            )}

            {/* SKU */}
            {item.sku && (
              <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>
            )}

            {/* Stock status */}
            {!inStock && (
              <p className="text-xs text-red-600 mt-1">Out of stock</p>
            )}
          </div>

          {/* Right side - Prices */}
          <div className="text-left sm:text-right">
            {showPrice && (
              <div className="space-y-1">
                {hasDiscount && showDiscount && (
                  <div className="text-sm text-gray-400 line-through">
                    ${item.price.toFixed(2)}
                  </div>
                )}
                <div className="text-lg font-bold text-gray-900">
                  ${finalPrice.toFixed(2)}
                </div>
                {hasDiscount && showDiscount && (
                  <div className="text-xs text-green-600">
                    Save {item.discount}%
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
          {/* Quantity controls */}
          {editable && inStock ? (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Qty:</label>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= maxQty}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {quantity >= maxQty && (
                <span className="text-xs text-gray-500">Max reached</span>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Quantity: {quantity}
            </div>
          )}

          {/* Subtotal */}
          {showSubtotal && (
            <div className="text-sm">
              <span className="text-gray-600">Subtotal: </span>
              <span className="font-semibold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          )}

          {/* Shipping info */}
          {showShipping && item.shipping && (
            <div className="text-sm">
              {item.shipping.free ? (
                <span className="text-green-600">Free shipping</span>
              ) : item.shipping.estimated ? (
                <span className="text-gray-500">
                  Ships by {item.shipping.estimated}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Action buttons */}
        {showActions && editable && (
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100">
            {/* Remove button with confirmation */}
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Remove item?</span>
                <button
                  onClick={handleRemove}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Yes
                </button>
                <button
                  onClick={handleCancelRemove}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={handleRemove}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            )}

            {/* Move to wishlist */}
            {onMoveToWishlist && (
              <button
                onClick={() => onMoveToWishlist(item.id)}
                className="text-sm text-gray-500 hover:text-green-600"
              >
                Move to wishlist
              </button>
            )}

            {/* Save for later */}
            {onSaveForLater && (
              <button
                onClick={() => onSaveForLater(item.id)}
                className="text-sm text-gray-500 hover:text-green-600"
              >
                Save for later
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple cart item for mini cart
export function MiniCartItem({ item, onRemove }: { item: CartItem; onRemove?: (id: string) => void }) {
  return (
    <CartItem
      item={item}
      onRemove={onRemove}
      variant="compact"
      showActions={false}
      showSubtotal={false}
      showDiscount={false}
    />
  )
}

// Cart item for checkout page
export function CheckoutCartItem({ item }: { item: CartItem }) {
  return (
    <CartItem
      item={item}
      variant="minimal"
      editable={false}
      showActions={false}
      showSubtotal={false}
    />
  )
}

// Cart item with all features
export function FullCartItem({ item, onUpdate, onRemove }: { 
  item: CartItem
  onUpdate?: (id: string, qty: number) => void
  onRemove?: (id: string) => void
}) {
  return (
    <CartItem
      item={item}
      onUpdateQuantity={onUpdate}
      onRemove={onRemove}
      onMoveToWishlist={() => console.log('Move to wishlist')}
      onSaveForLater={() => console.log('Save for later')}
      showShipping={true}
      showDiscount={true}
    />
  )
}

// ==================== HELPER COMPONENTS ====================

// Cart summary
export function CartSummary({ items, total }: { items: CartItem[]; total?: number }) {
  const subtotal = items.reduce((sum, item) => {
    const hasDiscount = item.discount ? item.discount > 0 : false
    const discountAmount = hasDiscount ? (item.price * (item.discount || 0)) / 100 : 0
    const finalPrice = item.price - discountAmount
    return sum + finalPrice * item.quantity
  }, 0)

  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.1
  const grandTotal = total !== undefined ? total : subtotal + shipping + tax

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Order Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-lg">${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
        Proceed to Checkout
      </button>
    </div>
  )
}

// Empty cart
export function EmptyCart() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🛒</div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Your cart is empty</h3>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
      <Link
        href="/products"
        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Continue Shopping
      </Link>
    </div>
  )
}