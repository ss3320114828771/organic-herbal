'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: Record<string, any>) => void
  placeholder?: string
  initialValue?: string
  filters?: FilterOption[]
  suggestions?: string[]
  recentSearches?: string[]
  autoFocus?: boolean
  debounceMs?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'minimal' | 'hero'
  showFilters?: boolean
  showSuggestions?: boolean
  showRecent?: boolean
  className?: string
  inputClassName?: string
  buttonClassName?: string
  loading?: boolean
  disabled?: boolean
  clearable?: boolean
  onClear?: () => void
}

interface FilterOption {
  id: string
  label: string
  type: 'select' | 'checkbox' | 'radio' | 'range'
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
}

export default function SearchBar({
  onSearch,
  onFilterChange,
  placeholder = 'Search...',
  initialValue = '',
  filters = [],
  suggestions = [],
  recentSearches = [],
  autoFocus = false,
  debounceMs = 300,
  size = 'md',
  variant = 'default',
  showFilters = false,
  showSuggestions = false,
  showRecent = false,
  className = '',
  inputClassName = '',
  buttonClassName = '',
  loading = false,
  disabled = false,
  clearable = true,
  onClear
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = React.useState(initialValue)
  const [isFocused, setIsFocused] = React.useState(false)
  const [showFilterPanel, setShowFilterPanel] = React.useState(false)
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, any>>({})
  const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== initialValue) {
        onSearch?.(query)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, onSearch, initialValue])

  // Handle keyboard navigation for suggestions
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions || !isFocused) return

      const suggestionsList = suggestions.length ? suggestions : recentSearches

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveSuggestionIndex(prev => 
          prev < suggestionsList.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
        e.preventDefault()
        const selected = suggestionsList[activeSuggestionIndex]
        setQuery(selected)
        onSearch?.(selected)
        setIsFocused(false)
      } else if (e.key === 'Escape') {
        setIsFocused(false)
        setActiveSuggestionIndex(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isFocused, suggestions, recentSearches, activeSuggestionIndex, showSuggestions, onSearch])

  // Scroll active suggestion into view
  React.useEffect(() => {
    if (activeSuggestionIndex >= 0 && suggestionsRef.current) {
      const activeElement = suggestionsRef.current.children[activeSuggestionIndex] as HTMLElement
      activeElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeSuggestionIndex])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query)
      setIsFocused(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
    onClear?.()
    onSearch?.('')
  }

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...selectedFilters, [filterId]: value }
    setSelectedFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch?.(suggestion)
    setIsFocused(false)
  }

  // Size classes
  const sizeClasses = {
    sm: {
      input: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      button: 'px-3 py-1.5 text-sm'
    },
    md: {
      input: 'px-4 py-2',
      icon: 'w-5 h-5',
      button: 'px-4 py-2'
    },
    lg: {
      input: 'px-5 py-3 text-lg',
      icon: 'w-6 h-6',
      button: 'px-5 py-3 text-lg'
    }
  }

  // Variant classes
  const variantClasses = {
    default: {
      container: 'border border-gray-200 rounded-lg bg-white',
      input: 'bg-transparent',
      button: 'bg-green-600 text-white hover:bg-green-700'
    },
    minimal: {
      container: 'border-b border-gray-200',
      input: 'bg-transparent px-0',
      button: 'text-green-600 hover:text-green-700'
    },
    hero: {
      container: 'border-2 border-green-600 rounded-full shadow-lg',
      input: 'bg-transparent',
      button: 'bg-green-600 text-white hover:bg-green-700 rounded-full'
    }
  }

  // Icons
  const SearchIcon = () => (
    <svg className={sizeClasses[size].icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  const CloseIcon = () => (
    <svg className={sizeClasses[size].icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const FilterIcon = () => (
    <svg className={sizeClasses[size].icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  )

  return (
    <div className={`relative ${className}`}>
      {/* Search form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`flex items-center ${variantClasses[variant].container} overflow-hidden`}>
          {/* Search icon */}
          <div className="pl-3 text-gray-400">
            <SearchIcon />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={disabled}
            className={`flex-1 outline-none ${sizeClasses[size].input} ${variantClasses[variant].input} ${inputClassName} ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />

          {/* Clear button */}
          {clearable && query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon />
            </button>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="p-2">
              <div className={`${sizeClasses[size].icon} border-2 border-green-600 border-t-transparent rounded-full animate-spin`} />
            </div>
          )}

          {/* Filter toggle */}
          {showFilters && filters.length > 0 && (
            <button
              type="button"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-2 text-gray-400 hover:text-green-600 transition-colors ${
                showFilterPanel ? 'text-green-600' : ''
              }`}
            >
              <FilterIcon />
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            disabled={disabled || loading}
            className={`${sizeClasses[size].button} ${variantClasses[variant].button} transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${buttonClassName}`}
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && isFocused && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {/* Recent searches */}
          {showRecent && recentSearches.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-500 px-2 py-1">Recent searches</p>
              {recentSearches.map((search, index) => (
                <button
                  key={`recent-${index}`}
                  onClick={() => handleSuggestionClick(search)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                    activeSuggestionIndex === index ? 'bg-gray-100' : ''
                  }`}
                >
                  🔍 {search}
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              {showRecent && recentSearches.length > 0 && (
                <div className="border-t border-gray-100 my-2" />
              )}
              <p className="text-xs text-gray-500 px-2 py-1">Suggestions</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded ${
                    activeSuggestionIndex === (showRecent ? recentSearches.length + index : index)
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

      {/* Filters panel */}
      {showFilters && showFilterPanel && filters.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>

                {filter.type === 'select' && filter.options && (
                  <select
                    value={selectedFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'checkbox' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={selectedFilters[filter.id]?.includes(option.value)}
                          onChange={(e) => {
                            const current = selectedFilters[filter.id] || []
                            const newValue = e.target.checked
                              ? [...current, option.value]
                              : current.filter((v: string) => v !== option.value)
                            handleFilterChange(filter.id, newValue)
                          }}
                          className="text-green-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'radio' && filter.options && (
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={filter.id}
                          value={option.value}
                          checked={selectedFilters[filter.id] === option.value}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          className="text-green-600"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {filter.type === 'range' && (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={filter.min || 0}
                      max={filter.max || 100}
                      step={filter.step || 1}
                      value={selectedFilters[filter.id] || filter.min || 0}
                      onChange={(e) => handleFilterChange(filter.id, parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{selectedFilters[filter.id] || filter.min || 0}</span>
                      <span>{filter.max || 100}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Filter actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setSelectedFilters({})
                  onFilterChange?.({})
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowFilterPanel(false)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Simple search bar
export function SimpleSearch({ onSearch }: { onSearch?: (query: string) => void }) {
  return (
    <SearchBar
      onSearch={onSearch}
      placeholder="Search..."
      size="sm"
      variant="minimal"
      showFilters={false}
    />
  )
}

// Hero search bar (for landing pages)
export function HeroSearch({ onSearch }: { onSearch?: (query: string) => void }) {
  const suggestions = ['React components', 'Next.js tutorial', 'Tailwind CSS', 'TypeScript']

  return (
    <SearchBar
      onSearch={onSearch}
      placeholder="What are you looking for?"
      size="lg"
      variant="hero"
      suggestions={suggestions}
      showSuggestions={true}
      autoFocus={true}
    />
  )
}

// Search with filters
export function FilteredSearch({ onSearch, onFilterChange }: { 
  onSearch?: (query: string) => void
  onFilterChange?: (filters: Record<string, any>) => void
}) {
  const filters: FilterOption[] = [
    {
      id: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: 'books', label: 'Books' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' }
      ]
    },
    {
      id: 'price',
      label: 'Price Range',
      type: 'checkbox',
      options: [
        { value: 'under25', label: 'Under $25' },
        { value: '25to50', label: '$25 to $50' },
        { value: '50to100', label: '$50 to $100' },
        { value: 'over100', label: 'Over $100' }
      ]
    },
    {
      id: 'rating',
      label: 'Minimum Rating',
      type: 'radio',
      options: [
        { value: '1', label: '1+ stars' },
        { value: '2', label: '2+ stars' },
        { value: '3', label: '3+ stars' },
        { value: '4', label: '4+ stars' }
      ]
    }
  ]

  return (
    <SearchBar
      onSearch={onSearch}
      onFilterChange={onFilterChange}
      placeholder="Search products..."
      filters={filters}
      showFilters={true}
      size="md"
    />
  )
}

// Search bar with recent searches
export function RecentSearchBar({ onSearch }: { onSearch?: (query: string) => void }) {
  const recentSearches = ['React', 'TypeScript', 'Next.js', 'Tailwind']

  return (
    <SearchBar
      onSearch={onSearch}
      placeholder="Search..."
      recentSearches={recentSearches}
      showRecent={true}
      showSuggestions={true}
      size="md"
    />
  )
}

// ==================== HOOK ====================

// Custom hook for search state
export function useSearch(initialQuery = '') {
  const [query, setQuery] = React.useState(initialQuery)
  const [results, setResults] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [filters, setFilters] = React.useState<Record<string, any>>({})

  const search = async (searchQuery: string, searchFilters: Record<string, any> = {}) => {
    setLoading(true)
    setQuery(searchQuery)
    setFilters(searchFilters)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock results
      const mockResults = [
        { id: 1, title: 'Result 1' },
        { id: 2, title: 'Result 2' }
      ]
      
      setResults(mockResults)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setFilters({})
  }

  return {
    query,
    results,
    loading,
    filters,
    search,
    clearSearch
  }
}