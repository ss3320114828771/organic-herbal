'use client'

import React from 'react'

// Simple Pagination component
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  className = ''
}: any) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const leftSibling = Math.max(1, currentPage - siblingCount)
    const rightSibling = Math.min(totalPages, currentPage + siblingCount)

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i)
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`
          px-3 py-2 rounded-lg border
          ${currentPage === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {currentPage > siblingCount + 1 && (
          <>
            <button
              onClick={() => onPageChange?.(1)}
              className="w-10 h-10 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
            >
              1
            </button>
            {currentPage > siblingCount + 2 && (
              <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
            )}
          </>
        )}

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={`
              w-10 h-10 rounded-lg border
              ${page === currentPage
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages - siblingCount && (
          <>
            {currentPage < totalPages - siblingCount - 1 && (
              <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
            )}
            <button
              onClick={() => onPageChange?.(totalPages)}
              className="w-10 h-10 rounded-lg border bg-white text-gray-700 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`
          px-3 py-2 rounded-lg border
          ${currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        Next
      </button>
    </div>
  )
}

// Simple Pagination with icons
export function IconPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}: any) {
  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          w-10 h-10 rounded-lg border flex items-center justify-center
          ${currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        ←
      </button>

      <span className="px-4 py-2 text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          w-10 h-10 rounded-lg border flex items-center justify-center
          ${currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        →
      </button>
    </div>
  )
}

// Simple Page Size Selector
export function PageSizeSelector({
  pageSize = 10,
  onPageSizeChange,
  options = [5, 10, 25, 50, 100],
  className = ''
}: any) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Show:</span>
      <select
        value={pageSize}
        onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
      >
        {options.map((opt: number) => (
          <option key={opt} value={opt}>
            {opt} per page
          </option>
        ))}
      </select>
    </div>
  )
}

// Simple Pagination Info
export function PaginationInfo({
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  className = ''
}: any) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      Showing {start} to {end} of {totalItems} results
    </div>
  )
}

// Complete Pagination Bar
export function PaginationBar({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  showInfo = true,
  showSizeSelector = true,
  className = ''
}: any) {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {showInfo && (
        <PaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {showSizeSelector && onPageSizeChange && (
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  )
}

// Simple hook
export function usePagination(initialPage = 1, initialPageSize = 10) {
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  const [totalItems, setTotalItems] = React.useState(0)

  const totalPages = Math.ceil(totalItems / pageSize)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const changePageSize = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page
  }

  return {
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    setTotalItems,
    goToPage,
    nextPage,
    prevPage,
    changePageSize
  }
}