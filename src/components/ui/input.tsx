'use client'

import React from 'react'

// Simple Input component
export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  className = ''
}: any) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

// TextArea component
export function TextArea({
  value,
  onChange,
  placeholder,
  label,
  error,
  rows = 4,
  disabled = false,
  required = false,
  className = ''
}: any) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

// Select component
export function Select({
  value,
  onChange,
  options = [],
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  className = ''
}: any) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 appearance-none bg-white
          ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt: any, i: number) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

// Checkbox component
export function Checkbox({
  checked,
  onChange,
  label,
  error,
  disabled = false,
  className = ''
}: any) {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </div>
      {label && (
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700">{label}</label>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

// Radio component
export function Radio({
  checked,
  onChange,
  label,
  name,
  value,
  disabled = false,
  className = ''
}: any) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
      />
      {label && (
        <label className="ml-3 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
    </div>
  )
}

// Radio Group
export function RadioGroup({
  options = [],
  value,
  onChange,
  label,
  name,
  className = ''
}: any) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="space-y-2">
        {options.map((opt: any, i: number) => (
          <Radio
            key={i}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            label={opt.label}
            name={name}
            value={opt.value}
          />
        ))}
      </div>
    </div>
  )
}

// Search Input
export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className = ''
}: any) {
  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
      {onSearch && (
        <button
          onClick={() => onSearch(value)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
        >
          Go
        </button>
      )}
    </div>
  )
}

// Password Input with toggle
export function PasswordInput({
  value,
  onChange,
  placeholder = 'Enter password',
  label,
  error,
  className = ''
}: any) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10
            ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'}
          `}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

// Simple hook for form handling
export function useInput(initialValue = '') {
  const [value, setValue] = React.useState(initialValue)
  const [error, setError] = React.useState('')

  const onChange = (e: any) => setValue(e.target.value)
  const reset = () => setValue(initialValue)
  const setErrorMsg = (msg: string) => setError(msg)
  const clearError = () => setError('')

  return {
    value,
    error,
    onChange,
    reset,
    setError: setErrorMsg,
    clearError
  }
}