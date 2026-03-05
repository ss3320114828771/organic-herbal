'use client'

import React from 'react'

interface DatePickerProps {
  value?: string
  onChange?: (date: string) => void
  min?: string
  max?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export default function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date',
  label,
  error,
  disabled = false,
  required = false,
  className = ''
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setSelectedDate(newDate)
    onChange?.(newDate)
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="date"
        value={selectedDate}
        onChange={handleChange}
        min={min}
        max={max}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error 
            ? 'border-red-300 focus:ring-red-200' 
            : 'border-gray-200 focus:ring-green-200'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Simple date range picker
export function DateRangePicker({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  min,
  max,
  className = ''
}: any) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <DatePicker
        value={startValue}
        onChange={onStartChange}
        min={min}
        max={endValue || max}
        label="Start Date"
        placeholder="Start date"
      />
      <DatePicker
        value={endValue}
        onChange={onEndChange}
        min={startValue || min}
        max={max}
        label="End Date"
        placeholder="End date"
      />
    </div>
  )
}

// Month picker
export function MonthPicker({
  value,
  onChange,
  label,
  className = ''
}: any) {
  const [selectedMonth, setSelectedMonth] = React.useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value
    setSelectedMonth(newMonth)
    onChange?.(newMonth)
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="month"
        value={selectedMonth}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </div>
  )
}

// Time picker
export function TimePicker({
  value,
  onChange,
  label,
  className = ''
}: any) {
  const [selectedTime, setSelectedTime] = React.useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setSelectedTime(newTime)
    onChange?.(newTime)
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="time"
        value={selectedTime}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </div>
  )
}

// DateTime picker
export function DateTimePicker({
  value,
  onChange,
  label,
  className = ''
}: any) {
  const [selectedDateTime, setSelectedDateTime] = React.useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTime = e.target.value
    setSelectedDateTime(newDateTime)
    onChange?.(newDateTime)
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="datetime-local"
        value={selectedDateTime}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </div>
  )
}

// Week picker
export function WeekPicker({
  value,
  onChange,
  label,
  className = ''
}: any) {
  const [selectedWeek, setSelectedWeek] = React.useState(value || '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWeek = e.target.value
    setSelectedWeek(newWeek)
    onChange?.(newWeek)
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="week"
        value={selectedWeek}
        onChange={handleChange}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200"
      />
    </div>
  )
}

// Preset date buttons
export function PresetDates({
  onSelect,
  className = ''
}: any) {
  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'Next Week', days: 7 },
    { label: 'Next Month', days: 30 }
  ]

  const handlePresetClick = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    onSelect?.(`${year}-${month}-${day}`)
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {presets.map((preset) => (
        <button
          key={preset.label}
          onClick={() => handlePresetClick(preset.days)}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}

// Simple hook for date handling
export function useDate(initialDate?: string) {
  const [date, setDate] = React.useState(initialDate || '')

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRelativeDate = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return {
    date,
    setDate,
    formatDate,
    getRelativeDate
  }
}