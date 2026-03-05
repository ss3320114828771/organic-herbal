'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: string
  size?: string
  color?: string
  maxQuantity?: number
  discount?: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  subtotal: number
  discount: number
  total: number
  shipping: number
  tax: number
  couponCode?: string
  couponDiscount?: number
}

interface AddToCartParams {
  productId: string
  name: string
  price: number
  quantity?: number
  image?: string
  variant?: string
  size?: string
  color?: string
  maxQuantity?: number
  discount?: number
}

interface UpdateQuantityParams {
  id: string
  quantity: number
}

export function useCart() {
  const [state, setState] = useState<CartState>({
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
    shipping: 0,
    tax: 0
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Load cart from storage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('cart')
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          setState(parsedCart)
        }
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    }
    
    loadCart()
  }, [])

  // Save cart to storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save cart:', error)
    }
  }, [state])

  // Calculate cart totals
  const calculateTotals = useCallback((items: CartItem[], couponDiscount = 0, shipping = 0, tax = 0) => {
    const subtotal = items.reduce((sum, item) => {
      const itemPrice = item.discount 
        ? item.price * (1 - item.discount / 100) 
        : item.price
      return sum + (itemPrice * item.quantity)
    }, 0)

    const total = subtotal + shipping + tax - couponDiscount

    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount: items.reduce((sum, item) => {
        if (item.discount) {
          const original = item.price * item.quantity
          const discounted = item.price * (1 - item.discount / 100) * item.quantity
          return sum + (original - discounted)
        }
        return sum
      }, 0) + couponDiscount,
      total,
      shipping,
      tax,
      couponDiscount
    }
  }, [])

  // Add item to cart
  const addItem = useCallback((params: AddToCartParams) => {
    setIsLoading(true)
    setError(null)

    try {
      const { productId, name, price, quantity = 1, image, variant, size, color, maxQuantity, discount } = params

      setState(prev => {
        // Check if item already exists
        const existingItemIndex = prev.items.findIndex(item => 
          item.productId === productId &&
          item.variant === variant &&
          item.size === size &&
          item.color === color
        )

        let newItems: CartItem[]

        if (existingItemIndex >= 0) {
          // Update existing item
          newItems = [...prev.items]
          const existingItem = newItems[existingItemIndex]
          const newQuantity = existingItem.quantity + quantity
          
          if (maxQuantity && newQuantity > maxQuantity) {
            throw new Error(`Maximum quantity (${maxQuantity}) reached`)
          }
          
          newItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity
          }
        } else {
          // Add new item
          const newItem: CartItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            productId,
            name,
            price,
            quantity,
            image,
            variant,
            size,
            color,
            maxQuantity,
            discount
          }
          newItems = [...prev.items, newItem]
        }

        return calculateTotals(newItems, prev.couponDiscount, prev.shipping, prev.tax)
      })

      setIsLoading(false)
      return { success: true }
    } catch (error: any) {
      setError(error.message || 'Failed to add item')
      setIsLoading(false)
      return { success: false, error: error.message }
    }
  }, [calculateTotals])

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      setState(prev => {
        const newItems = prev.items.filter(item => item.id !== itemId)
        return calculateTotals(newItems, prev.couponDiscount, prev.shipping, prev.tax)
      })

      setIsLoading(false)
      return { success: true }
    } catch (error: any) {
      setError(error.message || 'Failed to remove item')
      setIsLoading(false)
      return { success: false, error: error.message }
    }
  }, [calculateTotals])

  // Update item quantity
  const updateQuantity = useCallback((params: UpdateQuantityParams) => {
    const { id, quantity } = params

    if (quantity < 1) {
      return removeItem(id)
    }

    setIsLoading(true)
    setError(null)

    try {
      setState(prev => {
        const item = prev.items.find(i => i.id === id)
        if (!item) {
          throw new Error('Item not found')
        }

        if (item.maxQuantity && quantity > item.maxQuantity) {
          throw new Error(`Maximum quantity (${item.maxQuantity}) reached`)
        }

        const newItems = prev.items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )

        return calculateTotals(newItems, prev.couponDiscount, prev.shipping, prev.tax)
      })

      setIsLoading(false)
      return { success: true }
    } catch (error: any) {
      setError(error.message || 'Failed to update quantity')
      setIsLoading(false)
      return { success: false, error: error.message }
    }
  }, [calculateTotals, removeItem])

  // Clear cart
  const clearCart = useCallback(() => {
    setIsLoading(true)
    
    setState({
      items: [],
      totalItems: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
      shipping: 0,
      tax: 0
    })

    setIsLoading(false)
  }, [])

  // Apply coupon
  const applyCoupon = useCallback(async (code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to validate coupon
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock coupon validation
      let discount = 0
      if (code.toUpperCase() === 'SAVE10') {
        discount = 10
      } else if (code.toUpperCase() === 'SAVE20') {
        discount = 20
      } else {
        throw new Error('Invalid coupon code')
      }

      setState(prev => ({
        ...prev,
        couponCode: code,
        couponDiscount: discount
      }))

      setIsLoading(false)
      return { success: true, discount }
    } catch (error: any) {
      setError(error.message || 'Failed to apply coupon')
      setIsLoading(false)
      return { success: false, error: error.message }
    }
  }, [])

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setState(prev => ({
      ...prev,
      couponCode: undefined,
      couponDiscount: undefined
    }))
  }, [])

  // Update shipping
  const updateShipping = useCallback((shipping: number) => {
    setState(prev => calculateTotals(prev.items, prev.couponDiscount, shipping, prev.tax))
  }, [calculateTotals])

  // Update tax
  const updateTax = useCallback((tax: number) => {
    setState(prev => calculateTotals(prev.items, prev.couponDiscount, prev.shipping, tax))
  }, [calculateTotals])

  // Check if item is in cart
  const isInCart = useCallback((productId: string, variant?: string, size?: string, color?: string) => {
    return state.items.some(item => 
      item.productId === productId &&
      item.variant === variant &&
      item.size === size &&
      item.color === color
    )
  }, [state.items])

  // Get item quantity
  const getItemQuantity = useCallback((productId: string, variant?: string, size?: string, color?: string) => {
    const item = state.items.find(item => 
      item.productId === productId &&
      item.variant === variant &&
      item.size === size &&
      item.color === color
    )
    return item?.quantity || 0
  }, [state.items])

  // Go to checkout
  const goToCheckout = useCallback(() => {
    if (state.items.length > 0) {
      router.push('/checkout')
    }
  }, [state.items.length, router])

  return {
    // State
    items: state.items,
    totalItems: state.totalItems,
    subtotal: state.subtotal,
    discount: state.discount,
    total: state.total,
    shipping: state.shipping,
    tax: state.tax,
    couponCode: state.couponCode,
    isLoading,
    error,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    updateShipping,
    updateTax,

    // Utilities
    isInCart,
    getItemQuantity,
    goToCheckout,

    // Computed
    isEmpty: state.items.length === 0,
    itemCount: state.items.length
  }
}

// Hook for cart summary (lighter version)
export function useCartSummary() {
  const [itemCount, setItemCount] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        const cart = JSON.parse(storedCart)
        setItemCount(cart.totalItems || 0)
        setTotal(cart.total || 0)
      }
    } catch (error) {
      console.error('Failed to load cart summary:', error)
    }

    // Listen for cart updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' && e.newValue) {
        try {
          const cart = JSON.parse(e.newValue)
          setItemCount(cart.totalItems || 0)
          setTotal(cart.total || 0)
        } catch (error) {
          console.error('Failed to parse cart update:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { itemCount, total }
}

// Hook for mini cart (for headers)
export function useMiniCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart')
      if (storedCart) {
        const cart = JSON.parse(storedCart)
        setItems(cart.items?.slice(0, 3) || [])
        setTotal(cart.total || 0)
      }
    } catch (error) {
      console.error('Failed to load mini cart:', error)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart' && e.newValue) {
        try {
          const cart = JSON.parse(e.newValue)
          setItems(cart.items?.slice(0, 3) || [])
          setTotal(cart.total || 0)
        } catch (error) {
          console.error('Failed to parse cart update:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { items, total, itemCount: items.length }
}