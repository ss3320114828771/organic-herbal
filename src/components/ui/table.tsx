'use client'

import React from 'react'

// Simple Table component
export default function Table({
  columns = [],
  data = [],
  striped = false,
  bordered = false,
  hoverable = false,
  className = ''
}: any) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`w-full text-sm text-left ${bordered ? 'border border-gray-200' : ''}`}>
        <thead className="text-xs text-gray-700 bg-gray-50">
          <tr>
            {columns.map((col: any, i: number) => (
              <th key={i} className="px-6 py-3">
                {col.header || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr
              key={i}
              className={`
                ${striped && i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                ${hoverable ? 'hover:bg-gray-100' : ''}
                border-b border-gray-200
              `}
            >
              {columns.map((col: any, j: number) => (
                <td key={j} className="px-6 py-4">
                  {col.accessor ? row[col.accessor] : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Simple Table with actions
export function ActionTable({
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  className = ''
}: any) {
  const actionColumn = {
    header: 'Actions',
    accessor: 'id',
    render: (id: string) => (
      <div className="flex gap-2">
        {onView && (
          <button onClick={() => onView(id)} className="text-blue-600 hover:text-blue-800">
            View
          </button>
        )}
        {onEdit && (
          <button onClick={() => onEdit(id)} className="text-green-600 hover:text-green-800">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(id)} className="text-red-600 hover:text-red-800">
            Delete
          </button>
        )}
      </div>
    )
  }

  const allColumns = [...columns, actionColumn]

  return (
    <Table columns={allColumns} data={data} striped hoverable className={className} />
  )
}

// Simple Sortable Table
export function SortableTable({
  columns = [],
  data = [],
  className = ''
}: any) {
  const [sortField, setSortField] = React.useState('')
  const [sortDirection, setSortDirection] = React.useState('asc')

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortField) return 0
    
    const aVal = a[sortField]
    const bVal = b[sortField]
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const columnsWithSort = columns.map((col: any) => ({
    ...col,
    header: (
      <button
        onClick={() => handleSort(col.accessor || col)}
        className="flex items-center gap-1 hover:text-gray-900"
      >
        {col.header || col}
        {sortField === (col.accessor || col) && (
          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </button>
    )
  }))

  return (
    <Table columns={columnsWithSort} data={sortedData} striped hoverable className={className} />
  )
}

// Simple Paginated Table
export function PaginatedTable({
  columns = [],
  data = [],
  pageSize = 10,
  className = ''
}: any) {
  const [currentPage, setCurrentPage] = React.useState(1)
  
  const totalPages = Math.ceil(data.length / pageSize)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  const currentData = data.slice(start, end)

  return (
    <div>
      <Table columns={columns} data={currentData} striped hoverable className={className} />
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {start + 1} to {Math.min(end, data.length)} of {data.length} results
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Simple hook
export function useTable(initialData: any[] = []) {
  const [data, setData] = React.useState(initialData)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const addRow = (row: any) => {
    setData([...data, row])
  }

  const updateRow = (id: string, newData: any) => {
    setData(data.map(item => item.id === id ? { ...item, ...newData } : item))
  }

  const deleteRow = (id: string) => {
    setData(data.filter(item => item.id !== id))
  }

  return {
    data,
    loading,
    error,
    setLoading,
    setError,
    addRow,
    updateRow,
    deleteRow
  }
}