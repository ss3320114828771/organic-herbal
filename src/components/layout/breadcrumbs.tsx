'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ReactNode
  isCurrent?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  homeLabel?: string
  showHomeIcon?: boolean
  separator?: 'chevron' | 'slash' | 'arrow' | 'dot' | 'bullet' | React.ReactNode
  maxItems?: number
  collapseAfter?: number
  className?: string
  itemClassName?: string
  activeClassName?: string
  separatorClassName?: string
  includeHome?: boolean
  replaceUnderscores?: boolean
  capitalizeLabels?: boolean
  truncateLabels?: boolean
  maxLabelLength?: number
  customLabels?: Record<string, string>
  customIcons?: Record<string, React.ReactNode>
  hideSingleItem?: boolean
}

export default function Breadcrumbs({
  items,
  homeLabel = 'Home',
  showHomeIcon = true,
  separator = 'chevron',
  maxItems,
  collapseAfter,
  className = '',
  itemClassName = '',
  activeClassName = 'text-gray-800 font-medium',
  separatorClassName = 'text-gray-400',
  includeHome = true,
  replaceUnderscores = true,
  capitalizeLabels = true,
  truncateLabels = true,
  maxLabelLength = 30,
  customLabels = {},
  customIcons = {},
  hideSingleItem = false
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items

    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []
    
    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      
      // Format label
      let label = path
      
      // Apply custom labels
      if (customLabels[path]) {
        label = customLabels[path]
      } else {
        // Replace hyphens and underscores with spaces
        if (replaceUnderscores) {
          label = label.replace(/[-_]/g, ' ')
        }
        // Capitalize first letter of each word
        if (capitalizeLabels) {
          label = label.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ')
        }
      }
      
      // Truncate if needed
      if (truncateLabels && label.length > maxLabelLength) {
        label = label.substring(0, maxLabelLength) + '...'
      }
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrent: index === paths.length - 1
      })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()
  
  // Hide if only one item and hideSingleItem is true
  if (hideSingleItem && breadcrumbs.length <= 1) {
    return null
  }

  // Apply max items limit
  let displayBreadcrumbs = breadcrumbs
  if (maxItems && breadcrumbs.length > maxItems) {
    const start = breadcrumbs.length - maxItems + 1
    displayBreadcrumbs = [
      { label: '...', href: '#', isCurrent: false },
      ...breadcrumbs.slice(start)
    ]
  }

  // Apply collapse after
  if (collapseAfter && breadcrumbs.length > collapseAfter) {
    displayBreadcrumbs = [
      breadcrumbs[0],
      { label: '...', href: '#', isCurrent: false },
      ...breadcrumbs.slice(-(collapseAfter - 1))
    ]
  }

  // Get separator component
  const getSeparator = () => {
    if (React.isValidElement(separator)) {
      return separator
    }
    
    switch (separator) {
      case 'chevron':
        return <span className="text-lg leading-none mx-1">›</span>
      case 'slash':
        return <span className="text-lg leading-none mx-1">/</span>
      case 'arrow':
        return <span className="text-lg leading-none mx-1">→</span>
      case 'dot':
        return <span className="text-lg leading-none mx-1">•</span>
      case 'bullet':
        return <span className="text-lg leading-none mx-1">●</span>
      default:
        return <span className="text-lg leading-none mx-1">›</span>
    }
  }

  // Home icon component (simple SVG)
  const HomeIcon = () => (
    <svg 
      className="w-4 h-4 mr-1" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
      />
    </svg>
  )

  return (
    <nav aria-label="Breadcrumb" className={`py-3 ${className}`}>
      <ol className="flex items-center flex-wrap gap-1 sm:gap-2">
        {/* Home item */}
        {includeHome && (
          <>
            <li className="flex items-center">
              <Link
                href="/"
                className={`inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors ${itemClassName}`}
              >
                {showHomeIcon ? (
                  <HomeIcon />
                ) : null}
                {!showHomeIcon && homeLabel}
              </Link>
            </li>
            {breadcrumbs.length > 0 && (
              <li className="flex items-center">
                <span className={separatorClassName}>
                  {getSeparator()}
                </span>
              </li>
            )}
          </>
        )}

        {/* Breadcrumb items */}
        {displayBreadcrumbs.map((item, index) => (
          <React.Fragment key={item.href + index}>
            <li className="flex items-center">
              {item.href === '#' ? (
                <span className="text-sm text-gray-500 px-1">
                  {item.label}
                </span>
              ) : item.isCurrent ? (
                <span
                  className={`text-sm ${activeClassName} ${itemClassName}`}
                  aria-current="page"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`text-sm text-gray-600 hover:text-green-600 transition-colors inline-flex items-center ${itemClassName}`}
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </Link>
              )}
            </li>
            {index < displayBreadcrumbs.length - 1 && (
              <li className="flex items-center">
                <span className={separatorClassName}>
                  {getSeparator()}
                </span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.label,
              item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}`
            }))
          })
        }}
      />
    </nav>
  )
}

// Compact version for mobile
export function CompactBreadcrumbs({
  items,
  className = ''
}: {
  items?: BreadcrumbItem[]
  homeLabel?: string
  className?: string
}) {
  const pathname = usePathname()
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items
    const paths = pathname.split('/').filter(Boolean)
    return paths.map((path, index) => ({
      label: path.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      href: '/' + paths.slice(0, index + 1).join('/'),
      isCurrent: index === paths.length - 1
    }))
  }

  const breadcrumbs = generateBreadcrumbs()
  
  if (breadcrumbs.length === 0) return null

  // Home icon component (simple SVG)
  const HomeIcon = () => (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
      />
    </svg>
  )

  return (
    <nav aria-label="Breadcrumb" className={`py-2 ${className}`}>
      <ol className="flex items-center text-sm">
        <li>
          <Link href="/" className="text-gray-500 hover:text-green-600">
            <HomeIcon />
          </Link>
        </li>
        <li className="mx-2 text-gray-400">/</li>
        <li className="truncate max-w-[150px] sm:max-w-xs">
          <span className="font-medium text-gray-800">
            {breadcrumbs[breadcrumbs.length - 1].label}
          </span>
        </li>
      </ol>
    </nav>
  )
}

// Back button variant (useful for mobile)
export function BackButtonBreadcrumbs({
  backUrl,
  backLabel = 'Back',
  currentLabel,
  className = ''
}: {
  backUrl: string
  backLabel?: string
  currentLabel?: string
  className?: string
}) {
  return (
    <nav aria-label="Back navigation" className={`py-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Link
          href={backUrl}
          className="inline-flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors"
        >
          <span className="text-lg mr-1">←</span>
          {backLabel}
        </Link>
        {currentLabel && (
          <>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-800">
              {currentLabel}
            </span>
          </>
        )}
      </div>
    </nav>
  )
}

// Category tree breadcrumbs (for e-commerce)
export function CategoryBreadcrumbs({
  categories,
  productName,
  className = ''
}: {
  categories: Array<{ name: string; slug: string }>
  productName?: string
  className?: string
}) {
  // Home icon component (simple SVG)
  const HomeIcon = () => (
    <svg 
      className="w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
      />
    </svg>
  )

  return (
    <nav aria-label="Category breadcrumb" className={`py-2 ${className}`}>
      <ol className="flex items-center flex-wrap text-sm gap-1">
        <li>
          <Link href="/" className="text-gray-500 hover:text-green-600">
            <HomeIcon />
          </Link>
        </li>
        {categories.map((cat, index) => (
          <React.Fragment key={cat.slug}>
            <li className="mx-1 text-gray-400">/</li>
            <li>
              <Link
                href={`/category/${cat.slug}`}
                className="text-gray-600 hover:text-green-600"
              >
                {cat.name}
              </Link>
            </li>
          </React.Fragment>
        ))}
        {productName && (
          <>
            <li className="mx-1 text-gray-400">/</li>
            <li className="text-gray-800 font-medium truncate max-w-xs">
              {productName}
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}

// Dashboard breadcrumbs (for admin panels)
export function DashboardBreadcrumbs({
  items,
  className = ''
}: {
  items: Array<{ label: string; href?: string }>
  className?: string
}) {
  return (
    <nav aria-label="Dashboard breadcrumb" className={`py-4 ${className}`}>
      <ol className="flex items-center text-sm">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <li className="mx-2 text-gray-400">/</li>}
            <li>
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-green-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-gray-800">
                  {item.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

// Simple breadcrumbs for static sites
export function SimpleBreadcrumbs({
  items,
  className = ''
}: {
  items: Array<{ label: string; href: string }>
  className?: string
}) {
  return (
    <nav aria-label="Breadcrumb" className={`py-2 ${className}`}>
      <ol className="flex items-center text-sm">
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && <li className="mx-2 text-gray-400">/</li>}
            <li>
              {index === items.length - 1 ? (
                <span className="font-medium text-gray-800">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-gray-600 hover:text-green-600">
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}