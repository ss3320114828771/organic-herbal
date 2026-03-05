'use client'

import React from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface ProductFilterProps {
  categories?: FilterCategory[]
  brands?: FilterBrand[]
  priceRange?: PriceRange
  colors?: FilterColor[]
  sizes?: string[]
  tags?: string[]
  ratings?: number[]
  sortOptions?: SortOption[]
  onFilterChange?: (filters: FilterState) => void
  onSortChange?: (sort: string) => void
  onPriceRangeChange?: (min: number, max: number) => void
  onClearFilters?: () => void
  initialFilters?: FilterState
  showSearch?: boolean
  showCategories?: boolean
  showBrands?: boolean
  showPriceRange?: boolean
  showColors?: boolean
  showSizes?: boolean
  showTags?: boolean
  showRatings?: boolean
  showSort?: boolean
  showClearButton?: boolean
  showApplyButton?: boolean
  collapsible?: boolean
  mobile?: boolean
  className?: string
  variant?: 'sidebar' | 'topbar' | 'modal' | 'minimal'
}

interface FilterCategory {
  id: string
  name: string
  count?: number
  children?: FilterCategory[]
}

interface FilterBrand {
  id: string
  name: string
  logo?: string
  count?: number
}

interface PriceRange {
  min: number
  max: number
  step?: number
}

interface FilterColor {
  name: string
  value: string
  count?: number
}

interface SortOption {
  value: string
  label: string
}

interface FilterState {
  categories: string[]
  brands: string[]
  priceMin?: number
  priceMax?: number
  colors: string[]
  sizes: string[]
  tags: string[]
  ratings: number[]
  inStock?: boolean
  onSale?: boolean
  search?: string
  sort?: string
}

