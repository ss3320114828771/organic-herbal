'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface CategoryNavProps {
  categories?: Category[]
  onCategorySelect?: (categoryId: string) => void
  selectedCategory?: string
  variant?: 'sidebar' | 'horizontal' | 'dropdown' | 'mega'
  showCount?: boolean
  showIcons?: boolean
  showImages?: boolean
  depth?: number
  collapsible?: boolean
  mobile?: boolean
  className?: string
  itemClassName?: string
  activeClassName?: string
}

interface Category {
  id: string
  name: string
  slug: string
  href?: string
  icon?: React.ReactNode
  image?: string
  count?: number
  children?: Category[]
  featured?: boolean
  description?: string
}

export default function CategoryNav({
  categories = [],
  onCategorySelect,
  selectedCategory,
  variant = 'sidebar',
  showCount = true,
  showIcons = false,
  showImages = false,
  depth = 0,
  collapsible = true,
  mobile = false,
  className = '',
  itemClassName = '',
  activeClassName = 'bg-green-50 text-green-600 border-green-600'
}: CategoryNavProps) {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([])
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleCategory = (categoryId: string) => {
    if (!collapsible) return
    
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const isActive = (category: Category) => {
    if (selectedCategory === category.id) return true
    if (category.href && pathname === category.href) return true
    if (category.href && pathname.startsWith(category.href)) return true
    return false
  }

  const isExpanded = (categoryId: string) => {
    return expandedCategories.includes(categoryId)
  }

  // Mega menu variant
  if (variant === 'mega') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <span>Shop by Category</span>
          <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white shadow-xl rounded-lg border border-gray-200 p-6 z-50">
            <div className="grid grid-cols-3 gap-8">
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={category.href || `/category/${category.slug}`}
                    className="font-semibold text-gray-800 hover:text-green-600 block mb-2"
                    onClick={() => {
                      setIsOpen(false)
                      onCategorySelect?.(category.id)
                    }}
                  >
                    {category.name}
                    {showCount && category.count && (
                      <span className="ml-2 text-xs text-gray-400">({category.count})</span>
                    )}
                  </Link>
                  
                  {category.children && category.children.length > 0 && (
                    <ul className="space-y-1">
                      {category.children.slice(0, 5).map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.href || `/category/${child.slug}`}
                            className="text-sm text-gray-600 hover:text-green-600"
                            onClick={() => {
                              setIsOpen(false)
                              onCategorySelect?.(child.id)
                            }}
                          >
                            {child.name}
                            {showCount && child.count && (
                              <span className="ml-2 text-xs text-gray-400">({child.count})</span>
                            )}
                          </Link>
                        </li>
                      ))}
                      {category.children.length > 5 && (
                        <li>
                          <Link
                            href={category.href || `/category/${category.slug}`}
                            className="text-sm text-green-600 hover:text-green-700"
                            onClick={() => setIsOpen(false)}
                          >
                            View all →
                          </Link>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <nav className={`flex overflow-x-auto pb-2 gap-1 ${className}`}>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href || `/category/${category.slug}`}
            className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-lg transition-colors ${
              isActive(category)
                ? `bg-green-600 text-white ${activeClassName}`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${itemClassName}`}
            onClick={() => onCategorySelect?.(category.id)}
          >
            {showIcons && category.icon && <span>{category.icon}</span>}
            {showImages && category.image && (
              <img src={category.image} alt={category.name} className="w-5 h-5 rounded-full" />
            )}
            <span>{category.name}</span>
            {showCount && category.count && (
              <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                {category.count}
              </span>
            )}
          </Link>
        ))}
      </nav>
    )
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full"
        >
          <span>Categories</span>
          <span className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-50">
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <Link
                  href={category.href || `/category/${category.slug}`}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-gray-50 ${
                    isActive(category) ? 'bg-green-50 text-green-600' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setIsOpen(false)
                    onCategorySelect?.(category.id)
                  }}
                >
                  {showIcons && category.icon && <span>{category.icon}</span>}
                  <span className="flex-1">{category.name}</span>
                  {showCount && category.count && (
                    <span className="text-xs text-gray-400">({category.count})</span>
                  )}
                </Link>
                
                {category.children && category.children.length > 0 && isExpanded(category.id) && (
                  <div className="pl-6">
                    {category.children.map((child) => (
                      <Link
                        key={child.id}
                        href={child.href || `/category/${child.slug}`}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        onClick={() => {
                          setIsOpen(false)
                          onCategorySelect?.(child.id)
                        }}
                      >
                        {child.name}
                        {showCount && child.count && (
                          <span className="ml-2 text-xs text-gray-400">({child.count})</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Sidebar variant (default)
  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const expanded = isExpanded(category.id)
    const active = isActive(category)

    return (
      <li key={category.id} className="relative">
        <div className={`flex items-center ${level > 0 ? 'ml-4' : ''}`}>
          <Link
            href={category.href || `/category/${category.slug}`}
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              active
                ? activeClassName
                : 'text-gray-700 hover:bg-gray-100'
            } ${itemClassName}`}
            onClick={() => onCategorySelect?.(category.id)}
          >
            {showIcons && category.icon && <span>{category.icon}</span>}
            {showImages && category.image && (
              <img src={category.image} alt={category.name} className="w-5 h-5 rounded-full" />
            )}
            <span className="flex-1">{category.name}</span>
            {showCount && category.count && (
              <span className="text-xs text-gray-400">({category.count})</span>
            )}
          </Link>

          {hasChildren && collapsible && (
            <button
              onClick={() => toggleCategory(category.id)}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '−' : '+'}
            </button>
          )}
        </div>

        {hasChildren && expanded && (
          <ul className="mt-1 space-y-1">
            {category.children?.map(child => renderCategory(child, level + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav className={className}>
      <ul className="space-y-1">
        {categories.map(category => renderCategory(category))}
      </ul>
    </nav>
  )
}

// ==================== VARIANT COMPONENTS ====================

// Sidebar category navigation
export function SidebarCategories({ categories, selected, onSelect }: { 
  categories: Category[]
  selected?: string
  onSelect?: (id: string) => void
}) {
  return (
    <CategoryNav
      categories={categories}
      selectedCategory={selected}
      onCategorySelect={onSelect}
      variant="sidebar"
      collapsible={true}
      showCount={true}
    />
  )
}

// Header category navigation
export function HeaderCategories({ categories }: { categories: Category[] }) {
  return (
    <CategoryNav
      categories={categories}
      variant="horizontal"
      showCount={false}
      className="py-2"
    />
  )
}

// Mega menu for e-commerce
export function MegaMenu({ categories }: { categories: Category[] }) {
  return (
    <CategoryNav
      categories={categories}
      variant="mega"
      showCount={true}
    />
  )
}

// Mobile category menu
export function MobileCategories({ categories, onClose }: { 
  categories: Category[]
  onClose?: () => void
}) {
  const [expanded, setExpanded] = React.useState<string[]>([])

  const handleSelect = (id: string) => {
    onClose?.()
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const renderMobileCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expanded.includes(category.id)

    return (
      <div key={category.id} className={`border-b border-gray-100 last:border-0`}>
        <div className={`flex items-center py-3 px-4 ${level > 0 ? 'pl-8' : ''}`}>
          <Link
            href={category.href || `/category/${category.slug}`}
            className="flex-1 text-gray-800 font-medium"
            onClick={() => handleSelect(category.id)}
          >
            {category.name}
          </Link>
          {hasChildren && (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-2 text-gray-400"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="bg-gray-50">
            {category.children?.map(child => renderMobileCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white">
      {categories.map(category => renderMobileCategory(category))}
    </div>
  )
}

// Breadcrumb navigation
export function CategoryBreadcrumbs({ categories }: { categories: Category[] }) {
  return (
    <nav className="flex items-center text-sm text-gray-500">
      <Link href="/" className="hover:text-green-600">
        Home
      </Link>
      {categories.map((category, index) => (
        <React.Fragment key={category.id}>
          <span className="mx-2">/</span>
          {index === categories.length - 1 ? (
            <span className="text-gray-800 font-medium">{category.name}</span>
          ) : (
            <Link
              href={category.href || `/category/${category.slug}`}
              className="hover:text-green-600"
            >
              {category.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// ==================== MOCK DATA ====================

// Example categories for e-commerce
export const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    count: 120,
    icon: '💻',
    children: [
      {
        id: '1-1',
        name: 'Smartphones',
        slug: 'smartphones',
        count: 45,
        icon: '📱'
      },
      {
        id: '1-2',
        name: 'Laptops',
        slug: 'laptops',
        count: 32,
        icon: '💻'
      },
      {
        id: '1-3',
        name: 'Tablets',
        slug: 'tablets',
        count: 18,
        icon: '📟'
      }
    ]
  },
  {
    id: '2',
    name: 'Clothing',
    slug: 'clothing',
    count: 89,
    icon: '👕',
    children: [
      {
        id: '2-1',
        name: 'Men',
        slug: 'men',
        count: 42,
        icon: '👔'
      },
      {
        id: '2-2',
        name: 'Women',
        slug: 'women',
        count: 47,
        icon: '👗'
      }
    ]
  },
  {
    id: '3',
    name: 'Home & Garden',
    slug: 'home-garden',
    count: 56,
    icon: '🏠'
  },
  {
    id: '4',
    name: 'Sports',
    slug: 'sports',
    count: 34,
    icon: '⚽'
  }
]

// ==================== HOOK ====================

// Custom hook for category navigation
export function useCategoryNavigation(initialCategory?: string) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | undefined>(initialCategory)
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([])

  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const expandAll = (categories: Category[]) => {
    const getAllIds = (cats: Category[]): string[] => {
      return cats.reduce<string[]>((acc, cat) => {
        acc.push(cat.id)
        if (cat.children) {
          acc.push(...getAllIds(cat.children))
        }
        return acc
      }, [])
    }
    setExpandedCategories(getAllIds(categories))
  }

  const collapseAll = () => {
    setExpandedCategories([])
  }

  return {
    selectedCategory,
    expandedCategories,
    selectCategory,
    toggleExpand,
    expandAll,
    collapseAll
  }
}