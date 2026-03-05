'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProductSearchProps {
  onSearch?: (query: string, filters: SearchFilters) => void
  onFilterChange?: (filters: SearchFilters) => void
  onSortChange?: (sort: string) => void
  initialQuery?: string
  initialFilters?: SearchFilters
  initialSort?: string
  suggestions?: string[]
  recentSearches?: string[]
  showFilters?: boolean
  showSort?: boolean
  showSuggestions?: boolean
  showRecent?: boolean
  className?: string
  placeholder?: string
  autoFocus?: boolean
  loading?: boolean
}

interface SearchFilters {
  category?: string
  brand?: string[]
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  onSale?: boolean
  rating?: number
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image?: string
  category?: string
  brand?: string
}

export default function ProductSearch({
  onSearch,
  onFilterChange,
  onSortChange,
  initialQuery = '',
  initialFilters = {},
  initialSort = 'relevance',
  suggestions = [],
  recentSearches = [],
  showFilters = true,
  showSort = true,
  showSuggestions = true,
  showRecent = true,
  className = '',
  placeholder = 'Search products...',
  autoFocus = false,
  loading = false
}: ProductSearchProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState(initialQuery)
  const [filters, setFilters] = React.useState<SearchFilters>(initialFilters)
  const [sort, setSort] = React.useState(initialSort)
  const [isOpen, setIsOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [...(showRecent ? recentSearches : []), ...suggestions]
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      const selected = allItems[activeIndex]
      setQuery(selected)
      handleSearch(selected)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    setIsOpen(false)
    onSearch?.(searchQuery, filters)
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      handleSearch(query)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value
    setSort(newSort)
    onSortChange?.(newSort)
  }

  const clearFilters = () => {
    setFilters({})
    onFilterChange?.({})
  }

  const allSuggestions = [...(showRecent ? recentSearches : []), ...suggestions]

  return (
    <div className={`w-full ${className}`}>
      <div className="relative" ref={dropdownRef}>
        {/* Search form */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </form>

        {/* Suggestions dropdown */}
        {isOpen && allSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {showRecent && recentSearches.length > 0 && (
              <div className="p-2">
                <p className="text-xs font-medium text-gray-500 px-3 py-1">Recent searches</p>
                {recentSearches.map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => {
                      setQuery(search)
                      handleSearch(search)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                      activeIndex === index ? 'bg-gray-100' : ''
                    }`}
                  >
                    🔍 {search}
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 px-3 py-1">Suggestions</p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => {
                      setQuery(suggestion)
                      handleSearch(suggestion)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                      activeIndex === (showRecent ? recentSearches.length + index : index)
                        ? 'bg-gray-100'
                        : ''
                    }`}
                  >
                    💡 {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters section */}
      {showFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Category filter */}
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>

          {/* Price range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Checkbox filters */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="w-4 h-4 text-green-600 rounded"
            />
            In Stock
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters.onSale || false}
              onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              className="w-4 h-4 text-green-600 rounded"
            />
            On Sale
          </label>

          {/* Rating filter */}
          <select
            value={filters.rating || ''}
            onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : undefined)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
            <option value="2">2+ stars</option>
            <option value="1">1+ stars</option>
          </select>

          {/* Clear filters */}
          {(filters.category || filters.priceMin || filters.priceMax || filters.inStock || filters.onSale || filters.rating) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Sort section */}
      {showSort && (
        <div className="mt-4 flex justify-end">
          <select
            value={sort}
            onChange={handleSortChange}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple search bar
export function SimpleSearch({ onSearch }: { onSearch?: (query: string) => void }) {
  return (
    <ProductSearch
      onSearch={onSearch}
      showFilters={false}
      showSort={false}
      showSuggestions={false}
      showRecent={false}
      placeholder="Search..."
    />
  )
}

// Search with suggestions
export function SearchWithSuggestions({ onSearch }: { onSearch?: (query: string) => void }) {
  const suggestions = ['laptop', 'smartphone', 'headphones', 'keyboard', 'mouse']
  const recent = ['iphone', 'macbook', 'airpods']

  return (
    <ProductSearch
      onSearch={onSearch}
      suggestions={suggestions}
      recentSearches={recent}
      showFilters={false}
      showSort={false}
    />
  )
}

// Full search with filters
export function FullProductSearch({ onSearch }: { onSearch?: (query: string, filters: SearchFilters) => void }) {
  return (
    <ProductSearch
      onSearch={onSearch}
      showFilters={true}
      showSort={true}
      showSuggestions={true}
      showRecent={true}
    />
  )
}

// ==================== ICON COMPONENTS ====================

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

// ==================== HOOK ====================

// Custom hook for search
export function useProductSearch() {
  const [query, setQuery] = React.useState('')
  const [filters, setFilters] = React.useState<SearchFilters>({})
  const [results, setResults] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(false)
  const [total, setTotal] = React.useState(0)

  const search = async (searchQuery: string, searchFilters: SearchFilters = {}) => {
    setLoading(true)
    setQuery(searchQuery)
    setFilters(searchFilters)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock results
      const mockResults: Product[] = [
        { id: '1', name: 'Product 1', slug: 'product-1', price: 99.99 },
        { id: '2', name: 'Product 2', slug: 'product-2', price: 149.99 },
        { id: '3', name: 'Product 3', slug: 'product-3', price: 199.99 }
      ]
      
      setResults(mockResults)
      setTotal(mockResults.length)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setFilters({})
    setResults([])
    setTotal(0)
  }

  return {
    query,
    filters,
    results,
    loading,
    total,
    search,
    clearSearch
  }
}