export default function ProductFilter({
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000, step: 10 },
  colors = [],
  sizes = [],
  tags = [],
  ratings = [4, 3, 2, 1],
  sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ],
  onFilterChange,
  onSortChange,
  onPriceRangeChange,
  onClearFilters,
  initialFilters,
  showSearch = false,
  showCategories = true,
  showBrands = false,
  showPriceRange = true,
  showColors = false,
  showSizes = false,
  showTags = false,
  showRatings = true,
  showSort = true,
  showClearButton = true,
  showApplyButton = false,
  collapsible = true,
  mobile = false,
  className = '',
  variant = 'sidebar'
}: ProductFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize state from URL or initialFilters
  const [filters, setFilters] = React.useState<FilterState>({
    categories: initialFilters?.categories || searchParams?.getAll('category') || [],
    brands: initialFilters?.brands || searchParams?.getAll('brand') || [],
    priceMin: initialFilters?.priceMin || Number(searchParams?.get('minPrice')) || undefined,
    priceMax: initialFilters?.priceMax || Number(searchParams?.get('maxPrice')) || undefined,
    colors: initialFilters?.colors || searchParams?.getAll('color') || [],
    sizes: initialFilters?.sizes || searchParams?.getAll('size') || [],
    tags: initialFilters?.tags || searchParams?.getAll('tag') || [],
    ratings: initialFilters?.ratings || searchParams?.getAll('rating').map(Number) || [],
    inStock: initialFilters?.inStock || searchParams?.get('inStock') === 'true' || undefined,
    onSale: initialFilters?.onSale || searchParams?.get('onSale') === 'true' || undefined,
    search: initialFilters?.search || searchParams?.get('search') || '',
    sort: initialFilters?.sort || searchParams?.get('sort') || sortOptions[0]?.value
  })

  const [priceInput, setPriceInput] = React.useState({
    min: filters.priceMin || priceRange.min,
    max: filters.priceMax || priceRange.max
  })
  const [isOpen, setIsOpen] = React.useState(!collapsible)
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    'categories', 'brands', 'price', 'colors', 'sizes', 'ratings'
  ])

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) return count + value.length
    if (typeof value === 'boolean' && value) return count + 1
    if (typeof value === 'number' && value !== undefined) return count + 1
    if (typeof value === 'string' && value) return count + 1
    return count
  }, 0)

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    
    // Update URL params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(searchParams?.toString())
      
      // Update params based on filter changes
      Object.entries(newFilters).forEach(([key, value]) => {
        params.delete(key)
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(v => params.append(key, String(v)))
        } else if (value !== undefined && value !== '' && !Array.isArray(value)) {
          params.set(key, String(value))
        }
      })
      
      const newUrl = `${pathname}?${params.toString()}`
      router.push(newUrl, { scroll: false })
    }
    
    onFilterChange?.(updated)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(c => c !== categoryId)
    updateFilters({ categories: newCategories })
  }

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brandId]
      : filters.brands.filter(b => b !== brandId)
    updateFilters({ brands: newBrands })
  }

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter(c => c !== color)
    updateFilters({ colors: newColors })
  }

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...filters.sizes, size]
      : filters.sizes.filter(s => s !== size)
    updateFilters({ sizes: newSizes })
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter(t => t !== tag)
    updateFilters({ tags: newTags })
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    const newRatings = checked
      ? [...filters.ratings, rating]
      : filters.ratings.filter(r => r !== rating)
    updateFilters({ ratings: newRatings })
  }

  const handlePriceChange = (min: number, max: number) => {
    setPriceInput({ min, max })
  }

  const applyPriceRange = () => {
    updateFilters({
      priceMin: priceInput.min,
      priceMax: priceInput.max
    })
    onPriceRangeChange?.(priceInput.min, priceInput.max)
  }

  const handleSortChange = (value: string) => {
    updateFilters({ sort: value })
    onSortChange?.(value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already applied via onChange
  }

  const handleCheckboxChange = (key: 'inStock' | 'onSale') => {
    updateFilters({ [key]: !filters[key] })
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceMin: undefined,
      priceMax: undefined,
      colors: [],
      sizes: [],
      tags: [],
      ratings: [],
      inStock: undefined,
      onSale: undefined,
      search: '',
      sort: filters.sort // Preserve sort
    })
    setPriceInput({ min: priceRange.min, max: priceRange.max })
    onClearFilters?.()
    
    // Clear URL params except sort
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams()
      if (filters.sort) params.set('sort', filters.sort)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-4 flex-wrap ${className}`}>
        {showSort && (
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {showPriceRange && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceInput.min}
              onChange={(e) => handlePriceChange(Number(e.target.value), priceInput.max)}
              className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceInput.max}
              onChange={(e) => handlePriceChange(priceInput.min, Number(e.target.value))}
              className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <button
              onClick={applyPriceRange}
              className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    )
  }

  // Topbar variant
  if (variant === 'topbar') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex flex-wrap items-center gap-4">
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
              />
            </form>
          )}

          {showSort && (
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showClearButton && activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {showCategories && categories.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="text-sm text-gray-600">{category.name}</span>
                        {category.count && (
                          <span className="text-xs text-gray-400">({category.count})</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {showPriceRange && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      step={priceRange.step}
                      value={priceInput.max}
                      onChange={(e) => handlePriceChange(priceInput.min, Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={priceInput.min}
                        onChange={(e) => handlePriceChange(Number(e.target.value), priceInput.max)}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={priceInput.max}
                        onChange={(e) => handlePriceChange(priceInput.min, Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                      />
                    </div>
                    <button
                      onClick={applyPriceRange}
                      className="w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {showRatings && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Rating</h4>
                  <div className="space-y-2">
                    {ratings.map(rating => (
                      <label key={rating} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.ratings.includes(rating)}
                          onChange={(e) => handleRatingChange(rating, e.target.checked)}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <span className="text-sm text-gray-600">
                          {rating}+ stars {'⭐'.repeat(rating)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={() => handleCheckboxChange('inStock')}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-600">In Stock</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={() => handleCheckboxChange('onSale')}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-600">On Sale</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Modal variant (for mobile)
  if (variant === 'modal') {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center ${className}`}>
        <div className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {/* Filter sections - similar to sidebar but with close button */}
            <ProductFilter
              categories={categories}
              brands={brands}
              priceRange={priceRange}
              colors={colors}
              sizes={sizes}
              tags={tags}
              ratings={ratings}
              sortOptions={sortOptions}
              showSearch={showSearch}
              showCategories={showCategories}
              showBrands={showBrands}
              showPriceRange={showPriceRange}
              showColors={showColors}
              showSizes={showSizes}
              showTags={showTags}
              showRatings={showRatings}
              showSort={false}
              initialFilters={filters}
              onFilterChange={onFilterChange}
              variant="sidebar"
              collapsible={false}
            />
          </div>

          <div className="p-4 border-t border-gray-200 flex gap-3">
            <button
              onClick={clearFilters}
              className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Sidebar variant (default)
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {activeFilterCount > 0 && (
          <span className="px-2 py-1 bg-green-100 text-green-600 text-sm rounded-full">
            {activeFilterCount} active
          </span>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </form>
      )}

      {/* Sort */}
      {showSort && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Categories */}
      {showCategories && categories.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          >
            <span>Categories</span>
            <span className="text-gray-400">{expandedSections.includes('categories') ? '−' : '+'}</span>
          </button>
          {expandedSections.includes('categories') && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <div key={category.id}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.id)}
                      onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm text-gray-600">{category.name}</span>
                    {category.count && (
                      <span className="text-xs text-gray-400">({category.count})</span>
                    )}
                  </label>
                  {category.children && category.children.length > 0 && (
                    <div className="ml-6 mt-1 space-y-1">
                      {category.children.map(child => (
                        <label key={child.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(child.id)}
                            onChange={(e) => handleCategoryChange(child.id, e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span className="text-sm text-gray-600">{child.name}</span>
                          {child.count && (
                            <span className="text-xs text-gray-400">({child.count})</span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands */}
      {showBrands && brands.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          >
            <span>Brands</span>
            <span className="text-gray-400">{expandedSections.includes('brands') ? '−' : '+'}</span>
          </button>
          {expandedSections.includes('brands') && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <label key={brand.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand.id)}
                    onChange={(e) => handleBrandChange(brand.id, e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  {brand.logo && (
                    <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain" />
                  )}
                  <span className="text-sm text-gray-600">{brand.name}</span>
                  {brand.count && (
                    <span className="text-xs text-gray-400">({brand.count})</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      {showPriceRange && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          >
            <span>Price Range</span>
            <span className="text-gray-400">{expandedSections.includes('price') ? '−' : '+'}</span>
          </button>
          {expandedSections.includes('price') && (
            <div className="space-y-3">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                step={priceRange.step}
                value={priceInput.max}
                onChange={(e) => handlePriceChange(priceInput.min, Number(e.target.value))}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceInput.min}
                  onChange={(e) => handlePriceChange(Number(e.target.value), priceInput.max)}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceInput.max}
                  onChange={(e) => handlePriceChange(priceInput.min, Number(e.target.value))}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="Max"
                />
                {showApplyButton && (
                  <button
                    onClick={applyPriceRange}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Apply
                  </button>
                )}
              </div>
              {!showApplyButton && (
                <button
                  onClick={applyPriceRange}
                  className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  Apply Price Range
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Colors */}
      {showColors && colors.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          >
            <span>Colors</span>
            <span className="text-gray-400">{expandedSections.includes('colors') ? '−' : '+'}</span>
          </button>
          {expandedSections.includes('colors') && (
            <div className="flex flex-wrap gap-2">
              {colors.map(color => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value, !filters.colors.includes(color.value))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    filters.colors.includes(color.value)
                      ? 'border-green-600 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value.toLowerCase() }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sizes */}
      {showSizes && sizes.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('sizes')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          >
            <span>Sizes</span>
            <span className="text-gray-400">{expandedSections.includes('sizes') ? '−' : '+'}</span>
          </button>
          {expandedSections.includes('sizes') && (
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size, !filters.sizes.includes(size))}
                  className={`px-3 py-1 border rounded-lg text-sm font-medium transition-all ${
                    filters.sizes.includes(size)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'border-gray-200 text-gray-700 hover:border-green-600 hover:text-green-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {showTags && tags.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          >
            <span>Tags</span>
            <span className="text-gray-400">{expandedSections.includes('tags') ? '−' : '+'}</span>
          </button>
          {expandedSections.includes('tags') && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag, !filters.tags.includes(tag))}
                  className={`px-3 py-1 border rounded-full text-xs font-medium transition-all ${
                    filters.tags.includes(tag)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'border-gray-200 text-gray-600 hover:border-green-600 hover:text-green-600'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ratings */}
      {showRatings && (
        <div className="mb-4">
          <button
            onClick={() => toggleSection('ratings')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
          >
            <span>Customer Rating</span>
            <span className="text-gray-400">{expandedSections.includes('ratings') ? '−' : '+'}</span>
          </button>
          {expandedSections.includes('ratings') && (
            <div className="space-y-2">
              {ratings.map(rating => (
                <label key={rating} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={(e) => handleRatingChange(rating, e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    {rating}+ stars {'⭐'.repeat(rating)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Additional checkboxes */}
      <div className="space-y-2 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={() => handleCheckboxChange('inStock')}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm text-gray-600">In Stock Only</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={() => handleCheckboxChange('onSale')}
            className="w-4 h-4 text-green-600 rounded"
          />
          <span className="text-sm text-gray-600">On Sale</span>
        </label>
      </div>

      {/* Clear button */}
      {showClearButton && activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Sidebar filters
export function FilterSidebar({ categories, onFilterChange }: { 
  categories: FilterCategory[]
  onFilterChange?: (filters: FilterState) => void 
}) {
  return (
    <ProductFilter
      categories={categories}
      showCategories={true}
      showPriceRange={true}
      showRatings={true}
      onFilterChange={onFilterChange}
      variant="sidebar"
    />
  )
}

// Top bar filters
export function FilterBar({ onFilterChange, onSortChange }: {
  onFilterChange?: (filters: FilterState) => void
  onSortChange?: (sort: string) => void
}) {
  return (
    <ProductFilter
      showSearch={true}
      showSort={true}
      showPriceRange={true}
      onFilterChange={onFilterChange}
      onSortChange={onSortChange}
      variant="topbar"
    />
  )
}

// Mobile filter modal
export function MobileFilterModal({ isOpen, onClose, children }: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white w-full max-h-[90vh] rounded-t-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  )
}

// Active filters display
export function ActiveFilters({ filters, onRemove, onClear }: {
  filters: FilterState
  onRemove: (key: string, value?: string) => void
  onClear: () => void
}) {
  const activeFilters: { key: string; label: string; value?: string }[] = []

  if (filters.categories?.length) {
    filters.categories.forEach(cat => {
      activeFilters.push({ key: 'category', label: `Category: ${cat}`, value: cat })
    })
  }

  if (filters.brands?.length) {
    filters.brands.forEach(brand => {
      activeFilters.push({ key: 'brand', label: `Brand: ${brand}`, value: brand })
    })
  }

  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    activeFilters.push({ 
      key: 'price', 
      label: `Price: $${filters.priceMin || 0} - $${filters.priceMax || 'Any'}` 
    })
  }

  if (filters.colors?.length) {
    filters.colors.forEach(color => {
      activeFilters.push({ key: 'color', label: `Color: ${color}`, value: color })
    })
  }

  if (filters.sizes?.length) {
    filters.sizes.forEach(size => {
      activeFilters.push({ key: 'size', label: `Size: ${size}`, value: size })
    })
  }

  if (filters.ratings?.length) {
    filters.ratings.forEach(rating => {
      activeFilters.push({ key: 'rating', label: `${rating}+ Stars` })
    })
  }

  if (filters.inStock) {
    activeFilters.push({ key: 'inStock', label: 'In Stock' })
  }

  if (filters.onSale) {
    activeFilters.push({ key: 'onSale', label: 'On Sale' })
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
        >
          {filter.label}
          <button
            onClick={() => onRemove(filter.key, filter.value)}
            className="ml-1 text-gray-500 hover:text-red-600"
          >
            ×
          </button>
        </span>
      ))}
      <button
        onClick={onClear}
        className="text-sm text-red-600 hover:text-red-700"
      >
        Clear all
      </button>
    </div>
  )
}