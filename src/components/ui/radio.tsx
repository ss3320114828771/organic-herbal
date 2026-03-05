'use client'

import React from 'react'

// Simple Radio component
export default function Radio({
  checked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  className = ''
}: any) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
}

// Radio Group
export function RadioGroup({
  options = [],
  value,
  onChange,
  name,
  label,
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

// Radio Card (styled like a card)
export function RadioCard({
  checked = false,
  onChange,
  label,
  description,
  value,
  name,
  disabled = false,
  className = ''
}: any) {
  return (
    <label
      className={`
        block p-4 border rounded-lg cursor-pointer transition-all
        ${checked ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-green-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
        className="hidden"
      />
      <div className="flex items-start gap-3">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
            ${checked ? 'border-green-600' : 'border-gray-300'}
          `}
        >
          {checked && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
        </div>
        <div>
          <p className="font-medium text-gray-800">{label}</p>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      </div>
    </label>
  )
}

// Radio Card Group
export function RadioCardGroup({
  options = [],
  value,
  onChange,
  name,
  label,
  className = ''
}: any) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="space-y-3">
        {options.map((opt: any, i: number) => (
          <RadioCard
            key={i}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            label={opt.label}
            description={opt.description}
            name={name}
            value={opt.value}
          />
        ))}
      </div>
    </div>
  )
}

// Inline Radio Group
export function InlineRadioGroup({
  options = [],
  value,
  onChange,
  name,
  label,
  className = ''
}: any) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex flex-wrap gap-4">
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

// Simple hook
export function useRadio(initialValue = '') {
  const [value, setValue] = React.useState(initialValue)

  const onChange = (newValue: string) => {
    setValue(newValue)
  }

  const reset = () => setValue(initialValue)

  return {
    value,
    onChange,
    reset
  }
}